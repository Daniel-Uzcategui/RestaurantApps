<template>
  <q-page class="flex flex-center q-gutter-md q-pa-lg" >
    <div class="row">
    <h4>Administración de Sedes</h4>
     <q-table class="localization"
      :dense="$q.screen.lt.md"
      title="Sedes"
      :data="data"
      :columns="columns"
      color="primary"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Exportar a csv"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
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

export default {
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
    }
  },

  data () {
    return {
      columns: [
        {
          name: 'Name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'address', align: 'center', label: 'Ubicación', field: 'address' },
        { name: 'status', label: 'Estado', field: 'status' },
        { name: 'localization_date', label: 'Fecha', field: 'localization_date' },
        { name: 'status', label: 'Estado', field: 'status' }
      ],

      data: [
        {
          name: 'Frozen Yogurt',
          address: 'Efectivo',
          localization_date: '01/02/2020',
          status: 'En progreso'
        }
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
.localization
  width: 100%
 </style>
