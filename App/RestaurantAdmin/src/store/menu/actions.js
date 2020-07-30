import { firestoreAction } from 'vuexfire'
import { firestore, firebase } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const setValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({ [payload.payload.key]: payload.payload.value })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const delValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({ [payload.payload.key]: firebase.firestore.FieldValue.delete() })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const addRow = firestoreAction(async (state, payload) => {
  var st = 'estatus'
  if (payload.collection === 'menu') {
    st = 'status'
  }
  return firestore()
    .collection(payload.collection).add({
      name: '',
      [st]: 0,
      descripcion: '',
      DateIn: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

export const delrows = firestoreAction((context, payload) => {
  console.log(payload)
  var st = 'estatus'
  if (payload.collection === 'menu') {
    st = 'status'
  }
  for (const i in payload.payload) {
    firestore().collection(payload.collection)
      .doc(payload.payload[i].id)
      .update({ [st]: 2 })
      .then(() => {
        console.log(`${payload.collection} updated!`)
      })
  }
})
/// ////// END Action ////////
/// Bindings ////
export const bindMenu = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  return bindFirestoreRef('menu', firestore()
    .collection('menu').orderBy('status', 'desc')
    .where('status', '<', 2), { reset: false })
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias')
    .orderBy('estatus', 'desc')
    .where('estatus', '<', 2), { reset: false })
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingPromos')
  return bindFirestoreRef('promos', firestore().collection('promos')
    .orderBy('estatus', 'desc')
    .where('estatus', '<', 2), { reset: false })
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item')
    .orderBy('estatus', 'asc')
    .where('estatus', '<', 2), { reset: false })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup')
    .orderBy('estatus', 'desc')
    .where('estatus', '<', 2), { reset: false })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp')
    .orderBy('estatus', 'asc')
    .where('estatus', '<', 2), { reset: false })
})
