/// ////// Orders Action ////////
// import firebase from 'firebase/app'
import { firestoreAction } from 'vuexfire'
import { firestore, fireCallable } from '../../services/firebase/db.js'

// const orderEmail = require('../../pages/orders/template/vuelto')
export const bindOrders = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders', { payload })
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('orders', firestore().collection('orders').orderBy('dateIn', 'desc').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end))
  }
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('dateIn', 'desc').limit(100))
})
export const bindOrdersEnvio = firestoreAction(({ bindFirestoreRef }) => {
  return bindFirestoreRef('orderencomienda', firestore().collection('orders').orderBy('dateIn', 'desc').where('tipEnvio', '==', '4').where('encomienda.status', '==', 'enviar'))
})
export const bindOrderscorp = firestoreAction(({ bindFirestoreRef }) => {
  return bindFirestoreRef('ordercorporativo2', firestore().collection('orders').orderBy('dateIn', 'desc').where('tipEnvio', '==', '3').where('status', '==', 3))
})

export const unBindOrders = firestoreAction(({ unbindFirestoreRef }) => {
  console.log('unbinding')
  return unbindFirestoreRef('orders')
})
export const reportBindOrders = firestoreAction(({ bindFirestoreRef }) => {
  console.log('bindorders')
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc'))
})
export const reportBindOrders2 = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders')
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc').where('customer_id', '!=', 'aaaaa').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end))
  }
  return bindFirestoreRef('orders', firestore().collection('orders').orderBy('customer_id', 'desc').where('customer_id', '!=', 'aaaaa').limit(100))
})

export const saveOrder = firestoreAction((state, payload) => {
  try {
    return firestore()
      .collection('orders')
      .doc(payload.id)
      .update({ [payload.key]: payload.value })
      .then(() => {
        console.log('orders updated!',
          { [payload.key]: payload.value })
        return true
      })
  } catch (error) {
    throw error
  }
})
export const deleteOrder = firestoreAction((context, payload) => {
  console.log(payload)
  for (const i in payload) {
    firestore().collection('orders')
      .doc(payload[i].id)
      .delete().then(() => {
        console.log('orders removed!')
      }).catch((e) => {
        console.log('error removing orders!')
      })
  }
})
export const addOrder = firestoreAction((state, payload) => {
  return firestore()
    .collection('orders').add(
      payload
    )
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id)
    })
    .catch(function (error) {
      console.error('Error adding document: ', error)
    })
})
export const alterRange = async function ({ commit }, payload) {
  commit('order/alterRange', payload, { root: true })
}
export const reportBindOrderscorporativo = firestoreAction(({ bindFirestoreRef }, payload) => {
  console.log('bindorders')
  if (payload?.start && payload?.end) {
    console.log('renge')
    return bindFirestoreRef('ordercorporativo', firestore().collection('orders').orderBy('dateIn', 'desc').where('dateIn', '>=', payload.start).where('dateIn', '<', payload.end).where('tipEnvio', '==', '3'))
  }
  return bindFirestoreRef('ordercorporativo', firestore().collection('orders').orderBy('dateIn', 'desc').where('tipEnvio', '==', '3').limit(100))
})
export const encomienda = async function ({ commit }, payload) {
  commit('order/encomienda', payload, { root: true })
}
export const Status = async function ({ commit }, payload) {
  commit('order/Status', payload, { root: true })
}
export const Ordersfilter2 = async function ({ commit }, payload) {
  commit('order/Ordersfilter2', payload, { root: true })
}
export const StatusFilter2 = async function ({ commit }, payload) {
  commit('order/StatusFilter2', payload, { root: true })
}
export const setencomienda = async function (state, payload) {
  let result
  console.log('valor del paylod', payload)
  result = await firestore().collection('orders')
    .doc(payload.idorden)
    .set({
      guia: payload
    }, { merge: true })
  return result
}
export const setVuelto = async function (state, payload) {
  let result
  console.log('valor del paylod', payload)
  result = await firestore().collection('orders')
    .doc(payload.idorden)
    .set({
      vuelto: payload
    }, { merge: true })
  return result
}
export const emailAdminClients = function (state, payload) {
  let result
  // fireCallable().useEmulator('localhost', 5001)
  result = fireCallable().httpsCallable('mail')(payload).then(result2 => {
    console.log(result2)
  })
  console.log(result)
}
export const emailClients = function (state, payload) {
  let result
  // fireCallable().useEmulator('localhost', 5001)
  result = fireCallable().httpsCallable('mail2')(payload).then(result2 => {
    console.log(result2)
  })
  console.log(result)
}
export const createAUser = function (state, payload) {
  try {
    let result
    console.log('start call')
    if (process.env.environments.ENV_TYPE !== 'DEV') {
    }
    fireCallable().useEmulator('localhost', 5001)
    result = fireCallable().httpsCallable('createAUser')(payload).then(result2 => {
      console.log(result2)
    })
    console.log(result)
    return result
  } catch (error) {
    throw error
  }
}
export const modifyAUser = function (state, payload) {
  try {
    let result
    console.log('start call', payload)
    if (process.env.environments.ENV_TYPE !== 'DEV') {
    }
    fireCallable().useEmulator('localhost', 5001)
    result = fireCallable().httpsCallable('modifyAUser')({ ...payload, ambiente: localStorage.getItem('amb') }).then(result2 => {
      console.log(result2)
    })
    console.log(result)
    return result
  } catch (error) {
    throw error
  }
}
