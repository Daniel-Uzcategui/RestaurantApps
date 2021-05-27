export default function () {
  return {
    orders: [
      {
        id: 0,
        customer_id: 1,
        total_items: 10,
        paid: 10,
        name: '',
        typePayment: '',
        order_date: '',
        status: '',
        delivered: '',
        phone: '',
        responsable: '',
        description: ''
      }
    ],
    typePayment_options: [
      { label: 'Punto de venta', value: 0 },
      { label: 'Efectivo', value: 1 },
      { label: 'Zelle', value: 2 },
      { label: 'Tarjeta o Paypal', value: 3 },
      { label: 'Venmo', value: 4 },
      { label: 'Débito o Crédito', value: 5 },
      { label: 'Tarjeta Venezolana', value: 6 },
      { label: 'Transferencia Bancaria', value: 7 },
      { label: 'Pago móvil', value: 8 },
      { label: 'Tarjeta Venezolana', value: 9 }
    ]
  }
}
