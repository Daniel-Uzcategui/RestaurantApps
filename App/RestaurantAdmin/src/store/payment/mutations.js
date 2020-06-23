/// ////// Payments Mutations  ////////
export function savePaymentMt (state, payload) {
  state.payments[payload.id][payload.key] = payload.value
}
export function deletePaymentMt (state, payload) {
  state.payments = payload
}
