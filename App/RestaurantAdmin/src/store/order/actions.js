/// ////// Orders Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindOrders = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders', { payload })
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('orders', firestore().collection('orders').orderBy('dateIn', 'desc').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end))
  }
  let hoy = new Date()
  hoy.setDate(hoy.getDate() - 30)
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('dateIn', 'desc').where('dateIn', '>=', hoy))
})

export const reportBindOrders = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindorders')
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc'))
})

export const saveOrder = firestoreAction((state, payload) => {
  return firestore()
    .collection('orders')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('orders updated!')
    })
})
export const deleteOrder = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('orders')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('orders removed!')
      }).catch((e) => {
        console.log('error removing orders!')
      })
  }
})
export const addOrder = firestoreAction((state, payload) => {
  return firestore()
    .collection('orders').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
export const alterRange = async function ({ commit }, payload) {
  commit('order/alterRange', payload, { root: true })
}
