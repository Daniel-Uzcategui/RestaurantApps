import { firestoreAction } from 'vuexfire'
import { userRef, docGet, firestore, userRefMain } from '../../services/firebase/db.js'
/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(async ({ bindFirestoreRef }, id) => {
  const user = userRef('users', id)
  const query = await user.get()
  const exists = query.exists
  if (!exists) {
    console.log('No existe ', id)
    const getChopziUser = userRefMain('users', id)
    const chpziusr = await getChopziUser.get()
    if (!chpziusr.exists) {
      console.log('No such document!')
      return bindFirestoreRef('currentUser', userRef('users', id))
    } else {
      var data = chpziusr.data()
      delete data.rol
      data.typeAccess = 'Admin'
      const set = await userRef('users', id).set(data, { merge: true })
      if (set) {
        return bindFirestoreRef('currentUser', userRef('users', id))
      }
    }
  } else {
    return bindFirestoreRef('currentUser', userRef('users', id))
  }
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

export const updateSummary = async function ({ commit }, payload) {
  return this._vm.$axios.get(`https://us-central1-unico-wallet.cloudfunctions.net/AccSumary?id=${payload.currentUser.id}`)
    .then(response => {
      console.log('response', response)
      if (response.data.error) { throw response.data.error }
      return commit('SetSummary', response.data.data)
      // return response.data.data
    }).catch(res => {
      console.log(res.error)
      return commit('SetSummary', {
        Checking: 0,
        Savings: 0,
        Outstanding: 0,
        Loans: 0
      })
    })
}

export const GetUserHistory = async function ({ commit }, payload) {
  return this._vm.$axios.get(`https://us-central1-unico-wallet.cloudfunctions.net/GetUserHistory?id=${payload.currentUser.id}`)
    .then(response => {
      if (!response.data.error) { console.log(response.data); commit('setHistory', response.data.data) }
      console.log(payload.hist, 'History!!!')
      payload.nohist = true
      return response.data.data
    })
}

export const bindusers = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindusers')
  return bindFirestoreRef('users', firestore().collection('users'))
})
export const bindNewsLetter = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindNewsLetter')
  return bindFirestoreRef('newsletter', firestore().collection('newsletter'))
})
export const deleteUsers = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('orders')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('orders removed!')
      }).catch((e) => {
        console.log('error removing orders!')
      })
  }
})

export const setRolUser = async function ({ commit }, payload) {
  commit('user/setRolUser', payload, { root: true })
}
