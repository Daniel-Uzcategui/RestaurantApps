 <template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <div>
      <q-table class="table"
      title="Transactiones por medios de pago"
      color="primary"
      :data="OrderClient"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
      >
      <template v-slot:top-right>
        <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" >
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
 </div>
</q-page>
</template>

<script>
import { exportFile } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('payment', ['transactions']),
    OrderClient () {
      let OrderClient = []
      let i, order, clientforOrder, tipoPago, transactionforOrders
      let fullname, typeService
      let cardNumber, cardExpDate, responseMessage, trxType
      for (i = 0; i < this.orders.length; i++) {
        order = this.orders[i]
        if (order.id) {
          clientforOrder = this.clientOrders(order.customer_id)
          transactionforOrders = this.transactionOrders(order.id)
          console.log('Orders_id', order.id)
          console.log('transactionforOrders', transactionforOrders)
          if (transactionforOrders) {
            cardNumber = transactionforOrders.cardNumberFirst + '****' + transactionforOrders.cardNumberLast
            cardExpDate = transactionforOrders.cardExpDate
            responseMessage = transactionforOrders.responseMessage
            trxType = transactionforOrders.trxType
            fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
            typeService = typeof order.tipEnvio !== 'undefined' ? this.tipo_servicio[order.tipEnvio]['label'] : 'No disponible'
            tipoPago = this.tipo_pago[order.typePayment]['label']
            OrderClient.push({
              'id': order.id,
              'nombre': fullname,
              'typePayment': tipoPago,
              'status': this.estatus_options[order.status]['label'],
              'paid': order.paid,
              'factura': order.factura,
              'cardNumber': cardNumber,
              'cardExpDate': cardExpDate,
              'responseMessage': responseMessage,
              'trxType': trxType,
              'typeService': typeService
            })
          } else {
            cardNumber = ''
            cardExpDate = ''
            responseMessage = ''
            trxType = ''
          }
        }
      }
      return OrderClient
    }
  },
  created () {
    this.bindOrders()
    this.bindClients()
    this.bindtransactions()
  },
  methods: {
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
      })
    },
    transactionOrders (value) {
      console.log('En transactionOrders', value)
      return this.transactions.find(obj => {
        return obj.orderId === value
      })
    },
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.OrderClient.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'Pagos.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Navegador no permitio la descarga del Archivo...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    ...mapActions('order', ['bindOrders']),
    ...mapActions('client', ['bindClients']),
    ...mapActions('payment', ['bindtransactions'])
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre', sortable: true },
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment', sortable: true },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService', sortable: true },
        { name: 'cardNumber', align: 'center', label: 'Numero de Trajeta', field: 'cardNumber', sortable: true },
        { name: 'cardExpDate', align: 'center', label: 'Fecha de Vencimiento', field: 'cardExpDate', sortable: true },
        { name: 'responseMessage', align: 'center', label: 'Mensaje', field: 'responseMessage', sortable: true },
        { name: 'trxType', align: 'center', label: 'Autorizador', field: 'trxType', sortable: true },
        { name: 'paid', label: 'Monto', field: 'paid', sortable: true }
      ],
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ],
      tipo_pago: [
        { label: 'Punto de venta', value: 0 },
        { label: 'Efectivo', value: 1 },
        { label: 'Zelle', value: 2 },
        { label: 'Tarjeta o Paypal', value: 3 },
        { label: 'Venmo', value: 4 },
        { label: 'Débito o Crédito', value: 5 },
        { label: 'Tarjeta Venezolana', value: 6 },
        { label: 'Transferencia Bancaria', value: 7 },
        { label: 'Pago móvil', value: 8 }
      ],
      tipo_servicio: [
        { label: 'Pick-up', value: 0 },
        { label: 'Delivery', value: 1 },
        { label: 'En-Local', value: 2 }
      ]
    }
  }
}
</script>
<style lang="stylus">
 .table
  width: 100%
  margin-bottom: 50%

 </style>
