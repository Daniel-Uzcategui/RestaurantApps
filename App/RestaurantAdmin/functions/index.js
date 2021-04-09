const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const querystring = require('querystring')
const axios = require('axios')
const aesjs = require('aes-js')
const hasha = require('hasha')
const atob = require('atob')

exports.CheckCart = functions.firestore
  .document('/ambiente/{ambiente}/orders/{ordersId}')
  .onCreate(async (change, context) => {
    const newValue = change.data()
    const sede = newValue.sede
    const cart = newValue.cart
    var newcart = cart
    var sumPaid = 0
    var cfgRew
    var cfgData
    if (newValue.tipEnvio === '1') {
      const configRef = db.collection('ambiente').doc(context.params.ambiente).collection('config').doc('paymentServ')
      const cfg = await configRef.get()
      cfgData = cfg.data()
      if (!cfg.exists) {
        console.log('No such document!')
      } else {
        // sumPaid = sumPaid + parseInt(cfgData.price)
        if (typeof cfgData.rewards === 'undefined') {
          cfgRew = 10
        } else {
          cfgRew = cfgData.rewards
        }
      }
    }
    if (typeof cfgData === 'undefined') {
      const configRef = db.collection('ambiente').doc(context.params.ambiente).collection('config').doc('paymentServ')
      const cfg = await configRef.get()
      cfgData = cfg.data()
      if (!cfg.exists) {
        console.log('No such document!')
      } else {
        if (typeof cfgData.rewards === 'undefined') {
          cfgRew = 10
        } else {
          cfgRew = cfgData.rewards
        }
      }
    }
    var userRef = db.collection('ambiente').doc(context.params.ambiente).collection('users').doc(newValue.customer_id)
    const doc = await userRef.get()
    const userData = doc.data()
    var pointsCat = userData.pointsCat
    for (let prod in cart) {
      if (cart[prod].prodType === 0) {
        var reference = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(cart[prod].prodId)
        var decrement = admin.firestore.FieldValue.increment(-cart[prod].quantity)
        reference.update({
          [`stock.${sede}`]: decrement
        })
        var menu = await reference.get()
        var menuDoc = menu.data()
        if (!cart[prod].reward) {
          var discount = typeof menuDoc.discount !== 'undefined' ? menuDoc.discount : 0
          var prodPrice = parseFloat((menuDoc.price * (100 - discount) / 100).toFixed(2))
          sumPaid = (cart[prod].quantity * prodPrice) + sumPaid
          newcart[prod].prodPrice = prodPrice
        } else {
          let enoughPoints = 0
          let prodCat = cart[prod].category
          var catEnough = ''
          if (typeof prodCat === 'undefined') { prodCat = [] }
          var intsect = Object.keys(pointsCat).filter(value => cart[prod].category.includes(value))
          if (intsect.length) {
            for (let cat of intsect) {
              let points = pointsCat[cat]
              if ((points - (cart[prod].quantity * cfgRew)) >= 0) {
                enoughPoints++
                catEnough = cat
              }
            }
            if (enoughPoints) {
              let amount = cart[prod].quantity * cfgRew
              let decrement = admin.firestore.FieldValue.increment(-amount)
              userRef.update({
                [`pointsCat.${catEnough}`]: decrement
              })
            } else {
              discount = typeof menuDoc.discount !== 'undefined' ? menuDoc.discount : 0
              prodPrice = parseFloat((menuDoc.price * (100 - discount) / 100).toFixed(2))
              sumPaid = (cart[prod].quantity * prodPrice) + sumPaid
              newcart[prod].prodPrice = prodPrice
            }
          }
        }
        for (var items of cart[prod].items) {
          if (typeof items.quantity === 'undefined') {
            items.quantity = 1
          }
          items.price = await getComponentPrice(items.component, items.item, items.quantity, context.params.ambiente)
          sumPaid = sumPaid + ((items.price * items.quantity) * cart[prod].quantity)
        }
      } else {
        let multiplier = prod.quantity
        let products = prod.prods
        products.forEach((e) => {
          let reference = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(e.id)
          let amount = multiplier * e.quantity
          let decrement = admin.firestore.FieldValue.increment(-amount)
          reference.update({
            [`stock.${sede}`]: decrement
          })
        })
      }
    }
    change.ref.set({
      cart: newcart,
      paid: parseFloat(sumPaid.toFixed(2))
    }, {
      merge: true
    })
  })
