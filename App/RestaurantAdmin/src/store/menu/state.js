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
      price: 1,
      name: 'name',
      group_id: 1,
      descripcion: 'desc'
    }],
    itemGroup: [{
      id: 1,
      name: 'name',
      priority: 0,
      descripcion: 'desc'
    }],
    groupComp: [{
      id: 1,
      name: 'name',
      group_id: 1,
      descripcion: 'desc',
      type:0, // 0 = CheckBox, 1 = RadioBox, 2 = Stepper,
      min: 0,
      max: 5, 
      maxFree: 2,
      free: 1
    }]
  }
}
