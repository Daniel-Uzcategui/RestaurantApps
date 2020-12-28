import Axios from 'axios'
import firebaseService from '../services/firebase'

export default ({ router, store, Vue }) => {
  if (process.env.MODE === 'pwa') {
    console.log = function () {}
    Axios.get('/__/firebase/init.json').then(async response => {
      const cfg = await response.data
      if (!firebaseService.appslength()) {
        firebaseService.fBInit(cfg)
      }
      firebaseService.auth().onAuthStateChanged((currentUser) => {
        firebaseService.handleOnAuthStateChanged(store, currentUser)
      }, (error) => {
        console.error(error)
      })
      firebaseService.routerBeforeEach(router, store)
      Vue.prototype.$fb = firebaseService
      store.$fb = firebaseService
    }).catch(e => console.error('error fetching firebase config', { e }))
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
