// // const config = process.env.environments.FIREBASE_CONFIG
// const config = {
//   'apiKey': 'AIzaSyCQD0XVbvw9CjEShP3Ql3eZwD6wCSuIzR4',
//   'authDomain': 'restaurant-testnet.firebaseapp.com',
//   'databaseURL': 'https://restaurant-testnet.firebaseio.com',
//   'projectId': 'restaurant-testnet',
//   'storageBucket': 'restaurant-testnet.appspot.com',
//   'messagingSenderId': '857639385359',
//   'appId': '1:857639385359:web:1a3d18581d2a40e1dae67a',
//   'measurementId': 'G-DEYD5N2QXS'
// }
// // eslint-disable-next-line no-undef
// firebase.initializeApp(config)

// // eslint-disable-next-line no-undef
// const messaging = firebase.messaging()
// messaging.setBackgroundMessageHandler(async function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload)
//   // Customize notification here
//   const notificationTitle = 'Background Message Title'
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/Content/Img/logo-amezze-120.png'
//   }
//   console.log({ payload })
//   return self.registration.showNotification(notificationTitle,
//     notificationOptions)
// })
fetch('/__/firebase/init.json').then(async response => {
  let config = await response.json()
  if (config) {
    // eslint-disable-next-line no-undef
    firebase.initializeApp(config)
    // eslint-disable-next-line no-undef
    const messaging = firebase.messaging()
    messaging.setBackgroundMessageHandler(async function (payload) {
      console.log('[firebase-messaging-sw.js] Received background message ', payload)
      // Customize notification here
      const notificationTitle = 'Background Message Title'
      const notificationOptions = {
        body: 'Background Message body.',
        icon: '/Content/Img/logo-amezze-120.png'
      }
      console.log({ payload })
      return self.registration.showNotification(notificationTitle,
        notificationOptions)
    })
  }
})
