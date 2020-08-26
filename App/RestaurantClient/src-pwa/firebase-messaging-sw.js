if (typeof process !== 'undefined') {
  const config = process.env.environments.FIREBASE_CONFIG
  // eslint-disable-next-line no-undef
  firebase.initializeApp(config)

  // eslint-disable-next-line no-undef
  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)
    // Customize notification here
    const notification = JSON.parse(payload.data.notification)
    const notificationTitle = notification.title
    const notificationOptions = {
      body: notification.body
    }
    console.log({ notificationTitle, notificationOptions })
    return self.registration.showNotification(notificationTitle,
      notificationOptions)
  })
}
