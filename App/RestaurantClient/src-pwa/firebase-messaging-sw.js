
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
const clientVer = '0.1'
// eslint-disable-next-line no-undef
if (firebase.messaging.isSupported() && !iOS()) {
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
  }).catch(e => console.error('error fetching cfg firebase', { e }))
}
