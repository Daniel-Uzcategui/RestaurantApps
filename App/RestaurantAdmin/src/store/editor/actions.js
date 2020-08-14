import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const saveBlocks = firestoreAction((state, payload) => {
  console.log({ ...Array.from(payload) })
  return firestore()
    .collection('editor')
    .doc('blocks')
    .set({ blocks: JSON.parse(JSON.stringify(payload)) })
    .then(() => {
      console.log(`editor blocks updated!`)
    })
})
/// ////// END Action ////////
/// Bindings ////
export const bindBlocks = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks')
  return bindFirestoreRef('editor', firestore()
    .collection('editor'), { reset: false })
})
