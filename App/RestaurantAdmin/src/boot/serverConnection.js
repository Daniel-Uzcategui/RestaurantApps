import Axios from 'axios'
import firebaseService from '../services/firebase'
export default async ({ router, store, Vue }) => {
  if (process.env.environments.ENV_TYPE !== 'DEV') {
    console.log = () => {}
  }
  let setupAmbiente = await SetupAmbiente()
  if (setupAmbiente) {
    if (process.env.environments.ENV_TYPE === 'PROD') {
      console.log = function () {}
      await fireInit(router, store, Vue)
    } else {
      const config = process.env.environments.FIREBASE_CONFIG
      await firebaseService.fBInit(config)
      auth(router, store, Vue)
    }
  }
}

async function SetupAmbiente () {
  if (localStorage.getItem('amb') === null) {
    if (window.location.origin === 'http://localhost:8080' || window.location.origin === 'http://localhost:8081') {
      localStorage.setItem('amb', 'chopzi')
      return 1
    } else {
      return fetchSetup()
    }
  } else {
    return 1
  }
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
async function fetchSetup () {
  try {
    let options = { method: 'post',
      url: window.location.origin + '/getinitjs',
      data:
          {
            url: window.location.origin
          }
    }
    const response = await Axios(options)
    console.log(response.data)
    localStorage.setItem('amb', response.data.ambiente)
    return response.data
  } catch (error) {
    console.log(error)
    return fetchSetup()
  }
}
async function fireInit (router, store, Vue) {
  try {
    const config = process.env.environments.FIREBASE_CONFIG
    await firebaseService.fBInit(config)
    auth(router, store, Vue)
  } catch (error) {
    console.error(error)
    return fireInit(router, store, Vue)
  }
}
