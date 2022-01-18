import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const bindRiders = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingMenu')
  try {
    return bindFirestoreRef('riders', firestore().collection('riders').where('softDelete', '==', 0), { reset: false, serialize: serialize, wait: true })
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
export const addRider = firestoreAction((state, payload) => {
  return firestore()
    .collection('riders').add({
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
