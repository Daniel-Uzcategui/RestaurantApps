import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const bindBlocks = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('blocks', firestore()
    .collection('editor').doc('blocks'), { reset: false, serialize: serialize })
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const bindPage = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('page', firestore()
    .collection('editor').doc('page'), { reset: false, serialize: serialize })
})
export const bindRoutes = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('routes', firestore()
    .collection('editor').doc('routes'), { reset: false, serialize: serialize })
})
