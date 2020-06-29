import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindAddress = firestoreAction(({ bindFirestoreRef }) => {
  return bindFirestoreRef('address', firestore().collection('address'))
})

export const addAddress = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('address').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})

export const updateAddress = firestoreAction((state, payload) => {
  return firestore()
    .collection('address')
    .doc(payload.id)
    .update({ ...payload })
    .then(() => {
      console.log('address updated!')
    })
})

export const deleteAddress = firestoreAction((context, payload) => {
  console.log(payload)
  firestore().collection('address')
    .doc(payload.id)
    .delete().then(() => {
      console.log('address removed!')
    }).catch((e) => {
      console.log('error removing address!')
    })
})
