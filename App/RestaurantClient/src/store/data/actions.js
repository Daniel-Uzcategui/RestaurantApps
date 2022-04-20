import { api } from 'boot/apiaxios'
export async function loadCouriers ({ commit }) {
  await api.get(`/get/couriers`)
    .then((response) => {
      commit('loadCouriers', { data: response.data, error: null })
    }).catch(error => {
      commit('loadCouriers', { data: null, error: error })
    })
}
export async function loadCouriers2 ({ commit }) {
  let valor = await api.get(`/get/couriers`)
  return valor
}
export async function loadEstados ({ commit }, data) {
  console.log('el courier', data.value)
  await api.get(`/get/estados?courier=${data.value}`)
    .then((response) => {
      commit('loadEstados', { data: response.data, error: null })
    }).catch(error => {
      commit('loadEstados', { data: null, error: error })
    })
}
export async function loadEstados2 ({ commit }, data) {
  let valor = await api.get(`/get/estados?courier=${data}`)
  return valor
}
export async function loadCiudades ({ commit }, data) {
  await api.get(`/get/ciudades?estado=${data.value}`)
    .then((response) => {
      commit('loadCiudades', { data: response.data, error: null })
    }).catch(error => {
      commit('loadCiudades', { data: null, error: error })
    })
}
export async function loadCiudades2 ({ commit }, data) {
  let valor = await api.get(`/get/ciudades?estado=${data}`)
  return valor
}
export async function loadMunicipios ({ commit }, data) {
  await api.get(`/get/municipios?ciudad=${data.value}`)
    .then((response) => {
      commit('loadMunicipios', { data: response.data, error: null })
    }).catch(error => {
      commit('loadMunicipios', { data: null, error: error })
    })
}

export async function loadParroquias ({ commit }, data) {
  await api.get(`/get/parroquias?ciudad=${data.ciudad.value}&municipio=${data.municipio.value}`)
    .then((response) => {
      commit('loadParroquias', { data: response.data, error: null })
    }).catch(error => {
      commit('loadParroquias', { data: null, error: error })
    })
}

export async function loadOficinas ({ commit }, data) {
  await api.get(`/get/oficinas?ciudad=${data.value}`)
    .then((response) => {
      commit('loadOficinas', { data: response.data, error: null })
    }).catch(error => {
      commit('loadOficinas', { data: null, error: error })
    })
}

export async function generateGuia ({ commit, state }, data) {
  console.log(data)
  await api.post(`/generar/guia`,
    data,
    state.configHeader
  )
    .then((response) => {
      commit('generatedGuia', { data: response.data, error: null })
      console.log('Response:', response)
    }).catch(error => {
      // errorMsg = 'Error: Request failed with status code 500'
      // console.log(error)
      commit('generatedGuia', { data: null, error: error })
    })
}

export async function getTarifa ({ commit, state }, data) {
  console.log('modalidad', data)
  if (data.modalidadTarifa === 'oficina') {
    await api.get(`/get/calcularTarifa?courier=${data.courier}&ciudad=${data.ciudad}&cantidadPiezas=${data.cantidadPiezas}&peso=${data.peso}&seguro=${data.seguro}&valor=${data.valor}&tipoTarifa=${data.tipoTarifa}&modalidadTarifa=${data.modalidadTarifa}&oficina=${data.oficina}`, state.configHeader)
      .then((response) => {
        commit('loadTarifa', { data: response.data, error: null })
      }).catch(error => {
        commit('loadTarifa', { data: null, error: error })
      })
  } else {
    await api.get(`/get/calcularTarifa?courier=${data.courier}&ciudad=${data.ciudad}&cantidadPiezas=${data.cantidadPiezas}&peso=${data.peso}&seguro=${data.seguro}&valor=${data.valor}&tipoTarifa=${data.tipoTarifa}&modalidadTarifa=${data.modalidadTarifa}`, state.configHeader)
      .then((response) => {
        commit('loadTarifa', { data: response.data, error: null })
      }).catch(error => {
        commit('loadTarifa', { data: null, error: error })
      })
  }
}

export async function getTracking ({ commit, state }, data) {
  await api.get(`/get/tracking?courier=${data.courier}&numero_guia=${data.numero_guia}`, state.configHeader)
    .then((response) => {
      commit('generatedTracking', { data: response.data, error: null })
    }).catch(error => {
      commit('generatedTracking', { data: null, error: error })
    })
}

export async function generatePdfGuia ({ commit, state }, data) {
  await api.post(`/generar/pdf`,
    data,
    state.configHeader
  )
    .then((response) => {
      commit('generatedPdfGuia', { data: response.data, error: null })
    }).catch(error => {
      commit('generatedPdfGuia', { data: null, error: error })
    })
}
