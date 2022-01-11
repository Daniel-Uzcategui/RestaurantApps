/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore } from '../../services/firebase/db.js'

export const bindcorporativo = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindClients')
  return bindFirestoreRef('corporativo', firestore().collection('clients').doc(payload.id).collection('branches').where('softDelete', '==', 0))
})
export const setValuenew = async function (state, payload) {
  let result
  console.log('valores a agregar', payload)
  result = await firestore().collection('clients').doc(payload.id).collection('branches')
    .add({
      name: payload.name,
      RazonSocial: payload.RazonSocial,
      Rif: payload.Rif,
      Vendedor: payload.Vendedor,
      creditDays: payload.creditDays,
      tipoPago: payload.tipoPago,
      softDelete: 0
    })
  return result
}
export const setValueborrar = async function (state, payload) {
  let result
  console.log('el id para borrar', payload.id)
  result = await firestore().collection('clients')
    .doc(payload.idcliente).collection('branches').doc(payload.id)
    .set({
      softDelete: 1
    }, { merge: true })
  return result
}
export const setValueEditados = function (state, payload) {
  console.log('registro', payload)

  firestore().collection('clients')
    .doc(payload.idcliente).collection('branches').doc(payload.id)
    .set({
      name: payload.datos.name,
      RazonSocial: payload.datos.RazonSocial,
      Rif: payload.datos.Rif,
      Vendedor: payload.datos.Vendedor,
      creditDays: payload.datos.creditDays,
      tipoPago: payload.datos.tipoPago,
      softDelete: 0
    }, { merge: true }).then(() => {
      console.log('se actualizo')
    }).catch((e) => {
      console.log('error update de banches!')
    })
}
