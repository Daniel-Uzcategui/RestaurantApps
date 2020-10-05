/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigs = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configurations', firestore().collection('config'), { reset: false })
})
export const bindEnv = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('environment', firestore().collection('environment').doc('version'), { reset: false })
})
export const bindManif = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('manifest', firestore().collection('environment').doc('manifest'), { reset: false })
})
