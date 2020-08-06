/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfigChat = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindConfigs')
  return bindFirestoreRef('configs', firestore().collection('config'), { reset: false })
})

export const saveConfig = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection)
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log(`${payload.collection} updated!`)
    })
})
export const deleteConfig = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection(payload.collection)
      .doc(payload[i].id)
      .delete().then(() => {
        console.log(`${payload.collection} removeupdated!`)
      }).catch((e) => {
        console.log('error removing Configs!')
      })
  }
})

export const addConfig = firestoreAction((state, payload) => {
  return firestore()
    .collection(payload.collection).add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
