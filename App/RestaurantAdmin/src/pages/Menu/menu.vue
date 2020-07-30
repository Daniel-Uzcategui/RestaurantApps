<template>
  <div class="q-pa-md">
   <q-table
      :dense="$q.screen.lt.md"
      :data="elmenu"
      :columns="columns"
      title="Menu"
      :rows-per-page-options="[]"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
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
        label="Seleccione"
      />
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
            {{ props.row.name }}
            <q-popup-edit
            :value="props.row.name"
            @show="() => showPopup(props.row, 'name')"
            >
              <q-input @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="categoria" :props="props">
              <q-select
                filled
                :value="CatExists(props.row.categoria)"
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
           <q-td key="stock" :props="props">
              <q-input
                filled
                @input="(e) => saved(e, parseInt(props.row.stock), props.row.id, `stock.${sede}`)"
                :value="props.row.stock ? props.row.stock[sede] : 0"
                autofocus
                min="1" max="99999"
                type="number"
              />
          </q-td>
          <q-td key="discount" :props="props">
              <q-input
              filled
                @input="(e) => saved(e, parseInt(props.row.discount), props.row.id, 'discount')"
                :value="props.row.discount"
                dense
                autofocus
                label="%"
                min="0" max="100"
                type="number"
              />
          </q-td>
          <q-td key="price" :props="props">
            <q-input
              filled
                @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                :value="getNumberFormat(props.row.price,2,',','.')"
                dense
                autofocus
                label="Dos decimales"
                input-class="text-center"
              />
          </q-td>
          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved2(e, props.row.status, props.row.id, `estatus.${sede}`)"
                :value="props.row.estatus ? props.row.estatus[sede] ? true : false : false"
                color="#3c8dbc"
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
          document='menu'
        ></fbq-uploader>
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
  { name: 'desc', style: 'min-width: 80px; width: 100px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria' },
  { name: 'groupComp', align: 'center', label: 'Componentes', field: 'groupComp' },
  { name: 'descripcion', style: 'min-width: 80px; width: 120px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'stock', style: 'min-width: 80px; width: 120px', align: 'center', label: 'Stock', field: 'stock' },
  { name: 'discount', style: 'min-width: 80px; width: 120px', align: 'center', label: 'Descuento', field: 'discount' },
  { name: 'price', style: 'min-width: 150px; width: 200px', align: 'center', label: 'Precio', field: 'price' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' }
]
import { QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras', 'groupComp']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
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
  },
  methods: {
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
    saved2 (value, initialValue, id, key) {
      console.log({ key })
      if (value) { value = 1 } else { value = 0 }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'menu' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindMenu', 'bindCategorias', 'bindGroupComp']),
    ...mapActions('localization', ['bindLocalizations']),
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
    },
    getNumberFormat (number, decimals, decPoint, thousandsPoint) {
      if (number == null || !isFinite(number)) {
        // throw new TypeError('number is not valid')
        number = 0
      }

      if (!decimals) {
        var len = number.toString().split('.').length
        decimals = len > 1 ? len : 0
      }

      if (!decPoint) {
        decPoint = '.'
      }

      if (!thousandsPoint) {
        thousandsPoint = ','
      }

      number = parseFloat(number).toFixed(decimals)

      number = number.replace('.', decPoint)

      var splitNum = number.split(decPoint)
      splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsPoint)
      number = splitNum.join(decPoint)

      return number
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
