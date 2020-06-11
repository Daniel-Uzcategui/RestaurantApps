export default function () {
  return {
    categorias: {
      0: {
        id: 0,
        name: 'Frozen Yogurt',
        descripcion: `<p>It's cold but great and tastes different than normal ice cream, but it's great too!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        FechaAct: (new Date())
      },
      1: {
        id: 1,
        name: 'Ice cream sandwich',
        descripcion: `<p>It's also cold but great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: false,
        FechaAct: (new Date())
      },
      2: {
        id: 2,
        name: 'Eclair',
        descripcion: `<p>It's not cold and also great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        FechaAct: (new Date())
      },
      3: {
        id: 3,
        name: 'Cupcake',
        descripcion: `<p>It could be warm and it's great!</p><p><strong>Have a taste!</strong></p>`,
        estatus: true,
        FechaAct: (new Date())
      }
    }
  }
}
