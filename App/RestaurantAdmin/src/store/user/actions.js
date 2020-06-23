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
