 <template>
  <q-page class=" q-pa-lg" >
    <div>
     <q-card >
     <q-table class="headerClients"
      title="Clientes"
      :data="clients"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      >
     <template v-slot:top-right>
        <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
        <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="$router.replace('/clients/create')"/>
      </template>
       <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer" @click.native="$router.push({ path: '/clients/show' })">
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="green" round dense  icon="edit"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </q-card>
 </div>
</q-page>
</template>

<script>
import { exportFile } from 'quasar'
import { mapGetters } from 'vuex'

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
    ...mapGetters('clients', ['clients'])
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
    }
  },

  data () {
    return {
      columns: [
        { name: 'name', label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'email', align: 'center', label: 'Correo Electrónico', field: 'email' },
        { name: 'status', label: 'Estatus', field: 'status' },
        { name: 'phone', label: 'Telefono', field: 'phone' }
      ]
    }
  }
}
</script>
<style lang="stylus">
 .headerClients
  width: 100%
  margin-bottom: 50%
 .q-table__top
   background-color $secondary
   color white
 </style>
