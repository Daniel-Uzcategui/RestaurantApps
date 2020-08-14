import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const bindBlocks = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks')
  return bindFirestoreRef('editor', firestore()
    .collection('editor'), { reset: false })
})
