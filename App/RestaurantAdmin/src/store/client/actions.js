/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const saveClient = async function ({ commit }, payload) {
  return commit('saveClientMt', payload)
}

export const addClient = async function ({ commit }, payload) {
  return commit('addClientMt', payload)
}

export const deleteClient = async function ({ commit }, payload) {
  return commit('deleteClientMt', payload)
}

export const bindClients = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  return bindFirestoreRef('clients', firestore().collection('users').where('rol', '==', 'Usuario'))
})
