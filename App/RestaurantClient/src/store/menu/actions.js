import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
/// ////// END Action ////////
/// Cart Actions
export const addCart = async function ({ commit }, payload) {
  return commit('addCart', payload)
}
export const modCartVal = async function ({ commit }, payload) {
  return commit('modCartVal', payload)
}
export const delCartItem = async function ({ commit }, payload) {
  return commit('delCartItem', payload)
}
/// Bindings ////
export const bindExtras = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingExtras')
  return bindFirestoreRef('extras', firestore().collection('extras'))
})
export const bindMenu = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  return bindFirestoreRef('menu', firestore().collection('menu'))
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias'))
})
