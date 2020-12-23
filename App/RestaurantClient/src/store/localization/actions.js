/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
const serialize = (snapshot) => {
  // snapshot.data() DOES NOT contain the `id` of the document. By
  // default, Vuefire adds it as a non enumerable property named id.
  // This allows to easily create copies when updating documents, as using
  // the spread operator won't copy it
  // return Object.defineProperty(snapshot.data(), 'id', { value: snapshot.id })
  return { ...snapshot.data(), id: snapshot.id }
}
export const bindLocalizations = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalizations')
  return bindFirestoreRef('localizations', firestore().collection('localizations').where('status', '==', 0), { reset: false, serialize: serialize, wait: true })
})
export const bindLocalZones = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalZones')
  return bindFirestoreRef('localZones', firestore().collection('localZones').where('status', '<', 2))
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
