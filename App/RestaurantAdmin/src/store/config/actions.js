/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigs = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configs', firestore().collection('config'), { reset: false })
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

export const saveDay = firestoreAction((state, payload) => {
  console.log(payload)
  return firestore()
    .collection('config')
    .doc(payload.id)
    .update({ 'days': {
      [payload.key]: payload.value
    }
    })
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
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
