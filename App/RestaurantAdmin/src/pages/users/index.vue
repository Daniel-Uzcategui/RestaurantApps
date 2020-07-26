 <template>
  <q-page class=" q-pa-lg" >
    <div>
      <q-table class="table"
      title="Usuarios"
      color="primary"
      :data="users"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
      <template v-slot:top-right>
        <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="deleted"/>
        <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer">
           <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name !== 'Rol'">{{ col.value }}</div>
            <q-select
                v-if="col.name === 'Rol'"
                filled
                :value="col.value"
                @input="(e) => saved(e, col.value, props.row.id, `rol`)"
                @remove="(e) => removed({...e, id: props.row.id})"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="rolOpt"
                :option-label="(item) => item === null ? null : item.label"
                :option-value="(item) => item === null ? null : item.value"
                map-options
                emit-value
                stack-label
              />
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
    ...mapGetters('user', ['users'])
  },
  mounted () {
    this.bindusers()
    console.log(this.users)
    this.rolOpt = this.getPages()
  },
  methods: {
    ...mapActions('menu', ['setValue', 'delValue']),
    getPages () {
      let rutas = this.$router.options.routes
      let filter = rutas.filter(x => {
        if (typeof x.children === 'undefined') { return false }
        return true
      })
      let out = [{ value: 'Admin', label: 'Admin' }]
      filter.forEach(e => {
        e.children.forEach(k => {
          if (typeof k !== 'undefined' && typeof k.meta !== 'undefined' && typeof k.meta.nombre !== 'undefined') {
            out.push({ value: k.name, label: k.meta.nombre })
          }
        })
      })
      console.log({ out })
      return out
    },
    removed (e) {
      console.log(e)
      this.delValue({ payload: { id: e.id, key: `rol.${e.value[0].label}` }, collection: 'users' })
    },
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.users.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'Usuarios.csv',
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
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.users.length}`
    },
    ...mapActions('user', ['deleteUsers', 'bindusers']),
    deleted () {
      this.deleteUsers(this.selected)
    },
    saved (value, initialValue, id, key) {
      console.log({ value, initialValue, id, key })
      this.setValue({ payload: { value, id, key }, collection: 'users' })
    }
  },
  data () {
    return {
      selected: [],
      columns: [
        { name: 'Name', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
        { name: 'LastName', required: true, label: 'Apellido', field: 'apellido' },
        { name: 'Rol', required: true, label: 'Rol', field: 'rol' },
        { name: 'Status', required: true, label: 'Estatus', field: 'status' }
      ],
      rolOpt: []
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
