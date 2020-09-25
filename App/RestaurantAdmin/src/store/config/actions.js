/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigs = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configs', firestore().collection('config'), { reset: false })
})
export const bindEnv = firestoreAction(async ({ bindFirestoreRef }) => {
  console.log('bindEnv')
  return bindFirestoreRef('version', firestore().collection('environment').doc('version'), { reset: false })
})
export const bindManifest = firestoreAction(async ({ bindFirestoreRef }) => {
  console.log('bindManifest')
  return bindFirestoreRef('manifest', firestore().collection('environment').doc('manifest'), { reset: false })
})
export const saveManifest = firestoreAction(async (state, payload) => {
  return firestore()
    .collection('environment')
    .doc('manifest')
    .set(payload, { merge: true })
    .then(() => {
      console.log(`manifest updated!`)
    })
})
export const saveConfig = firestoreAction((state, payload) => {
  console.log(payload)
  return firestore()
    .collection('config')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('updated!')
    })
})

export const saveConfig2 = firestoreAction(async (state, payload) => {
  console.log(payload)
  return firestore()
    .collection('config')
    .doc(payload.id)
    .set({ ...payload }, { merge: true })
    .then(() => {
      console.log('updated!')
    }).catch(e => console.error(e))
})

export const saveDay = firestoreAction((state, payload) => {
  console.log(payload)
  return firestore()
    .collection('config')
    .doc(payload.id)
    .set({ 'days': {
      ...payload.value
    }
    }, { merge: true })
    .then(() => {
      console.log('updated!')
    })
})

export const deleteConfig = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('config')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log(`${payload.collection} removeupdated!`)
      }).catch((e) => {
        console.log('error removing Configs!')
      })
  }
})

export const addConfig = firestoreAction((state, payload) => {
  return firestore().collection('config')
    .add(payload)
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
      console.log(payload)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
export const addConfig2 = firestoreAction((state, payload) => {
  return firestore().collection('config').doc(payload.doc)
    .set(payload.payload)
    .then(function (docRef) {
      console.log('Document written with ID: ', payload.doc)
      console.log(payload.payload)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
