import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Category Mutations ////////
export const editCategory = firestoreAction((state, payload) => {
  return firestore()
    .collection('categorias')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('categorias updated!')
    })
})

export function saveCategory (state, payload) {
  console.log(payload)
  state.categorias = payload
}

export const addCatMut = firestoreAction((state, payload) => {
  return firestore()
    .collection('categorias').add({
      name: ''
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

/// ////// END Category Mutations ////////
/// ////// START Menu Mutations ////////
export const editMenu = firestoreAction((state, payload) => {
  return firestore()
    .collection('menu')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('menu updated!')
    })
})

export function saveMenu (state, payload) {
  console.log(payload)
  state.menu = payload
}

export function setFilter (state, payload) {
  console.log(payload)
  state.selectedFilter = payload
}
export function setProduct (state, payload) {
  console.log(payload)
  state.selectedProduct = payload
}
export function setProdType (state, payload) {
  console.log(payload)
  state.selectedProdType = payload
}
export const addMenuMut = firestoreAction((state, payload) => {
  return firestore()
    .collection('menu').add({
      name: ''
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

/// ////// END Menu Mutations ////////
/// ////// START Cart Mutations ////////

export function addCart (state, payload) {
  state.cart = ([ ...state.cart, { ...payload } ])
}
export function setSede (state, payload) {
  state.sede = payload
}
export function modCartVal (state, payload) {
  state.cart[payload.id][payload.key] = payload.value
}
export function delCartItem (state, payload) {
  delete state.cart.splice(payload, 1)
}

export function delCart (state, payload) {
  state.cart = []
}

/// ////// END Cart Mutations ////////
