import { register } from 'register-service-worker'
import { Notify, Dialog } from 'quasar'
// eslint-disable-next-line no-unused-vars
var clientVer = '0.8.29'
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register('firebase-messaging-sw.js', {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (registration) {
    console.log('Service worker is active.')
  },

  registered (registration) {
    console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    console.log('New content is available.')
    Dialog.create({
      title: 'Nueva actualización disponible',
      message: 'Solo tiene que refrescar la página',
      cancel: true,
      persistent: true,
      onOk () {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (let registration of registrations) {
            registration.unregister()
          }
          window.location.reload()
        })
      }
    })
  },

  updated (/* registration */) {
    console.log('New content downloaded')
    Notify.create({
      message: 'Update Completed',
      icon: 'announcement'
    })
  },
  offline () {
    console.log('No hay conexión a Internet. Ejecutando en modo fuera de línea, algunas fucntionalidades estan deshabilitadas.')
    Notify.create({
      message: 'Fuera de línea',
      icon: 'announcement'
    })
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
    Notify.create({
      message: 'Hubo un error al cargar, porfavor refrescar la página',
      icon: 'announcement'
    })
  }
})
