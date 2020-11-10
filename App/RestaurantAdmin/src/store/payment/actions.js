/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindpayments = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindpayments')
  return bindFirestoreRef('payments', firestore().collection('payments'))
})

export const bindtransactions = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindTransactions')
  return bindFirestoreRef('transactions', firestore().collection('transactions'))
})

export const savePayment = firestoreAction((state, payload) => {
  return firestore()
    .collection('payments')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('payments updated!')
    })
})
export const deletePayments = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('payments')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('payments removed!')
      }).catch((e) => {
        console.log('error removing payments!')
      })
  }
})

export const addPayment = firestoreAction((state, payload) => {
  return firestore()
    .collection('payments').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
