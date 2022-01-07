/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const saveClient = firestoreAction((state, payload) => {
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

export const bindClients2 = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  return bindFirestoreRef('clients2', firestore().collection('clients'))
})
export const setIdCliente = async function ({ commit }, payload) {
  console.log('id de la categoria', payload)
  commit('client/setIdCliente', payload, { root: true })
}
export const bindOnlyVendedor = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindOnlyClients')
  return bindFirestoreRef('vendedor', firestore().collection('users').where('typeAccess', '==', 'Vendedor').orderBy('email'))
})
