export const categorias = ({ categorias }) => {
  let cats = JSON.parse(JSON.stringify(categorias))
  for (let i in cats) {
    let cat = cats[i]
    if (cat.subCat) {
      for (let subcatkey of Object.keys(cat.subCat)) {
        let subcat = cat.subCat[subcatkey]
        console.log('catname', subcat.name.length)
        if ((subcat.name === undefined || subcat.name.length === 0) || subcat.softDelete) {
          delete cats[i].subCat[subcatkey]
        }
      }
    }
  }
  return cats.sort((a, b) => (sorted(a.priority) > sorted(b.priority)) ? 1 : ((sorted(b.priority) > sorted(a.priority)) ? -1 : 0))
}
export const origMenu = ({ menu, sede }) => {
  if (menu.length) {
    return menu.reduce((y, x) => {
      if (x.estatus && x.estatus[sede]) {
        let price = { price: x.price }
        // if (viewRewards) {
        //   price = { price: 0, reward: true }
        // }
        y.push({
          categoria: x.categoria,
          estatus: x.estatus,
          descripcion: x.descripcion,
          descripcioncolor: x.descripcioncolor,
          name: x.name,
          photo: x.photo,
          pricerange: x.pricerange,
          photomulti: x.photomulti,
          photosmall: x.photosmall,
          ...price,
          id: x.id,
          stock: x.stock,
          discount: x.discount,
          prodType: 0,
          disptype: x.disptype,
          priority: parseInt(x.priority ? x.priority : 1000),
          groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
        })
      }
      return y.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    }, [])
  } else return []
}
function sorted (a) {
  let num = parseInt(a)
  if (isNaN(num)) {
    return 0
  }
  return num
}
export const plaincategorias = ({ categorias }) => categorias
// export const menu = ({ menu }) => {
//   const keys = Object.keys(menu)
//   var arr = []
//   for (const i in keys) {
//     arr.unshift(menu[keys[i]])
//   }
//   return arr
// }
export const menu = ({ menu }) => menu

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
      label: `${x.name} $${parseFloat(x.price).toFixed(2)} `,
      price: parseFloat(x.price)
    }
  })
  console.log('Extras', arr2)
  return arr2
}

export const plainExtras = ({ extras }) => extras

export const listext = ({ extras }) => extras

export const cart = ({ cart }) => cart

export const sede = ({ sede }) => sede
export const rewards = ({ rewards }) => rewards

export const promos = ({ promos }) => {
  const keys = Object.keys(promos)
  var arr = []
  for (const i in keys) {
    arr.unshift(promos[keys[i]])
  }
  return arr
}

export const filters = ({ filters }) => filters

export const selectedProduct = ({ selectedProduct }) => selectedProduct

export const selectedProdType = ({ selectedProdType }) => selectedProdType

export const selectedFilter = ({ selectedFilter }) => selectedFilter

export const selCat = ({ selCat }) => selCat

export const item = ({ item }) => item

export const itemGroup = ({ itemGroup }) => itemGroup

export const groupComp = ({ groupComp }) => groupComp
