// eslint-disable-next-line no-undef
firebase.initializeApp({
  'apiKey': 'AIzaSyCQD0XVbvw9CjEShP3Ql3eZwD6wCSuIzR4',
  'authDomain': 'restaurant-testnet.firebaseapp.com',
  'databaseURL': 'https://restaurant-testnet.firebaseio.com',
  'projectId': 'restaurant-testnet',
  'storageBucket': 'restaurant-testnet.appspot.com',
  'messagingSenderId': '857639385359',
  'appId': '1:857639385359:web:1a3d18581d2a40e1dae67a',
  'measurementId': 'G-DEYD5N2QXS'
})

// eslint-disable-next-line no-undef
const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notification = JSON.parse(payload.message.notification)
  const notificationTitle = notification.title
  const notificationOptions = {
    body: notification.body
  }
  console.log({ notificationTitle, notificationOptions })
  return self.registration.showNotification(notificationTitle,
    notificationOptions)
})
