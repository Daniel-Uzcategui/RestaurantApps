/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const saveClient = firestoreAction(async (state, payload) => {
  return firestore()
    .collection('users')
    .doc(payload.id)
    .update({
      [payload.key]: payload.value
    })
    .then(() => {
      console.log('users updated!')
    })
})

export const bindOnlyClients = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindOnlyClients')
  return bindFirestoreRef('clients', firestore().collection('users').where('typeAccess', '==', 'Client').orderBy('email'))
})

export const bindClients = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  return bindFirestoreRef('clients', firestore().collection('users').orderBy('email'))
})
export const unBindClients = firestoreAction(({ unbindFirestoreRef }) => {
  unbindFirestoreRef('clients')
  unbindFirestoreRef('vendedor')
  return unbindFirestoreRef('clients2')
})
export const bindClients2 = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  return bindFirestoreRef('clients2', firestore().collection('clients').where('softDelete', '==', 0))
})
export const setIdCliente = async function ({ commit }, payload) {
  console.log('id de la categoria', payload)
  commit('client/setIdCliente', payload, { root: true })
}
export const bindOnlyVendedor = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindOnlyClients')
  return bindFirestoreRef('vendedor', firestore().collection('users').orderBy('email'))
})
export const setValue = async function (state, payload) {
  let result

  result = await firestore().collection('clients')
    .doc(payload.id)
    .set({
      name: payload.name
    }, { merge: true })
  return result
}
export const setValueborar = async function (state, payload) {
  let result

  result = await firestore().collection('clients')
    .doc(payload.id)
    .set({
      softDelete: 1
    }, { merge: true })
  return result
}
export const setValuenew = async function (state, payload) {
  let result

  result = await firestore().collection('clients')
    .add({
      name: payload.name,
      softDelete: 0
    })
  return result
}
