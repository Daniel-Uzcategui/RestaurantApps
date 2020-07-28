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
  return firestore()
    .collection(payload.collection).add({
      name: '',
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
  for (const i in payload.payload) {
    firestore().collection(payload.collection)
      .doc(payload.payload[i].id)
      .delete().then(() => {
        console.log(`${payload.collection} removed!`)
      }).catch((e) => {
        console.log('error removing extras!')
      })
  }
})
/// ////// END Action ////////
/// Bindings ////
export const bindExtras = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingExtras')
  return bindFirestoreRef('extras', firestore().collection('extras'), { reset: false })
})
export const bindMenu = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  return bindFirestoreRef('menu', firestore().collection('menu'), { reset: false })
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias').where('estatus', '<', 2), { reset: false })
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingPromos')
  return bindFirestoreRef('promos', firestore().collection('promos'), { reset: false })
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item'), { reset: false })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup'), { reset: false })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp'), { reset: false })
})
