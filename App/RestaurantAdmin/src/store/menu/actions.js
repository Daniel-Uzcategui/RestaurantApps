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
export const createId = (state, payload) => { return firestore().collection(payload).doc().id }
export const batch = (state, payload) => {
}
export const bindmenu2 = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalizations')
  return bindFirestoreRef('menu2', firestore().collection('menu'))
})
export const setValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({
      [payload.payload.key]: payload.payload.value
    })
    .then(() => {
      console.log(`${payload.collection} updated!`)
      return payload.payload.id
    })
})
export const setMultiValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({ ...payload.payload })
    .then(() => {
      console.log(`${payload.collection} updated!`)
      return payload.payload.id
    })
})
export const setValue2 = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .set({
      [payload.payload.key]: payload.payload.value
    }, { merge: true })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const delValue = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .update({
      [payload.payload.key]: firebase.firestore.FieldValue.delete()
    })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const addRow = firestoreAction(async (state, payload) => {
  let data = {
    name: '',
    softDelete: 0,
    descripcion: '',
    DateIn: firebase.firestore.FieldValue.serverTimestamp()
  }
  if (!(payload.collection === 'optionsConf' || payload.collection === 'categorias')) {
    data = {
      price: 0,
      ...data
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
export const newAddRow = firestoreAction(async (state, payload) => {
  let data = {
    softDelete: 0,
    ...payload.data,
    DateIn: firebase.firestore.FieldValue.serverTimestamp()
  }
  if (!(payload.collection === 'optionsConf' || payload.collection === 'groupComp' || payload.collection === 'categorias')) {
    data = {
      price: 0,
      ...data
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
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const bindMenu = firestoreAction(async ({ bindFirestoreRef, unbindFirestoreRef }) => {
  console.log('bindingMenu')
  await unbindFirestoreRef('menu')
  return bindFirestoreRef('menu', firestore()
    .collection('menu')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindRewards = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindRewards')
  return bindFirestoreRef('rewards', firestore()
    .collection('rewards')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindCoupons = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindCoupons')
  return bindFirestoreRef('coupons', firestore()
    .collection('coupons')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindFilters = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingFilters')
  return bindFirestoreRef('filters', firestore()
    .collection('filters')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindCategorias = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingCategorias')
  return bindFirestoreRef('categorias', firestore().collection('categorias')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindPromos = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingPromos')
  return bindFirestoreRef('promos', firestore().collection('promos')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindItem = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItem')
  return bindFirestoreRef('item', firestore().collection('item')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindItemGroup = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindItemsGroup')
  return bindFirestoreRef('itemGroup', firestore().collection('itemGroup')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
export const bindGroupComp = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindGroupComp')
  return bindFirestoreRef('groupComp', firestore().collection('groupComp')
    .orderBy('softDelete', 'asc')
    .orderBy('DateIn', 'desc')
    .where('softDelete', '<', 1), { reset: false, serialize: serialize, wait: true })
})
