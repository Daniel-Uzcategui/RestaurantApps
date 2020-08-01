/// ////// Localization Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'
export const bindConfig = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalizations')
  return bindFirestoreRef('localizations', firestore().collection('localizations').where('softDelete', '==', 0), { reset: false })
})
