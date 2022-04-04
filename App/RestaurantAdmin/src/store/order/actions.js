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
export const bindOrdersEnvio = firestoreAction(({ bindFirestoreRef }) => {
  return bindFirestoreRef('orderencomienda', firestore().collection('orders').orderBy('dateIn', 'desc').where('tipEnvio', '==', '4').where('encomienda.status', '==', 'enviar'))
})

export const unBindOrders = firestoreAction(({ unbindFirestoreRef }) => {
  console.log('unbinding')
  return unbindFirestoreRef('orders')
})
export const reportBindOrders = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindorders')
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc'))
})
export const reportBindOrders2 = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders')
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc').where('customer_id', '!=', 'aaaaa').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end))
  }
  let hoy = new Date()
  hoy.setDate(hoy.getDate() - 30)
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc').where('customer_id', '!=', 'aaaaa').where('dateIn', '>=', hoy))
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
export const reportBindOrderscorporativo = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders')
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('ordercorporativo', firestore().collection('orders').orderBy('dateIn', 'desc').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end).where('tipEnvio', '==', '3'))
  }
  let hoy = new Date()
  hoy.setDate(hoy.getDate() - 30)
  return bindFirestoreRef('ordercorporativo', firestore().collection('orders').orderBy('dateIn', 'desc').where('tipEnvio', '==', '3').where('dateIn', '>=', hoy))
})
export const encomienda = async function ({ commit }, payload) {
  commit('order/encomienda', payload, { root: true })
}
export const setencomienda = async function (state, payload) {
  let result
  console.log('valor del paylod', payload)
  result = await firestore().collection('orders')
    .doc(payload.idorden)
    .set({
      guia: payload
    }, { merge: true })
  return result
}
