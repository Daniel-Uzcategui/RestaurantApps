import { firestoreAction } from 'vuexfire'
import { fireAdmin } from '../../services/firebase/db.js'
export const binderrores = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindLocalizations')
  return bindFirestoreRef('error', fireAdmin().collection('errores'))
})
