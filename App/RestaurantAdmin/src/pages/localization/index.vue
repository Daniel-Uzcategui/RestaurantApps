 <template>
  <q-page class=" q-pa-lg" >
    <div>
      <q-table class="localization"
      title="Sedes"
      color="primary"
      :data="localizations"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
      <template v-slot:top-right>
        <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="$router.replace('/localization/create')"/>
        <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="deleted"/>
        <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer" @click.native="$router.push({ path: '/localization/show', query: { Localization_Id: props.row.id } })">
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
    ...mapGetters('localization', ['localizations'])
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
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.localizations.length}`
    },
    ...mapActions('localization', ['deleteLocation']),
    deleted () {
      this.deleteLocation(this.localizations.filter(a => !this.selected.some(b => b['id'] === a['id'])))
    }
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'Name', required: true, label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'Address', required: true, align: 'center', label: 'Ubicación', field: 'address' },
        { name: 'Status', required: true, label: 'Estatus', field: 'status' },
        { name: 'Localization_date', label: 'Fecha', field: 'localization_date' }
      ]
    }
  }
}
</script>
<style lang="stylus">
 .localization
  width: 100%
  margin-bottom: 50%
 .q-table__top
   background-color $secondary
   color white
 </style>
