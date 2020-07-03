<template>
  <q-page class="q-pa-md q-pa-sm " >
    <div class="row header-container">
    <div class="header-cell col-md-3 col-sm-4" >
     <q-card class="text-white" horizontal>
      <q-card-section class="bg-secondary">
        <div class="text-h5">
          <i class="fa fa-bell" aria-hidden="true"></i>
          <span class="separate">{{totalOrders('Pendiente')}}</span>
        </div>
        <div class="text-subtitle2">Ordenes Pendientes </div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions class="bg-primary" vertical>
       <q-btn no-caps flat icon-right="fa fa-arrow-alt-circle-right"
       label="Más info"
       @click.native="$router.push({ path: '/orders/index', query: { status: 'Pendiente' } })" />
      </q-card-actions>
       </q-card>
       </div>
       <div class="header-cell col-md-3 col-sm-4"  >
      <q-card class=" text-white" horizontal>
        <q-card-section  class="bg-secondary">
        <div class="text-h5">
          <i class="fa fa-bell" aria-hidden="true"></i>
          <span class="separate">{{totalOrders('En progreso')}}</span>
        </div>
        <div class="text-subtitle2">Ordenes en Progreso</div>
      </q-card-section>
       <q-separator dark />
      <q-card-actions  class="bg-primary" vertical>
        <q-btn no-caps flat
        icon-right="fa fa-arrow-alt-circle-right"
        label="Más info"
        @click.native="$router.push({ path: '/orders/index', query: { status: 'En progreso' } })" />
      </q-card-actions>
       </q-card>
        </div>
        <div class="header-cell col-md-3 col-sm-4">
       <q-card class="text-white" horizontal>
        <q-card-section  class="bg-secondary">
        <div class="text-h5"><i class="fa fa-bell" aria-hidden="true"></i>
        <span class="separate">{{totalOrders('Anulada')}}</span>
        </div>
        <div class="text-subtitle2">Ordenes en Anuladas</div>
     </q-card-section>
       <q-separator dark />
      <q-card-actions class="bg-primary" vertical>
        <q-btn no-caps flat icon-right="fa fa-arrow-alt-circle-right" label="Más info"
        @click.native="$router.push({ path: '/orders/index', query: { status: 'Anulada' } })" />
      </q-card-actions>
    </q-card>
    </div>
     <div class="flex-break q-py-md "></div>
     <div class="header-cell col-12" tabindex="0">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Ordenes</div>
      </q-card-section>
     <q-table
      :dense="$q.screen.lt.md"
      :data="orders"
      :columns="columns"
      color="primary"
      row-key="id"
      no-data-label="No se encontraron registros"
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
    ...mapGetters('order', ['orders'])
  },
  mounted () {
    this.bindOrders()
    console.log(this.orders)
  },
  methods: {
    ...mapActions('order', ['bindOrders']),
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
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
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'status', label: 'Estado', field: 'status' }
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
