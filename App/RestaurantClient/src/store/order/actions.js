/// ////// START Localization Action ////////
export const saveLocationAc = async function ({ commit }, payload) {
  return commit('saveLocationMt', payload)
}

import { firestoreAction } from 'vuexfire'
import { firestore, Timestamp } from '../../services/firebase/db.js'
export const addOrder = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('orders').add({ ...payload, dateIn: Timestamp.now() })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
export const saveOrder = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('orders')
    .doc(payload.id)
    .update({
      [payload.key]: payload.value
    })
    .then(() => {
      console.log('orders updated!')
    })
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const bindOrders = firestoreAction(async ({ bindFirestoreRef, unbindFirestoreRef }, payload) => {
  console.log('bindorders', payload)
  const e = await bindFirestoreRef('orders', firestore().collection('orders').where('customer.id', '==', payload).orderBy('dateIn'), { reset: false, serialize: serialize, wait: true })
  return e
})
