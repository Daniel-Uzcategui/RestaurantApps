const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.addUser = functions.https.onRequest(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  const reqRef = db.collection('environment')
  const doc = await reqRef.where('available', '==', true).limit(1).get();
  // const requestUID = 'woietWO6JKXhGxyLSmSeHJsOsfu2'
  // console.log(req)
  const requestUID = req.body.id
  let chopziCred = {
    "envType": "chopzi",
    "adminDomain": "admin-chopzi",
    "authDomain": "chopzidjkb8.firebaseapp.com",
    "credential": {
        "implicit": false,
        "projectId": "chopzidjkb8",
        "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/xRUyCNHD5vyB\n9n1/WOHRhfrSeeSOffx0ti6fP/UzZgYY8adkuBDCOxdbwmvXU4WGna2yqwEMgqkx\n823mp1T8j9vc84B1k4ySpWPElj91GJp6MvkZKVIIDqLsPLxB6HryRfByX+2RzAx8\nv7w5KbYq6TzeZejjMrm5dAhXw1W8fbBrJt3vflxK/vO2SXUZbetwMyBi2f9P6oPL\nWxiOZTaZif4CrKv15+1EFlDI0Sdqz9nnwo7aYU6TWddBRGNlRTmBfHd2EsKX5rwJ\nf0QOW+sIf14Rzav/5S3+yaKiZ2RwhGuJC/8JRLqHNzkIeKo1avNVzsmYiF4Y76jj\nPh2mVfJjAgMBAAECggEABrJKna8qKAWaXq1tT3OamxbrHcts3D7xAGBWO3BfzxYq\nc1eI6V72Eto+ZBFjc6byfDNoW9tV04qCfwCJn2rLcHBTlKEaJMDswTguRjCa8atU\nxZyfDy5es3JTZR1v03tbQ7eGgG/yG0u9SePmHjbjKhdv7TIw0jI0wxGWsv3ashS/\n9U6mkURGSEmcEyD7MxP1eVBU5snd/JHQKRzJXL5pl35LpFm4Av7v/cBJ2+B0UsYd\nMja2cvv1UkZlaqEdTmJT/sR8/Bs2U1sa+DWQkdNNljliFIfdkszM+WjypGPQizYU\nY/KfT4kkR6gKP78X0/4Bl3watrNd/WD4W0mKWujvRQKBgQD1C9hB5hDeimPY7YNL\nYW6v0o7kKvmm4e2pdA1lNZDcSGMGPRd2AkGslB+U56GxZtmWFJpBrkzrI/AJLMpJ\n7ZV+a66oFOzNll2QKfrtaGR0UBTCa6t5CbvxnOdT34sthYG2VSXpbpNx8SEfJWm9\nh5xBIoVVjUiwHtsijEA61LA9fQKBgQDIV5OIFBKKYtH9OcAHl/x8hasljWwISVGe\nq4ry4dTuNhgE1/Gudfntm4Rz7sw3LbGyJETO98syBXQ+Kh59h5yr6r0AlsPN5uuE\n4aN2GCNEqIkAOVos2LL3HXz0DtIK10C5j/YNTwWmPR5yDzTIM6u6s/bR3Qo+TzaB\nRvNpLDl1XwKBgQDUMt2is0gIbm7oe0UnEch4GS4EB/MIwLy98PFoo2o+V7Doxh56\n4plciSiQGcW7igUCIfUyy21wcj56s365ZjP+teEZTIWDwqJjJPdWfv/+eRqBAhwL\nRJKsN+NajkpHsUUST8n0yvyDvvufrRZUOgrlnK851o8LdKzuzeURDP1RQQKBgCW7\nUL7lQOStXe06Ti9f8Z6mMiidbQZWgLfIiR/bZpYCvB1VamA4Of0FODn5dJ7DzV7G\ns+rjAnMGUfFPT3TG8Lv0NuqAepox7pOVR4r7WtEYiMzxAEnH+lTOSfVRQT/ncHpC\nYc353w+DHVPQB1nZWXONZ2P5JG+9zX8llLxvJtczAoGBAK5zkRj2kwbCjFEOhcUq\nqwxS1nHSo9SArCSB3H1uCukh+czP27IMMDriWGQhqp3t4nvUNS8eaX7HhQoaRQ14\nRM+ND0O3YGWA3b603WqaXqz3c1+k4jTwkilAryK/ruJDt2/sPBBNzm+6OPfcu10X\n/qmuDGc5ktSdzF2d4kbiwAbn\n-----END PRIVATE KEY-----\n",
        "clientEmail": "firebase-adminsdk-yzxp0@chopzidjkb8.iam.gserviceaccount.com",
        "httpClient": {
            "retry": {
                "maxRetries": 4,
                "statusCodes": [
                    503
                ],
                "ioErrorCodes": [
                    "ECONNRESET",
                    "ETIMEDOUT"
                ],
                "backOffFactor": 0.5,
                "maxDelayInMillis": 60000
            }
        }
    },
    "apiKey": "AIzaSyDWC0_VfEms3F1FtbVSLkgrnHljJrjc_6A",
    "clientDomain": "chopzi",
    "available": true,
    "messagingSenderId": "1087725013103",
    "projectId": "chopzidjkb8",
    "version": "q4usa",
    "storageBucket": "chopzidjkb8.appspot.com",
    "appId": "1:1087725013103:web:f1b587df31741c7408259a"
  }
  chopziCred.credential = admin.credential.cert(chopziCred.credential)
  const chopziApp = admin.initializeApp(chopziCred, 'other');
  const db3 = chopziApp.firestore();
  const chopziUserRef = await db3.collection('users').doc(requestUID).get();
  const chopziUser = chopziUserRef.data()
  if (doc.empty) {
    admin.firestore().collection('mail').add({
      to: chopziUser.email,
      message: {
        subject: 'Hola desde Chopzi!',
        text: 'Por los momentos te hemos colocado en lista de espera',
        html: '',
      },
    })
    let ret = await db.collection('users').doc(requestUID).set({ requestDate: new Date(), awaitingTrial: true }, {merge: true});
    let ret2 = await db3.collection('users').doc(requestUID).set({ requestDate: new Date(), awaitingTrial: true }, {merge: true});
    console.error('No such document!')
    try {
      if (ret && ret2) {
        let e = { error: 9000, message: 'No hay servidores disponibles por el momento, el usuario ha sido colocado en lista de espera'}
        throw e
      } else {
        let e = { error: 9000, message: 'No hay servidores disponibles por el momento, el usuario ha sido colocado en lista de espera'}
        throw e
      }
    } catch (e) {
      res.status(400)
      console.log('errorrrrrr', e)
      admin.firestore().collection('mail').add({
        to: 'danieluzca2@gmail.com',
        message: {
          subject: 'Hola desde Chopzi!',
          text: JSON.stringify(e),
          html: '',
        },
      })
      return res.send(e)
    }
  } else {
    return doc.forEach(async (dox) => {
      try {
        if (typeof chopziUser.clientDomain !== 'undefined') {
          let e = { error: 9001, message: 'El usuario ya tiene un servicio asociado', uu: chopziUser.clientDomain }
          throw e
        }
        let env = await dox.data()
        env.credential = admin.credential.cert(env.credential)
        // const otherApp = admin.initializeApp(env, 'other2');
        // const db2 = otherApp.firestore();
        let ret3 = await db.collection('environment').doc(env.projectId).set({ available: false }, {merge: true})
        /*eslint-disable */
        let ret = await db.collection('users').doc(requestUID).set({ ...chopziUser,trialDate: new Date(), clientDomain: env.clientDomain, adminDomain: env.adminDomain }, {merge: true});
        let ret2 = await db3.collection('users').doc(requestUID).set({ trialDate: new Date(), clientDomain: env.clientDomain, adminDomain: env.adminDomain }, {merge: true});
        console.log('REEET', ret)
        if (ret && ret2 && ret3) {
          admin.firestore().collection('mail').add({
            to: chopziUser.email,
            message: {
              subject: 'Hola desde Chopzi',
              text: 'Administrativo: ' + env.adminDomain + ' Cliente: ' + env.clientDomain,
              html: '',
            },
          })
          return res.send(chopziUser.email)
        } else {
          let e = { error: 9002, message: 'Error al escribir documento'}
          throw e
          // res.status(400)
          // return res.send(env)
        }
      } catch (e) {
        res.status(400)
        console.log('errorrrrrr', e)
        // admin.firestore().collection('mail').add({
        //   to: 'danieluzca2@gmail.com',
        //   message: {
        //     subject: 'Hola desde Chopzi!',
        //     text: JSON.stringify(e),
        //     html: '',
        //   },
        // })
        return res.send(e)
      }
    })
  }
})