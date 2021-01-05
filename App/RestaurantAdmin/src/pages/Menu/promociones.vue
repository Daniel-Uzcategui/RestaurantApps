<template>
   <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
         <q-table
         style="border-radius: 28px"
         grid
         dense
         :data="elpromos"
         :columns="columns2"
         :visible-columns="visibleColumns"
         title="Promociones"
         :rows-per-page-options="[]"
         row-key="id"
         :selected-rows-label="getSelectedString2"
         selection="multiple"
         ref="table"
         :selected.sync="selected2"
         >
         <template v-if="$q.screen.gt.xs" v-slot:top>
           <p class="text-h5 text-bold q-ma-md">
      Promociones
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="secondary" icon="save"></q-btn>
            <q-btn-group flat push >
          <q-btn flat color="white" push no-caps label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat color="white" push no-caps label="Eliminar" icon="delete_outline" @click="delrow"/>
        </q-btn-group>
         </template>
         <!-- <template v-slot:body="props">
            <q-tr :props="props">
               <q-td  auto-width>
                  <q-checkbox v-model="props.selected" />
               </q-td>
           <q-td key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id)">
            <div class=" column items-center" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm"  color="secondary" icon="insert_photo" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-center" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
          </q-td>
          <q-td key="desc" :props="props">
              <q-input filled dense rounded outlined style="width: 250px" @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name"  />
          </q-td>
          <q-td key="descripcion" :props="props">
              <q-editor content-class="bg-amber-3"
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"

              />
          </q-td>
           <q-td key="price" :props="props">
                  <q-decimal dense rounded outlined  style="width: 150px" class="q-mb-md" :rules="[validate]"
                   @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
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
              <q-select filled dense rounded outlined

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
              <q-select filled dense rounded outlined

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
              <q-input filled dense rounded outlined style="width: 200px"
              v-model.number="cantidad"
              label="Cantidad a añadir"
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
                  :days="getDays(props.row.id)"
                  name="dayHours"
                  type="select"
                  :time-increment="15"
                  :localization="localization"
                  color="#00af0b"
                  @updated-hours="updatedHours(props.row.id)"
                ></business-hours>
              </div>
            </div>
            </q-td>
          </q-tr>
         </template> -->
         <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected;" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Agregar Nombre'}}</q-item-label>
                </q-item-section>
                <q-item-section class="text-caption text-grey">
                  <q-icon
                    @click.stop="(e) => {saved(
                        typeof props.row.estatus === 'undefined' ? true : !props.row.estatus,
                          props.row.estatus, props.row.id,
                          `estatus`);
                        typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus
                        }"
                      :color="props.row.estatus ? 'blue' : 'red'"
                   style="min-width: 25px" class="col-1 self-center full-height" size="md" :name="props.row.estatus ? 'toggle_on' : 'toggle_off'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption> {{(props.row.price).toFixed(2)}}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-icon name="edit" @click.stop="props.expand = !props.expand" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
          <q-item class="column items-start" key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id, props.row)">
            <div class=" column items-start" v-if="showDefaultPhoto(props.row.photo, props.row)">
                <q-avatar round class="q-mb-sm" icon="fas fa-hamburger" font-size="50px" size="180px" text-color="white"></q-avatar></div>
            <div class="column items-start" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id, props.row)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
          </q-item>
          <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Estatus</label></q-td>
                  <q-toggle
                  @input="(e) => {saved(e, props.row.estatus, props.row.id, 'estatus'); typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus}"
                  :value="props.row.estatus ? true : false"
                  color="blue"
                  />
              </q-item>
          <q-item class="column items-start" key="desc" :props="props">
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled dense rounded outlined
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              v-model="props.row.name"
               />
          </q-item>
          <q-item class="column items-start" key="categoria" :props="props">
            <q-td><label class="label-expand">Productos</label></q-td>
              <q-select filled dense rounded outlined
                bottom-slots
                v-model="props.row.prods"
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
              >
               <template v-slot:hint>
                  Para aumentar, la cantidad de productos coloque la cantidad en el campo inferior
                </template>
              </q-select>
          </q-item>
          <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="label-expand">Cantidad a añadir</label></q-td>
                  <q-input filled dense rounded outlined style="width: 150px"
                    v-model.number="cantidad"
                    label="Cantidad a añadir"
                    type="number"
                    min="1"
                    max="99"/>
              </q-item>
           <q-item class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Opciones</label></q-td>
              <q-select filled dense rounded outlined

                v-model="props.row.groupComp"
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
          </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col" key="descripcion" :props="props">
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                      min-height="5rem"

                    />
                </q-td>
              </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Precio</label></q-td>
                  <q-decimal dense rounded outlined filled
                  :rules="[validate]"
                   @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                  v-model="props.row.price"
                  input-style="text-align: right">
                  </q-decimal>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
      </q-table>
      <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
        <fbq-uploader
          class="q-my-lg"
          label="Por favor cargar una foto"
          :meta="meta"
          :prefixPath="prefixPath"
          :onlyLink="true"
          @uploaded="(e) => {uploadComplete(e); saveTemp({ payload: { value: e.link, id: photoProp.id, key: 'photo' }, collection: 'promos' }); photoProp.photo = e.link }"
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
    <q-footer v-if="$q.screen.lt.sm" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
      <q-tab flat  push no-caps icon="add" @click="addrow"/>
        <q-tab flat color="white" push no-caps label="Eliminar" icon="delete_outline" @click="delrow"/>
   </q-tabs>
   </q-footer>
   </div>
