export default function () {
  return {
    cart: [],
    categorias: [{
      subCat: {}
    }
    ],
    rewards: [],
    coupons: [],
    menu: [
      {
        name: '',
        descripcion: '',
        estatus: true,
        categoria: [],
        photo: '',
        extras: [''],
        price: 0,
        FechaAct: ''
      }],
    selectedFilter: '',
    selectedProduct: '',
    selectedProdType: '',
    sede: null,
    promos: [],
    item: [],
    itemGroup: [],
    groupComp: [],
    filters: [],
    menu2: []
  }
}
