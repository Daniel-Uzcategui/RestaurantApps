<template>
  <q-page class="q-pa-lg" >
    <div class="row header-container">
    <div class="flex-break q-py-md "></div>
     <div class="header-cell col-12" tabindex="0">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Tus Pedidos</div>
      </q-card-section>
     <q-table class="orders "
      :dense="$q.screen.lt.md"
      :data="data"
      :columns="columns"
      color="primary"
      row-key="name"
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
import { mapActions } from 'vuex'
export default {
  created () {
    this.bindExtras()
    this.bindMenu()
    this.bindCategorias()
  },
  methods: {
    ...mapActions('menu', ['bindExtras', 'bindMenu', 'bindCategorias']),
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
        {
          name: 'descrip',
          required: true,
          label: 'Descripción',
          align: 'left',
          field: 'descrip',
          sortable: true
        },
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'status', label: 'Estado', field: 'status' }
      ],

      data: [
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso'
        }
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
