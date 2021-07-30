export default function () {
  return {
    orders: [
    ],
    tipoServicio: [
      { label: 'Pick-up', value: 0 },
      { label: 'Delivery', value: 1 },
      { label: 'En-Local', value: 2 },
      { label: 'Orden de Compra', value: 3 }
    ],
    dateRange: null,
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
