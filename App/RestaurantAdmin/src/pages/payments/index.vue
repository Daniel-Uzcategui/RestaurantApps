 <template>
  <q-page class=" q-pa-lg" >
    <div>
      <q-table class="table"
      title="Pagos"
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
    OrderClient () {
      let OrderClient = []
      let i, obj, clientforOrder, tipoPago
      let fullname, tableOrder, typeService
      for (i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        clientforOrder = this.clientOrders(obj.customer_id)
        fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
        tableOrder = obj.table !== 0 ? obj.table : 'No asignada'
        typeService = typeof obj.tipEnvio !== 'undefined' ? this.tipo_servicio[obj.tipEnvio]['label'] : 'No disponible'
        tipoPago = this.tipo_pago[obj.typePayment]['label']
        OrderClient.push({
          'id': obj.id,
          'nombre': fullname,
          'typePayment': tipoPago,
          'status': this.estatus_options[obj.status]['label'],
          'paid': obj.paid,
          'factura': obj.factura,
          'table': tableOrder,
          'typeService': typeService
        })
      }
      return OrderClient
    }
  },
  mounted () {
    this.bindOrders()
    this.bindClients()
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
    ...mapActions('client', ['bindClients'])
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre' },
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService' },
        { name: 'paid', label: 'Monto', field: 'paid' }
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
        { label: 'Tarjeta o Paypal', value: 3 }
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
 .q-table__top
   background-color $secondary
   color white
 </style>
