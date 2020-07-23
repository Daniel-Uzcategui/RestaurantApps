/// ////// START Localization Action ////////
export const saveLocationAc = async function ({ commit }, payload) {
  return commit('saveLocationMt', payload)
}

import { firestoreAction } from 'vuexfire'
import { firestore, Timestamp } from '../../services/firebase/db.js'
export const addOrder = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('orders').add(
      { ...payload, dateIn: Timestamp.now() }
    )
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
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('orders updated!')
    })
})
export const bindOrders = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders')
  return bindFirestoreRef('orders', firestore().collection('orders').where('customer_id', '==', payload))
})
