/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const saveClient = firestoreAction((state, payload) => {
  return firestore()
    .collection('users')
    .doc(payload.id)
    .update({ [payload.key]: payload.value })
    .then(() => {
      console.log('users updated!')
    })
})

export const bindClients = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  return bindFirestoreRef('clients', firestore().collection('users'))
})
