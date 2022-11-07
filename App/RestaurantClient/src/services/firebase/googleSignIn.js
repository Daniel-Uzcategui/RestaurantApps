import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

var provider = new firebase.auth.GoogleAuthProvider()

export const GoogleSignIn = async () => {
  console.log('GoogleSignIn')
  return firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken
      // The signed-in user info.
      var user = result.user
      console.log(token, user)
    // ...
    }).catch((error) => {
    // Handle Errors here.
      // var errorCode = error.code
      // var errorMessage = error.message
      // // The email of the user's account used.
      // var email = error.email
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential
    // ...
      console.error(error)
    })
}
export const GoogleSignInMobile = async () => {
  console.log('GoogleSignIn')
  return firebase.auth().signInWithRedirect(provider)
}
