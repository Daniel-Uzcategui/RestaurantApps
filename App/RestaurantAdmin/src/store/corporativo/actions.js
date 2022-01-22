/// ////// START Clients from users Action ////////
import { firestoreAction } from 'vuexfire'
import { firestore, fireAdmin } from '../../services/firebase/db.js'

export const bindcorporativo = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindClients')
  console.log('el cliente', payload.id)
  if (payload.id !== '') {
    return bindFirestoreRef('corporativo', firestore().collection('clients').doc(payload.id).collection('branches').where('softDelete', '==', 0))
  }
})
export const bindonlybranches = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindClients')
  console.log('el cliente')

  return bindFirestoreRef('branches', fireAdmin().collectionGroup('branches'))
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
  return firestore().collection('clients')
    .doc(payload.idcliente).collection('branches').doc(payload.id)
    .set({
      ...JSON.parse(JSON.stringify(payload.datos)),
      softDelete: 0
    }, { merge: true }).then(() => {
      console.log('se actualizo')
    }).catch((e) => {
      console.log('error update de banches!')
    })
}
export const getbranches = function (state, payload) {
  let result2
  let resullt = []

  result2 = fireAdmin().collection('ambiente').doc(payload.ambiente).collection('clients')
    .doc(payload.idcliente).collection('branches')
    .get()
  result2.then(doc => {
    doc.forEach(doc2 => {
      resullt.push({ id: doc2.id, data: doc2.data() })
    })
    console.log('aaaaaaaaaaaaaa', resullt)
  })
  return resullt
}
