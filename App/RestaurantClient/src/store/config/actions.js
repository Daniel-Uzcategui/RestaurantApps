/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigs = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configurations', firestore().collection('config'), { reset: false, serialize: serialize, wait: true })
})
export const bindThemeCfg = firestoreAction(({ bindFirestoreRef }) => {
  console.log('themecfg')
  return bindFirestoreRef('themecfg', firestore().collection('config').doc('theme'), { reset: false, serialize: serialize, wait: true })
})
export const bindMenuCfg = firestoreAction(({ bindFirestoreRef }) => {
  console.log('menucfg')
  return bindFirestoreRef('menucfg', firestore().collection('config').doc('menu'), { reset: false, serialize: serialize, wait: true })
})
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const bindPaymentServ = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindPaymentServ')
  return bindFirestoreRef('paymentServ', firestore().collection('config').doc('paymentServ'), { reset: false, serialize: serialize, wait: true })
})
export const bindChat = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindChat')
  return bindFirestoreRef('chat', firestore().collection('config').doc('chat'), { reset: false, serialize: serialize, wait: true })
})
export const bindthemecfg = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindChat')
  return bindFirestoreRef('menucfg', firestore().collection('config').doc('menu'), { reset: false, serialize: serialize, wait: true })
})
export const bindEnv = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('environment', firestore().collection('environment').doc('version'), { reset: false, serialize: serialize, wait: true })
})
export const bindManif = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('manifest', firestore().collection('environment').doc('manifest'), { reset: false, serialize: serialize, wait: true })
})
export const bindRates = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindRates')
  return bindFirestoreRef('rates', firestore().collection('rates').orderBy('dateIn', 'desc'), { reset: false, serialize: serialize, wait: true })
})
export const setMenuDispType = async function ({ commit }, payload) {
  return commit('menuDispType', payload)
}
