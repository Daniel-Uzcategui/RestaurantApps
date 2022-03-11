// ---------- Inicializar List-----------------
export function initCouriers (state) {
  state.couriersList = []
}
export function initEstados (state) {
  state.estadosList = []
}
export function initCiudades (state) {
  state.ciudadesList = []
}
export function initMunicipios (state) {
  state.municipiosList = []
}
export function initParroquias (state) {
  state.parroquiasList = []
}
export function initOficinas (state) {
  state.oficinasList = []
}
export function initDatos (state) {
  // state.couriersList=[]
  state.estadosList = []
  state.ciudadesList = []
  state.municipiosList = []
  state.parroquiasList = []
  state.oficinasList = []
  state.tarifa.ok = false
  state.tarifa.error = null
  state.tarifa.data = {}
  state.guia.ok = false
  state.guia.error = null
  state.guia.data = {}
  state.tracking.ok = false
  state.tracking.error = null
  state.tracking.data = {}
  state.pdfGuia.ok = false
  state.pdfGuia.error = null
  state.pdfGuia.data = {}
  state.dataSelected.courier = {}
  state.dataSelected.estado = {}
  state.dataSelected.ciudad = {}
  state.dataSelected.municipio = {}
  state.dataSelected.parroquia = {}
  state.dataSelected.oficina = {}
  state.dataSelected.destinatario = ''
  state.dataSelected.contacto = ''
  state.dataSelected.cirif = ''
  state.dataSelected.telefono = ''
  state.dataSelected.direccion = ''
  state.dataSelected.inmueble = ''
  state.dataSelected.descripcionPaquete = ''
  state.dataSelected.referencia = ''
  state.dataSelected.numeroPiezas = 0
  state.dataSelected.peso = 0
  state.dataSelected.tipoEnvio = ''
  state.dataSelected.valor = 0
  state.dataSelected.tipoServicio = ''
  state.dataSelected.retirarOficina = true
  state.dataSelected.seguro = true
}
export function initTracking (state) {
  state.tracking.data = {}
  state.tracking.error = null
  state.tracking.ok = false
}

// ---------- Actualizar List-----------------
export function updateCourier (state, data) {
  state.dataSelected.courier = data
}
export function updateEstado (state, data) {
  state.dataSelected.estado = data
}
export function updateCiudad (state, data) {
  state.dataSelected.ciudad = data
}
export function updateMunicipio (state, data) {
  state.dataSelected.municipio = data
}
export function updateParroquia (state, data) {
  state.dataSelected.parroquia = data
}
export function updateOficina (state, data) {
  state.dataSelected.oficina = data
}

export function updateOtherData (state, data) {
  state.dataSelected.destinatario = data.destinatario
  state.dataSelected.contacto = data.contacto
  state.dataSelected.cirif = data.cirif
  state.dataSelected.telefono = data.telefono
  state.dataSelected.direccion = data.direccion
  state.dataSelected.inmueble = data.inmueble
  state.dataSelected.descripcionPaquete = data.descripcionPaquete
  state.dataSelected.referencia = data.referencia
  state.dataSelected.numeroPiezas = data.numeroPiezas
  state.dataSelected.peso = data.peso
  state.dataSelected.tipoEnvio = data.tipoEnvio
  state.dataSelected.valor = data.valor
  state.dataSelected.tipoServicio = data.tipoServicio
  state.dataSelected.retirarOficina = data.retirarOficina
  state.dataSelected.seguro = data.seguro
}

// ---------- Cargar List-----------------
export function loadCouriers (state, data) {
  state.errorList = null
  if (!data.error) {
    state.couriersList = []
    data.data.forEach(element => {
      var courierRecord = {}
      courierRecord.label = firstUpperCase(element.nombre)
      courierRecord.value = element._id
      courierRecord.category = 1
      // courierRecord.data = element
      state.couriersList.push(courierRecord)
    })
  } else {
    state.errorList = data.error
  }
}

export function loadEstados (state, data) {
  state.errorList = null
  if (!data.error) {
    state.estadosList = []
    data.data.forEach(element => {
      var estadosRecord = {}
      estadosRecord.label = element.nombre
      estadosRecord.value = element._id
      estadosRecord.category = 1
      state.estadosList.push(estadosRecord)
    })
  } else {
    state.errorList = data.error
  }
}

export function loadCiudades (state, data) {
  state.errorList = null
  if (!data.error) {
    state.ciudadesList = []
    data.data.forEach(element => {
      var ciudadesRecord = {}
      ciudadesRecord.label = element.nombre
      ciudadesRecord.value = element._id
      ciudadesRecord.category = 1
      state.ciudadesList.push(ciudadesRecord)
    })
  } else {
    state.errorList = data.error
  }
}

export function loadMunicipios (state, data) {
  state.errorList = null
  if (!data.error) {
    state.municipiosList = []
    data.data.forEach(element => {
      var municipiosRecord = {}
      municipiosRecord.label = element.nombre
      municipiosRecord.value = element._id
      municipiosRecord.category = 1
      state.municipiosList.push(municipiosRecord)
    })
  } else {
    state.errorList = data.error
  }
}

export function loadParroquias (state, data) {
  state.errorList = null
  if (!data.error) {
    state.parroquiasList = []
    data.data.forEach(element => {
      var parroquiasRecord = {}
      parroquiasRecord.label = element.nombre
      parroquiasRecord.value = element._id
      parroquiasRecord.category = 1
      state.parroquiasList.push(parroquiasRecord)
    })
  } else {
    state.errorList = data.error
  }
}

export function loadOficinas (state, data) {
  state.errorList = null
  if (!data.error) {
    state.oficinasList = []
    data.data.forEach(element => {
      var oficinasRecord = {}
      oficinasRecord.label = element.nombre
      oficinasRecord.value = element._id
      oficinasRecord.category = 1
      state.oficinasList.push(oficinasRecord)
    })
  } else {
    state.errorList = data.error
  }
}

// --------------------------------------------------
export function loadTarifa (state, data) {
  state.tarifa.ok = false
  state.tarifa.error = null
  state.tarifa.data = {}
  if (!data.error) {
    state.tarifa.data = data.data
    state.tarifa.ok = true
  } else {
    state.tarifa.error = data.error
  }
}

export function generatedGuia (state, data) {
  state.guia.ok = false
  state.guia.error = null
  state.guia.data = {}
  if (!data.error) {
    state.guia.data = data.data
    state.guia.ok = true
  } else {
    state.guia.error = data.error
  }
}

export function generatedTracking (state, data) {
  state.tracking.ok = false
  state.tracking.error = null
  state.tracking.data = {}
  if (!data.error) {
    state.tracking.data = data.data
    state.tracking.ok = true
  } else {
    state.tracking.error = data.error
  }
}

export function generatedPdfGuia (state, data) {
  state.pdfGuia.ok = false
  state.pdfGuia.error = null
  state.pdfGuia.data = {}
  if (!data.error) {
    state.pdfGuia.data = data.data
    state.pdfGuia.ok = true
  } else {
    state.pdfGuia.error = data.error
  }
}

// --------------------------------------------------------------------------
function firstUpperCase (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
