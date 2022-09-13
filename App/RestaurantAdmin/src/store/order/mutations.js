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
export function Status (state, payload) {
  state.Status = payload.status
}
export function Ordersfilter2 (state, payload) {
  state.Ordersfilter = payload.Ordersfilter
}
export function StatusFilter2 (state, payload) {
  state.StatusFilter = payload.StatusFilter
}
export function selectedmesa (state, payload) {
  state.selectedmesa = payload
}
export function ordermesa (state, payload) {
  state.ordermesa = payload
}
