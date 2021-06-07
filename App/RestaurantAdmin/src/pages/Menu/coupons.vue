<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
    {{coupons}}
   <q-table
      style="border-radius: 28px"
      :dense="$q.screen.lt.md"
      :data="elcoupons"
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
      coupons
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
                  <q-item-label class="col-5 self-center">{{props.row.name  || 'Nuevo Cupón'}}</q-item-label>
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
          <q-item  :props="props">
                  <p class="text-bold">Incluir todos los productos</p>
                  <q-toggle
                      @input="(e) => {saved(e, props.row.includeAll, props.row.id, 'includeAll'); typeof props.row.includeAll === 'undefined' ? props.row.includeAll=true : props.row.includeAll=!props.row.includeAll}"
                      :value="props.row.includeAll ? true : false"
                      color="blue"
                    />
              </q-item>
          <q-item class="column items-start" key="name" :props="props">
            <div class="col-12 label-expand">Nombre</div>
              <q-input filled dense
              @input="(e) => saved(e.toUpperCase(), props.row.name, props.row.id, 'name')"
              v-model="props.row.name"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item class="column items-start" :props="props">
              <p>Tipo de Descuento</p>
              <div class="row">
             <q-radio v-model="props.row.isAmount" @input="(e) => saved(e, props.row.isAmount, props.row.id, 'isAmount')" :val="0" label="Porcentaje" />
             <q-radio v-model="props.row.isAmount" @input="(e) => saved(e, props.row.isAmount, props.row.id, 'isAmount')" :val="1" label="Monto" />
              </div>
          </q-item>
          <q-item v-if="props.row.isAmount === 0" class="column items-start" :props="props">
            <q-input filled dense
              @input="(e) => saved(parseFloat(e), props.row.discount, props.row.id, 'discount')"
              v-model.number="props.row.discount"
              rounded
              label="Descuento"
              suffix="%"
              type="number"
              outlined />
          </q-item>
          <q-item v-if="props.row.isAmount === 1" class="column items-start" :props="props">
            <q-input filled dense
              @input="(e) => saved(parseFloat(e), props.row.amount, props.row.id, 'amount')"
              v-model.number="props.row.amount"
              rounded
              label="Monto"
              suffix="$"
              type="number"
              outlined />
          </q-item>
          <q-item v-if="props.row.includeAll" class="column items-start" :props="props">
            <div class="col-12 label-expand">Excluir Categorias</div>
              <q-select filled dense
              v-if="props.row.exclude"
              @input="(e) => saved(e, props.row.exclude.categories, props.row.id, 'exclude.categories')"
              v-model="props.row.exclude.categories"
              map-options
              emit-value
              clearable
              @popup-show="filtering = categorias"
              @filter="filterFn"
              use-chips
              :options="categorias"
              multiple
              :option-label="e => e.name"
              :option-value="e => e.id"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item v-if="props.row.includeAll" class="column items-start" :props="props">
            <div class="col-12 label-expand">Excluir Productos</div>
              <q-select filled dense
              v-if="props.row.exclude"
              @input="(e) => saved(e, props.row.exclude.products, props.row.id, 'exclude.products')"
              v-model="props.row.exclude.products"
              map-options
              emit-value
              clearable
              use-chips
              :options="menu"
              multiple
              :option-label="e => e.name"
              :option-value="e => e.id"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
          <q-item v-if="!props.row.includeAll" class="column items-start" :props="props">
            <div class="col-12 label-expand">Incluir Categorias</div>
              <q-select filled dense
              v-if="props.row.include"
              @input="(e) => saved(e, props.row.include.categories, props.row.id, 'include.categories')"
              v-model="props.row.include.categories"
              map-options
              emit-value
              clearable
              use-chips
              :options="categorias"
              multiple
              :option-label="e => e.name"
              :option-value="e => e.id"
              rounded
              class="col-12 full-width"
              outlined />
          </q-item>
           <q-item v-if="!props.row.includeAll" class="column items-start" :props="props">
            <div class="col-12 label-expand">Incluir Productos</div>
              <q-select filled dense
              v-if="props.row.include"
              @input="(e) => saved(e, props.row.include.products, props.row.id, 'include.products')"
              v-model="props.row.include.products"
              map-options
              emit-value
              clearable
              use-chips
              :options="menu"
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
    <q-footer v-if="sede !== null && $q.screen.lt.sm" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps>
      <q-tab flat push no-caps icon="delete_outline" @click="softDelete"/>
      <q-tab flat push no-caps icon="add" @click="addrow"/>
    </q-tabs>
  </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'width: 175px;', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'exclude', align: 'center', label: 'exclude', field: 'exclude' },
  { name: 'estatus', align: 'center', label: 'estatus', field: 'estatus' },
  { name: 'discount', align: 'center', label: 'discount', field: 'discount' },
  { name: 'includeAll', align: 'center', label: 'includeAll', field: 'includeAll' },
  { name: 'include', align: 'center', label: 'include', field: 'include' },
  { name: 'amount', align: 'center', label: 'amount', field: 'amount' }
]
import { mapActions, mapGetters } from 'vuex'

