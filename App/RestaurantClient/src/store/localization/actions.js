/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindLocalizations = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalizations')
  return bindFirestoreRef('localizations', firestore().collection('localizations'))
})

export const saveLocation = firestoreAction((state, payload) => {
  return firestore()
    .collection('localizations')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('localizations updated!')
    })
})
export const deleteLocation = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('localizations')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('localizations removed!')
      }).catch((e) => {
        console.log('error removing localizations!')
      })
  }
})

export const addLoc = firestoreAction((state, payload) => {
  return firestore()
    .collection('localizations').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})