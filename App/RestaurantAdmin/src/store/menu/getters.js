export const categorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.push(categorias[keys[i]])
  }
  return arr
}
export const plaincategorias = ({ categorias }) => categorias
export const menu = ({ menu }) => {
  const keys = Object.keys(menu)
  var arr = []
  for (const i in keys) {
    arr.push(menu[keys[i]])
  }
  return arr
}
export const listcategorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.push(categorias[keys[i]])
  }
  return arr.map(x => {
    var obj = {
      label: x.name,
      value: x.id
    }
    return obj
  })
}
