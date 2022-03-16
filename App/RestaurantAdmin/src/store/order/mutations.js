export function saveOrderMt (state, payload) {
  state.orders[payload.id][payload.key] = payload.value
}
export function deleteOrderMt (state, payload) {
  state.orders = payload
}
export function alterRange (state, payload) {
  state.dateRange = payload
}
export function encomienda (state, payload) {
  state.Encomienda = payload
}
