import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Category Action ////////
export const setCategory = async function ({ commit }, payload) {
  return commit('editCategory', payload)
}

export const saveCategory = async function ({ commit }, payload) {
  return commit('saveCategory', payload)
}

export const addCategory = async function ({ commit }, payload) {
  return commit('addCatMut', payload)
}
/// ////// END Category Action ////////
/// ////// START MENU Action ////////
export const setMenu = async function ({ commit }, payload) {
  return commit('editMenu', payload)
}

export const saveMenu = async function ({ commit }, payload) {
  return commit('saveMenu', payload)
}

export const addMenu = async function ({ commit }, payload) {
  return commit('addMenuMut', payload)
}
/// ////// END MENU Action ////////

/// ////// START Extras Action ////////
export const setExtras = async function ({ commit }, payload) {
  return commit('editExtras', payload)
}

export const saveExtras = async function ({ commit }, payload) {
  return commit('saveExtras', payload)
}

export const addExtras = async function ({ commit }, payload) {
  return commit('addExtras', payload)
}
/// ////// END Extras Action ////////
/// Bindings ////
export const bindExtras = firestoreAction(({ bindFirestoreRef }) => {
  console.log('binding')
  return bindFirestoreRef('extras', firestore().collection('extras'))
})
