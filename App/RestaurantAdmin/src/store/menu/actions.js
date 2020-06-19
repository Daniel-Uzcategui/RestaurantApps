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

export const delCategory = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('categorias')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('categorias removed!')
      }).catch((e) => {
        console.log('error removing categorias!')
      })
  }
})
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

export const delMenu = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('menu')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('menu removed!')
      }).catch((e) => {
        console.log('error removing menu!')
      })
  }
})
/// ////// END MENU Action ////////

/// ////// START Extras Action ////////
export const setExtras = async function ({ commit }, payload) {
  return commit('editExtras', payload)
}

export const saveExtras = async function ({ commit }, payload) {
  return commit('saveExtras', payload)
}

export const delExtras = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('extras')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('extras removed!')
      }).catch((e) => {
        console.log('error removing extras!')
      })
  }
})

export const addExtras = async function ({ commit }, payload) {
  return commit('addExtras', payload)
}
/// ////// END Extras Action ////////
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
