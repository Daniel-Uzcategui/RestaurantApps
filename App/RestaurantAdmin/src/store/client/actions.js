/// ////// START Localization Action ////////
export const saveClient = async function ({ commit }, payload) {
  return commit('saveClientMt', payload)
}

export const addClient = async function ({ commit }, payload) {
  return commit('addClientMt', payload)
}

export const deleteClient = async function ({ commit }, payload) {
  return commit('deleteClientMt', payload)
}
