 <template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <q-tabs
        v-model="tab"
        inline-label
        :breakpoint="0"
        align="justify"
        class="bg-primary text-white"
        dark
        color
      >
        <q-tab name="Registrados" no-caps label="Registrados" />
        <q-tab name="Suscritos"  no-caps label="Suscritos al boletin" />
      </q-tabs>
    <div>
     <q-card v-show="tab ==='Registrados'">
     <q-table class="headerClients"
      title="Clientes"
      :data="clients"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
     <template v-slot:top-right>
        <q-btn flat  push label="Eliminar" no-caps icon="delete_outline" @click="deleted"/>
        <q-btn flat  push label="Exportar a csv" no-caps icon="archive" @click="exportTable"/>
      </template>
       <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer" @click.native="$router.push({ path: '/clients/show', query: { client_Id: props.row.id } })">
            <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
           </q-td>
           <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="status" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.status, props.row.id, `status`)"
                :value="props.row.status ? true : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="phone" :props="props">
            <q-input filled :value="props.row.phone" type="text" float-label="Float Label"  disabled/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </q-card>
    <q-card v-show="tab ==='Suscritos'">
     <q-table class="headerClients"
      title="Clientes"
      :data="newsletter"
      :columns="columns2"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
     <template v-slot:top-right>
        <!-- <q-btn flat  push label="Eliminar" icon="delete_outline" @click="deleted"/> -->
        <q-btn flat  push label="Exportar a csv" no-caps icon="archive" @click="exportTable2"/>
      </template>
       <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
           </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </q-card>
 </div>
 <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Borrar Cliente</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar un cliente a eliminar
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
    ...mapGetters('client', ['clients']),
    ...mapGetters('user', ['newsletter'])
  },
  mounted () {
    this.bindOnlyClients()
    this.bindNewsLetter()
    console.log(this.clients)
  },
  methods: {
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.clients.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'Clientes.csv',
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
    exportTable2 () {
      // naive encoding to csv format
      const content = [ this.columns2.map(col => wrapCsvValue(col.label)) ].concat(
        this.newsletter.map(row => this.columns2.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'SuscritosBoletin.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Navegador no permitió la descarga del Archivo...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.clients.length}`
    },
    ...mapActions('client', ['deleteClient', 'bindOnlyClients']),
    ...mapActions('user', ['bindNewsLetter']),
    deleted () {
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Borrar Cliente',
          message: 'Desea borrar los elementos seleccionados ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          this.deleteClient(this.clients.filter(a => !this.selected.some(b => b['id'] === a['id'])))
        }).onCancel(() => {
          console.log('>>>> Cancel')
        })
      }
      if (this.selected.length === 0) {
        this.noSelect = true
      }
    }
  },

  data () {
    return {
      tab: 'Registrados',
      selected: [],
      noSelect: false,
      columns: [
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
        { name: 'email', align: 'left', label: 'Correo Electrónico', field: 'email', sortable: true },
        { name: 'status', label: 'Estatus', field: 'status', align: 'left', sortable: true },
        { name: 'phone', label: 'Telefono', field: 'phone', align: 'center', style: 'min-width: 180px; width: 220px', sortable: true }
      ],
      columns2: [
        { name: 'email', align: 'left', label: 'Correo Electrónico', field: 'email', sortable: true }
      ]
    }
  }
}
</script>
<style lang="stylus">
 .headerClients
  width: 100%

 </style>
