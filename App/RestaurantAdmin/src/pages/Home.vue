<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <div class="row justify-between">
        <div :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="text-center col-xs-6 col-sm-6 col-md-4 col-lg-3"  >
         <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
          <q-card-section class="notifCardSection q-cardtop row justify-center">
            <div class="text-h5 row justify-between col-12">
              <i class="fas fa-tasks col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(0)}}</div>
            </div>
            <div class="text-subtitle2 self-center text-bold">Por Confirmar </div>
          </q-card-section>
          <q-card-section class="bg-primary q-pa-none">
          <q-card-actions vertical class="q-pt-md">
           <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"

           @click.native="$router.push({ path: '/orders/index', query: { status: 0 } })" />
          </q-card-actions>
          </q-card-section>
           </q-card>
          </div>
         <div :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3" >
          <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
          <q-card-section  class="notifCardSection q-cardtop row justify-center">
            <div class="text-h5 row justify-between col-12">
              <i class="fas fa-spinner col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(1)}}</div>
            </div>
            <div class="text-subtitle2 self-center text-bold">En Progreso</div>
          </q-card-section>
          <q-card-section class="bg-primary q-pa-none">
          <q-card-actions  class="q-pt-md" vertical>
            <q-btn color="white" no-caps flat
            icon-right="fa fa-arrow-alt-circle-right"

            @click.native="$router.push({ path: '/orders/index', query: { status: 1 } })" />
          </q-card-actions>
          </q-card-section>
           </q-card>
          </div>
          <div :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(3)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Entregadas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 3} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <div :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(4)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Anuladas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 4} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <orderVentaT :colors="['#b00', '#666']" key="orderventa" class="graphs col-xs-12 col-sm-12 col-md-12 col-lg-6" />
    <cantidadsemanal key="cantidadsemanal" class="graphs col-xs-12 col-sm-12 col-md-12 col-lg-6" />
    <productos key="productos" class="graphs col-xs-12 col-sm-12 col-md-12 col-lg-12" />
     <ordertable class="col-12" />
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
  components: {
    'ordertable': () => import('./orders/index'),
    'orderVentaT': () => import('../components/businessIntelligence/VentasT/index'),
    'productos': () => import('../components/businessIntelligence/productovendidos/index'),
    'cantidadsemanal': () => import('../components/businessIntelligence/semanacantidad/index')
  },
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
        tipoPago = this.tipo_pago && this.tipo_pago[obj.typePayment] && this.tipo_pago[obj.typePayment]['label'] ? this.tipo_pago[obj.typePayment]['label'] : ''
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
    this.bindOrders().catch(e => console.error(e))
    this.bindClients().catch(e => console.error(e))
  },
  methods: {
    ...mapActions('order', ['bindOrders']),
    ...mapActions('client', ['bindClients']),
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
      })
    },
    exportTable () {
      // naive encoding to csv format
      // console.log({ cols: this.columns })
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.OrderClient.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'OrdenesClientes.csv',
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
    totalOrders (value) {
      var totalOrder = this.orders.filter(obj => {
        return obj.status === value
      })
      return totalOrder.length
    }
  },

  data () {
    return {
      columns: [
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre' },
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService' },
        { name: 'paid', label: 'Monto', field: 'paid' },
        { name: 'table', label: 'Mesa', field: 'table' },
        { name: 'status', label: 'Estado', field: 'status' }
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
.graphs
  height: 300px !important
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.totalCard
  width: 30%
.notifCard
  border-radius: 28px
</style>
