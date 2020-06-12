import Vue from 'vue'
/// ////// START Category Mutations ////////
export function editCategory (state, payload) {
  state.categorias[payload.id][payload.key] = payload.value
}

export function saveCategory (state, payload) {
  console.log(payload)
  state.categorias = payload
}

export function addCatMut (state, payload) {
  console.log(payload)
  Vue.set(state.categorias, payload, {
    id: payload,
    name: '',
    descripcion: ``,
    estatus: false,
    FechaAct: '19/04/20'
  })
}

/// ////// END Category Mutations ////////
/// ////// START Menu Mutations ////////
export function editMenu (state, payload) {
  state.menu[payload.id][payload.key] = payload.value
}

export function saveMenu (state, payload) {
  console.log(payload)
  state.menu = payload
}

export function addMenuMut (state, payload) {
  console.log(payload)
  Vue.set(state.menu, payload, {
    id: payload,
    name: '',
    descripcion: ``,
    estatus: false,
    FechaAct: '19/04/20'
  })
}

/// ////// END Menu Mutations ////////
