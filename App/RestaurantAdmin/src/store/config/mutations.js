/// ////// Localization Mutations  ////////
export function saveLocationMt (state, payload) {
  state.localizations[payload.id][payload.key] = payload.value
}
export function deleteLocationMt (state, payload) {
  state.localizations = payload
}
export function navMenuOpen (state, payload) {
  state.navMenuOpen = payload
}
