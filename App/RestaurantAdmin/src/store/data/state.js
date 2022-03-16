export default function () {
  return {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYxYTU4YzRkNDViYTQ0ZDQwYTAzMTRjNCIsInVzZXIiOiJjaG9wemlwcm9kIiwidGltZXMiOjAsImRhdGUiOjE2MzgyMzkzMjM3ODF9.lztjnkWD_A_VEfMpeiyUuiIiZtClvqSC0y8icHdAbq0',
    configHeader: {
      headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYxMzBiZWUxMDMzYzE0N2U5MDAyM2M4NyIsInVzZXIiOiJjaG9wemkiLCJ0aW1lcyI6MCwiZGF0ZSI6MTYzMDU4NDgzNDgzNH0.rI1kZk0N57bzzfk3WD-hKGD2m2AIOXbXvHLclbwbwjw' }
    },
    couriersList: [],
    estadosList: [],
    ciudadesList: [],
    municipiosList: [],
    parroquiasList: [],
    oficinasList: [],
    dataSelected: {
      courier: {},
      estado: {},
      ciudad: {},
      municipio: {},
      parroquia: {},
      oficina: {},
      destinatario: '',
      contacto: '',
      cirif: '',
      telefono: '',
      direccion: '',
      inmueble: '',
      descripcionPaquete: '',
      referencia: '',
      numeroPiezas: 0,
      peso: 0,
      tipoEnvio: '',
      valor: 0,
      tipoServicio: '',
      retirarOficina: true,
      seguro: true
    },
    tarifa: {
      data: {},
      error: null,
      ok: false
    },
    tracking: {
      data: {},
      error: null,
      ok: false
    },
    errorList: null,
    guia: {
      data: {},
      error: null,
      ok: false
    },
    pdfGuia: {
      data: {},
      error: null,
      ok: false
    },
    error: null
  }
}
