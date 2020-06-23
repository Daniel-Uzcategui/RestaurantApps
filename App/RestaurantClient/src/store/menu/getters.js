export const categorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.unshift(categorias[keys[i]])
  }
  return arr
}
export const plaincategorias = ({ categorias }) => categorias
export const menu = ({ menu }) => {
  const keys = Object.keys(menu)
  var arr = []
  for (const i in keys) {
    arr.unshift(menu[keys[i]])
  }
  return arr
}
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

export const listextras = ({ extras }) => {
  const keys = Object.keys(extras)
  var arr = []
  for (const i in keys) {
    arr.unshift(extras[keys[i]])
  }
  const arr2 = arr.map(x => {
    return {
      value: x.id,
      label: `${x.name} $${parseInt(x.price).toFixed(2)} `
    }
  })
  console.log('Extras', arr2)
  return arr2
}

export const plainExtras = ({ extras }) => extras

export const listext = ({ extras }) => extras

export const cart = ({ cart }) => cart