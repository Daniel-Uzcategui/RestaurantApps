import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
/// ////// START Action ////////
export const saveBlocks = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('blocks' + payload.doc)
    .set({ blocks: JSON.parse(JSON.stringify(payload.payload)) }, { merge: true })
    .then(() => {
      console.log(`editor blocks updated!`)
    })
})
export const saveBlocks2 = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('editor')
    .doc('blocks' + payload.doc)
    .set({ addedPages: JSON.parse(JSON.stringify(payload.payload)) }, { merge: true })
    .then(() => {
      console.log(`editor blocks updated!`)
    })
})
export const saveCss = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('blocks' + payload.doc)
    .set({ css: payload.payload }, { merge: true })
    .then(() => {
      console.log(`editor css updated!`)
    })
})
export const saveScCss = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('blocks' + payload.doc)
    .set({ scopedCss: payload.payload }, { merge: true })
    .then(() => {
      console.log(`editor css updated!`)
    })
})
export const savePage = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('page' + payload.doc)
    .set(payload.payload)
    .then(() => {
      console.log(`editor page updated!`)
    })
})
export const saveRoutes = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('routes' + payload.doc)
    .set(payload.payload)
    .then(() => {
      console.log(`editor routes updated!`)
    })
})
export const saveVer = firestoreAction((state, payload) => {
  return firestore()
    .collection('editor')
    .doc('versions')
    .set({ [payload]: new Date() }, { merge: true })
    .then(() => {
      console.log(`editor version updated!`)
    })
})
/// ////// END Action ////////
/// Bindings ////
export const bindBlocks = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindingBlocks')
  return bindFirestoreRef('editor', firestore()
    .collection('editor'), { reset: false })
})
