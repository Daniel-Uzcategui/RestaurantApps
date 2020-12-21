/// ////// Transaction Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindTransactions = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindTransactions')
  return bindFirestoreRef('transactions', firestore().collection('transactions'), { reset: false, serialize: serialize })
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
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