// import ClientMenu from '../editor/components/client/pages/Menu/menu'
export default {
  components: {
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'groupComp', 'coupons']),
    ...mapGetters('user', ['currentUser']),
    filtered () {
      if (this.filtering === null) {
        return []
      }
      return this.filtering.map(x => x.name)
    },
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
    elcoupons: {
      get () {
        var sort = Array.from(this.couponsTemp)
        var sorted = sort.sort((a, b) => {
          return b.DateIn - a.DateIn
        })
        return sorted
      },
      set (e) {
        this.couponsTemp = e
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
      filtering: null,
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
      couponsTemp: []
    }
  },
  created () {
    this.bindMenu().then((e) => {
      this.menuTemp = JSON.parse(JSON.stringify(e))
    })
    this.bindCoupons().then((e) => {
      this.couponsTemp = JSON.parse(JSON.stringify(e))
      console.log({ e })
    })
    this.bindCategorias()
  },
  methods: {
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.stringOptions
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.stringOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
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
      this.saveTemp({ payload: { value, id, key }, collection: 'coupons' })
      // this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    saveTemp (temp) {
      if (typeof this.temp1[temp.collection] === 'undefined') {
        this.temp1[temp.collection] = {}
      }
      if (typeof this.temp1[temp.collection][temp.payload.id] === 'undefined') {
        this.temp1[temp.collection][temp.payload.id] = {}
      }
      if (temp.payload.key.includes('.')) {
        let keys = temp.payload.key.split('.')
        if (typeof this.temp1[temp.collection][temp.payload.id][keys[0]] === 'undefined') {
          this.temp1[temp.collection][temp.payload.id][keys[0]] = {}
        }
        this.temp1[temp.collection][temp.payload.id][keys[0]][keys[1]] = temp.payload.value
      } else {
        this.temp1[temp.collection][temp.payload.id][temp.payload.key] = temp.payload.value
      }
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
          this.couponsTemp = JSON.parse(JSON.stringify(this.coupons))
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
    ...mapActions('menu', ['setValue', 'setValue2', 'setMultiValue', 'newAddRow', 'bindMenu', 'bindCategorias', 'bindCoupons']),
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
          this.delrows({ payload: this.selected, collection: 'coupons' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.couponsTemp.findIndex(x => x.id === payload.payload[i].id)
        this.couponsTemp.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      // console.log(this.temp1)
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elcoupons.length}`
      return objSelectedString
    },
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.coupons === 'undefined') {
        this.temp1.coupons = {}
      }
      this.temp1.coupons[rand] = { id: rand, isNew: true, products: [], exclude: {}, include: {} }
      this.couponsTemp.unshift({ id: rand, isNew: true, products: [], exclude: {}, include: {} })
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
