import { firestoreAction } from 'vuexfire'
import User from '../../models/User.js'

export const addUserToUsersCollection = async (state, userRef) => {
  let currentDate = new Date()
  let DateIn = currentDate.toLocaleString()
  let status = true
  let admin = true
  let typeAccess = 'Client'
  const
    { email, nombre, apellido, cedula, id, phone, sexo, fecnac } = state,
    user = new User({ email, nombre, apellido, cedula, id, phone, sexo, fecnac, status, admin, typeAccess, DateIn })
  let userSet1 = await userRef[0].set({ ...user }, { merge: true })
  let userSetDelayForTrigger = await delay(3000)
  if (userRef.length === 2) {
    var userSet2 = await userRef[1].set({ ...user, typeAccess: 'Client', otherDb: true }, { merge: true })
    if (userSet1 && userSetDelayForTrigger) {
      if (userSet2) {
        return 1
      }
    }
  } else {
    if (userSet1 && userSetDelayForTrigger) {
      return 1
    }
  }
}
function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export const createNewUser = async function ({ dispatch, commit }, data) {
  const $fb = this.$fb
  let currentDate = new Date()
  let status = true
  let admin = true
  let typeAccess = 'Client'
  let DateIn = currentDate.toLocaleString()
  const { email, password, nombre, apellido, cedula, phone, sexo, fecnac } = data
  const fbAuthResponse = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResponse.user.uid
  let userRef = []
  userRef.push($fb.userRef('users', id))
  if (localStorage.getItem('amb') !== 'chopzi') {
    userRef.push($fb.userRefMain('users', id))
  }
  return addUserToUsersCollection({ email, nombre, apellido, cedula, id, phone, sexo, fecnac, status, admin, typeAccess, DateIn }, userRef)
}

export const loginUser = async function ({ commit }, payload) {
  const $fb = this.$fb
  const { email, password } = payload
  return $fb.loginWithEmail(email, password)
}
export const GoogleSignIn = async function ({ commit }, payload) {
  const $fb = this.$fb
  return $fb.GoogleSignIn()
}
export const GoogleSignInMobile = async function ({ commit }, payload) {
  const $fb = this.$fb
  return $fb.GoogleSignInMobile()
}
export const logoutUser = async function ({ commit }, payload) {
  await firestoreAction(({ unbindFirestoreRef }) => { unbindFirestoreRef('users') })
  commit('user/setCurrentUserData', null, { root: true })
  this.$fb.logoutUser()
  localStorage.removeItem('otoken')
}

export function routeUserToAuth () {
  this.$router.push({
    path: '/auth/login'
  })
}
