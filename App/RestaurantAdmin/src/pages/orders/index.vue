 <template>
  <q-page class=" q-pa-lg" >
    <div>
      <q-table class="table"
      title="Ordenes"
      color="primary"
      :data="OrderClient"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
      <template v-slot:top-right>
        <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="$router.replace('/orders/create')"/>
        <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer" @click.native="$router.push({ path: '/orders/show', query: { Order_Id: props.row.id } })">
           <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
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
import { exportFile, date } from 'quasar'
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
      let fullname, statusOrder, tableOrder, typeService
      for (i = 0; i < this.orders.length; i++) {
        obj = null
        if (typeof this.$route.query.status !== 'undefined') {
          if (this.$route.query.status === this.orders[i].status) {
            obj = this.orders[i]
          }
        } else {
          obj = this.orders[i]
        }
        if (obj !== null) {
          clientforOrder = this.clientOrders(obj.customer_id)
          fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
          typeService = typeof obj.tipEnvio !== 'undefined' ? this.tipo_servicio[obj.tipEnvio]['label'] : 'No disponible'
          if (obj.typePayment === 'punto') {
            tipoPago = this.tipo_pago[0]['label']
          }
          if (obj.typePayment === 'cash') {
            tipoPago = this.tipo_pago[1]['label']
          }
          if (obj.typePayment === 'Zelle') {
            tipoPago = this.tipo_pago[2]['label']
          }
          statusOrder = typeof obj.status !== 'undefined' ? this.estatus_options[obj.status]['label'] : ''
          tableOrder = obj.table !== 0 ? obj.table : 'No asignada'
          OrderClient.push({
            'id': obj.id,
            'nombre': fullname,
            'typePayment': tipoPago,
            'status': statusOrder,
            'paid': obj.paid,
            'dateIn': obj.dateIn,
            'factura': obj.factura,
            'table': tableOrder,
            'typeService': typeService
          })
        }
      }
      return OrderClient
    }
  },
  created () {
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
        'Ordenes.csv',
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
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.orders.length}`
    },
    ...mapActions('order', ['deleteOrder', 'bindOrders']),
    ...mapActions('client', ['bindClients']),
    deleted () {
      this.deleteOrder(this.selected)
    }
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'factura', required: true, label: 'Factura', align: 'left', field: 'factura', sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre' },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService' },
        { name: 'status', required: true, label: 'Estatus', field: 'status' },
        { name: 'paid', label: 'Monto', field: 'paid' },
        { name: 'table', label: 'Mesa', field: 'table' },
        { name: 'dateIn', label: 'Fecha', field: 'dateIn', format: val => date.formatDate(val.toDate(), 'DD-MM-YYYY HH:mm:ss') }
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
        { label: 'Zelle', value: 2 }
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
