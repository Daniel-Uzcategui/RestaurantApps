import firebaseService from '../services/firebase'
export default ({ router, store, Vue }) => {
  const config = process.env.environments.FIREBASE_CONFIG
  firebaseService.fBInit(config)
  auth(router, store, Vue)
}
function auth (router, store, Vue) {
  firebaseService.auth().onAuthStateChanged((currentUser) => {
    firebaseService.handleOnAuthStateChanged(store, currentUser)
  }, (error) => {
    console.error(error)
  })
  firebaseService.routerBeforeEach(router, store)
  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService
}
