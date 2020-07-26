import { firestoreAction } from 'vuexfire'
import User from '../../models/User.js'

export const addUserToUsersCollection = async (state, userRef) => {
  const
    { email, nombre, apellido, cedula, id } = state,
    user = new User({ email, nombre, apellido, cedula, id })
  return userRef.set(user)
}

export const createNewUser = async function ({ dispatch, commit }, data) {
  const $fb = this.$fb
  const { email, password, nombre, apellido, cedula } = data
  const fbAuthResponse = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResponse.user.uid
  const userRef = $fb.userRef('users', id)
  return addUserToUsersCollection({ email, nombre, apellido, cedula, id }, userRef)
}

export const loginUser = async function ({ commit }, payload) {
  const $fb = this.$fb
  const { email, password } = payload
  return $fb.loginWithEmail(email, password)
}

export const logoutUser = async function ({ commit }, payload) {
  firestoreAction(({ unbindFirestoreRef }) => { unbindFirestoreRef('users') })
  commit('user/setCurrentUserData', null, { root: true })
  this.$fb.logoutUser()
}

export function routeUserToAuth () {
  this.$router.push({
    path: '/auth/login'
  })
}
