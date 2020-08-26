import { firestoreAction } from 'vuexfire'
import { userRef, docGet, firestore } from '../../services/firebase/db.js'
/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(({ bindFirestoreRef }, id) => {
  return bindFirestoreRef('currentUser', userRef('users', id))
})

export const decsUser = firestoreAction(({ bindFirestoreRef }) => {
  return bindFirestoreRef('docUser', docGet('users'))
})
/**
 * @param  {Object} {state}
 * @param  {String} id
 * @param  {Object} payload
 */
export const updateUserData = async function ({ state }, payload) {
  return userRef('users', payload.id).update(payload)
}

export const dcc = async function ({ commit }, payload) {
  const $fb = this.$fb
  return $fb.docGet('users')
}
export const setValue = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection(payload.collection)
    .doc(payload.payload.id)
    .set({ [payload.payload.key]: payload.payload.value }, { merge: true })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