</template>
<script>
const columns = [
  { name: 'desc', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price' }
]
const columns2 = [
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'desc', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'groupComp', align: 'center', field: 'groupComp' },
  { name: 'prods', align: 'center', field: 'prods' },
  { name: 'cantidad', align: 'center', field: 'cantidad' },
  { name: 'horarios', field: 'horarios' }
]
const visibleColumns = ['photo', 'desc', 'descripcion', 'price', 'estatus', 'groupComp', 'prods', 'cantidad']
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import BusinessHours from 'vue-business-hours'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    // eslint-disable-next-line vue/no-unused-components
    BusinessHours
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'promos', 'groupComp']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    promosCopy () {
      return this.promos.map(x => {
        return {
          ...x,
          id: x.id,
          horarios: false
        }
      })
    },
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
      photoProp: null,
      visibleColumns,
      columns2,
      elpromos: [],
      temp1: [],
      selected: [],
      selected2: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      noSelect: false,
      filterOptions: [],
      show_days: [],
      showBussinesHours: [],
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
    this.bindPromos().then((e) => {
      this.elpromos = JSON.parse(JSON.stringify(e))
    })
    this.bindItem()
    this.bindItemGroup()
    this.bindGroupComp()
  },
  methods: {
    promo (id) {
      return this.promos.find(obj => {
        return obj.id === id
      })
    },
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
      this.saveTemp({ payload: { value, id, key }, collection: 'promos' })
    },
    saved2 (value, initialValue, id, key) {
      console.log({ key })
      if (key === 'discount') { value = parseFloat(value) } else if (key === 'price') { value = parseFloat(value) } else if (key.includes('stock')) { value = parseFloat(value) }
      if (key === 'estatus') { if (value) { value = 1 } else { value = 0 } }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'promos' })
    },
    saveTemp (temp) {
      if (typeof this.temp1[temp.collection] === 'undefined') {
        this.temp1[temp.collection] = {}
      }
      if (typeof this.temp1[temp.collection][temp.payload.id] === 'undefined') {
        this.temp1[temp.collection][temp.payload.id] = {}
      }
      this.temp1[temp.collection][temp.payload.id][temp.payload.key] = temp.payload.value
      this.$forceUpdate()
    },
    executeSave () {
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            this.newAddRow({ collection, data })
          } else {
            for (let key in this.temp1[collection][document]) {
              var value = this.temp1[collection][document][key]
              console.log({ payload: { value, document, key }, collection: collection })
              this.setValue2({ payload: { value, id: document, key }, collection: collection })
            }
          }
        }
      }
      this.temp1 = {}
      this.$q.notify({ message: 'Cambios Guardados' })
    },
    getStatus (value) {
      let status
      status = value === 1
      return status
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue2', 'addRow', 'newAddRow', 'bindMenu', 'bindCategorias', 'bindPromos', 'bindItemGroup', 'bindItem', 'bindGroupComp']),
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
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.elpromos.findIndex(x => x.id === payload.payload[i].id)
        this.elpromos.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      console.log(this.temp1)
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
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.promos === 'undefined') {
        this.temp1.promos = {}
      }
      this.temp1.promos[rand] = { id: rand, isNew: true, price: 0, descripcion: '' }
      this.elpromos.unshift({ id: rand, price: 0, descripcion: '' })
      this.$forceUpdate()
    },
    showPhotoUpload (type, prop) {
      this.photoProp = prop
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
      console.log({ info })
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
    },
    updatedHours (id) {
      let value, key
      value = this.show_days[id]
      key = 'days'
      console.log(`row = ${id}, name  = ${key}`)
      console.log(value)
      this.setValue({ payload: { value, id, key }, collection: 'promos' })
    },
    getDays (id) {
      let days = []
      // console.log('getDays')
      // console.log(id)
      this.showBussinesHours[id] = true
      if (this.promo(id).days) {
        let objMonday, objTuesday, objWednesday, objThursday, objFriday, objSaturday, objSunday
        objMonday = JSON.parse(JSON.stringify(this.promo(id).days.monday))
        objTuesday = JSON.parse(JSON.stringify(this.promo(id).days.tuesday))
        objWednesday = JSON.parse(JSON.stringify(this.promo(id).days.wednesday))
        objThursday = JSON.parse(JSON.stringify(this.promo(id).days.thursday))
        objFriday = JSON.parse(JSON.stringify(this.promo(id).days.friday))
        objSaturday = JSON.parse(JSON.stringify(this.promo(id).days.saturday))
        objSunday = JSON.parse(JSON.stringify(this.promo(id).days.sunday))
        days = { monday: objMonday, tuesday: objTuesday, wednesday: objWednesday, thursday: objThursday, friday: objFriday, saturday: objSaturday, sunday: objSunday }
        this.show_days[id] = days
      } else {
        this.show_days[id] = this.default
      }
      // console.log(this.show_days[id])
      return this.show_days[id]
    }
  }
}
</script>

<style lang="stylus">

  .group
     width: 100px
     height: 100px
     border: 3px solid #555
</style>
