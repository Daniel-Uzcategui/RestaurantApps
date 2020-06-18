/// ////// Localization Action ////////
export const saveLocation = async function ({ commit }, payload) {
  return commit('saveLocationMt', payload)
}

export const deleteLocation = async function ({ commit }, payload) {
  return commit('deleteLocationMt', payload)
}
