<template>
  <div class="q-pa-md">
   <q-table
      :data="menu"
      :columns="columns"
      title="Menu"
      :rows-per-page-options="[]"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-slot:top-right>
      <div class="q-pa-md">SEDE</div>
      <q-select
        bg-color="white"
        outlined
        v-model="sede"
        :options="locList"
        style="width: 250px"
        behavior="menu"
        emit-value
        map-options
        stack-label
      />
        <q-btn-group flat push >
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="delrow"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
        <q-tr v-if="sede !== null" :props="props">
          <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
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

          <q-td key="categoria" :props="props">
              <q-select
                filled
                :value="props.row.categoria"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                @new-value="createValue"
                :options="listcategorias"
                @filter="filterFn"
                style="width: 250px"
                map-options
                emit-value
                stack-label
              />
          </q-td>

          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, `estatus.${sede}`)"
                :value="props.row.estatus ? props.row.estatus[sede] ? props.row.estatus[sede] : false : false"
                color="#3c8dbc"
              />
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

          <q-td key="FechaAct" :props="props">
            <div class="text-pre-wrap">{{ props.row.FechaAct }}</div>
            <q-popup-edit v-model.number="props.row.FechaAct">
              <q-input
                readonly
                @input="(e) => saved(e, props.row.FechaAct, props.row.id, 'FechaAct')"
                :value="props.row.FechaAct"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>

           <q-td key="stock" :props="props">
            <div v-if="props.row.stock && typeof props.row.stock[sede] !== 'undefined'"  class="text-pre-wrap" >{{ props.row.stock[sede] }}</div>
            <div v-else >0</div>
            <q-popup-edit :value="props.row.stock ? props.row.stock[sede] : 0">
              <q-input
                @input="(e) => saved(e, props.row.stock, props.row.id, `stock.${sede}`)"
                :value="props.row.stock ? props.row.stock[sede] : 0"
                dense
                autofocus
                type="number"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="price" :props="props">
            <div class="text-pre-wrap">{{ props.row.price }}</div>
            <q-popup-edit :value="props.row.price">
              <q-input
                @input="(e) => saved(e, props.row.price, props.row.id, 'price')"
                :value="props.row.price"
                dense
                autofocus
                type="number"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="extras" :props="props">
              <q-select
                filled
                :value="props.row.extras"
                @input="(e) => saved(e, props.row.extras, props.row.id, 'extras')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                @new-value="createValue"
                :options="listextras"
                @filter="filterFn"
                style="width: 250px"
                map-options
                emit-value
                stack-label
              />
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
        ></fbq-uploader>
    </q-dialog>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 80px; width: 100px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'min-width: 80px; width: 120px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'FechaAct', label: 'Fecha Activación', field: 'FechaAct' },
  { name: 'stock', align: 'center', label: 'Stock', field: 'stock' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price' },
  { name: 'extras', align: 'center', label: 'Extras', field: 'extras' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
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
      sede: null,
      columns,
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false
    }
  },
  created () {
    this.bindMenu()
    this.bindExtras()
    this.bindCategorias()
    this.bindLocalizations()
  },
  methods: {
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(this.sede)
      console.log({ key })
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindMenu', 'bindExtras', 'bindCategorias']),
    ...mapActions('localization', ['bindLocalizations']),
    delrow () {
      this.delrows({ payload: this.selected, collection: 'menu' })
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.menu.length}`
    },
    addrow () {
      this.addRow({ collection: 'menu' })
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
          this.filterOptions = this.listextras
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.listextras.filter(
            v => v.toLowerCase().indexOf(needle) > -1
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
