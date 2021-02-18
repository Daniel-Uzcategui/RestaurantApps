 <template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <div>
      <q-table class="table" flat square
      style="border-radius: 28px"
      title="Transacciones por medios de pago"
      :data="OrderClient"
      :columns="columns"
      :grid="$q.screen.lt.md"
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
      let i, tipoPago, transactionforOrders
      // let fullname
      let cardNumber, trxProcesingDate, responseMessage, trxType
      for (i = 0; i < this.transactions.length; i++) {
        transactionforOrders = this.transactions[i]
        if (transactionforOrders.id) {
          if (transactionforOrders) {
            cardNumber = transactionforOrders.cardNumberFirst + '****' + transactionforOrders.cardNumberLast
            trxProcesingDate = transactionforOrders.trxProcesingDate
            responseMessage = transactionforOrders.paymentStatus !== 'approved' ? transactionforOrders.paymentStatus : 'Aprobado'
            trxType = transactionforOrders.trxType
            // fullname = '' // typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
            if (typeof transactionforOrders.payment_method !== 'undefined') {
              // console.log(transactionforOrders)
              // console.log(transactionforOrders)
              tipoPago = transactionforOrders.payment_method === 'TDD' ? this.tipo_pago[0]['label'] : this.tipo_pago[1]['label']
            }
            OrderClient.push({
              'id': transactionforOrders.id,
              // 'nombre': fullname,
              'typePayment': tipoPago,
              'paid': transactionforOrders.paidAmount,
              'factura': transactionforOrders.factura,
              'cardNumber': cardNumber,
              'trxProcesingDate': trxProcesingDate,
              'responseMessage': responseMessage,
              'trxType': trxType
            })
          } else {
            cardNumber = ''
            trxProcesingDate = ''
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
  mounted () {
    this.bindtransactions()
  },
  methods: {
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
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
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment', sortable: true },
        { name: 'cardNumber', align: 'center', label: 'Numero de Trajeta', field: 'cardNumber', sortable: true },
        { name: 'trxProcesingDate', label: 'Fecha de transacción', field: 'trxProcesingDate', sortable: true },
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
        { label: 'Tarjeta Debito', value: 'TDD' },
        { label: 'Tarjeta Credito', value: 'TDC' }
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
