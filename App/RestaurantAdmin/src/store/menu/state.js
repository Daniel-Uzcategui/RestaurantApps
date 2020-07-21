export default function () {
  return {
    categorias: [
      {
        id: 'asdd',
        name: 'Frozen Yogurt',
        descripcion: `<p>It's cold but great and tastes different than normal ice cream, but it's great too!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        extras: [],
        FechaAct: '19/04/20'
      },
      {
        id: 'qww',
        name: 'Ice cream sandwich',
        descripcion: `<p>It's also cold but great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: false,
        extras: [],
        FechaAct: '19/04/20'
      },
      {
        id: 'rtr',
        name: 'Eclair',
        descripcion: `<p>It's not cold and also great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        FechaAct: '19/04/20'
      },
      {
        id: 'yty',
        name: 'Cupcake',
        descripcion: `<p>It could be warm and it's great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        extras: [],
        FechaAct: '19/04/20'
      }
    ],
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
    extras: [
      {
        id: 'asdd',
        name: 'Frozen Yogurt',
        descripcion: `<p>It's cold but great and tastes different than normal ice cream, but it's great too!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        price: 10,
        FechaAct: '19/04/20'
      },
      {
        id: 'qww',
        name: 'Ice cream sandwich',
        descripcion: `<p>It's also cold but great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: false,
        price: 10,
        FechaAct: '19/04/20'
      },
      {
        id: 'rtr',
        name: 'Eclair',
        descripcion: `<p>It's not cold and also great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        price: 10,
        FechaAct: '19/04/20'
      },
      {
        id: 'yty',
        name: 'Cupcake',
        descripcion: `<p>It could be warm and it's great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        price: 10,
        FechaAct: '19/04/20'
      }
    ],
    promos: [],
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
      group_id: [ 1 ],
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
      name: 'Proteinas',
      descripcion: 'desc'
    }],
    groupComp: [{
      priority: 1,
      id: 1,
      required: 0,
      name: 'Proteinas adicionales',
      group_id: 1,
      descripcion: 'Maximo 3',
      type: 0, // 0 = CheckBox, 1 = RadioBox, 2 = Slider,
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
      type: 2, // 0 = CheckBox, 1 = RadioBox, 2 = Slider,
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
      type: 1, // 0 = CheckBox, 1 = RadioBox, 2 = Slider,
      free: 1
    }]
  }
}
