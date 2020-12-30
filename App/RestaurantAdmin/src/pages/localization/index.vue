 <template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
    <div>
      <q-table
      :grid="$q.screen.lt.md"
      class="localization"
      title="Sedes"
      style="border-radius: 28px"
      color="primary"
      :data="localizations"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
      :selected-rows-label="getSelectedString"
      selection="single"
      :selected.sync="selected"
      >
      <template v-if="$q.screen.gt.xs" v-slot:top-right>
        <q-btn flat color="white" push no-caps label="Agregar" icon="add" @click="$router.replace('/localization/create')"/>
        <q-btn flat color="white" push no-caps label="Eliminar" icon="delete_outline" @click="softDelete"/>
        <q-btn flat color="white" push no-caps label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
       <template v-slot:header="props">
        <q-tr :props="props">
          <q-th>
             Seleccione
          </q-th>
          <q-th>
             Nombre
          </q-th>
          <q-th>
            Ubicación
          </q-th>
          <q-th>
             Estatus
          </q-th>
          <q-th  v-if="config && config.statusPickup">
            Pick UP
          </q-th>
          <q-th  v-if="config && config.statusDelivery">
            Delivery
          </q-th>
          <q-th  v-if="config && config.statusInlocal">
            En local
          </q-th>
        </q-tr>
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
           <q-td key="status" v-if="estatus_options && estatus_options[props.row.status]" :props="props">
            {{estatus_options[props.row.status].label}}
          </q-td>
           <q-td v-if="config && config.statusPickup"  key="PickUP" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.PickUP, props.row.id, 'Pick UP')"
                :value="props.row.PickUP"
                color="#3c8dbc"
              />
          </q-td>
          <q-td v-if="config && config.statusDelivery" key="Delivery" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.Delivery, props.row.id, 'Delivery')"
                :value="props.row.Delivery"
                color="#3c8dbc"
              />
          </q-td>
          <q-td  v-if="config && config.statusInlocal" key="Inlocal" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.Inlocal, props.row.id, 'Inlocal')"
                :value="props.row.Inlocal"
                color="#3c8dbc"
              />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
            <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name}}</q-item-label>
                </q-item-section>
                <q-item-section class="text-caption text-grey">
                  <q-item-label>{{props.row.status ? 'activo' : 'inactivo'}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-icon name="arrow_drop_down" @click="$router.push({ path: '/localization/show', query: { Localization_Id: props.row.id } })" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
            </q-list>
          <!-- <q-card>
            <q-card-section>
              <q-icon name="search" @click="$router.push({ path: '/localization/show', query: { Localization_Id: props.row.id } })" />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card> -->
      </template>
    </q-table>
 </div>
 <q-footer v-if="$q.screen.lt.sm" reveal>
   <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
     <q-tab flat color="white" push no-caps icon="add" @click="$router.replace('/localization/create')"/>
        <q-tab flat push no-caps icon="delete_outline" @click="softDelete"/>
        <q-tab flat color="white" push no-caps icon="archive" @click="exportTable"/>
   </q-tabs>
 </q-footer>
 <q-dialog v-model="noSelectLoc">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Sede</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar una sede a Eliminar
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
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(obj => {
        return obj.source === 'paymentServ'
      })
    }
  },
  created () {
    this.bindConfigs()
  },
  mounted () {
    this.bindLocalizations()
  },
  methods: {
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.localizations.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'Sedes.csv',
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
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.localizations.length}`
      return objSelectedString
    },
    ...mapActions('localization', ['saveLocation', 'bindLocalizations']),
    ...mapActions('config', ['bindConfigs']),
    softDelete () {
      let id = ''
      let value = 2
      let key = 'status'
      if (this.selected.length === 0) {
        this.noSelectLoc = true
      }
      if (this.selected.length > 0) {
        id = this.selected[0].id
        this.$q.dialog({
          title: 'Borrar Sede',
          message: '¿Desea Borrar la Sede seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.saveLocation({ value, id, key })
        }).onCancel(() => {
        })
      }
    }
  },
  data () {
    return {
      selected: [],
      noSelectLoc: false,
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ],
      columns: [
        { name: 'name', required: true, label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'address', required: true, align: 'center', label: 'Ubicación', field: 'address' },
        { name: 'status', required: true, label: 'Estatus', field: 'status' },
        { name: 'PickUP', align: 'center', label: 'Pick UP', field: 'PickUP' },
        { name: 'Delivery', align: 'center', label: 'Delivery', field: 'Delivery' },
        { name: 'Inlocal', align: 'center', label: 'En local', field: 'Inlocal' }
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
