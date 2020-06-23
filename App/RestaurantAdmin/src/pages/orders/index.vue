 <template>
  <q-page class=" q-pa-lg" >
    <div>
      <q-table class="table"
      title="Ordenes"
      color="primary"
      :data="orders"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
      <template v-slot:top-right>
        <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="$router.replace('/orders/create')"/>
        <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="deleted"/>
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
    ...mapGetters('order', ['orders'])
  },
  mounted () {
    this.bindOrders()
    console.log(this.orders)
  },
  methods: {
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
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.orders.length}`
    },
    ...mapActions('order', ['deleteOrder', 'bindOrders']),
    deleted () {
      this.deleteOrder(this.selected)
    }
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'description', required: true, label: 'Descripción', align: 'left', field: 'description', sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'status', required: true, label: 'Estatus', field: 'status' },
        { name: 'paid', label: 'Monto', field: 'paid' },
        { name: 'order_date', label: 'Fecha', field: 'order_date', format: val => date.formatDate(val, 'DD-MM-YYYY') }
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
