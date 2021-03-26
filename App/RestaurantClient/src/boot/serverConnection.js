import Axios from 'axios'
import firebaseService from '../services/firebase'

export default async ({ router, store, Vue }) => {
  if (localStorage.getItem('amb') === null) {
    if (window.location.origin === 'http://localhost:8080' || window.location.origin === 'http://localhost:8081') {
      localStorage.setItem('amb', 'chopzi')
      if (process && process.env && process.env.MODE === 'pwa') {
        console.log = function () {}
        await Axios.get('/__/firebase/init.json').then(async response => {
          const cfg = await response.data
          if (!(firebaseService && firebaseService.appslength())) {
            try {
              firebaseService.fBInit(cfg)
            } catch (e) {
              console.log(e)
            }
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
    } else {
      await fetch(`${window.location.origin}/getinitjs`, {
        method: 'POST',
        body: JSON.stringify({
          url: window.location.origin
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).then(response => response.json())
        .then(async json => {
          localStorage.setItem('amb', json.ambiente)
          if (process && process.env && process.env.MODE === 'pwa') {
            console.log = function () {}
            await Axios.get('/__/firebase/init.json').then(async response => {
              const cfg = await response.data
              if (!(firebaseService && firebaseService.appslength())) {
                try {
                  firebaseService.fBInit(cfg)
                } catch (e) {
                  console.log(e)
                }
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
        }).catch(err => { console.err(err); alert('Conexion inestable, o no esta conectado a internet') })
    }
  }
}
