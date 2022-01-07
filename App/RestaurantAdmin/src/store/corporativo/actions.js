/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const bindcorporativo = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindClients')
  return bindFirestoreRef('corporativo', firestore().collection('clients').doc(payload.id).collection('branches'))
})
