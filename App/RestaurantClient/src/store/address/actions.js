import { firestoreAction } from 'vuexfire'
// import firebase from 'firebase/compat/app'
import { firestore } from '../../services/firebase/db.js'
export const bindAddress = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log({ payload })
  return bindFirestoreRef('address', firestore().collection('address').where('user', '==', payload), { reset: false, serialize: serialize, wait: true })
})
export const bindAddress2 = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log({ payload })
  return bindFirestoreRef('address', firestore().collection('address').where('user', '==', payload), { reset: false, serialize: serialize, wait: true })
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const addAddress = firestoreAction(async (state, payload) => {
  try {
    let valor
    valor = await firestore()
      .collection('address').add({
        ...payload,
        softDelete: 0
      })
    return { id: valor.id, ...payload }
  } catch (error) {
    console.error('Error adding document: ', error)
  }
})
export const addAddress2 = firestoreAction(async (state, payload) => {
  try {
    let valor
    valor = await firestore()
      .collection('address').add({
        ...payload,
        softDelete: 0
      })
    return valor.id
  } catch (error) {
    console.error('Error adding document: ', error)
  }
})
export const updateAddress = firestoreAction((state, payload) => {
  return firestore()
    .collection('address')
    .doc(payload.id)
    .update({ ...payload })
    .then(() => {
      console.log('address updated!')
    })
})

export const deleteAddress = firestoreAction((context, payload) => {
  console.log(payload)
  firestore().collection('address')
    .doc(payload.id)
    .delete().then(() => {
      console.log('address removed!')
    }).catch((e) => {
      console.log('error removing address!')
    })
})
