import firebaseService from '../services/firebase'

export default ({ router, store, Vue }) => {
  console.log({ process })
  if (process.env.MODE === 'pwa') {
    fetch('/__/firebase/init.json').then(async response => {
      const cfg = await response.json()
      console.log({ cfg })
      firebaseService.fBInit(cfg)
      firebaseService.auth().onAuthStateChanged((currentUser) => {
        firebaseService.handleOnAuthStateChanged(store, currentUser)
      }, (error) => {
        console.error(error)
      })
      firebaseService.routerBeforeEach(router, store)
      Vue.prototype.$fb = firebaseService
      store.$fb = firebaseService
    })
  } else {
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
  }
}
