import { firestoreAction } from 'vuexfire'
import { docGet, firestore, userRefMain, firestoreMain, userRef } from '../../services/firebase/db.js'
/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(async ({ bindFirestoreRef }, id) => {
  return bindFirestoreRef('currentUser', userRefMain('users', id))
  // const user = userRef('users', id)
  // const query = await user.get()
  // const exists = query.exists
  // if (!exists) {
  //   console.log('No existe ', id)
  //   const getChopziUser = userRefMain('users', id)
  //   const chpziusr = await getChopziUser.get()
  //   if (!chpziusr.exists) {
  //     console.log('No such document!')
  //     return bindFirestoreRef('currentUser', userRef('users', id))
  //   } else {
  //     var data = chpziusr.data()
  //     delete data.rol
  //     data.typeAccess = 'Admin'
  //     const set = await userRef('users', id).set(data, { merge: true })
  //     if (set) {
  //       return bindFirestoreRef('currentUser', userRef('users', id))
  //     }
  //   }
  // } else {
  //   return bindFirestoreRef('currentUser', userRefMain('users', id))
  // }
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
  return userRefMain('users', payload.id).update(payload)
}
export const updateLocalUserData = async function ({ state }, payload) {
  return userRef('users', payload.id).update(payload)
}
export const dcc = async function ({ commit }, payload) {
  const $fb = this.$fb
  return $fb.docGet('users')
}

export const getAvailableUrls = async ({ commit }, payload) => {
  try {
    console.log(payload)
    const ref = firestoreMain().collection('subdomains')
    let querySnapshot = await ref.where('subdomain', '==', payload).get()
    if (querySnapshot.empty) {
      console.log('No matching documents.')
      return [true, true]
    } else {
      return [false, true]
    }
  } catch (error) {
    console.error(error)
    return [false, false]
  }
}
export const createAmbiente = async ({ commit }, payload) => {
  try {
    const ref = firestoreMain().collection('subdomains')
    let querySnapshot = await ref.where('subdomain', '==', payload).get()
    if (querySnapshot.empty) {
      console.log('No matching documents.')
      return [true, true]
    } else {
      return [false, true]
    }
  } catch (error) {
    return false
  }
}
export const bindusers = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindusers')
  return bindFirestoreRef('users', firestore().collection('users'))
})
export const bindAmbiente = firestoreAction(({ bindFirestoreRef }, userid) => {
  console.log('bindAmbiente')
  return bindFirestoreRef('ambientes', firestoreMain().collection(`users/${userid}/ambientes`))
})
export const bindRoles = firestoreAction(({ bindFirestoreRef }, userid) => {
  console.log('bindRoles', userid)
  return bindFirestoreRef('roles', userRef('users', userid))
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
