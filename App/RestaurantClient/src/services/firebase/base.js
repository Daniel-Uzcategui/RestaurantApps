
import firebase from 'firebase/app'
import 'firebase/auth'
import { Notify } from 'quasar'

/**
 * Returns Firebase 's global namespace from which all Firebase services are accessed
 * https://firebase.google.com/docs/reference/js/firebase.auth.html#callable
 * @return {Object} Firebase Module
 */
export const self = () => {
  return firebase
}

/**
 * Returns Firebase 's auth service
 * https://firebase.google.com/docs/reference/js/firebase.auth.html#callable
 * @return {Object} currentUser object from firebase
 */
export const auth = () => {
  return firebase.auth()
}

/**
 * Async function providing the application time to
 * wait for firebase to initialize and determine if a
 * user is authenticated or not with only a single observable
 *
 */
export const ensureAuthIsInitialized = (store) => {
  if (store.state.auth.isReady) return true
  // Create the observer only once on init
  return new Promise((resolve, reject) => {
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      resolve()
      unsubscribe()
    }, () => {
      reject(new Error('Looks like there is a problem with the firebase service. Please try again later'))
    })
  })
}

/** Convenience method to initialize firebase app
 * @param  {Object} config
 * @return {Object} App
 */
export const fBInit = (config) => {
  return firebase.initializeApp(config)
}

/** Handle the auth state of the user and
 * set it in the auth store module
 * @param  {Object} store - Vuex Store
 * @param  {Object} currentUser - Firebase currentUser
 */
export const handleOnAuthStateChanged = async (store, currentUser) => {
  const initialAuthState = isAuthenticated(store)
  console.log({ initialAuthState })
  // Save to the store
  store.commit('auth/setAuthState', {
    isAuthenticated: currentUser !== null,
    isAnonymous: currentUser !== null ? currentUser.isAnonymous : true,
    isReady: true,
    uid: (currentUser ? currentUser.uid : '')
  })
  // Get & bind the current user
  if (store.state.auth.isAuthenticated) {
    console.log({ currentUser })
    await store.dispatch('user/getCurrentUser', currentUser.uid)
  }

  // If the user looses authentication route
  // them to the login page
  if (!currentUser && initialAuthState) {
    store.dispatch('auth/routeUserToAuth')
  }
  if (currentUser == null) {
    firebase.auth().signInAnonymously().then(e => {
      store.commit('auth/setAuthState', {
        isAuthenticated: currentUser !== null,
        isAnonymous: true,
        isReady: true,
        uid: (currentUser ? currentUser.uid : '')
      })
      console.log('Anonimo!')
    }).catch(function (error) {
      var errorCode = error.code
      var errorMessage = error.message
      console.log({ errorCode, errorMessage })
    })
  }
}

/**
 * @param  {Object} store - Vuex store
 */
export const isAuthenticated = (store) => {
  if (store.state.auth.isAnonymous) {
    return false
  }
  return store.state.auth.isAuthenticated
}

/**
 * remove firebase auth token
 */
export const logoutUser = () => {
  return auth().signOut()
}

/**
 * @param  {Object} router - Vue Router
 * @param  {Object} store - Vuex Store
 */
export const routerBeforeEach = async (router, store) => {
  router.beforeEach(async (to, from, next) => {
    try {
      if (typeof to === 'undefined' || typeof next === 'undefined') { return }
      let waitforme = await ensureAuthIsInitialized(store)
      console.log({ waitforme })
      if (waitforme && to.matched.some(record => record.meta.requiresAuth)) {
        if (isAuthenticated(store)) {
          console.log('trueee')
          if (typeof next !== 'undefined') { next() }
        } else {
          console.log('falseeee')
          if (typeof next !== 'undefined') { next('/auth/login') }
        }
      } else if ((to.path === '/auth/register' && isAuthenticated(store)) ||
        (to.path === '/auth/login' && isAuthenticated(store))) {
        if (typeof next !== 'undefined') { next() }
      } else {
        if (typeof next !== 'undefined') { next() }
      }
    } catch (err) {
      Notify.create({
        message: `ROUTER BEFORE EACH: ${err}`,
        color: 'negative'
      })
    }
  })
}
