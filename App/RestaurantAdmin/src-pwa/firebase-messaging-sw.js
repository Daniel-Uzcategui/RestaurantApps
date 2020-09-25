
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
        icon: 'icons/icon-192x192.png'
      }
      console.log({ payload })
      return self.registration.showNotification(notificationTitle,
        notificationOptions)
    })
  }
})
