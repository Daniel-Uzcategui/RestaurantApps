export const categorias = ({ categorias }) => categorias
export const plaincategorias = ({ categorias }) => categorias
export const menu = ({ menu }) => menu
export const rewards = ({ rewards }) => rewards
export const coupons = ({ coupons }) => coupons
export const promos = ({ promos }) => promos
export const listcategorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.unshift(categorias[keys[i]])
  }
  const arr2 = arr.map(x => {
    return {
      value: x.id,
      label: x.name
    }
  })
  console.log('categorias', arr2)
  return arr2
}

export const item = ({ item }) => {
  let it = item.map(x => x)
  let a = it.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
  return a
}
export const itemPlain = ({ item }) => item
export const filters = ({ filters }) => filters

export const itemGroup = ({ itemGroup }) => itemGroup

export const groupComp = ({ groupComp }) => groupComp

export const selectedProduct = ({ selectedProduct }) => selectedProduct

export const selectedProdType = ({ selectedProdType }) => selectedProdType

export const selectedFilter = ({ selectedFilter }) => selectedFilter

export const sede = ({ sede }) => sede

export const cart = ({ cart }) => cart
