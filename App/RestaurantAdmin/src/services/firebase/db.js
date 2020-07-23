import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

/**
 * Firestore
 * https: //firebase.google.com/docs/reference/js/firebase.firestore.Firestore.html
 *
 * @return {Interface} returns Firestore
 */
export const firestore = () => {
  return firebase.firestore()
}
export { firebase }
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }
/**
 * @param  {String} collectionName - Firestore collection name
 * @param  {String} id - Uid to assign to a doc in firestore collection
 */
export const userRef = (collectionName, id) => {
  return firestore().collection(collectionName).doc(id)
}
export const docGet = (doc) => {
  console.log('getting ' + doc)
  return firestore().collection(doc).get().then(snapshot => {
    var ret = []
    for (const prop in snapshot.docs) {
      var query = snapshot.docs[prop].data()
      ret.push({ user: query.email, name: query.fullName, chainacc: query.ChainAcc
      })
    }
    return ret
  })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}
/**
 * @param  {String} storageLocation - Location on Firebase Storage
 */
export const storageRef = (storageLocation) => {
  return firebase.storage().ref(storageLocation)
}
