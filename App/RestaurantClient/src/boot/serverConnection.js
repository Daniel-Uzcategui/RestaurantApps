import firebaseService from '../services/firebase'
export default ({ router, store, Vue }) => {
  const config = process.env.environments.FIREBASE_CONFIG
  firebaseService.fBInit(config)
  firebaseService.auth().onAuthStateChanged((currentUser) => {
    firebaseService.handleOnAuthStateChanged(store, currentUser)
  }, (error) => {
    console.error(error)
  })
  firebaseService.routerBeforeEach(router, store)
  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService
  if (process.env.environments.ENV_DEV !== 'DEV') {
    // console.log = () => {}
  }
}
