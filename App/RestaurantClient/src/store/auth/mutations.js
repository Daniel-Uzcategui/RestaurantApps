export function setAuthState (state, data) {
  state.isAuthenticated = data.isAuthenticated
  state.isAnonymous = data.isAnonymous
  state.isReady = data.isReady
  state.uid = data.uid
}
