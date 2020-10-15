export default function () {
  return {
    categorias: [],
    menu: [],
    extras: [],
    cart: [],
    sede: null,
    promos: [],
    filters: [],
    selectedFilter: '',
    item: [{
      id: 1,
      price: 2,
      name: 'Atun (100g)',
      group_id: [1],
      descripcion: 'Atun aleta amarilla'
    },
    {
      id: 2,
      price: 1.5,
      name: 'Salmon (100g)',
      group_id: [1],
      descripcion: 'Salmon Chileno'
    },
    {
      id: 3,
      price: 1.8,
      name: 'Pescado Blanco (100g)',
      group_id: [1],
      descripcion: 'Mahi Mahi'
    },
    {
      id: 4,
      price: 1,
      name: 'Pollo (100g)',
      group_id: [1],
      descripcion: ''
    }],
    itemGroup: [{
      id: 1,
      name: 'name',
      descripcion: 'desc'
    }],
    groupComp: [{
      priority: 1,
      id: 1,
      required: 0,
      name: 'Proteinas adicionales',
      group_id: 1,
      descripcion: 'Maximo 3',
      type: 0, // 0 = CheckBox, 1 = RadioBox, 2 = Stepper,
      min: 0,
      max: 3,
      free: 0
    },
    {
      priority: 2,
      id: 2,
      required: 0,
      name: 'Proteinas adicionales',
      group_id: 1,
      descripcion: 'Maximo 15',
      type: 2, // 0 = CheckBox, 1 = RadioBox, 2 = Stepper,
      min: 0,
      max: 15,
      maxUnit: 5,
      free: 0
    },
    {
      priority: 0,
      id: 3,
      required: 1,
      name: 'Proteinas',
      group_id: 1,
      descripcion: 'Seleccione una Proteina',
      type: 1, // 0 = CheckBox, 1 = RadioBox, 2 = Stepper,
      free: 1
    }]
  }
}
