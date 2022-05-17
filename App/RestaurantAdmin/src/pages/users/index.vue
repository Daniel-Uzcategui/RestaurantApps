 <template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
    <div>
      <q-table class="table "
      :grid="$q.screen.lt.md"
      title="Usuarios"
      color="primary"
      style="border-radius: 28px"
      :loading="loading"
      :data="getUsers"
      :columns="columns"
      :dense="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      >
      <template v-slot:top-right>
        <q-btn v-if="filter_id" color="accent" no-caps class="q-ma-md" push @click="filter_id = undefined" label="Eliminar filtro de usuario" />
        <q-input label="Filtro por nombre" v-model="filter" />
        <q-btn flat no-caps push label="Agregar" icon="add" @click="$router.replace('/users/create')"/>
        <q-btn flat no-caps push label="Eliminar" icon="delete_outline" @click="deleted"/>
        <q-btn flat no-caps push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th>
             Seleccione
          </q-th>
          <q-th>
             Nombre
          </q-th>
          <q-th>
            Apellido
          </q-th>
          <q-th>
             Rol
          </q-th>
          <q-th>
            Estatus
          </q-th>
          <q-th>
           Tipo de Aplicación
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer">
           <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
           <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
           <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
           <q-td key="apellido" :props="props">
            {{ props.row.apellido }}
          </q-td>
           <q-td>
            <q-select options-selected-class="text-blue" filled
                :value="props.row.rol"
                @input="(e) => saved(e, props.row.rol, props.row.id, `rol`)"
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
           <q-td key="status" :props="props">
            <div v-if="props.row.status !== undefined" >
             <q-toggle
                @input="(e) => saved(e, props.row.status, props.row.id, 'status')"
                :value="props.row.status"
                color="#3c8dbc"
              />
            </div>
          </q-td>
          <q-td key="typeAccess" :props="props">
            <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
            :value="props.row.typeAccess"
            @input="(e) => saved(e, props.row.typeAccess, props.row.id, 'typeAccess')"
            :options="typeAccess_options" />
          </q-td>
        </q-tr>
       <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Correo Electronico: </label></q-td>
          <q-td colspan="2">
            <div class="text-left"><q-input filled :value="props.row.email" disable/></div>
          </q-td>
         </q-tr>
          <q-tr v-show="props.expand" :props="props">
           <q-td><label class="label-expand">Telefono: </label></q-td>
          <q-td colspan="2">
            <div class="text-left"><q-input filled :value="props.row.phone" disable/></div>
          </q-td>
         </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Fecha Nacimiento: </label></q-td>
          <q-td colspan="2">
            <div class="text-left"><q-input filled :value="props.row.fecnac" disable/></div>
          </q-td>
         </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Sexo: </label></q-td>
          <q-td colspan="2">
            <div class="text-left"><q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
            :value="props.row.sexo"
            @input="(e) => saved(e, props.row.sexo, props.row.id, 'sexo')"
            :options="sexo_options" /></div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" v-if="props.row.typeAccess==='Proveedor'">
          <q-td colspan=2>
            <label class="label-expand">Codigo</label>
            <div class="text-left"><q-input filled :value="props.row.codigoDelivery" disable/></div>
          </q-td>
          <q-td colspan=2>
            <label class="label-expand">Razón Social </label>
            <div class="text-left"><q-input filled :value="props.row.razonSocial" disable/></div>
          </q-td>
         </q-tr>
         <q-tr v-show="props.expand" :props="props" v-if="props.row.typeAccess==='Proveedor'">
          <q-td colspan=2>
            <label class="label-expand">Id Fiscal </label>
            <div class="text-left"><q-input filled :value="props.row.RIF" disable/></div>
          </q-td>
          <q-td colspan=2>
            <label class="label-expand">Razón Comercial</label>
            <div class="text-left"><q-input filled :value="props.row.razonComercial" disable/></div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" v-if="props.row.typeAccess==='Delivery'">
          <q-td colspan=2>
            <label class="label-expand">Codigo </label>
            <div class="text-left"><q-input filled :value="props.row.codigo" disable/></div>
          </q-td>
          <q-td colspan=2 key="statusUbicacion">
            <label class="label-expand">Estatus de Ubicación</label>
            <div class="text-left">
              <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
              :value="props.row.statusUbicacion"
              @input="(e) => saved(e, props.row.statusUbicacion, props.row.id, 'statusUbicacion')"
              :options="estatus_ubicacion" />
           </div>
          </q-td>
         </q-tr>
          <q-tr v-show="props.expand" :props="props" v-if="props.row.typeAccess==='Delivery'">
         <q-td colspan=2 key="movilidad">
            <label class="label-expand">Tipo movilidad </label>
            <div class="text-left">
              <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
              :value="props.row.movilidad"
              @input="(e) => saved(e, props.row.movilidad, props.row.id, 'movilidad')"
              :options="tipo_options" />
           </div>
          </q-td>
          <q-td colspan=2 key="statusdelivery">
            <label class="label-expand">Estatus delivery </label>
            <div class="text-left">
              <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
              :value="props.row.statusdelivery"
              @input="(e) => saved(e, props.row.statusdelivery, props.row.id, 'statusdelivery')"
              :options="estatus_delivery" />
           </div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" v-if="props.row.typeAccess==='Seller'">
          <q-td colspan=2>
            <label class="label-expand">Codigo del vendedor </label>
            <div class="text-left"><q-input filled :value="props.row.codigo" disable/></div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
            <q-list  class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.nombre}} {{ props.row.apellido}}</q-item-label>
                </q-item-section>
                 <q-item-section side>
                <q-icon name="edit" @click="props.expand = !props.expand" />
               </q-item-section>
              </q-item>
              <q-separator></q-separator>
            </q-list>
             <q-list v-if="props.expand">
               <q-item class="row justify-center" key="desc" :props="props">
                <div class="col-6 q-pa-xs">
                  <label class="label-expand">Nombre:</label>
                  {{ props.row.nombre }}
                </div>
                <div class="col-6 q-pa-xs">
                  <label class="label-expand">Apellido:</label>
                  {{ props.row.apellido}}
                </div>
               </q-item>
               <q-item class="row justify-center" key="desc" :props="props">
                <div class="col-6 q-pa-xs">
                  <label class="label-expand">Correo Electronico:</label>
                  {{ props.row.email }}
                </div>
                <div class="col-6 q-pa-xs">
                  <label class="label-expand">Telefono:</label>
                  {{ props.row.phone}}
                </div>
               </q-item>
               <q-item  key="desc" :props="props">
                <div class="col-10 q-pa-xs">
                  <label class="label-expand">Sexo:</label>
                  <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
                   :value="props.row.sexo"
                   @input="(e) => saved(e, props.row.typeAccess, props.row.id, 'sexo')"
                   :options="sexo_options" />
                </div>
               </q-item>
               <q-item>
                  <div class="col-10 q-pa-xs">
                  <label class="label-expand">Rol:</label>
              <q-select options-selected-class="text-blue" filled rounded outlined
                :value="props.row.rol"
                @input="(e) => saved(e, props.row.rol, props.row.id, `rol`)"
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
              /></div>
               </q-item>
                <q-item  class="row justify-center">
                 <div  class="col-6 q-pa-xs" v-if="props.row.status !== undefined" >
                   <label class="label-expand">Estatus:</label>
                  <q-toggle
                      @input="(e) => saved(e, props.row.status, props.row.id, 'status')"
                      :value="props.row.status"
                      color="#3c8dbc"
                    />
                  </div>
                 <div class="col-6 q-pa-xs">
                 <label class="label-expand">Tipo de Aplicación</label>
                 <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
                    :value="props.row.typeAccess" rounded outlined
                    @input="(e) => saved(e, props.row.typeAccess, props.row.id, 'typeAccess')"
                    :options="typeAccess_options" />
                 </div>
               </q-item>
          </q-list>
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
    ...mapGetters('user', ['users']),
    getUsers () {
      if (this.filter === '') {
        if (this.filter_id) {
          return this.users.filter(x => x.id === this.filter_id)
        }
        return this.users
      }
      // let userFilter = []
      return this.users.filter(x => (x.nombre + ' ' + x.apellido).toLowerCase().includes(this.filter))
      // let userDetail
      // for (userDetail of this.users) {
      //   if (userDetail.rol !== 'Cliente') {
      //     userFilter.push(userDetail)
      //   }
      // }
      // console.log({ userFilter })
      // return this.users
    }
  },
  mounted () {
    this.bindusers().then(() => {
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
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
      let out = [{ value: 'Admin', label: 'Admin' }, { value: 'Owner', label: 'Owner' }, { value: 'Vendedor', label: 'Vendedor' }]
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
        this.getUsers.map(row => this.columns.map(col => wrapCsvValue(
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
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.getUsers.length}`
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
      loading: true,
      columns: [
        { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
        { name: 'apellido', required: true, label: 'Apellido', field: 'apellido' },
        { name: 'rol', required: true, label: 'Rol', field: 'rol' },
        { name: 'status', required: true, label: 'Estatus', field: 'status' },
        { name: 'typeAccess', required: true, label: 'Tipo de Aplicación', field: 'typeAccess' }
      ],
      filter: '',
      filter_id: this.$route.query.filter || undefined,
      rolOpt: [],
      typeAccess_options: [
        { label: 'Proveedor', value: 'Proveedor' },
        { label: 'Delivery', value: 'Delivery' },
        { label: 'Cliente', value: 'Client' },
        { label: 'Administrativo', value: 'Admin' },
        { label: 'Vendedor', value: 'Seller' }
      ],
      estatus_ubicacion: [
        { label: 'En Sede', value: 1 },
        { label: 'Asignado', value: 2 },
        { label: 'En vía al destino', value: 3 },
        { label: 'En Retorno', value: 4 }
      ],
      tipo_options: [
        { label: 'Vehículo', value: 0 },
        { label: 'Motocicleta', value: 1 },
        { label: 'Bicicleta', value: 2 },
        { label: 'Caminando', value: 3 }
      ],
      estatus_delivery: [
        { label: 'Disponible', value: 0 },
        { label: 'No disponible', value: 1 },
        { label: 'Suspendido', value: 2 }
      ],
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
      ]
    }
  }
}
</script>
<style lang="stylus">
 .table
  width: 100%

 </style>
