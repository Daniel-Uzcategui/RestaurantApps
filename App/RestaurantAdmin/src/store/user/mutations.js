export const setCurrentUserData = (state, data) => {
  state.currentUser = data
}
export const setCurrentdocUser = (state, data) => {
  state.docUser = data
}

export const setEditUserDialog = (state, editUserDialog) => {
  state.editUserDialog = editUserDialog
}

export const SetSummary = (state, payload) => {
  Object.keys(payload).map(function (key, index) {
    if (key !== 'Loans') { payload[key] = payload[key].toFixed(2) }
  })
  state.summary = payload
}

export const setHistory = (state, setHistory) => {
  state.hist = setHistory
}

export function setRolUser (state, data) {
  state.rol = data.rol
}
