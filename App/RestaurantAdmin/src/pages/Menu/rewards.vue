<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
      style="border-radius: 28px"
      :dense="$q.screen.lt.md"
      :data="elrewards"
      grid
      :columns="columns"
      :rows-per-page-options="[20, 30, 0]"
      row-key="id"
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
    >
    <template v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Rewards
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
      <div class="q-pa-md">
      </div>
          <q-btn flat push no-caps label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat push no-caps label="Eliminar" icon="delete_outline" @click="softDelete"/>
        <q-input filled dense  v-if="sede !== null" class="q-ma-md" style="min-width: 250px" v-model="searchBar" rounded outlined label="Buscar" >
          <template v-slot:prepend>
          <q-icon name="fas fa-search"/>
        </template>
        </q-input>
      </template>
    <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-m-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section class="column items-start" key="photo" :props="props">
                  <div class="row justify-between no-wrap full-width">
                  <q-item-label class="col-5 self-center">{{props.row.name  || 'Nueva Recompensa'}}</q-item-label>
                  <q-icon
                    @click.stop="(e) => {saved(
                        typeof props.row.estatus === 'undefined' ? true : !props.row.estatus,
                          props.row.estatus, props.row.id,
                          `estatus`);
                        typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus
                        }"
                      :color="props.row.estatus ? 'blue' : 'red'"
                   style="min-width: 25px" class="col-1 self-center full-height" size="md" :name="props.row.estatus ? 'toggle_on' : 'toggle_off'" />
                  <q-btn class="col-1 self-center" flat push rounded icon="edit" @click.stop="props.expand = !props.expand" />
                  </div>
                </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
              <q-item class="column items-center">
                <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
              </q-item>
          <q-item  :props="props">
                  <p class="text-bold">Activar</p>
                  <q-toggle
                      @input="(e) => {saved(e, props.row.estatus, props.row.id, 'estatus'); typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus}"
                      :value="props.row.estatus ? true : false"
                      color="blue"
                    />
              </q-item>
          <q-item class="column items-start" key="name" :props="props">
            <div class="col-12 label-expand">Nombre</div>
              <q-input filled dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              v-model="props.row.name"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item class="column items-start" key="quantity" :props="props">
            <div class="col-12 label-expand">Cantidad</div>
              <q-input filled dense
              @input="(e) => saved(parseInt(e), props.row.quantity, props.row.id, 'quantity')"
              v-model.number="props.row.quantity"
              rounded
              type="number"
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item class="column items-start" key="products" :props="props">
            <div class="col-12 label-expand">Productos</div>
              <q-select filled dense
              @input="(e) => saved(e, props.row.products, props.row.id, 'products')"
              v-model="props.row.products"
              map-options
              emit-value
              :options="elmenu"
              multiple
              :option-label="e => e.name"
              :option-value="e => e.id"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
              <q-item class="column items-center">
                <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar un producto a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-footer v-if="sede !== null && $q.screen.lt.md" style="z-index: 9999" reveal>
    <q-tabs class="bg-primary" dense mobile-arrows indicator-color="transparent" no-caps>
      <routetabmenu></routetabmenu>
      <q-tab flat push no-caps icon="delete_outline" @click="softDelete"/>
      <q-tab flat push no-caps icon="add" @click="addrow"/>
    </q-tabs>
  </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'width: 175px;', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'products', align: 'center', label: 'products', field: 'products' },
  { name: 'quantity', align: 'center', label: 'quantity', field: 'quantity' },
  { name: 'estatus', align: 'center', label: 'estatus', field: 'estatus' }
]
import { mapActions, mapGetters } from 'vuex'
import Routetabmenu from '../../components/navigation/routetabmenu.vue'

