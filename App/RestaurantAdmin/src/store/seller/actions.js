import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const bindseller = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindseller')
  return bindFirestoreRef('seller', firestore().collection('users').where('rol', 'array-contains', 'Vendedor'))
})

export const bindOrderClients = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  try {
    return bindFirestoreRef('orderClients', firestore().collection('clients').where('softDelete', '==', 0), { reset: false, serialize: serialize, wait: true })
  } catch (e) {
    console.error(e)
  }
})
export const bindClientBranch = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindingMenu')
  try {
    return bindFirestoreRef('branches', firestore().collection('clients').doc(payload).collection('branches').where('softDelete', '==', 0), { reset: false, serialize: serialize, wait: true })
  } catch (e) {
    console.error(e)
  }
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const addClient = firestoreAction((state, payload) => {
  return firestore()
    .collection('clients').add({
      ...payload,
      softDelete: 0
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

export const addBranch = firestoreAction((state, payload) => {
  return firestore()
    .collection('clients').doc(payload.client).collection('branches').add({
      ...payload.data,
      softDelete: 0
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
