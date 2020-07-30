import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindAddress = firestoreAction(({ bindFirestoreRef }, payload) => {
  return bindFirestoreRef('address', firestore().collection('address').where('softDelete', '<', 1))
})

export const addAddress = firestoreAction((state, payload) => {
  console.log({ payload })
  return firestore()
    .collection('address').add({
      ...payload,
      softDelete: 0
    })
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
    .update({ softDelete: 1 }).then(() => {
      console.log('address removed!')
    }).catch((e) => {
      console.log('error removing address!')
    })
})
