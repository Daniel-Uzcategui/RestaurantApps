<template>
  <div :class="$q.screen.gt.xs ? 'q-pa-lg' : ''">
   <q-table
      :grid="$q.screen.lt.md"
      :dense="$q.screen.lt.md"
      :data="elmenu"
      :columns="columns"
      title="Catálogos"
      :rows-per-page-options="[]"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
    >
    <template v-slot:top-right>
      <q-toggle @input="(e) => saved3(e, menucfg.displayType, 'menu', 'displayType')" color="warning"
                :value="menucfg.displayType ? true : false" label="Tipo de Display" left-label />
      <q-input rounded outlines color="white" dark filled class="q-pr-md" @input="(e) => saved3(e, menucfg.iconsactive, 'menu', 'dispName')"
                :value="menucfg.dispName ? menucfg.dispName : 'Catálogo'" label="Nombre de display" />
      <q-toggle @input="(e) => saved3(e, menucfg.iconsactive, 'menu', 'iconsactive')" color="warning"
                :value="menucfg.iconsactive ? true : false" label="Activar iconos" left-label />
      <q-toggle @input="(e) => saved3(e, menucfg.menuactive, 'menu', 'menuactive')" color="warning"
                :value="menucfg.menuactive ? true : false" label="Mostrar en Menú" left-label />
      <div class="q-pa-md">
      <q-select rounded outlined
        bg-color="white"
        v-model="sede"
        :options="locList"
        style="width: 250px"
        behavior="menu"
        emit-value
        map-options
        stack-label
        label="Seleccionar Sede"
      />
      </div>
        <q-btn-group flat push v-if="sede !== null">
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="softDelete"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
        <q-tr v-if="sede !== null" :props="props">
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
              <q-input style="width: 200px"
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              :value="props.row.name"
              autofocus
              rounded
              outlined />
          </q-td>
          <q-td key="categoria" :props="props">
              <q-select rounded outlined
                :value="CatExists(props.row.categoria)"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="listcategorias"
                style="width: 250px"
                map-options
                emit-value
                stack-label
              />
          </q-td>
           <q-td key="groupComp" :props="props">
              <q-select rounded outlined
                :value="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                style="width: 250px"
                map-options
                emit-value
                stack-label
              />
          </q-td>
          <q-td auto-width >
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
       </q-tr>
        <q-tr v-show="props.expand" :props="props">
           <q-td><label class="label-expand">Descripción</label></q-td>
           <q-td colspan="100%" key="descripcion" :props="props">
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
                style="width: 450px"
              />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
           <q-td><label class="label-expand">Stock</label></q-td>
           <q-td colspan="100%" key="stock" :props="props">
               <q-input rounded outlined
                style="width: 100px"
                @input="(e) => saved(e, parseInt(props.row.stock), props.row.id, `stock.${sede}`)"
                :value="props.row.stock ? props.row.stock[sede] : 0"
                autofocus
                min="1" max="99999"
                type="number"
              />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Descuento</label></q-td>
          <q-td colspan="100%" key="discount" :props="props">
              <q-input rounded outlined
                style="width: 100px"
                @input="(e) => saved(e, parseInt(props.row.discount), props.row.id, 'discount')"
                :value="props.row.discount"
                autofocus
                label="%"
                min="0" max="100"
                type="number"
              />
          </q-td>
         </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Precio</label></q-td>
          <q-td colspan="100%" key="price" :props="props">
             <q-decimal style="width: 150px"
             :rules="[validate]"
             rounded
             outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
             :value="props.row.price"
             input-style="text-align: right">
             </q-decimal>
          </q-td>
        </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Prioridad</label></q-td>
          <q-td colspan="100%" key="priority" :props="props">
             <q-input style="width: 100px" rounded
             outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
             :value="props.row.priority"
             autofocus
             min="1" max="999"
             type="number">
             </q-input>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Display Type</label></q-td>
          <q-td colspan="100%" key="disptype" :props="props">
             <q-input
                style="width: 100px"
                rounded
                outlined
                @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)"
                :value="props.row.disptype ? props.row.disptype : 0"
                autofocus
                min="1" max="99999"
                type="number"
              />
          </q-td>
        </q-tr>
         <q-tr v-show="props.expand" :props="props">
          <q-td><label class="label-expand">Activar</label></q-td>
          <q-td  key="estatus" :props="props" >
              <q-toggle
                @input="(e) => saved(e, props.row.status, props.row.id, `estatus.${sede}`)"
                :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td colspan="100%" >
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div v-if="sede !== null" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card>
            <q-card-section>
             <q-list dense>
              <q-item>
                <q-item-section>
                  <q-checkbox dense v-model="props.selected" :label="props.row.name" />
                </q-item-section>
                <q-item-section side>
                  <q-icon v-ripple name="edit" @click="props.expand = !props.expand" />
                </q-item-section>
              </q-item>
            </q-list>
            </q-card-section>
            <q-separator />
            <q-list v-if="!props.expand" dense>
              <q-item>
                <q-item-section>
                  <div @click="showPhotoUpload(props.row.id)">
            <div v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm"  color="blue-grey-10" icon="fas fa-hamburger" font-size="50px" size="100px" text-color="white"></q-avatar></div>
            <div v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="100px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar></div>
                </div>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Precio</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption> {{(props.row.price).toFixed(2)}}
                  </q-item-label>
                </q-item-section>
              </q-item>
                            <q-item>
                <q-item-section>
                  <q-item-label>Categorias</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption>
                    <q-select rounded outlined
                :value="CatExists(props.row.categoria)"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="listcategorias"
                map-options
                emit-value
                stack-label
                readonly
              />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list v-if="props.expand">
          <q-item class="column items-center" key="photo" :props="props">
            <div class="text-center" @click="showPhotoUpload(props.row.id)">
            <div class=" column items-center" v-if="showDefaultPhoto(props.row.photo)">
                <q-avatar round class="q-mb-sm"  color="blue-grey-10" icon="fas fa-hamburger" font-size="50px" size="180px" text-color="white"></q-avatar><span class="text-caption text-blue-grey-10">Click para editar</span></div>
            <div class="column items-center" v-else>
                <q-avatar round class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(props.row.id)">
                    <q-img :src="props.row.photo"></q-img>
                </q-avatar><span class="text-blue-grey-10"><q-icon class="q-mr-sm" color="blue-grey-10" name="edit" size="16px"></q-icon>Click para editar</span></div>
                </div>
          </q-item>
          <q-item class="column items-center" key="desc" :props="props">
              <q-input
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              :value="props.row.name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-center" key="categoria" :props="props">
              <q-select rounded outlined
                :value="CatExists(props.row.categoria)"
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="listcategorias"
                map-options
                emit-value
                stack-label
              />
          </q-item>
           <q-item class="column items-center" key="groupComp" :props="props">
              <q-select rounded outlined
                :value="props.row.groupComp"
                @input="(e) => saved(e, props.row.groupComp, props.row.id, 'groupComp')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="groupComp"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                map-options
                emit-value
                stack-label
              />
          </q-item>
              <q-item class="column items-center" v-show="props.expand" :props="props">
                <q-td><label class="label-expand">Descripción</label></q-td>
                <q-td colspan="100%" key="descripcion" :props="props">
                    <q-editor
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      :value="props.row.descripcion"
                      min-height="5rem"
                      autofocus
                    />
                </q-td>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Stock</p>
                    <q-input
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.stock), props.row.id, `stock.${sede}`)"
                      :value="props.row.stock ? props.row.stock[sede] : 0"
                      min="1" max="99999"
                      type="number"
                    />
                  </div>
                  <div class="col-6 q-pa-xs">
                    <p class="text-bold">Descuento</p>
                    <q-input
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.discount), props.row.id, 'discount')"
                      :value="props.row.discount"
                      label="%"
                      min="0" max="100"
                      type="number"
                    />
                  </div>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Precio</p>
                  <q-decimal
                  :rules="[validate]"
                  rounded
                  outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                  :value="props.row.price"
                  input-style="text-align: right">
                  </q-decimal>
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  :value="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Tipo de Display</p>
                  <q-input
                      rounded
                      outlined
                      @input="(e) => saved(e, parseInt(props.row.disptype), props.row.id, `disptype`)"
                      :value="props.row.disptype ? props.row.disptype : 0"
                      min="1" max="99999"
                      type="number"
                    />
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Activar</p>
                  <q-toggle
                      @input="(e) => saved(e, props.row.status, props.row.id, `estatus.${sede}`)"
                      :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                      color="#3c8dbc"
                    />
                </div>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
        <fbq-uploader
          class="q-my-lg"
          label="Please Upload a Photo"
          :meta="meta"
          :prefixPath="prefixPath"
          @uploaded="uploadComplete"
          document='menu'
        />
    </q-dialog>
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
  </div>
