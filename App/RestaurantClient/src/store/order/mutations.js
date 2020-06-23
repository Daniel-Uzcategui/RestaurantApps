export function saveLocationMt (state, payload) {
  state.localizations[payload.id][payload.key] = payload.value
}