exports.FirstUser = functions.firestore
  .document('/ambiente/{ambiente}/users/{userId}')
  .onCreate(async (user, context) => {
    const userRef = db.collection('ambiente').doc(context.params.ambiente).collection('config').doc('firstUser')
    const snapshot = await userRef.get()
    const original = user.data()
    if (!snapshot.exists) {
      const data = {
        user: 'created'
      }
      const res = await db.collection('ambiente').doc(context.params.ambiente).collection('config').doc('firstUser').set({ ...data, DateIn: admin.firestore.Timestamp.now() })
      const res2 = await user.ref.set({
        rol: ['Admin'],
        firstAccess: true,
        DateIn: admin.firestore.Timestamp.now()
      }, { merge: true })
      return [res, res2]
    } else {
      const res3 = await user.ref.set({
        DateIn: admin.firestore.Timestamp.now()
      }, { merge: true })
      if (context.params.ambiente !== 'chopzi' && typeof original.otherDb === 'undefined') {
        const userRef2 = db.collection('ambiente').doc('chopzi').collection('users').doc(original.id)
        let usuario = original
        delete original.rol
        await userRef2.set({ ...usuario, otherDb: true, typeAccess: 'Client', DateIn: admin.firestore.Timestamp.now() })
      }
      if (context.params.ambiente === 'chopzi' && typeof original.otherDb === 'undefined') {
        const res = await requestTrial(user.id)
        return [res, res3]
      }
    }
  })
exports.facturasSequence = functions.firestore
  .document('/ambiente/{ambiente}/orders/{ordersId}')
  .onCreate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var countRef = db.collection('ambiente').doc(context.params.ambiente).collection('counters').doc('orders')
    var docRef = await countRef.get()
    if (!docRef.exists) {
      console.log('No such document!')
      countRef.set({
        factura: 0
      }).then(async () => {
        change.ref.set({
          factura: 0
        }, {
          merge: true
        })
      })
    } else {
      countRef.update({
        factura: admin.firestore.FieldValue.increment(1)
      }).then(async () => {
        var counter = await db.collection('ambiente').doc(context.params.ambiente).collection('counters').doc('orders').get()
        change.ref.set({
          factura: counter.data().factura
        }, {
          merge: true
        })
      })
    }
  })
async function getComponentPrice (compId, itemId, ambiente) {
  var price = 0
  var compRef = db.collection('ambiente').doc(ambiente).collection('groupComp').doc(compId)
  var comp = await compRef.get()
  var compDoc = comp.data()
  if (!compDoc.free) {
    var itemRef = db.collection('ambiente').doc(ambiente).collection('item').doc(itemId)
    var item = await itemRef.get()
    var itemDoc = item.data()
    price = price + (itemDoc.price)
  }
  return price
}
async function fetchSetup (url) {
  try {
    let options = { method: 'post',
      url: url + '/getinitjs',
      data:
          {
            url: url
          }
    }
    const response = await axios(options)
    return response.data
  } catch (error) {
    console.log(error)
    return fetchSetup()
  }
}
exports.GetManifest = functions.https.onRequest(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  var url = 'https://' + req.headers['x-forwarded-host']
  // const url = 'https://chopzi.com'
  console.log(url, 'URLS')
  if (typeof req.headers['x-forwarded-host'] === 'undefined') {
    return res.send({
      'name': 'Chopzi',
      'short_name': 'chopzi',
      'description': 'Chopzi ECRA',
      'display': 'standalone',
      'start_url': '.',
      'icons': [
        {
          'src': 'icons/icon-128x128.png',
          'sizes': '128x128',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-256x256.png',
          'sizes': '256x256',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-384x384.png',
          'sizes': '384x384',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        }
      ],
      'orientation': 'portrait',
      'background_color': '#ffffff',
      'theme_color': '#027be3'
    })
  }
  let ambiente = await fetchSetup(url)
  const reqRef = db.doc(`ambiente/${ambiente.ambiente}/environment/manifest`)
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    return res.send({
      'name': 'Chopzi',
      'short_name': 'chopzi',
      'description': 'Chopzi ECRA',
      'display': 'standalone',
      'start_url': '.',
      'icons': [
        {
          'src': 'icons/icon-128x128.png',
          'sizes': '128x128',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-256x256.png',
          'sizes': '256x256',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-384x384.png',
          'sizes': '384x384',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        }
      ],
      'orientation': 'portrait',
      'background_color': '#ffffff',
      'theme_color': '#027be3'
    })
  } else {
    let pre = doc.data()
    let icons = [{
      'src': pre.icons.icon128x128,
      'sizes': '128x128',
      'type': 'image/png'
    },
    {
      'src': pre.icons.icon192x192,
      'sizes': '192x192',
      'type': 'image/png'
    },
    {
      'src': pre.icons.icon256x256,
      'sizes': '256x256',
      'type': 'image/png'
    },
    {
      'src': pre.icons.icon384x384,
      'sizes': '384x384',
      'type': 'image/png'
    },
    {
      'src': pre.icons.icon512x512,
      'sizes': '512x512',
      'type': 'image/png'
    }]
    pre.icons = icons
    return res.send({ ...pre })
  }
})

