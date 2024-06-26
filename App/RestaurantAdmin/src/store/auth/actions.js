import { firestoreAction } from 'vuexfire'
import User from '../../models/User.js'

export const addUserToUsersCollection = async (state, userRef) => {
  let currentDate = new Date()
  let DateIn = currentDate.toLocaleString()
  let status = true
  let admin = true
  let typeAccess = 'Admin'
  const
    { email, nombre, apellido, cedula, id, sexo, fecnac } = state,
    user = new User({ email, nombre, apellido, cedula, id, sexo, fecnac, status, admin, typeAccess, DateIn })
  return userRef.set({ ...user }, { merge: true }).then(doc => {
    return true
  }).catch(e => {
    return false
  })
}
export const createNewUser = async function ({ dispatch, commit }, data) {
  const $fb = this.$fb
  let currentDate = new Date()
  let status = true
  let admin = true
  let typeAccess = 'Admin'
  let DateIn = currentDate.toLocaleString()
  const { email, password, nombre, apellido, cedula, sexo, fecnac } = data
  const fbAuthResponse = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResponse.user.uid
  let userRef = $fb.userRefMain('users', id)
  return addUserToUsersCollection({ email, nombre, apellido, cedula, id, sexo, fecnac, status, admin, typeAccess, DateIn }, userRef)
}

export const createUser = async function ({ dispatch, commit }, data) {
  const $fb = this.$fb
  let currentDate = new Date()
  let status = true
  let admin = true
  let DateIn = currentDate.toLocaleString()
  const { email, password, nombre, apellido, cedula,
    sexo, fecnac, codigo, razonSocial,
    RIF, razonComercial, rol, codigoDelivery,
    statusUbicacion, movilidad, statusdelivery,
    typeAccess, phone } = data
  const fbAuthResponse = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResponse.user.uid
  const userRef = $fb.userRef('users', id)
  return addUserToUsersCollection2(
    { email, nombre, apellido, cedula, id, sexo, fecnac, status, admin, typeAccess, codigo, razonSocial, RIF, razonComercial, rol, codigoDelivery, statusUbicacion, movilidad, statusdelivery, phone, DateIn }, userRef)
}

export const addUserToUsersCollection2 = async (state, userRef) => {
  let currentDate = new Date()
  let DateIn = currentDate.toLocaleString()
  let status = true
  let admin = true
  const
    { email, nombre, apellido, cedula,
      id, sexo, fecnac, codigo, razonSocial,
      RIF, razonComercial, rol, typeAccess,
      codigoDelivery, statusUbicacion,
      movilidad, statusdelivery, phone } = state,
    user = new User(
      { email, nombre, apellido, cedula, id, sexo, fecnac, status, admin, typeAccess, codigo, razonSocial, RIF, razonComercial, rol, codigoDelivery, statusUbicacion, movilidad, statusdelivery, phone, DateIn })
  return userRef.set(user)
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
