export const orderClients = ({ orderClients }) => orderClients
export const branches = ({ branches }) => branches
export const seller = ({ seller }) => {
  let newSellerObj = []
  for (let i in seller) {
    const { id, nombre, apellido, phone, email } = seller[i]
    const user = { id, nombre, apellido, phone, email }
    newSellerObj.push(user)
  }
  return newSellerObj
}
