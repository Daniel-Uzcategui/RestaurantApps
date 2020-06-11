export const categorias = ({ categorias }) => {
  const keys = Object.keys(categorias)
  var arr = []
  for (const i in keys) {
    arr.push(categorias[keys[i]])
  }
  return arr
}
