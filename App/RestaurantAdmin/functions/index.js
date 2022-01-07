const functions = require('firebase-functions')
const admin = require('firebase-admin')
const axios = require('axios')
admin.initializeApp()
const db = admin.firestore()
async function rewardAmount (context, newValue) {
  let cfgData
  let cfgRew
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
  return cfgRew
}

exports.onWrite = require('./triggers/test/onWrite/index')

exports.CheckCart = functions.firestore
  .document('/ambiente/{ambiente}/orders/{ordersId}')
  .onCreate(async (change, context) => {
    const newValue = change.data()
    const sede = newValue.sede
    const cart = newValue.cart
    var newcart = cart
    var sumPaid = 0
    var sumProd = 0
    var sumExtras = 0
    var cfgRew
    cfgRew = await rewardAmount(context, newValue) // Find if there is a configuration for rewards if not set it to 10
    var userRef = db.collection('ambiente').doc(context.params.ambiente).collection('users').doc(newValue.customer_id)
    const doc = await userRef.get()
    const userData = doc.data()
    var pointsCat = userData.pointsCat
    let cupon = 0
    let message = []
    if (newValue.address) {
      let reference = db.collection('ambiente').doc(context.params.ambiente).collection('address').doc(newValue.address)
      let addressDoc = await reference.get()
      let address = addressDoc.data()
      address = JSON.parse(address.location)
      let lat = address[0].position.lat
      let lng = address[0].position.lng
      message.push(
        {
          'type': 'text',
          'value': `*Chopzi* \nnueva orden para delivery!`
        }
      )
      message.push(
        {
          'type': 'location',
          'lng': lng.toString(),
          'lat': lat.toString()
        }
      )
    } else {
      message.push({
        'type': 'text',
        'value': `*Chopzi* \nnueva orden npara Pickup!`
      })
    }
    for (let prod in cart) {
      if (cart[prod].prodType === 0) {
        let sub = 0
        let extra = 0
        let paid = 0
        // Update product stock start
        var reference = db.collection('ambiente').doc(context.params.ambiente).collection('menu').doc(cart[prod].prodId)
        var decrement = admin.firestore.FieldValue.increment(-cart[prod].quantity)
        reference.update({
          [`stock.${sede}`]: decrement
        })
        // End
        var menu = await reference.get()
        var menuDoc = menu.data()
        var discount = menuDoc.discount || 0
        if (!cart[prod].reward) {
          var prodPrice = parseFloat((menuDoc.price * (100 - discount) / 100).toFixed(2))
          paid = (cart[prod].quantity * prodPrice)
          sub = (cart[prod].quantity * prodPrice)
          newcart[prod].prodPrice = prodPrice
          newcart[prod].discount = discount
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
              prodPrice = parseFloat((menuDoc.price * (100 - discount) / 100).toFixed(2))
              sumPaid = (cart[prod].quantity * prodPrice) + sumPaid
              newcart[prod].prodPrice = prodPrice
            }
          }
        }
        for (var items of cart[prod].items) {
          items.quantity = items.quantity || 1
          items.price = await getComponentPrice(items.component, items.item, context.params.ambiente)
          items.price = (items.price * (100 - discount) / 100)
          let price = ((items.price * items.quantity) * cart[prod].quantity)
          paid = paid + price
          extra = extra + price
        }
        if (newValue.cupons && newValue.cupons.length) { // Check coupon and apply discount
          for (let i of newValue.cupons) {
            let excluyente = i.includeAll && !i.exclude?.products?.include?.(cart[prod].prodId) && !i.exclude?.categories?.some?.(item => cart[prod].category?.includes(item))
            let incluyente = !i.includeAll && (i.include?.products?.include?.(cart[prod].prodId) || i.include?.categories?.some?.(item => cart[prod].category?.includes(item)))
            let disctot = 0
            if (i.discount && !i.isAmount && (excluyente || incluyente)) {
              let disc = (1 - i.discount / 100)
              let subdisc = sub * disc
              let extradisc = extra * disc
              disctot = (sub - subdisc) + (extra - extradisc)
              cupon += disctot
            }
          }
        }
        sumPaid = paid + sumPaid
        sumProd = sub + sumProd
        sumExtras = extra + sumExtras
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
    if (newValue?.cupons?.length) {
      for (let i of newValue.cupons) {
        if (i.amount && i.isAmount) {
          cupon += i.amount
        }
      }
    }

    let newData = {
      cart: newcart,
      paid: newValue.delivery ? roundNumber(sumPaid + newValue.delivery - cupon) : roundNumber(sumPaid - cupon),
      subtotal: roundNumber(sumProd),
      cuponTotal: roundNumber(cupon),
      extras: roundNumber(sumExtras)
    }
    change.ref.set({
      ...newData
    }, {
      merge: true
    })
    return sendMessageAdmin(context.params.ambiente, message)
  })
