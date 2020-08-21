const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()

exports.CheckCart = functions.firestore
  .document('orders/{ordersId}')
  .onCreate(async (change, context) => {
    // Get an object representing the document
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
    // var userRef = db.collection('users').doc(newValue.customer_id)
    // const doc = await userRef.get()
    // const userData = doc.data()
    for (let prod in cart) {
      if (cart[prod].prodType === 0) {
        var reference = db.collection('menu').doc(cart[prod].prodId)
        var decrement = admin.firestore.FieldValue.increment(-cart[prod].quantity)
        reference.update({
          [`stock.${sede}`]: decrement
        })
        var menu = await reference.get()
        var menuDoc = menu.data()
        if (!cart[prod].rewards) {
          var discount = typeof menuDoc.discount !== 'undefined' ? menuDoc.discount : 0
          var prodPrice = parseFloat((menuDoc.price * (100 - discount) / 100).toFixed(2))
          sumPaid = (cart[prod].quantity * prodPrice) + sumPaid
          newcart[prod].prodPrice = prodPrice
        }
        for (var items of cart[prod].items) {
          if (typeof items.quantity === 'undefined') {
            items.quantity = 1
          }
          items.price = await getComponentPrice(items.component, items.item, items.quantity)
          sumPaid = sumPaid + ((items.price * items.quantity) * cart[prod].quantity)
        }
      } else {
        var multiplier = prod.quantity
        var products = prod.prods
        products.forEach((e) => {
          var reference = db.collection('menu').doc(e.id)
          var amount = multiplier * e.quantity
          var decrement = admin.firestore.FieldValue.increment(-amount)
          reference.update({
            [`stock.${sede}`]: decrement
          })
        })
      }
    }
    change.ref.set({
      cart: newcart,
      paid: sumPaid
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
    if (!countRef.exists) {
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
exports.RewardsPoints = functions.firestore
  .document('orders/{ordersId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()
    if (newValue.status === 3) {
      var paid = previousValue.paid
      var user = previousValue.customer_id
      var userRef = db.collection('users').doc(user)
      const doc = await userRef.get()
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
          var points = admin.firestore.FieldValue.increment(paid)
          userRef.update({
            points: points
          })
        }
        const cart = previousValue.cart
        for (let prod of cart) {
          if (prod.prodType === 0) {
            var menuRef = db.collection('menu').doc(prod.prodId)
            const docMenu = await menuRef.get()
            var increment = admin.firestore.FieldValue.increment(prod.quantity)
            if (!docMenu.exists) {
              console.log('No such document!')
            } else {
              const docMenuData = docMenu.data()
              for (var cat of docMenuData.categoria) {
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
  })
