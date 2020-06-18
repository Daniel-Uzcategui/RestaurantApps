export function saveClientMt (state, payload) {
  console.log(payload)
  console.log(state)
  console.log('mutacion')
  state.clients[payload.id][payload.key] = payload.value
}

export function addClientMt (state, payload) {
  console.log(payload)
}

export function deleteClientMt (state, payload) {
  state.clients = payload
}