exports.RewardsPoints = functions.firestore
  .document('/ambiente/{ambiente}/orders/{ordersId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    let user = previousValue.customer_id
    let userRef = db.collection('ambiente').doc(context.params.ambiente).collection('users').doc(user)
    const doc = await userRef.get()
    if (!doc.exists) {
      console.log('No such document!')
    } else {
      if (previousValue.status !== newValue.status) {
        var options = [
          { label: 'Por Confirmar', value: 0 },
          { label: 'Preparando su pedido', value: 1 },
          { label: 'Orden en vía', value: 2 },
          { label: 'Orden Entregada', value: 3 },
          { label: 'Anulada', value: 4 }]
        var status = options.find(e => e.value === newValue.status)
        const userData = doc.data()
        if (typeof userData.fcm !== 'undefined') {
          return admin.messaging().sendToDevice(userData.fcm, { 'notification': {
            'title': 'ChopZi',
            'body': `${status.label}`,
            'click_action': 'http://localhost:8080/#/orders/index',
            'icon': 'icons/favicon-128x128.png'
          } })
        }
      }
    }
    if (newValue.status === 3) {
      let paid = previousValue.paid
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        const userData = doc.data()
        if (typeof userData.points === 'undefined') {
          userRef.set({
            points: paid
          }, {
            merge: true
          })
        } else {
          let points = admin.firestore.FieldValue.increment(paid)
          userRef.update({
            points: points
          })
        }
        const cart = previousValue.cart
        for (let prod of cart) {
          if (prod.prodType === 0 && typeof prod.rewards === 'undefined') {
            let menuRef = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(prod.prodId)
            const docMenu = await menuRef.get()
            let increment = admin.firestore.FieldValue.increment(prod.quantity)
            if (!docMenu.exists) {
              console.log('No such document!')
            } else {
              const docMenuData = docMenu.data()
              for (let cat of docMenuData.categoria) {
                if (typeof userData.pointsCat === 'undefined' || typeof userData.pointsCat[cat] === 'undefined') {
                  userRef.set({
                    pointsCat: {
                      [cat]: typeof userData.pointsCat === 'undefined' ? prod.quantity : typeof userData.pointsCat[cat] === 'undefined' ? prod.quantity : increment
                    }
                  }, {
                    merge: true
                  })
                } else {
                  userRef.update({
                    [`pointsCat.${cat}`]: increment
                  })
                }
              }
            }
          }
        }
      }
    }
    if (newValue.status === 4) {
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        const cart = previousValue.cart
        const sede = previousValue.sede
        for (let prod of cart) {
          if (prod.prodType === 0) {
            var menuRef = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(prod.prodId)
            const docMenu = await menuRef.get()
            let increment = admin.firestore.FieldValue.increment(prod.quantity)
            if (!docMenu.exists) {
              console.log('No such document!')
            } else {
              menuRef.update({
                [`stock.${sede}`]: increment
              })
            }
          }
          if (prod.prodType === 1) {
            for (let product of prod.prods) {
              let menuRef = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(product.id)
              const docMenu = await menuRef.get()
              let increment = admin.firestore.FieldValue.increment(product.quantity)
              if (!docMenu.exists) {
                console.log('No such document!')
              } else {
                menuRef.update({
                  [`stock.${sede}`]: increment
                })
              }
            }
          }
        }
      }
    }
  })