function roundNumber (num) {
  return parseFloat(num.toFixed(2))
}
exports.FirstUser = functions.firestore
  .document('/ambiente/{ambiente}/users/{userId}')
  .onCreate(async (user, context) => {
    const original = user.data()
    if (context.params.ambiente !== 'chopzi') {
      const userRef2 = db.collection('ambiente').doc('chopzi').collection('users').doc(original.id)
      const doc = await userRef2.get()
      if (doc.empty) {
        let usuario = original
        delete original.rol
        await userRef2.set({ ...usuario, otherDb: true, typeAccess: 'Client', DateIn: admin.firestore.Timestamp.now() })
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
      await countRef.set({
        factura: 0
      }).then(async () => {
        change.ref.set({
          factura: 0
        }, {
          merge: true
        })
      })
    } else {
      await countRef.update({
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
    const adminRef = db.collection('ambiente').doc(context.params.ambiente).collection('users')
    const allAdmins = await adminRef.where('typeAccess', '==', 'Admin').get()
    if (!allAdmins.empty) {
      allAdmins.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
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
          const pre = await getPreManifest(context.params.ambiente)
          sendNotif(pre, userRef, userData, status.label)
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
async function sendMessageAdmin (ambiente, message) {
  let ambienteRef = db.collection('ambiente').doc(ambiente)
  const docAmb = await ambienteRef.get()
  const ambData = docAmb.data()
  let user = ambData.userAdmin.id
  let userRef = db.collection('ambiente').doc('chopzi').collection('users').doc(user)
  const doc = await userRef.get()
  const userData = doc.data()
  if (typeof userData.fcm !== 'undefined') {
    // const pre = await getPreManifest(ambiente)
    return sendNotif(userData, message)
  }
}
// async function sendMessage (user, message) {
//   let ambiente = 'chopzi'
//   let userRef = db.collection('ambiente').doc(ambiente).collection('users').doc(user)
//   const doc = await userRef.get()
//   const userData = doc.data()
//   if (typeof userData.fcm !== 'undefined') {
//     const pre = await getPreManifest(ambiente)
//     return sendNotif(pre, userRef, userData, message)
//   }
// }
// exports.sendMessage = functions.https.onRequest(async (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*')
//   res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
//   res.set('Access-Control-Allow-Headers', '*')
//   console.log(req.body.user, req.body.message)
//   let ambiente = 'chopzi'
//   let body = req.body.message
//   let userRef = db.collection('ambiente').doc(ambiente).collection('users').doc(req.body.user)
//   const doc = await userRef.get()
//   const userData = doc.data()
//   if (typeof userData.fcm !== 'undefined') {
//     const pre = await getPreManifest(ambiente)
//     return res.send(sendNotif(pre, userRef, userData, body))
//   }
// })
async function sendNotif (userData, message) {
  // await admin.firestore().collection('mail').add({
  //   to: userData.email,
  //   message: {
  //     subject: pre.name,
  //     text: body,
  //     html: ''
  //   }
  // })
  // await admin.messaging().sendToDevice(userData.fcm, { 'notification': {
  //   'title': pre.name,
  //   'body': body,
  //   // 'click_action': 'http://chopzi.com/#/',
  //   'icon': pre.icon
  // } }).then(async function (response) {
  //   var userfcm = userData.fcm
  //   if (response.failureCount) {
  //     let toDelete = []
  //     for (let i in response.results) {
  //       var result = response.results[i]
  //       if (result.error) {
  //         toDelete.push(userfcm[i])
  //       }
  //     }
  //     for (let i of toDelete) {
  //       let index = userfcm.findIndex(x => x === i)
  //       userfcm.splice(index, 1)
  //     }
  //   }
  //   return [userRef.set({ fcm: userfcm }, { merge: true }), response]
  // })
  //   .catch(function (error) {
  //     console.log('Error sending message:', error)
  //     return [false, error]
  //   })
  try {
    message.push({
      'type': 'text',
      'value': `*Cliente* ${userData.nombre + ' ' + userData.apellido} ${userData.phone}`
    })
    let dateNow = Date.now()
    // dateNow.setSeconds(dateNow.getSeconds() + 10)
    let time = Math.floor(dateNow / 1000)
    let msgTime = time
    for (let msg of message) {
      msgTime = msgTime + 3
      msg.time = msgTime
    }
    time = time.toString()
    let postData = {
      'app': {
        'id': '584241329457',
        'time': time,
        'data': {
          'recipient': {
            'id': userData.phone
          },
          message
        }
      }
    }
    let options = {
      url: 'https://whapi.io/api/send',
      method: 'post',
      data: postData
    }
    await axios(options)
  } catch (err) {
    console.error(err)
  }
}
async function getPreManifest (ambiente) {
  const reqRef = db.doc(`ambiente/${ambiente}/environment/manifest`)
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    return {
      'name': 'Chopzi',
      'icon': 'icons/icon-128x128.png'
    }
  } else {
    let prev = doc.data()
    return {
      'name': prev.name,
      'icon': prev.icons.icon128x128
    }
  }
}
