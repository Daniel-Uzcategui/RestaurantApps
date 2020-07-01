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
           <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
           <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
           <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
           <q-td key="PickUP" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.PickUP, props.row.id, 'Pick UP')"
                :value="props.row.PickUP"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="Delivery" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.Delivery, props.row.id, 'Delivery')"
                :value="props.row.Delivery"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="Inlocal" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.Inlocal, props.row.id, 'Inlocal')"
                :value="props.row.Inlocal"
                color="#3c8dbc"
              />
          </q-td>
        </q-tr>
      </template>
    </q-table>
 </div>
 <q-dialog v-model="noSelectLoc">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Borrar Sedes</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar una sede a eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
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
  mounted () {
    this.bindLocalizations()
    console.log(this.localizations)
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
    ...mapActions('localization', ['deleteLocation', 'bindLocalizations']),
    deleted () {
      console.log(this.selected)
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Borrar Sedes',
          message: 'Desea borrar los elementos seleccionados ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          this.deleteLocation(this.selected)
        }).onCancel(() => {
          console.log('>>>> Cancel')
        })
      }
      if (this.selected.length === 0) {
        this.noSelectLoc = true
      }
    }
  },
  data () {
    return {
      selected: [],
      noSelectLoc: false,
      columns: [
        { name: 'name', required: true, label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'address', required: true, align: 'center', label: 'Ubicación', field: 'address' },
        { name: 'status', required: true, label: 'Estatus', field: 'status' },
        { name: 'PickUP', align: 'center', label: 'Pick UP', field: 'PickUP' },
        { name: 'Delivery', align: 'center', label: 'Delivery', field: 'Delivery' },
        { name: 'Inlocal', align: 'center', label: 'In local', field: 'Inlocal' }
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
