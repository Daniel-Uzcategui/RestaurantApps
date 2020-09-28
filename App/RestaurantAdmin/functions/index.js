const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

exports.CheckCart = functions.firestore
  .document('orders/{ordersId}')
  .onCreate(async (change, context) => {
    // Get an object representing the documen
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.data()
    const sede = newValue.sede
    const cart = newValue.cart
    var newcart = cart
    var sumPaid = 0
    if (newValue.tipEnvio === '1') {
      const configRef = db.collection('config')
      const cfg = await configRef.get()
      cfg.forEach(doccfg => {
        var cfgData = doccfg.data()
        if (cfgData.source === 'paymentServ') {
          sumPaid = sumPaid + parseInt(cfgData.price)
        }
      })
    }
    var userRef = db.collection('users').doc(newValue.customer_id)
    const doc = await userRef.get()
    const userData = doc.data()
    var pointsCat = userData.pointsCat
    for (let prod in cart) {
      if (cart[prod].prodType === 0) {
        var reference = db.collection('menu').doc(cart[prod].prodId)
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
              if ((points - (cart[prod].quantity * 10)) >= 0) {
                enoughPoints++
                catEnough = cat
              }
            }
            if (enoughPoints) {
              let amount = cart[prod].quantity * 10
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
          items.price = await getComponentPrice(items.component, items.item, items.quantity)
          sumPaid = sumPaid + ((items.price * items.quantity) * cart[prod].quantity)
        }
      } else {
        let multiplier = prod.quantity
        let products = prod.prods
        products.forEach((e) => {
          let reference = db.collection('menu').doc(e.id)
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
exports.facturasSequence = functions.firestore
  .document('orders/{ordersId}')
  .onCreate(async (change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var countRef = db.collection('counters').doc('orders')
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
        var counter = await db.collection('counters').doc('orders').get()
        change.ref.set({
          factura: counter.data().factura
        }, {
          merge: true
        })
      })
    }
  })
async function getComponentPrice (compId, itemId) {
  var price = 0
  var compRef = db.collection('groupComp').doc(compId)
  var comp = await compRef.get()
  var compDoc = comp.data()
  if (!compDoc.free) {
    var itemRef = db.collection('item').doc(itemId)
    var item = await itemRef.get()
    var itemDoc = item.data()
    price = price + (itemDoc.price)
  }
  return price
}
exports.GetManifest = functions.https.onRequest(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  const reqRef = db.collection('environment').doc('manifest')
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    res.send({
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
exports.GetManifestAdmin = functions.https.onRequest(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  const reqRef = db.collection('environment').doc('manifest')
  const doc = await reqRef.get()
  if (!doc.exists) {
    console.error('No such document!')
    res.send({
      'name': 'Chopzi-admin',
      'short_name': 'chopzi-admin',
      'description': 'Chopzi ECRA Admin',
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
    let icons = [
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
    ]
    pre.icons = icons
    pre.name = 'Chopzi-admin-' + pre.name
    pre.short_name = 'Chopzi-admin-' + pre.short_name
    return res.send({ ...pre })
  }
})
exports.RewardsPoints = functions.firestore
  .document('orders/{ordersId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    let user = previousValue.customer_id
    let userRef = db.collection('users').doc(user)
    const doc = await userRef.get()
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
            let menuRef = db.collection('menu').doc(prod.prodId)
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
        return
      } else {
        const cart = previousValue.cart
        const sede = previousValue.sede
        for (let prod of cart) {
          if (prod.prodType === 0) {
            var menuRef = db.collection('menu').doc(prod.prodId)
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
              let menuRef = db.collection('menu').doc(product.id)
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
    if (!doc.exists) {
      console.log('No such document!')
    } else {
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
          'icon': 'app-logo-128x128.png'
        } })
      }
    }
  })
