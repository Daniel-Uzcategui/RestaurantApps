import { firestoreAction } from 'vuexfire'
import { userRef, firestore, userRefMain } from '../../services/firebase/db.js'
/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(async ({ bindFirestoreRef }, id) => {
  const user = userRef('users', id)
  const query = await user.get()
  const exists = query.exists
  if (!exists && localStorage.getItem('amb') !== 'chopzi') {
    console.log('No existe ', id)
    const getChopziUser = userRefMain('users', id)
    const chpziusr = await getChopziUser.get()
    if (!chpziusr.exists) {
      console.log('No such document user!')
      throw new Error('El usuario no existe')
    } else {
      var data = chpziusr.data()
      console.log('Usuario encontrado', data)
      delete data.rol
      data.typeAccess = 'Client'
      const set = await userRef('users', id).set(data, { merge: true }).then(e => { return 1 }).catch(l => console.error(l))
      console.log(set)
      if (set) {
        bindFirestoreRef('currentUser', userRef('users', id))
        return 1
      }
    }
  } else {
    return bindFirestoreRef('currentUser', userRef('users', id))
  }
})
/**
 * @param  {Object} {state}
 * @param  {String} id
 * @param  {Object} payload
 */
export const updateUserData = async function ({ state }, payload) {
  return userRef('users', payload.id).update(payload)
}

export const bindusers = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindusers')
  return bindFirestoreRef('users', firestore().collection('users'))
})

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
export const newsletterAdd = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('newsletter')
    .add({
      email: payload
    })
    .then(() => {
      console.log(`${payload} agregado!`)
    })
})
