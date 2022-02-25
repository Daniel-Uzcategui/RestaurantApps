export default function () {
  return {
    orders: [],
    estatus_options: [
      { label: 'Por Confirmar', value: 0 },
      { label: 'Preparando su pedido', value: 1 },
      { label: 'Orden en vía', value: 2 },
      { label: 'Orden Entregada', value: 3 },
      { label: 'Anulada', value: 4 }
    ],
    estatus_optionsOrd: [
      { label: 'Por Confirmar', value: 0 },
      { label: 'Preparando su pedido', value: 1 },
      { label: 'Orden en vía', value: 2 },
      { label: 'Orden Entregada', value: 3 },
      { label: 'Anulada', value: 4 },
      { label: 'Vencida', value: 5 },
      { label: 'Pagada', value: 6 }
    ],
    allestatus: [
      { label: 'Por Confirmar', value: 0 },
      { label: 'Preparando su pedido', value: 1 },
      { label: 'Orden en vía', value: 2 },
      { label: 'Orden Entregada', value: 3 },
      { label: 'Anulada', value: 4 },
      { label: 'Vencida', value: 5 },
      { label: 'Pagada', value: 6 }
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
      { label: 'Tarjeta Venezolana', value: 9 },
      { label: 'Zelle Novared', value: 10 },
      { label: 'Pago movil Novared', value: 11 }
    ],
    ordercorporativo: []
  }
}
