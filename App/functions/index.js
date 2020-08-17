const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.facturasSequence = functions.firestore
    .document('orders/{ordersId}')
    .onCreate( async (change, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      var countRef = db.collection('counters').doc('orders');
      // Atomically increment the population of the city by 50.
      countRef.update({
          factura: firebase.firestore.FieldValue.increment(1)
      });
      var counter = db.collection('counters').doc('orders').get().data().factura
      change.ref.set({
        factura: factura
      }, {
          merge: true
      })

});