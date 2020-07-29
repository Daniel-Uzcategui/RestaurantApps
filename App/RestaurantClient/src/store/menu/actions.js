import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
/// ////// END Action ////////
/// Cart Actions
export const addCart = async function ({ commit }, payload) {
  return commit('addCart', payload)
}
export const setSede = async function ({ commit }, payload) {
  return commit('setSede', payload)
}
export const modCartVal = async function ({ commit }, payload) {
  return commit('modCartVal', payload)
}
export const delCartItem = async function ({ commit }, payload) {
  return commit('delCartItem', payload)
}
/// Bindings ////
export const bindMenu = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  return bindFirestoreRef('menu', firestore().collection('menu'))
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias').where('estatus', '==', 1))
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindPromos')
  return bindFirestoreRef('promos', firestore().collection('promos').where('estatus', '==', 1))
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item').where('estatus', '==', 1), { reset: false })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup').where('estatus', '==', 1), { reset: false })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp').where('estatus', '==', 1), { reset: false })
})
