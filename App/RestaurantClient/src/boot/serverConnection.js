import firebase from 'firebase/compat/app'
import firebaseService from '../services/firebase'
export default ({ router, store, Vue }) => {
  const config = process.env.environments.FIREBASE_CONFIG
  firebaseService.fBInit(config)
  if (location.hostname === 'localhost') {
    firebase.firestore().useEmulator('localhost', 8080)
  }
  firebaseService.auth().onAuthStateChanged((currentUser) => {
    firebaseService.handleOnAuthStateChanged(store, currentUser)
  }, (error) => {
    console.error(error)
  })
  firebaseService.routerBeforeEach(router, store)
  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService
  if (process.env.environments.ENV_DEV !== 'DEV') {
    console.log = () => {}
  }
}
