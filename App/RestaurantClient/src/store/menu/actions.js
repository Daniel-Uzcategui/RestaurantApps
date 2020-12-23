import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
/// ////// END Action ////////
/// Cart Actions
export const addCart = async function ({ commit }, payload) {
  return commit('addCart', payload)
}
export const setSede = async function ({ commit }, payload) {
  try {
    console.log({ setsede: payload })
    return commit('setSede', payload)
  } catch (e) {
    console.error(e)
  }
}
export const modCartVal = async function ({ commit }, payload) {
  return commit('modCartVal', payload)
}

export const setFilter = async function ({ commit }, payload) {
  return commit('setFilter', payload)
}
export const setProduct = async function ({ commit }, payload) {
  return commit('setProduct', payload)
}
export const setProdType = async function ({ commit }, payload) {
  return commit('setProdType', payload)
}
export const delCartItem = async function ({ commit }, payload) {
  return commit('delCartItem', payload)
}
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
/// Bindings ////
export const bindMenu = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  try {
    return bindFirestoreRef('menu', firestore().collection('menu').where('softDelete', '==', 0), { reset: false, serialize: serialize, wait: true })
  } catch (e) {
    console.error(e)
  }
})
export const bindFilters = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingFilters')
  return bindFirestoreRef('filters', firestore()
    .collection('filters')
    .where('softDelete', '==', 0).where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias').where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindPromos')
  return bindFirestoreRef('promos', firestore().collection('promos').where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item').where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup').where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp').where('estatus', '==', true), { reset: false, serialize: serialize, wait: true })
})
