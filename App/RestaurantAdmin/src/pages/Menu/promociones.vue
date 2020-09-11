<template>
   <div class="q-pa-md">
           <q-table
           dense
         :data="promos"
         :columns="columns2"
         title="Promociones"
         :rows-per-page-options="[]"
         row-key="id"
         :selected-rows-label="getSelectedString2"
         selection="multiple"
         :selected.sync="selected2"
         >
         <template v-slot:top-right>
            <q-btn-group flat push >
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="delrow"/>
        </q-btn-group>
         </template>
         <template v-slot:body="props">
            <q-tr :props="props">
               <q-td  auto-width>
                  <q-checkbox v-model="props.selected" />
               </q-td>
           <q-td key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id)">
            <div class=" column items-center" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm"  color="blue-grey-10" icon="fas fa-hamburger" font-size="50px" size="180px" text-color="white"></q-avatar><span class="text-caption text-blue-grey-10">Click para editar</span></div>
            <div class="column items-center" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar><span class="text-blue-grey-10"><q-icon class="q-mr-sm" color="blue-grey-10" name="edit" size="16px"></q-icon>Click para editar</span></div>
                </div>
          </q-td>
          <q-td key="desc" :props="props">
              <q-input style="width: 250px" @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
          </q-td>
          <q-td key="descripcion" :props="props">
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
              />
          </q-td>
           <q-td key="price" :props="props">
                  <q-decimal style="width: 150px" class="q-mb-md" :rules="[validate]"
                  outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                :value="props.row.price" input-style="text-align: right"></q-decimal>
               </q-td>
               <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, `estatus`)"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-td>
           <q-td auto-width >
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
               <q-td colspan="2" key="groupComp" :props="props">
              <q-select
                filled
                :value="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                @new-value="createValue"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                @filter="filterFn"
                style="width: 250px"
                map-options
                emit-value
                stack-label
                label="Opciones"
              />
          </q-td>
              <q-td key="prods" :props="props">
              <q-select
                filled
                :value="props.row.prods"
                @input="(e) => saved(e, props.row.prods, props.row.id, 'prods')"
                use-input
                :option-value="(item) => item === null ? null : { id: item.id, quantity: cantidad, name: item.name }"
                :option-label="(item) => item === null ? null : typeof item.quantity === 'undefined' ? item.name : `${item.name} * ${item.quantity}`"
                use-chips
                multiple
                input-debounce="0"
                :options="filterOptions"
                @filter="filterFn"
                style="width: 250px"
                stack-label
                emit-value
                label="Productos"
              />
          </q-td>
          <q-td key="cantidad">
              <q-input style="width: 150px"
              filled
              v-model.number="cantidad"
              label="Cantidad por Producto"
              type="number"
              min="1"
              max="99"/>
          </q-td>
          <q-td colspan="100%" >
          </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
          <q-td colspan="4">
            <div class="business-hours-container">
             <div class="business-hours-component">
               <h5>Horarios</h5>
              <business-hours
                  :days="days"
                  name="dayHours"
                  type="select"
                  :time-increment="15"
                  :localization="localization"
                  color="#00af0b"
                ></business-hours>
              </div>
            </div>
            </q-td>
          </q-tr>
         </template>
      </q-table>
      <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
        <fbq-uploader
          class="q-my-lg"
          label="Por favor cargar una foto"
          :meta="meta"
          :prefixPath="prefixPath"
          @uploaded="uploadComplete"
          document='promos'
        ></fbq-uploader>
    </q-dialog>
    <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Promociones</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar una Promoción a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
   </div>
