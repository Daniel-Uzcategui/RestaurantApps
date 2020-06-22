import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
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

export const addRow = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection).add({
      name: ''
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
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
