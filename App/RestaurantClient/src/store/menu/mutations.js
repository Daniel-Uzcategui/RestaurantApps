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
/// ////// START Extras Mutations ////////
export const editExtras = firestoreAction((state, payload) => {
  return firestore()
    .collection('extras')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('extras updated!')
    })
})

export function saveExtras (state, payload) {
  console.log(payload)
  state.extras = payload
}

export const addExtras = firestoreAction((state, payload) => {
  return firestore()
    .collection('extras').add({
      name: ''
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

export function addCart (state, payload) {
  state.cart.push(payload)
  console.log(state.cart)
}
/// ////// END Extras Mutations ////////
