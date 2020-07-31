export const categorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.unshift(categorias[keys[i]])
  }
  return arr
}
export const plaincategorias = ({ categorias }) => categorias
export const menu = ({ menu }) => menu
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

export const item = ({ item }) => item

export const itemGroup = ({ itemGroup }) => itemGroup

export const groupComp = ({ groupComp }) => groupComp