</template>
<script>
const columns = [
  { name: 'photo', align: 'center', label: 'Foto', field: 'photo' },
  { name: 'desc', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria' },
  { name: 'groupComp', align: 'center', label: 'Opciones', field: 'groupComp' },
  { name: 'descripcion', align: 'left', field: 'descripcion' },
  { name: 'stock', align: 'center', field: 'stock' },
  { name: 'discount', align: 'center', field: 'discount' },
  { name: 'price', align: 'center', field: 'price' },
  { name: 'priority', align: 'center', field: 'priority' },
  { name: 'disptype', align: 'center', field: 'disptype' },
  { name: 'estatus', align: 'left', field: 'estatus' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'groupComp']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs']),
    menucfg () {
      let men = this.configs.find(e => e.id === 'menu')
      if (typeof men === 'undefined') {
        return { menuactive: true }
      }
      return this.configs.find(e => e.id === 'menu')
    },
    elmenu () {
      var sort = Array.from(this.menu)
      return sort.sort((a, b) => {
        return b.DateIn - a.DateIn
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
      sede: null,
      columns,
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      noSelect: false
    }
  },
  created () {
    this.bindMenu()
    this.bindCategorias()
    this.bindLocalizations()
    this.bindGroupComp()
    this.bindConfigs()
    console.log({ cat: this.categorias, gr: this.groupComp })
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
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
      console.log({ values })
      return values
    },
    resetPhotoType () {
      this.photoType = ''
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(this.sede)
      console.log({ key })
      if (key === 'discount') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) } else if (key === 'price') { value = parseFloat(value) } else if (key.includes('stock')) { value = parseInt(value) }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    saved3 (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue2({ payload: { value, id, key }, collection: 'config' })
    },
    saved2 (value, initialValue, id, key) {
      console.log({ key })
      if (value) { value = 1 } else { value = 0 }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'setValue2', 'addRow', 'delrows', 'bindMenu', 'bindCategorias', 'bindGroupComp']),
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
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elmenu.length}`
      return objSelectedString
    },
    addrow () {
      if (this.sede !== null) {
        this.addRow({ collection: 'menu' })
      }
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
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white
  .label-expand
    font-weight: bold
</style>