exports.MakePay = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    return res.end()
  }
  const reqBank = req.body.bank
  const ambiente = req.body.ambiente
  if (typeof reqBank === 'undefined') {
    return res.send({
      error: 'No Bank parameter set'
    })
  }
  const reqRef = db.collection('ambiente').doc(ambiente).collection('config').doc('paymentServ')
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    return res.send({
      error: 'No payment configuration set'
    })
  } else {
    let pre = doc.data()
    switch (true) {
      case reqBank === 'CrediCorp':
        try {
          if (typeof pre.CreditCorp === 'undefined') {
            res.send(400, { error: '001', title: 'Error', message: 'Credicorp key not set' })
            break
          }
          let Message
          let obj = req.body
          obj.securityKey = pre.CreditCorp
          delete obj.bank
          delete obj.ambiente
          let postData = { ...obj, security_key: pre.CreditCorp }
          console.log(postData)
          let postData2 = querystring.stringify(postData)
          let options = {
            url: 'https://secure.nmi.com/api/transact.php',
            method: 'post',
            data: postData2
          }
          console.log('option :', options)
          Message = await axios(options)
          console.log(Message.data)
          let response = querystring.parse(Message.data)
          const payload = {
            cardNumberFirst: postData.ccnumber.substr(0, 4),
            cardNumberLast: postData.ccnumber.substr(postData.ccnumber.length - 4),
            cardCVC: postData.cvv,
            transactionid: response.transactionid,
            paidAmount: postData.amount,
            paidAmountCurrency: 'US$',
            rateId: 0,
            txnBankId: 1,
            trxType: 'Creditcorp',
            paymentStatus: parseInt(response.response) === 1 ? 'approved' : response.responsetext,
            DateIn: new Date()
          }
          const res2 = await db.collection('ambiente').doc(ambiente).collection('transactions').add(payload)
          res.send({ trx: Message.data, id: res2.id, trx2: response })
        } catch (err) {
          res.status(400)
          console.log({ err })
          res.send({
            title: 'Error',
            message: 'Error inesperado, intente más tarde' })
        }
        break
      case reqBank === 'Mercantil':
        try {
          var cfg = pre.Mercantil
          let integratorId = cfg.integratorId
          let merchantId = cfg.merchantId
          let terminalId = cfg.terminalId
          let request = req.body
          delete request.bank
          delete request.ambiente
          let defaultcode = cfg.claveSecreta
          request.transaction.cvv = encryptar(defaultcode, request.transaction.cvv.toString()).toString()
          request.transaction.twofactor_auth = encryptar(defaultcode, request.transaction.twofactor_auth).toString()
          let invoicenumber = Math.random().toString(16).substr(2, 10)
          request.merchant_identify = {
            'integratorId': parseInt(integratorId),
            'merchantId': parseInt(merchantId),
            'terminalId': terminalId
          }
          if (cfg.ambiente) {
            var url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/pay'
          } else {
            url = 'https://apimbu.mercantilbanco.com/mercantil-banco/prod/v1/payment/pay'
          }
          request.transaction.invoice_number = invoicenumber
          let options2 = { method: 'post',
            url: url,
            headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': cfg.xibm },
            data: request,
            json: true }
          console.log(options2)
          let respuesta = await axios(options2)
          const payload = {
            cardNumberFirst: request.transaction.card_number.substr(0, 4),
            cardNumberLast: request.transaction.card_number.substr(request.transaction.card_number.length - 4),
            cardCVC: request.transaction.cvv,
            cardExpDate: typeof request.transaction.expiration_date === 'undefined' ? '' : request.transaction.expiration_date,
            customerId: typeof request.transaction.customerId === 'undefined' ? '' : request.transaction.customerId,
            paidAmount: request.transaction.amount,
            paidAmountCurrency: respuesta.data.transaction_response.currency,
            rateId: 0,
            txnBankId: 1,
            trxType: 'Mercantil',
            trxProcesingDate: respuesta.data.transaction_response.processing_date,
            paymentStatus: respuesta.data.transaction_response.trx_status,
            payment_method: respuesta.data.transaction_response.payment_method,
            DateIn: new Date()
          }
          const res2 = await db.collection('ambiente').doc(ambiente).collection('transactions').add(payload)
          res.send({ trx: respuesta.data.transaction_response, id: res2.id })
        } catch (err) {
          res.status(400)
          console.log({ err })
          if (err.response && err.response.data && err.response.data.error_list) {
          // console.log(error.response.data);
            console.log(err.response.data.error_list[0].description)
            // console.log(error.response.headers);
            res.send({
              title: 'Error',
              message: err.response.data.error_list[0].description })
          } else {
            res.send({
              title: 'Error',
              message: 'Error inesperado, intente más tarde' })
          }
        }
        break
      case reqBank === 'PagoMovil':
        try {
          cfg = pre.Mercantil
          // let integratorId = cfg.integratorId
          // let merchantId = cfg.merchantId
          let terminalId = cfg.terminalId
          let request = req.body
          delete request.bank
          delete request.ambiente
          let defaultcode = cfg.claveSecreta
          // defaultcode = 'A9279120481620090701AA30'
          request.transaction_c2p.destination_mobile_number = encryptar(defaultcode, request.transaction_c2p.destination_mobile_number.toString()).toString()
          request.transaction_c2p.destination_id = encryptar(defaultcode, request.transaction_c2p.destination_id.toString()).toString()
          // request.transaction_c2p.payment_reference = encryptar(defaultcode, request.transaction_c2p.payment_reference).toString()
          request.transaction_c2p.payment_reference = ''
          request.transaction_c2p.origin_mobile_number = encryptar(defaultcode, request.transaction_c2p.origin_mobile_number.toString()).toString()
          request.transaction_c2p.twofactor_auth = encryptar(defaultcode, request.transaction_c2p.twofactor_auth).toString()
          let invoicenumber = Math.random().toString(16).substr(2, 10)
          request.merchant_identify = {
            'integratorId': 1,
            // parseInt(integratorId),
            'merchantId': 150408,
            // parseInt(merchantId),
            'terminalId': terminalId
          }
          if (cfg.ambiente) {
            url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/c2p'
          } else {
            url = 'https://apimbu.mercantilbanco.com/mercantil-banco/prod/v1/payment/c2p'
            // url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/c2p'
            // url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/c2p'
          }
          request.transaction_c2p.invoice_number = invoicenumber
          let options2 = { method: 'post',
            url: url,
            headers:
            { accept: 'application/json',
              'content-type': 'application/json',
              // 'x-ibm-client-id': '81188330-c768-46fe-a378-ff3ac9e88824'
              'x-ibm-client-id': cfg.xibm
            },
            data: request
            // json: true
          }
          console.log(options2)
          let respuesta = await axios(options2)
          // const payload = {
          //   cardNumberFirst: request.transaction.card_number.substr(0, 4),
          //   cardNumberLast: request.transaction.card_number.substr(request.transaction.card_number.length - 4),
          //   cardCVC: request.transaction.cvv,
          //   orderId: 0,
          //   paidAmount: request.transaction.amount,
          //   paidAmountCurrency: respuesta.data.transaction_response.currency,
          //   rateId: 0,
          //   txnBankId: 1,
          //   trxType: 'Mercantil',
          //   trxProcesingDate: respuesta.data.transaction_response.processing_date,
          //   paymentStatus: respuesta.data.transaction_response.trx_status,
          //   payment_method: respuesta.data.transaction_response.payment_method,
          //   DateIn: new Date()
          // }
          // const res2 = await db.collection('transactions').add(payload)
          console.log('Bien', respuesta)
          res.send({ trx: respuesta.data.transaction_c2p_response })
          // res.send({ options2 })
          // res.send({ trx: respuesta.data.transaction_response, id: res2.id })
        } catch (err) {
          console.log('Error', err)
          res.status(400)
          console.log({ ...err.response })
          if (err.response && err.response.data && err.response.data.error_list) {
            // console.log(error.response.data);
            console.log(err.response.data.error_list[0].description)
            // console.log(error.response.headers);
            res.send({
              title: 'Error',
              message: err.response.data.error_list[0].description })
          } else {
            res.send({
              title: 'Error',
              message: 'Error inesperado, intente más tarde'
            })
          }
        }
        break
      case reqBank === 'MercantilTDC':
        try {
          cfg = pre.Mercantil
          let integratorId = cfg.integratorId
          let merchantId = cfg.merchantId
          let terminalId = cfg.terminalId
          let request = req.body
          delete request.bank
          delete request.ambiente
          let defaultcode = cfg.claveSecreta
          // request.transaction.cvv = encryptar(defaultcode, request.transaction.cvv.toString()).toString()
          request.transaction.twofactor_auth = encryptar(defaultcode, request.transaction.twofactor_auth).toString()
          let invoicenumber = Math.random().toString(16).substr(2, 10)
          request.merchant_identify = {
            'integratorId': parseInt(integratorId),
            'merchantId': parseInt(merchantId),
            'terminalId': terminalId
          }
          if (cfg.ambiente) {
            url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/pay'
          } else {
            url = 'https://apimbu.mercantilbanco.com/mercantil-banco/prod/v1/payment/pay'
          }
          request.transaction.invoice_number = invoicenumber
          let options2 = { method: 'post',
            url: url,
            headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': cfg.xibm },
            data: request,
            json: true }
          console.log(options2)
          let respuesta = await axios(options2)
          const payload = {
            cardNumberFirst: request.transaction.card_number.substr(0, 4),
            cardNumberLast: request.transaction.card_number.substr(request.transaction.card_number.length - 4),
            // cardCVC: request.transaction.cvv,
            orderId: 0,
            paidAmount: request.transaction.amount,
            paidAmountCurrency: respuesta.data.transaction_response.currency,
            cardExpDate: typeof request.transaction.expiration_date === 'undefined' ? '' : request.transaction.expiration_date,
            customerId: typeof request.transaction.customerId === 'undefined' ? '' : request.transaction.customerId,
            rateId: 0,
            txnBankId: 1,
            trxType: 'Mercantil',
            trxProcesingDate: respuesta.data.transaction_response.processing_date,
            paymentStatus: respuesta.data.transaction_response.trx_status,
            payment_method: respuesta.data.transaction_response.payment_method,
            invoice_number: invoicenumber,
            DateIn: new Date()
          }
          console.log(payload)
          const res2 = await db.collection('ambiente').doc(ambiente).collection('transactions').add(payload)
          res.send({ trx: respuesta.data.transaction_response, id: res2.id })
        } catch (err) {
          res.status(400)
          console.log({ err })
          if (err.response && err.response.data && err.response.data.error_list) {
          // console.log(error.response.data);
            console.log(err.response.data.error_list[0].description)
            // console.log(error.response.headers);
            res.send({
              title: 'Error',
              message: err.response.data.error_list[0].description })
          } else {
            res.send({
              title: 'Error',
              message: 'Error inesperado, intente más tarde',
              error: err })
          }
        }
        break
      default:
        res.send({
          title: 'Error',
          message: 'Error inesperado, intente más tarde' })
    }
  }
})
exports.GetAuth = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    return res.end()
  }
  const ambiente = req.body.ambiente
  const reqRef = db.collection('ambiente').doc(ambiente).collection('config').doc('paymentServ')
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    return res.send({
      error: 'No payment configuration set'
    })
  }
  let pre = doc.data()
  if (typeof pre.Mercantil === 'undefined') {
    return res.send({
      error: 'No payment configuration set'
    })
  }
  let cfg = pre.Mercantil
  let integratorId = cfg.integratorId
  let merchantId = cfg.merchantId
  let terminalId = cfg.terminalId
  let body = req.body
  body.merchant_identify = {
    'integratorId': parseInt(integratorId),
    'merchantId': parseInt(merchantId),
    'terminalId': terminalId
  }
  if (cfg.ambiente) {
    var url = 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/getauth'
  } else {
    url = 'https://apimbu.mercantilbanco.com/mercantil-banco/prod/v1/payment/getauth'
  }
  let options = { method: 'post',
    url: url,
    headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': cfg.xibm },
    data: body,
    json: true }
  try {
    let respuesta = await axios(options)
    console.log(respuesta.data)
    let defaultcode = cfg.claveSecreta
    let typePasswordBank = decrypt(respuesta.data.authentication_info.twofactor_type, defaultcode)
    res.status(200)
    return res.send({ auth: typePasswordBank.slice(0, 15) })
  } catch (err) {
    res.status(400)
    console.log({ err })
    if (err.response && err.response.data && err.response.data.error_list) {
    // console.log(error.response.data);
      console.log(err.response.data.error_list[0].description)
      // console.log(error.response.headers);
      return res.send({
        title: 'Error',
        message: err.response.data.error_list[0].description })
    } else {
      return res.send({
        title: 'Error',
        message: 'Error inesperado, intente más tarde' })
    }
  }
})
function decrypt (encryptedBytes, keybanking) {
  const clave = hasha(keybanking, { algorithm: 'sha256', Type: 'string' })
  var key = clave.substr(0, 32)
  key = aesjs.utils.hex.toBytes(key)
  // eslint-disable-next-line new-cap
  var aesCbc = new aesjs.ModeOfOperation.cbc(key)
  // se le incorporo para convertir de base64 a byte
  encryptedBytes = Uint8Array.from(atob(encryptedBytes), c => c.charCodeAt(0))
  var decryptedBytes = aesCbc.decrypt(encryptedBytes)
  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
  console.log(decryptedText)
  return decryptedText
}
// eslint-disable-next-line no-unused-vars
function encryptar (keybanking, value) {
  const clave = hasha(keybanking, { algorithm: 'sha256', Type: 'string' })
  var key = clave.substr(0, 32)
  key = aesjs.utils.hex.toBytes(key)
  // eslint-disable-next-line new-cap
  var aesCbc = new aesjs.ModeOfOperation.cbc(key)
  const dataBytes = aesjs.utils.utf8.toBytes(value)
  const paddedData = aesjs.padding.pkcs7.pad(dataBytes)
  const encryptedBytes = aesCbc.encrypt(paddedData)
  // console.log('valor',encryptedBytes)
  let buff = Buffer.from(encryptedBytes)
  let base64data = buff.toString('base64')
  return base64data
}

