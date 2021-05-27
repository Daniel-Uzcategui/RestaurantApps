export default {
  currentUser: null,
  rol: null,
  docUser: null,
  editUserDialog: false,
  summary: {
    Checking: null,
    Savings: null,
    Loans: null,
    Outstanding: null
  },
  roles: [],
  ambientes: [],
  hist: [{
    'index': 0,
    'no': true
  }],
  newsletter: [],
  users: [
    {
      id: 0,
      identification: 'V14556722',
      name: 'Juan Gurttizzt',
      lastname: 'Gurttizzt',
      email: 'juan.Gurttizzt@example.com',
      birthdate: '01/02/1980',
      status: 'Activo',
      address: 'Caracas',
      rol: 'administrador'
    }
  ]
}
