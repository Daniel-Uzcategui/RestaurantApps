/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigs = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configurations', firestore().collection('config'), { reset: false })
})
export const bindPaymentServ = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindPaymentServ')
  return bindFirestoreRef('paymentServ', firestore().collection('config').doc('paymentServ'), { reset: false })
})
export const bindChat = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindChat')
  return bindFirestoreRef('chat', firestore().collection('config').doc('chat'), { reset: false })
})
export const bindMenuCfg = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindChat')
  return bindFirestoreRef('menucfg', firestore().collection('config').doc('menu'), { reset: false })
})
export const bindEnv = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('environment', firestore().collection('environment').doc('version'), { reset: false })
})
export const bindManif = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('manifest', firestore().collection('environment').doc('manifest'), { reset: false })
})
