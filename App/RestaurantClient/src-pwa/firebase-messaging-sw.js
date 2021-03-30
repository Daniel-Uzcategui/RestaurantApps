function iOS () {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
}
// eslint-disable-next-line no-unused-vars
var clientVer = '0.8.57'
// eslint-disable-next-line no-undef
if (firebase && firebase.messaging && firebase.messaging.isSupported() && !iOS()) {
  // eslint-disable-next-line no-undef
  if (!(firebase && firebase.apps & firebase.apps.length)) {
    fetch('/__/firebase/init.json').then(async response => {
      try {
        let config = await response.json()
        if (config) {
        // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            firebase.initializeApp(config)
          } catch (error) {
            console.log(error)
          }
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
      } catch (e) { console.error(e) }
    }).catch(e => console.error('error fetching cfg firebase', { e }))
  } else {
    try {
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
    } catch (err) {
      console.error(err)
    }
  }
}
