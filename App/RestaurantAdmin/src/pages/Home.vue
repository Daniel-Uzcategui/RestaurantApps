<template>
  <q-page class="q-pa-md q-pa-sm " >
    <div class="row header-container">
        <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-3"  >
         <q-card class="text-white" horizontal>
          <q-card-section class="bg-secondary">
            <div class="text-h5">
              <i class="fa fa-bell" aria-hidden="true"></i>
              <span class="separate">{{totalOrders(0)}}</span>
            </div>
            <div class="text-subtitle2">Ordenes Por Confirmar </div>
          </q-card-section>
          <q-separator dark />
          <q-card-actions class="bg-primary" vertical>
           <q-btn no-caps flat icon-right="fa fa-arrow-alt-circle-right"
           label="Más info"
           @click.native="$router.push({ path: '/orders/index', query: { status: 0 } })" />
          </q-card-actions>
           </q-card>
          </div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-3" >
          <q-card class=" text-white" horizontal>
          <q-card-section  class="bg-secondary">
            <div class="text-h5">
              <i class="fa fa-bell" aria-hidden="true"></i>
              <span class="separate">{{totalOrders(1)}}</span>
            </div>
            <div class="text-subtitle2">Ordenes en Progreso</div>
          </q-card-section>
          <q-separator dark />
          <q-card-actions  class="bg-primary" vertical>
            <q-btn no-caps flat
            icon-right="fa fa-arrow-alt-circle-right"
            label="Más info"
            @click.native="$router.push({ path: '/orders/index', query: { status: 1 } })" />
          </q-card-actions>
           </q-card>
          </div>
          <div class="q-pa-xs header-cell col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="text-white" horizontal>
              <q-card-section  class="bg-secondary">
              <div class="text-h5"><i class="fa fa-bell" aria-hidden="true"></i>
              <span class="separate">{{totalOrders(4)}}</span>
              </div>
              <div class="text-subtitle2">Ordenes en Anuladas</div>
             </q-card-section>
           <q-separator dark />
            <q-card-actions class="bg-primary" vertical>
              <q-btn no-caps flat icon-right="fa fa-arrow-alt-circle-right" label="Más info"
              @click.native="$router.push({ path: '/orders/index', query: { status: 4 } })" />
            </q-card-actions>
          </q-card>
      </div>
     <div class="flex-break"></div>
     <div class="header-cell col-xs-12 col-10" tabindex="0">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Ordenes</div>
      </q-card-section>
     <q-table
      :dense="$q.screen.lt.md"
      :data="OrderClient"
      :columns="columns"
      color="primary"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
    >
      <template v-slot:top>
          <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
    </q-table>
    </q-card>
    </div>
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
    ...mapActions('order', ['bindOrders']),
    ...mapActions('client', ['bindClients']),
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
      })
    },
    exportTable () {
      // naive encoding to csv format
      console.log({ cols: this.columns })
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
        { name: 'factura', required: true, label: 'Factura', align: 'left', field: 'factura', sortable: true },
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
<style lang="sass" scoped>
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.totalCard
   width: 30%
</style>