// import ClientMenu from '../editor/components/client/pages/Menu/menu'
export default {
  components: {
    Routetabmenu
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'groupComp', 'rewards']),
    ...mapGetters('user', ['currentUser']),
    menucfg () {
      let men = this.configs.find(e => e.id === 'menu')
      if (typeof men === 'undefined') {
        return { menuactive: true }
      }
      return this.configs.find(e => e.id === 'menu')
    },
    elmenu: {
      get () {
        var sort = Array.from(this.menuTemp)
        var sorted = sort.sort((a, b) => {
          return b.DateIn - a.DateIn
        })
        if (this.searchBar !== null && typeof this.searchBar !== 'undefined' && this.searchBar !== '') {
          var filteredMenu = sorted.filter(x => {
            return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
          })
          sorted = filteredMenu
        }
        if (this.category !== null) {
          return sorted.filter(x => {
            return x && x.categoria && x.categoria.includes(this.category)
          })
        }
        return sorted
      },
      set (e) {
        this.menuTemp = e
      }
    },
    elrewards: {
      get () {
        var sort = Array.from(this.rewardsTemp)
        var sorted = sort.sort((a, b) => {
          return b.DateIn - a.DateIn
        })
        return sorted
      },
      set (e) {
        this.rewardsTemp = e
      }
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
      if (!(this.currentUser && this.currentUser.id)) {
        return {
          id: '',
          photoType: this.photoType
        }
      }
      return {
        id: this.currentUser.id,
        photoType: this.photoType
      }
    }
  },
  data () {
    return {
      colorText: false,
      definitions: {
        color: {
          tip: 'Cambiar color de fuente',
          icon: 'palette',
          label: 'Color',
          handler: () => { this.colorText = true }
        },
        'tamaño': { cmd: 'color', param: 'red', icon: this.$q.iconSet.editor.size1 || this.$q.iconSet.editor.size, tip: this.$q.lang.editor.size1, htmlTip: `<font class="fontsize-42">${this.$q.lang.editor.size1}</font>` }
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'color'],
        [{
          label: this.$q.lang.editor.fontSize,
          icon: this.$q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7'
          ]
        }]
      ],
      showUploader: false,
      myCroppa: {},
      viewId: null,
      addoptView: false,
      propass: null,
      category: null,
      addopt: false,
      addopt2: false,
      tempOpt: null,
      addcat: false,
      preview: false,
      searchBar: '',
      menuTemp: [],
      amb: localStorage.getItem('amb'),
      sede: null,
      columns,
      temp1: {},
      selected: [],
      popupeditorData: '',
      photoType: '',
      photoProp: null,
      photoUpload: false,
      noSelect: false,
      rewardsTemp: []
    }
  },
  created () {
    this.bindMenu().then((e) => {
      this.menuTemp = JSON.parse(JSON.stringify(e))
    })
    this.bindRewards().then((e) => {
      this.rewardsTemp = JSON.parse(JSON.stringify(e))
    })
  },
  methods: {
    conss (e, y) {
      console.log(e, y)
    },
    validate (value) {
      return value >= 0 || 'error'
    },
    groupCompFilter () {
      if (this.propass.row.groupComp) {
        return this.groupComp.filter(x => {
          return !this.propass.row.groupComp.includes(x.id)
        })
      } else {
        return this.groupComp
      }
    },
    addNewOpts () {
      let props = this.propass
      props.row.groupComp = props.row.groupComp ? [...props.row.groupComp, ...this.tempOpt] : this.tempOpt
      this.saved(props.row.groupComp, props.row.groupComp, props.row.id, 'groupComp')
      this.tempOpt = null
    },
    getCompVal (id, val) {
      let group = this.groupComp.find(x => x.id === id)
      if (typeof group === 'undefined') {
        return 'Valor no encontrado'
      } else {
        let value = group[val]
        return value
      }
    },
    delCompVal (oldval, delval) {
      let index = oldval.findIndex(x => x === delval)
      oldval.splice(index, 1)
      return oldval
    },
    search () {
      if (this.selectedCat !== null) {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
        this.filteredMenu = this.filteredMenu.filter(x => {
          return x.categoria.includes(this.selectedCat.id)
        })
      } else {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
      }
    },
    CatExists (values) {
      let cat = this.plaincategorias
      if (typeof values === 'undefined') { return [] }
      for (let i in values) {
        var filter = cat.filter(x => x.id === values[i])
        if (filter.length === 0) {
          values.splice(i, 1)
        }
      }
      // console.log({ values })
      return values
    },
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupinsert_photoData = row[col]
    },
    saved (value, initialValue, id, key) {
      // console.log(this.temp1)
      // console.log({ key })
      if (key === 'discount') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) } else if (key === 'price') { value = parseFloat(value) }
      // else if (key.includes('stock')) { value = parseInt(value) }
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'rewards' })
      // this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    saveTemp (temp) {
      if (typeof this.temp1[temp.collection] === 'undefined') {
        this.temp1[temp.collection] = {}
      }
      if (typeof this.temp1[temp.collection][temp.payload.id] === 'undefined') {
        this.temp1[temp.collection][temp.payload.id] = {}
      }
      this.temp1[temp.collection][temp.payload.id][temp.payload.key] = temp.payload.value
      console.log({ temp1: this.temp1 })
      this.$forceUpdate()
    },
    saved3 (value, initialValue, id, key) {
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'config' })
    },
    saved2 (value, initialValue, id, key) {
      // console.log({ key })
      if (value) { value = 1 } else { value = 0 }
      // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'menu' })
    },
    async executeSave () {
      try {
        this.$q.loading.show({ message: 'Guardando los cambios' })
        let waitSaved = await this.asyncSave()
        if (waitSaved) {
          this.$q.notify({ message: 'Cambios Guardados', color: 'green' })
          this.temp1 = {}
          this.menuTemp = JSON.parse(JSON.stringify(this.menu))
          this.$forceUpdate()
        }
      } catch (error) {
        console.error(error)
        this.$q.notify({ message: 'Error guardando los cambios', color: 'red' })
      } finally {
        this.$q.loading.hide()
      }
    },
    async asyncSave () {
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          console.log(document, collection)
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            await this.newAddRow({ collection, data })
          } else {
            await this.setMultiValue({ payload: { id: document, ...this.temp1[collection][document] }, collection: collection })
          }
        }
      }
      return true
    },
    canceled (val, initialValue) {
      // console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'setValue2', 'setMultiValue', 'newAddRow', 'bindMenu', 'bindRewards']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindConfigs']),
    /* delrow () {
      this.delrows({ payload: this.selected, collection: 'menu' })
    }, */
    softDelete () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar producto',
          message: '¿Desea Eliminar el producto seleccionado ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'menu' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.menuTemp.findIndex(x => x.id === payload.payload[i].id)
        this.menuTemp.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      // console.log(this.temp1)
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elrewards.length}`
      return objSelectedString
    },
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.rewards === 'undefined') {
        this.temp1.rewards = {}
      }
      this.temp1.rewards[rand] = { id: rand, isNew: true, products: [] }
      this.rewardsTemp.unshift({ id: rand, isNew: true, products: [] })
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
      // console.log({ info })
      try {
        for (let i of info) {
          if (i.file.startsWith('small_')) {
            this.photoProp.photosmall = i.link
            this.saveTemp({ payload: { value: i.link, id: this.photoProp.id, key: 'photosmall' }, collection: 'menu' })
          } else {
            this.photoProp.photo = i.link
            this.saveTemp({ payload: { value: i.link, id: this.photoProp.id, key: 'photo' }, collection: 'menu' })
          }
        }
        let fileNames = []
        info.forEach(file => fileNames.push(file.file))
        this.photoUpload = false
        this.$q.notify({
          message: `Foto cargada exitosamente, recuerde guardar los cambios`,
          color: 'positive'
        })
        this.showUploader = false
      } catch (error) {
        this.showUploader = false
        console.error(error)
        this.$q.notify({
          message: `Oops hubo un error subiendo el archivo`,
          color: 'red'
        })
      }
    }
  }
}
</script>

<style lang="stylus">
  .label-expand
    font-weight: bold
  .croppa-container
    background-color: transparent
    border: 2px solid grey
    border-radius: 8px
 .croppa-container:hover
    opacity: 1
    background-color: #8ac9ef

</style>
