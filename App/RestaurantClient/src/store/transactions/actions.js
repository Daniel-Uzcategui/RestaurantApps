/// ////// Transaction Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindTransactions = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindTransactions')
  return bindFirestoreRef('transactions', firestore().collection('transactions'), { reset: false })
})

export const addTransaction = firestoreAction((state, payload) => {
  return firestore()
    .collection('transactions').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
