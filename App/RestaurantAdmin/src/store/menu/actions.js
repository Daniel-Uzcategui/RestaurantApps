import { firestoreAction } from 'vuexfire'
import { firestore, firebase } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const setSede = async function ({ commit }, payload) {
  try {
    console.log({ setsede: payload })
    return commit('setSede', payload)
  } catch (e) {
    console.error(e)
  }
}
export const setValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({ [payload.payload.key]: payload.payload.value })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const setValue2 = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .set({ [payload.payload.key]: payload.payload.value }, { merge: true })
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
  let data = {
    name: '',
    softDelete: 0,
    descripcion: '',
    estatus: true,
    DateIn: firebase.firestore.FieldValue.serverTimestamp()
  }
  if (!(payload.collection === 'optionsConf' || payload.collection === 'categorias')) {
    data = {
      ...data,
      price: 0
    }
  }
  return firestore()
    .collection(payload.collection).add({ ...data })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

export const delrows = firestoreAction((context, payload) => {
  for (const i in payload.payload) {
    firestore().collection(payload.collection)
      .doc(payload.payload[i].id)
      .update({ softDelete: 1, estatus: false })
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
    .collection('menu')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindFilters = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingFilters')
  return bindFirestoreRef('filters', firestore()
    .collection('filters')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingPromos')
  return bindFirestoreRef('promos', firestore().collection('promos')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false })
})
