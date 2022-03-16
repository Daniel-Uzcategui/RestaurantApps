/* eslint-disable camelcase */
export const orders = ({ orders }) => orders
// Getter ordersClient check if order is Vencida
export const ordersClient = ({ orders }) => {
  let arr = []
  for (let obj of orders) {
    let ord = obj
    if (ord.tipEnvio === '3' && ord.creditDays && ord.status === 3 && ord.statusLog) {
      let dateIn = getLogDate(ord)
      let differenceDates = (new Date()).getTime() - dateIn.getTime()
      let daysDif = differenceDates / (1000 * 60 * 60 * 24)
      let status = daysDif > ord.creditDays ? 5 : ord.status
      arr.push({ ...ord, status, id: obj.id })
    } else {
      arr.push(ord)
    }
  }
  console.log('ARR', arr)
  return arr
}
export const ordersClient2 = ({ ordercorporativo }) => {
  let arr = []
  for (let obj of ordercorporativo) {
    let ord = obj
    if (ord.tipEnvio === '3' && ord.creditDays && ord.status === 3 && ord.statusLog) {
      let dateIn = getLogDate(ord)
      let differenceDates = (new Date()).getTime() - dateIn.getTime()
      let daysDif = differenceDates / (1000 * 60 * 60 * 24)
      let status = daysDif > ord.creditDays ? 5 : ord.status
      arr.push({ ...ord, status, id: obj.id })
    } else {
      arr.push(ord)
    }
  }
  console.log('ARR', arr)
  return arr
}
function getLogDate (obj) {
  let ret = obj.statusLog?.find(x => x.status === 3)
  if (typeof ret === 'undefined') {
    return new Date()
  }
  return ret.dateIn.toDate()
}
export const typePayment_options = ({ typePayment_options }) => typePayment_options
export const dateRange = ({ dateRange }) => dateRange
export const tipoServicio = ({ tipoServicio }) => tipoServicio
export const estatus_options = ({ estatus_options }) => estatus_options
export const estatus_optionsOrd = ({ estatus_optionsOrd }) => estatus_optionsOrd
export const allestatus = ({ allestatus }) => allestatus
export const ordercorporativo = ({ ordercorporativo }) => ordercorporativo
export const orderencomienda = ({ orderencomienda }) => orderencomienda
export const Encomienda = ({ Encomienda }) => Encomienda
