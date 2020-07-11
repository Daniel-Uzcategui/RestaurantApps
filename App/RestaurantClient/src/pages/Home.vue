<template>
  <q-page class="q-pa-lg" >
    <div class="row header-container">
    <div class="flex-break q-py-md "></div>
     <div class="header-cell col-12" tabindex="0">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Ordenes</div>
      </q-card-section>
     <q-table class="orders "
      :dense="$q.screen.lt.md"
      :data="DetailOrders"
      :columns="columns"
      color="primary"
      row-key="id"
      no-data-label="No se encontraron registros"
    >
      <template v-slot:top>
          <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
       <template v-slot:body="props">
        <q-tr :props="props" >
           <q-td key="factura" :props="props">
            {{ props.row.factura }}
          </q-td>
           <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="table" :props="props" >
            {{ props.row.table }}
          </q-td>
          <q-td key="paid" :props="props">
            {{ props.row.paid }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </q-card>
    </div>
    </div>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

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
    ...mapGetters('user', ['currentUser']),
    DetailOrders () {
      let Order = []
      let i, obj, status
      let tableOrder
      for (i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        tableOrder = obj.table !== 0 ? obj.table : 'No asignada'
        status = this.estatus_options[obj.status]['label']
        Order.push({
          'id': obj.id,
          'status': status,
          'paid': obj.paid.toFixed(2),
          'factura': obj.factura,
          'table': tableOrder
        })
      }
      console.log(Order)
      return Order
    }
  },
  created () {
    this.bindExtras()
    this.bindMenu()
    this.bindCategorias()
    console.log(this.currentUser)
    this.bindOrders(this.currentUser.id)
    console.log(this.orders)
  },
  methods: {
    ...mapActions('menu', ['bindExtras', 'bindMenu', 'bindCategorias']),
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
    }
  },

  data () {
    return {
      columns: [
        { name: 'factura', required: true, label: 'Factura', field: 'factura' },
        { name: 'status', label: 'Estado', field: 'status', align: 'center' },
        { name: 'table', label: 'Mesa', field: 'table' }
      ],
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
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
