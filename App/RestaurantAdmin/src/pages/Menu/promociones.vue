<template>
   <div class="q-pa-md">
           <q-table
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
            {{ props.row.name }}
            <q-popup-edit
            :value="props.row.name"
            @show="() => showPopup(props.row, 'name')"
            >
              <q-input @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="descripcion" :props="props">
            <div v-html="props.row.descripcion"></div>
            <q-popup-edit
              :value="props.row.descripcion"
            >
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
              />
            </q-popup-edit>
          </q-td>
               <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved((e ? 1 : 0), props.row.estatus, props.row.id, `estatus`)"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-td>
               <q-td key="price" :props="props">
                  <q-input
                     filled
                     @input="(e) => saved2(e, props.row.price, props.row.id, 'price')"
                     :value="props.row.price"
                     mask="#.##"
                     dense
                     autofocus
                     input-class="text-center"
                     label="2 decimales"
                     />
               </q-td>
               <q-td key="groupComp" :props="props">
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
              />
          </q-td>
          <q-td key="cantidad">
              <q-input filled v-model.number="cantidad" label="Cantidad de productos" type="number"/>
          </q-td>
            </q-tr>
         </template>
      </q-table>
      <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
        <fbq-uploader
          class="q-my-lg"
          label="Please Upload a Photo"
          :meta="meta"
          :prefixPath="prefixPath"
          @uploaded="uploadComplete"
          document='promos'
        ></fbq-uploader>
    </q-dialog>
   </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 80px; width: 100px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'price', style: 'min-width: 150px; width: 200px', align: 'center', label: 'Precio', field: 'price' }
]
const columns2 = [
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'desc', style: 'min-width: 80px; width: 100px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'min-width: 80px; width: 120px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'price', style: 'min-width: 150px; width: 200px', align: 'center', label: 'Precio', field: 'price' },
  { name: 'groupComp', align: 'center', label: 'Componentes', field: 'groupComp' },
  { name: 'prods', style: 'min-width: 150px; width: 200px', align: 'center', label: 'Productos', field: 'prods' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue')
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
      filterOptions: []
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
  },
  methods: {
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
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindMenu', 'bindCategorias', 'bindPromos']),
    ...mapActions('localization', ['bindLocalizations']),
    delrow () {
      console.log({ payload: this.selected2, collection: 'promos' })
      this.delrows({ payload: this.selected2, collection: 'promos' })
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.menu.length}`
    },
    getSelectedString2 () {
      return this.selected2.length === 0 ? '' : `${this.selected2.length} record${this.selected2.length > 1 ? 's' : ''} selected of ${this.promos.length}`
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

</style>