exports.getinitjs = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', '*')
  var url = 'https://' + req.headers['x-forwarded-host']
  console.log(url)
  if (typeof req.headers['x-forwarded-host'] === 'undefined' || url.includes('localhost')) {
    return res.send('chopzi')
  }
  const getClientSub = await db.collection('ambiente')
    .where('domains', 'array-contains', url)
    .get()
  if (getClientSub.empty) {
    console.log('No matching documents.')
    return res.send({ ambiente: 'NA' })
  }
  getClientSub.forEach((doc) => {
    let data = doc.data()
    return res.send({ ambiente: data.ambiente })
  })
})
exports.seoHandling = functions.https.onRequest(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  var url = 'https://' + req.headers['x-forwarded-host']
  // const url = 'https://chopzi.com'
  console.log(url, 'URLS')
  if (typeof req.headers['x-forwarded-host'] === 'undefined') {
    return res.send(``)
  }
  let ambiente = await fetchSetup(url)
  if (ambiente.ambiente === 'NA') {
    return res.send('<p> Error en la configuracion del ambiente contacte al administrador </p>')
  }
  const reqRef = db.doc(`ambiente/${ambiente.ambiente}/environment/manifest`)
  const sourceRef = db.doc(`environment/sources`)
  const sources = await sourceRef.get()
  const doc = await reqRef.get()
  var scripts = ''
  var stylesheets = ''
  if (!sources.exists) {
    console.log('No such document!')
  } else {
    const srcData = sources.data()
    const src = srcData.src
    for (let i of src) {
      scripts = scripts + `<script src="${i}"></script>`
    }
    const style = srcData.stylesheet
    for (let i of style) {
      stylesheets = stylesheets + `<link href="${i}" rel="stylesheet">`
    }
  }
  if (!doc.exists && sources.exists) {
    console.error('No such document!')
    return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">
        <meta name="robots" content="index, follow" data-qmeta="robots">
        <meta name="language" content="Spanish" data-qmeta="language">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" data-qmeta="equiv">
        <link rel="mask-icon" href="icons/safari-pinned-tab.svg" color="#027be3">
        ${stylesheets}
        <meta name="msapplication-TileImage" content="icons/ms-icon-144x144.png">
        <meta name="msapplication-TileColor" content="#000000">
    </head>
    <body>
    <div id="q-app">
    <style>
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  top: 50%;
  position: fixed;
  left: 50%;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
</head>
<body>

<div class="loader"></div>
    </div>
    <script>
    localStorage.setItem('amb', '${ambiente.ambiente}')
    </script>
    ${scripts}
    </body>
  </html>
    `)
  } else {
    let pre = doc.data()
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width">
        <title>${pre.name}</title>
        <meta name="title" content="${pre.name}" data-qmeta="title">
        <meta name="description" content="${pre.description}" data-qmeta="description">
        <meta name="keywords" content="${pre.keywords}" data-qmeta="keywords">
        <link rel="manifest" href="getmanifest.json">
        <meta name="robots" content="index, follow" data-qmeta="robots">
        <meta name="language" content="Spanish" data-qmeta="language">
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="${url}">
        <meta property="og:title" content="${pre.name}">
        <meta property="og:description" content="${pre.description}">
        <meta property="og:image" content="${pre.icons.icon512x512}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${url}">
        <meta property="twitter:title" content="Chopzi">
        <meta property="twitter:description" content="${pre.description}">
        <meta property="twitter:image" content="${pre.icons.icon512x512}">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" data-qmeta="equiv">
        <link rel="shortcut icon" type="image/ico" href="${pre.icons.favicon}" data-qmeta="favicon">
        <link rel="shortcut icon" type="image/png" href="${pre.icons.icon128x128}" data-qmeta="128x128">
        <link rel="shortcut icon" type="image/png" href="${pre.icons.icon192x192}" data-qmeta="192x192">
        <link rel="shortcut icon" type="image/png" href="${pre.icons.icon256x256}" data-qmeta="256x256">
        <link rel="shortcut icon" type="image/png" href="${pre.icons.icon512x512}" data-qmeta="512x512">
        <link rel="mask-icon" href="icons/safari-pinned-tab.svg" color="#027be3">
        ${stylesheets}
        <meta name="msapplication-TileImage" content="icons/ms-icon-144x144.png">
        <meta name="msapplication-TileColor" content="#000000">
    </head>
    <body>
    <div id="q-app">
    <style>
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  position: fixed;
  top: 50%;
  left: 50%;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<div class="loader"></div>
    </div>
    <script>
    localStorage.setItem('amb', '${ambiente.ambiente}')
    </script>
    ${scripts}
    </body>
  </html>`
    return res.send(html)
  }
})
async function requestTrial (requestUID) {
  const reqRef = db.collection('ambiente')
  const doc = await reqRef.where('available', '==', true).limit(1).get()
  const chopziUserRef = await db.doc(`ambiente/chopzi/users/${requestUID}`).get()
  const chopziUser = chopziUserRef.data()
  if (doc.empty) {
    admin.firestore().collection('mail').add({
      to: chopziUser.email,
      message: {
        subject: 'Hola desde Chopzi!',
        text: 'Por los momentos te hemos colocado en lista de espera',
        html: ''
      }
    })
    let ret = await db.doc(`ambiente/chopzi/users/${requestUID}`).set({ ...chopziUser, typeAccess: 'Client', requestDate: admin.firestore.Timestamp.now(), awaitingTrial: true }, { merge: true })
    console.error('No such document!')
    try {
      if (ret) {
        let e = { error: 9000, message: 'No hay servidores disponibles por el momento, el usuario ha sido colocado en lista de espera' }
        throw e
      } else {
        let e = { error: 9000, message: 'No hay servidores disponibles por el momento, el usuario ha sido colocado en lista de espera' }
        throw e
      }
    } catch (e) {
      console.log('errorrrrrr', e)
      admin.firestore().collection('mail').add({
        to: 'danieluzca2@gmail.com',
        message: {
          subject: 'El usuario esta en lista de espera!',
          text: requestUID,
          html: ''
        }
      })
      return 0
    }
  } else {
    return doc.forEach(async (dox) => {
      try {
        if (typeof chopziUser.clientDomain !== 'undefined') {
          let e = { error: 9001, message: 'El usuario ya tiene un servicio asociado', uu: chopziUser.clientDomain }
          throw e
        }
        let env = await dox.data()
        // const otherApp = admin.initializeApp(env, 'other2');
        // const db2 = otherApp.firestore();
        console.log('WTF', env.ambiente)
        let ret3 = await db.doc(`ambiente/${env.ambiente}`).set({ available: false, trialDate: admin.firestore.Timestamp.now(), userAdmin: chopziUser }, { merge: true })
        let ret2 = await db.doc(`ambiente/${env.ambiente}/users/${requestUID}`).set({ ...chopziUser, typeAccess: 'Admin', rol: ['Admin'] }, { merge: true })
        /*eslint-disable */
        let ret = await db.doc(`ambiente/chopzi/users/${requestUID}`).set({ ...chopziUser,trialDate: admin.firestore.Timestamp.now(), clientDomain: env.clientDomain, adminDomain: env.adminDomain }, {merge: true});
        if (ret && ret2 && ret3) {
          admin.firestore().collection('mail').add({
            to: chopziUser.email,
            message: {
              subject: 'Hola desde Chopzi',
              text: 'Administrativo: ' + 'https://' + env.adminDomain + '.chopzi.com' + ' Cliente: '+ 'https://'  + env.clientDomain + '.chopzi.com',
              html: '',
            },
          })
          admin.firestore().collection('mail').add({
            to: 'daniel.uzcategui@chopzi.com',
            message: {
              subject: 'Se Registró un usuario ',
              text: requestUID + ' Administrativo: ' + env.adminDomain + ' Cliente: ' + env.clientDomain + ' ' + JSON.stringify(chopziUser),
              html: '',
            },
          })
          admin.firestore().collection('mail').add({
            to: 'chopzi.info@chopzi.com',
            message: {
              subject: 'Se Registró un usuario ',
              text: requestUID + ' Administrativo: ' + env.adminDomain + ' Cliente: ' + env.clientDomain + ' ' + JSON.stringify(chopziUser),
              html: '',
            },
          })
          return 1
        } else {
          let e = { error: 9002, message: 'Error al escribir documento'}
          throw e
          // res.status(400)
          // return res.send(env)
        }
      } catch (e) {
        console.log('errorrrrrr', e)
        admin.firestore().collection('mail').add({
          to: 'daniel.uzcategui@chopzi.com',
          message: {
            subject: 'Error con algun usuario ' + requestUID + ' ' + JSON.stringify(chopziUser),
            text: JSON.stringify(e),
            html: '',
          },
        })
        admin.firestore().collection('mail').add({
          to: 'chopzi.info@chopzi.com',
          message: {
            subject: 'Error con algun usuario ' + requestUID + ' ' + JSON.stringify(chopziUser),
            text: JSON.stringify(e),
            html: '',
          },
        })
        return 0
      }
    })
  }

}