</template>
<script>
const columns = [
  { name: 'desc', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price' }
]
const columns2 = [
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'desc', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'groupComp', align: 'center', field: 'groupComp' },
  { name: 'prods', align: 'center', field: 'prods' },
  { name: 'cantidad', align: 'center', field: 'cantidad' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import BusinessHours from 'vue-business-hours'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    BusinessHours
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'promos', 'groupComp']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    locList () {
      return this.localizations.map(x => {
        return {
          value: x.id,
          label: x.name
        }
      })
    },
    meta () {
      return {
        id: this.currentUser.id,
        photoType: this.photoType
      }
    },
    prefixPath () {
      const id = this.currentUser.id,
        path = `${id}/${this.photoType}Photo/${this.photoType}Photo.`
      return path
    }
  },
  data () {
    return {
      cantidad: 1,
      columns,
      columns2,
      selected: [],
      selected2: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      noSelect: false,
      filterOptions: [],
      default: {
        'monday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5d1',
            'isOpen': true
          }
        ],
        'tuesday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5d8',
            'isOpen': true
          }
        ],
        'wednesday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5df',
            'isOpen': true
          }
        ],
        'thursday': [
          {
            'open': '0800',
            'close': '1600',
            'id': '5ca5578b0c5e6',
            'isOpen': true
          }
        ],
        'friday': [
          {
            'open': '0800',
            'close': '1600',
            'id': '5ca5578b0c5ec',
            'isOpen': true
          }
        ],
        'saturday': [
          {
            'open': '0800',
            'close': '1600',
            'id': '5ca5578b0c5f8',
            'isOpen': true
          }
        ],
        'sunday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5c7',
            'isOpen': true
          }
        ]
      },
      localization: {
        'switchOpen': 'Habilitada',
        'switchClosed': 'Desabilitado',
        'placeholderOpens': 'Abre',
        'placeholderCloses': 'Cerrado',
        'addHours': 'Agregar horas',
        'open': {
          'invalidInput': 'Ingrese una hora de apertura en el formato de 12 horas (es decir, 08:00 a.m.). También puede ingresar las "24 horas".',
          'greaterThanNext': 'Ingrese un horario de apertura que sea anterior al horario de cierre.',
          'lessThanPrevious': 'Ingrese un horario de apertura posterior al horario de cierre anterior.',
          'midnightNotLast': 'La medianoche solo se puede seleccionar para la última hora de cierre del día.'
        },
        'close': {
          'invalidInput': 'Ingrese una hora de cierre en el formato de 12 horas (es decir, 05:00 PM). También puede ingresar "24 horas" o "Medianoche".',
          'greaterThanNext': 'Ingrese una hora de cierre que sea posterior a la hora de apertura.',
          'lessThanPrevious': 'Ingrese una hora de cierre anterior a la próxima hora de apertura.',
          'midnightNotLast': 'La medianoche solo se puede seleccionar para la última hora de cierre del día.'
        },
        't24hours': '24 horas',
        'midnight': 'Medianoche',
        'days': {
          'sunday': 'Domingo',
          'monday': 'Lunes',
          'tuesday': 'Martes',
          'wednesday': 'Miércoles',
          'thursday': 'Jueves',
          'friday': 'Viernes',
          'saturday': 'Sábado'
        }
      }
    }
  },
  created () {
    this.bindMenu().then(() => {
      this.filterOptions = this.menu.map(x => {
        return {
          id: x.id,
          name: x.name
        }
      })
      console.log({ ff: this.filterOptions })
    })
    this.bindCategorias()
    this.bindLocalizations()
    this.bindPromos()
    this.bindItem()
    this.bindItemGroup()
    this.bindGroupComp()
    this.days = this.default
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
    },
    seleccion () {
      console.log(this.selected)
    },
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log({ value })
      this.setValue({ payload: { value, id, key }, collection: 'promos' })
    },
    saved2 (value, initialValue, id, key) {
      console.log({ key })
      if (key === 'discount') { value = parseFloat(value) } else if (key === 'price') { value = parseFloat(value) } else if (key.includes('stock')) { value = parseFloat(value) }
      if (key === 'estatus') { if (value) { value = 1 } else { value = 0 } }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'promos' })
    },
    getStatus (value) {
      let status
      status = value === 1
      return status
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindMenu', 'bindCategorias', 'bindPromos', 'bindItemGroup', 'bindItem', 'bindGroupComp']),
    ...mapActions('localization', ['bindLocalizations']),
    delrow () {
      console.log({ payload: this.selected2, collection: 'promos' })
      if (this.selected2.length === 0) {
        this.noSelect = true
      }
      if (this.selected2.length > 0) {
        this.$q.dialog({
          title: 'Eliminar Promociones',
          message: '¿Desea Eliminar la Promociones seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected2, collection: 'promos' })
        }).onCancel(() => {
        })
      }
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.menu.length}`
    },
    getSelectedString2 () {
      let literal = this.selected2.length > 1 ? 's' : ''
      let objSelectedString = this.selected2.length === 0 ? '' : `${this.selected2.length} registro` + literal + ` seleccionado` + literal + ` de ${this.promos.length}`
      return objSelectedString
    },
    addrow () {
      this.addRow({ collection: 'promos' })
    },
    showPhotoUpload (type) {
      this.photoUpload = true
      this.photoType = type
    },
    showDefaultPhoto (e) {
      return e === '' ||
        e === null ||
        e === undefined
    },
    uploadComplete (info) {
      console.log(this.prefixPath)
      console.log(this.currentUser)
      let fileNames = []
      info.files.forEach(file => fileNames.push(file))
      this.photoUpload = false
      this.$q.notify({
        message: `Successfully uploaded your photo: ${fileNames}`,
        color: 'positive'
      })
    },
    createValue (val, done) {
      if (val.length > 0) {
        if (!this.listextras.includes(val)) {
          this.listextras.push(val)
        }
        done(val, 'toggle')
      }
    },
    getExtras (e) {
      console.log('GetExtras1', e, this.plainExtras)
      // if (Array.isArray(e) && e.length) { return [] }
      const ret = e.map(x => {
        return this.plainExtras[x].name
      })
      return ret
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.menu.map(x => {
            return {
              id: x.id,
              name: x.name
            }
          })
        } else {
          const needle = val.toLowerCase()
          console.log({ needle })
          this.filterOptions = this.menu.filter(
            v => v.name.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white
  .group
     width: 100px
     height: 100px
     border: 3px solid #555
</style>
