import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const bindBlocks = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('blocks', firestore()
    .collection('editor').doc('blocks'), { reset: false })
})
export const bindPage = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('page', firestore()
    .collection('editor').doc('page'), { reset: false })
})
export const bindRoutes = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks', { firestore })
  return bindFirestoreRef('routes', firestore()
    .collection('editor').doc('routes'), { reset: false })
})
