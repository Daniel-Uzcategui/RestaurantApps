export function editCategory (state, payload) {
  console.log(payload)
  state.categorias[payload.id][payload.key] = payload.value
}
