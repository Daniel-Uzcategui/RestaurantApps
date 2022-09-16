<template>
<div v-if="!isDiag" :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
  <!-- <q-card v-if="mapCat.length" class="column q-cardGlass">
    <vue2-org-tree  v-for="data in mapCat" :key="data.id" class="bg-transparent" :data="data" :props="{label: 'name', children:'subCat', expand: 'expand'}" collapsable :label-class-name="labelClass"
        :render-content="renderContent" @on-expand="onExpand" @on-node-click="onNodeClick"
        @on-node-drop="onNodeDrop"
        :horizontal="true"
        selected-class-name="selected-node" selected-key="selectedKey"/>
  </q-card> -->
   <q-card>
   <q-table
      grid
      :data="elcat"
      :columns="columns"
      title="Categorias"
      row-key="id"
      :selected-rows-label="getSelectedString"
      :rows-per-page-options="[20, 30, 0]"
      selection="single"
      dense
      flat
      rounded
      ref="table"
      style="border-radius: 28px;"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
    >
    <template v-if="$q.screen.gt.xs || isDiag" v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Categorías
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat push no-caps label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat push no-caps label="Eliminar" icon="delete_outline" @click="softDelete"/>
        </q-btn-group>
      </template>

      <template v-slot:item="props">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name : 'Nueva Categoría'}}</q-item-label>
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
                <q-item-section side>
                <q-icon name="edit" @click.stop="props.expand = !props.expand" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
          <q-dialog v-model="props.expand">
            <q-card class="q-pb-md q-pr-md">
              <q-list class="q-diag-glassMorph full-width">
                                <q-expansion-item
                    expand-separator
                    icon="settings"
                    label="Avanzado"
                  >
                      <q-item class="column items-start">
                          <p class="text-bold">Color de Fondo</p>
                      <q-color
                        default-value="#2B3742"
                        v-model="props.row.color"
                        default-view="palette"
                        :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                        @change="val => saved(val, props.row.color, props.row.id, 'color')"
                        style="max-width: 250px"
                        />
                    </q-item>
                    <q-item class="column items-start">
                          <p class="text-bold">Color de Texto</p>
                      <q-color
                        default-value="#2B3742"
                        v-model="props.row.textcolor"
                        default-view="palette"
                        :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                        @change="val => saved(val, props.row.textcolor, props.row.id, 'textcolor')"
                        style="max-width: 250px"
                        />
                    </q-item>
                    <q-item class="column items-start" key="priority" :props="props">
                       <p class="text-bold">Prioridad (número más bajo se muestra primero)</p>
                      <q-input filled dense rounded outlined @input="(e) => saved(e, props.row.priority, props.row.id, 'priority')" v-model="props.row.priority"  />
                  </q-item>
                  </q-expansion-item>
                  <q-item class="column items-start" key="desc" :props="props">
                    <p class="text-bold">Nombre</p>
                      <q-input filled dense rounded outlined @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
                        v-model="props.row.name"
                        />
                  </q-item>
                  <q-item class="column items-start" key="estatus" :props="props">
                      <q-toggle
                        label="Estatus"
                        @input="(e) => {saved(e, props.row.estatus, props.row.id, 'estatus'); typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus}"
                        :value="props.row.estatus ? true : false"
                        color="blue"
                      />
                  </q-item>
                  <q-expansion-item
                    expand-separator
                    icon="category"
                    label="Sub Categorías"
                    default-opened
                  >
                  <template v-slot:header>

                    <q-item-section>
                      Sub Categorías
                    </q-item-section>

                    <q-item-section side>
                      <div class="row items-center">
                        <q-btn-group push>
                        <!-- <q-btn color="red" rounded label="Borrar" /> -->
                       <q-btn color="blue" rounded label="Añadir" @click.stop="addSubCat(props.row)" />
                        </q-btn-group>
                      </div>
                    </q-item-section>
                  </template>
                  <div v-if="props.row.subCat">
                  <subcatlist class="q-ml-md" v-for="(sub, index) in Object.keys(props.row.subCat)" :key="index" :id="props.row.id" :subCat="props.row.subCat[sub]" @subCat="(e) => saved(e, props.row.subCat[sub], props.row.id, 'subCat.' + sub)" />
                  </div>
                  </q-expansion-item>
              </q-list>
            </q-card>
          </q-dialog>
          </q-list>
      </template>
    </q-table>
  </q-card>
  <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar categoria</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar una Categoria a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-footer v-if="$q.screen.lt.md && !isDiag" style="z-index:9999" reveal>
   <q-tabs  class="bg-primary" dense mobile-arrows indicator-color="transparent" no-caps >
    <routetabmenu></routetabmenu>
     <q-tab flat  push no-caps label="Agregar" stack icon="add" @click="addrow"/>
      <q-tab flat push no-caps label="Borrar" stack icon="delete_outline" @click="softDelete"/>
   </q-tabs>
 </q-footer>
 <q-dialog v-model="editCategory">
            <q-list class="q-diag-glassMorph full-width">
              <q-expansion-item
                  expand-separator
                  icon="settings"
                  label="Avanzado"
                >
                    <q-item class="column items-start">
                        <p class="text-bold">Color de Fondo</p>
                    <q-color
                      default-value="#2B3742"
                      v-model="catHolder.color"
                      default-view="palette"
                      :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                      style="max-width: 250px"
                      />
                  </q-item>
                  <q-item class="column items-start">
                        <p class="text-bold">Color de Texto</p>
                    <q-color
                      default-value="#2B3742"
                      v-model="catHolder.textcolor"
                      default-view="palette"
                      :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                      @change="val => { catHolder.textcolor = val }"
                      style="max-width: 250px"
                      />
                  </q-item>
                  <q-item class="column items-start" key="priority" >
                     <p class="text-bold">Prioridad (número más bajo se muestra primero)</p>
                    <q-input filled dense rounded outlined v-model="catHolder.priority"  />
                </q-item>
                </q-expansion-item>
                <q-item class="column items-start" key="desc" >
                  <p class="text-bold">Nombre</p>
                    <q-input filled dense rounded outlined
                      v-model="catHolder.name"
                      />
                </q-item>
                <q-item class="column items-start" key="estatus" >
                    <q-toggle
                      label="Estatus"
                      @input="(e) => { typeof catHolder.estatus === 'undefined' ? catHolder = Object.assign({},catHolder,{estatus:true}) : catHolder = Object.assign({},catHolder,{estatus:!catHolder.estatus})}"
                      :value="catHolder.estatus ? true : false"
                      color="blue"
                    />
                </q-item>
                 <q-btn color="white" text-color="black" label="Guardar" @click="saveCatHolder" />
            </q-list>
 </q-dialog>
 </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'width: 150px;', align: 'center', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'max-width: 250px;', align: 'center', label: 'Descripción', field: 'descripcion' },
  { name: 'color', align: 'center', label: 'Color de fondo', field: 'color' },
  { name: 'textcolor', align: 'center', label: 'Color del texto ', field: 'textcolor' },
  { name: 'subCat', align: 'center', label: 'subCat', field: 'subCat' },
  { name: 'priority', style: 'min-width: 10px; width: 10px', align: 'center', label: 'Prioridad ', field: 'priority' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' }
]

import { mapActions, mapGetters } from 'vuex'
import subcatlist from '../../components/menu/categorias/subcatlist.vue'
import Vue2OrgTree from 'vue2-org-tree'
import Contextmenucat from '../../components/menu/categorias/contextmenucat.vue'
import Routetabmenu from '../../components/navigation/routetabmenu.vue'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { subcatlist, Vue2OrgTree, Contextmenucat, Routetabmenu },
  computed: {
    ...mapGetters('menu', ['categorias']),
    catHolderCopy () {
      return JSON.parse(JSON.stringify(this.catHolder))
    }
  },
  props: {
    isDiag: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      // mapCat: [],
      editCategory: false,
      elcat: [],
      temp1: {},
      catHolder: {},
      columns,
      selected: [],
      noSelect: false,
      popupEditData: ''
    }
  },
  mounted () {
    this.bindCategorias().then((e) => {
      this.elcat = JSON.parse(JSON.stringify(e))
      // console.log(e, 'cats')
    })
    // console.log(this.$router)
    if (this.isDiag) {
      this.showprompt()
    }
  },
  watch: {
    // mapCat (e) {
    //   // console.log(e, 'mapcat')
    // },
    catHolderCopy: {
      handler (e, olde) {
        let newHold = JSON.parse(JSON.stringify(e))
        let oldHold = JSON.parse(JSON.stringify(olde))
        console.log(newHold, oldHold, '<= rowrow')
        if (typeof e.id === 'undefined') {
          return
        }
        delete newHold.expand
        delete newHold.selectedKey
        delete newHold.subCat
        delete newHold.DateIn
        delete newHold.isTrusted
        let id = newHold.refid || newHold.id
        if (newHold.ref) {
          return this.saved(newHold, null, id, newHold.ref)
        }
        for (let key of Object.keys(newHold)) {
          if (newHold[key] !== oldHold[key]) {
            console.log(newHold[key], null, id, key, 'QUE VERGA')
            return this.saved(newHold, null, id, newHold.ref)
          }
        }
      },
      deep: true
    },
    // elcat (e) {
    //   this.mapCat = []
    //   e.forEach(x => {
    //     if (x.subCat) {
    //       let subCat = this.convertToArray(x.subCat, x.id)
    //       let obj = { ...x, expand: true, subCat }
    //       // this.$set(obj, 'subCat', subCat)
    //       this.mapCat.push(obj)
    //     } else {
    //       this.mapCat.push({ ...x, subCat: [], expand: true })
    //     }
    //   })
    //   console.log(this.mapCat, 'mapcat')
    // },
    categorias (e) {
      this.elcat = JSON.parse(JSON.stringify(e))
    }
  },
  methods: {
    // convertToArray (sub, id, subCatid) {
    //   let refid = id
    //   let newArray = []
    //   let subKeys = Object.keys(sub)
    //   // let num = 0
    //   for (let i of subKeys) {
    //     let ref = 'subCat.' + i
    //     if (subCatid) {
    //       ref = subCatid + '.' + i
    //     }
    //     let prepare = sub[i]
    //     if (prepare.subCat) {
    //       sub[i].subCat = this.convertToArray(sub[i].subCat, refid, ref)
    //       // this.$set(sub[i], 'subCat', this.convertToArray(sub[i].subCat, refid, ref))
    //     } else {
    //       sub[i].subCat = []
    //     }
    //     if (!sub[i].softDelete) {
    //       newArray.push({ ...sub[i], refid, ref, expand: true })
    //       // num++
    //     }
    //   }
    //   return newArray
    // },
    // labelClass (data) {
    //   let color = 'blue'
    //   if (data.ref) {
    //     let num = parseInt(data.ref.split('.').length) + 1
    //     if (num > 14) {
    //       num = num - 12
    //     }
    //     color = color + '-' + num
    //   }
    //   return 'bg_node bg-' + color
    // },
    // renderContent (h, data) {
    //   return h(Contextmenucat, {
    //     on: {
    //       add: (event) => {
    //         // console.log(event, data)
    //         this.addSubCat(data, data.refid, data.ref)
    //       },
    //       editar: (event) => {
    //         this.onNodeClick(event, data)
    //       },
    //       delete: (event) => {
    //         // console.log(event)
    //         this.onNodeDelete(event, data)
    //       }
    //     },
    //     props: {
    //       label: data.name
    //     }
    //   })
    // },
    // onExpand (e, data) {
    //   if ('expand' in data) {
    //     data.expand = !data.expand
    //     if (!data.expand && data.subCat) {
    //       this.collapse(data.subCat)
    //     }
    //   } else {
    //     this.$set(data, 'expand', true)
    //   }
    // },
    // collapse (nodes) {
    //   // console.log(nodes, 'NODES')
    //   nodes.forEach(node => {
    //     if (node.expand) {
    //       node.expand = false
    //     }

    //     node.subCat && this.collapse(node.subCat)
    //   })
    // },
    // onNodeDelete (e, data) {
    //   this.$q.dialog({
    //     message: '¿Está seguro que desea eliminar a ' + data.name + '?'
    //   }).onOk(() => {
    //     this.catHolder = data
    //     this.catHolder.softDelete = 1
    //     this.saveCatHolder()
    //   })
    // },
    // onNodeClick (e, data) {
    //   console.log('CLICK', data)
    //   this.editCategory = true
    //   this.catHolder = data
    //   this.$set(data, 'selectedKey', !data['selectedKey'])
    // },
    // onNodeMouseOver (e, data) {
    //   // console.log('MOUSE OVER', e, data)
    // },
    // onNodeMouseOut (e, data) {
    //   // console.log('MOUSE OUT', e)
    // },
    // onNodeDrop (e, drag, drop) {
    //   // console.log('DROP', e)
    //   // console.log('drag:', drag)
    //   // console.log('drop:', drop)
    //   let f = drag.name
    //   let g = drop.name
    //   drag.name = g
    //   drop.name = f
    // },
    // consoleame (e) {
    //   // console.log(e, 'he')
    // },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    showprompt () {
      this.$q.dialog({
        title: '',
        message: '¿Qué Nombre desea para la nueva Categoría?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // // console.log('>>>> OK, received', data)
        if (data.length > 0) {
          this.addrow({ name: data, estatus: true, softDelete: 0 })
          this.executeSave()
        }
      })
    },
    // saved (value, initialValue, id, key) {
    //   // console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
    //   this.setValue({ payload: { value, id, key }, collection: 'categorias' })
    // },
    saveCatHolder () {
      let flat = JSON.parse(JSON.stringify(this.catHolder))
      delete flat.subCat
      delete flat.expand
      delete flat.selectedKey
      this.saved(this.catHolder, null, this.catHolder.refid, this.catHolder.ref)
      this.catHolder = {}
      this.executeSave()
      this.editCategory = false
    },
    saved (value, initialValue, id, key) {
      this.saveTemp({ payload: { value, id, key }, collection: 'categorias' })
    },
    executeSave () {
      // console.log(JSON.stringify(this.temp1), 'culprit')
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            this.newAddRow({ collection, data })
          } else {
            let arr = []
            for (let key in this.temp1[collection][document]) {
              var value = this.temp1[collection][document][key]
              arr.push({ payload: { value, id: document, key }, collection: collection })
              this.setValue({ payload: { value, id: document, key }, collection: collection })
            }
            arr = arr.sort((a, b) => a.payload.key.length - b.payload.key.length)
            for (let i in arr) {
              console.log(arr[i], '<= arrlength')
              this.setValue(arr[i])
            }
          }
        }
      }
      this.temp1 = {}
      this.$q.notify({ message: 'Cambios Guardados' })
    },
    saveTemp (temp) {
      console.log('SaveTemp =>', temp)
      if (typeof this.temp1[temp.collection] === 'undefined') {
        // this.temp1 = Object.assign({}, this.temp1, { [temp.collection]: {} })
        this.$set(this.temp1, temp.collection, {})
      }
      if (typeof this.temp1[temp.collection][temp.payload.id] === 'undefined') {
        // this.temp1[temp.collection] = Object.assign({}, this.temp1[temp.collection], { [temp.payload.id]: {} })
        this.$set(this.temp1[temp.collection], temp.payload.id, {})
      }
      if (Array.isArray(temp.payload.value.subCat)) {
        delete temp.payload.value.subCat
      }
      this.$set(this.temp1[temp.collection][temp.payload.id], temp.payload.key, temp.payload.value)
      // this.temp1[temp.collection][temp.payload.id][temp.payload.key] = temp.payload.value
      // this.temp1 = Object.assign({}, this.temp1, { [temp.collection]: { [temp.payload.id]: { [temp.payload.key]: temp.payload.value, ...[temp.payload.id] } } })
      console.log('Savetemp =>', this.temp1)
    },
    canceled (val, initialValue) {
      // console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'newAddRow', 'bindCategorias', 'createId']),
    async addSubCat (row, refid, ref) {
      // console.log(row, 'asdasd')
      console.log(row, 'row')
      let newId = await this.createId('categorias')
      let id = row.id
      if (refid) {
        id = refid
      }
      let newref = 'subCat.' + newId
      if (ref) {
        newref = ref + '.subCat.' + newId
      }
      let val = {
        id: newId,
        name: 'Nueva Categoría',
        estatus: true,
        refid: id,
        ref: newref,
        expand: true,
        softDelete: 0,
        subCat: {}
      }
      if (typeof row.subCat === 'undefined') {
        this.$set(row, 'subCat', {})
      }
      this.$set(row, 'subCat', { ...row.subCat, [newId]: val })
      // row.subCat.push(val)
      if (newref.split('.').length === 2) {
        newref = 'subCat'
        val = { ...row.subCat, [newId]: val }
      }
      this.saved(val, row, id, newref)
      // console.log(row, '<=')
      // this.executeSave(newId)
      // this.elcat = [ ...this.elcat ]
      // let index = this.elcat.findIndex(x => x.id === id)
      // this.elcat.splice(index, 1, Object.assign({}, this.elcat[index]))
      // this.$forceUpdate()
      // this.mapCat = Object.assign({}, this.mapCat)
    },
    /* delrow () {
      this.delrows({ payload: this.selected, collection: 'categorias' })
    }, */
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (let i in payload.payload) {
        let index = this.elcat.findIndex(x => x.id === payload.payload[i].id)
        this.elcat.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
    },
    softDelete () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar Categoría',
          message: '¿Desea Eliminar la categoría seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'categorias' })
        }).onCancel(() => {
        })
      }
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.categorias.length}`
      return objSelectedString
    },
    async addrow (data) {
      if (typeof data === 'undefined') {
        data = {}
      }
      let newId = await this.createId('categorias')
      if (typeof this.temp1.categorias === 'undefined') {
        this.temp1.categorias = {}
      }
      this.temp1.categorias[newId] = { id: newId, isNew: true, descripcion: '', name: 'Nueva Categoría', ...data, estatus: true }
      this.elcat.unshift({ id: newId, descripcion: '', name: 'Nueva Categoría', ...data, estatus: true })
      this.$forceUpdate()
    }
  }
}
</script>
<style>
/* .org-tree-container{display:inline-block;padding:15px;background-color:#fff}.org-tree{display:table;text-align:center}.org-tree:after,.org-tree:before{content:"";display:table}.org-tree:after{clear:both}.org-tree-node,.org-tree-node-children{position:relative;margin:0;padding:0;list-style-type:none}.org-tree-node-children:after,.org-tree-node-children:before,.org-tree-node:after,.org-tree-node:before{transition:all .35s}.org-tree-node-label{position:relative;display:inline-block}.org-tree-node-label .org-tree-node-label-inner{padding:10px 15px;text-align:center;border-radius:3px;box-shadow:0 1px 5px rgba(0,0,0,.15)}.org-tree-node-btn{position:absolute;top:100%;left:50%;width:20px;height:20px;z-index:10;margin-left:-11px;margin-top:9px;background-color:#fff;border:1px solid #ccc;border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.15);cursor:pointer;transition:all .35s ease}.org-tree-node-btn:hover{background-color:#e7e8e9;-webkit-transform:scale(1.15);transform:scale(1.15)}.org-tree-node-btn:after,.org-tree-node-btn:before{content:"";position:absolute}.org-tree-node-btn:before{top:50%;left:4px;right:4px;height:0;border-top:1px solid #ccc}.org-tree-node-btn:after{top:4px;left:50%;bottom:4px;width:0;border-left:1px solid #ccc}.org-tree-node-btn.expanded:after{border:none}.org-tree-node{padding-top:20px;display:table-cell;vertical-align:top}.org-tree-node.collapsed,.org-tree-node.is-leaf{padding-left:10px;padding-right:10px}.org-tree-node:after,.org-tree-node:before{content:"";position:absolute;top:0;left:0;width:50%;height:19px}.org-tree-node:after{left:50%;border-left:1px solid #ddd}.org-tree-node:not(:first-child):before,.org-tree-node:not(:last-child):after{border-top:1px solid #ddd}.collapsable .org-tree-node.collapsed{padding-bottom:30px}.collapsable .org-tree-node.collapsed .org-tree-node-label:after{content:"";position:absolute;top:100%;left:0;width:50%;height:20px;border-right:1px solid #ddd}.org-tree>.org-tree-node{padding-top:0}.org-tree>.org-tree-node:after{border-left:0}.org-tree-node-children{padding-top:20px;display:table}.org-tree-node-children:before{content:"";position:absolute;top:0;left:50%;width:0;height:20px;border-left:1px solid #ddd}.org-tree-node-children:after{content:"";display:table;clear:both}.horizontal .org-tree-node{display:table-cell;float:none;padding-top:0;padding-left:20px}.horizontal .org-tree-node.collapsed,.horizontal .org-tree-node.is-leaf{padding-top:10px;padding-bottom:10px}.horizontal .org-tree-node:after,.horizontal .org-tree-node:before{width:19px;height:50%}.horizontal .org-tree-node:after{top:50%;left:0;border-left:0}.horizontal .org-tree-node:only-child:before{top:1px;border-bottom:1px solid #ddd}.horizontal .org-tree-node:not(:first-child):before,.horizontal .org-tree-node:not(:last-child):after{border-top:0;border-left:1px solid #ddd}.horizontal .org-tree-node:not(:only-child):after{border-top:1px solid #ddd}.horizontal .org-tree-node .org-tree-node-inner{display:table}.horizontal .org-tree-node-label{display:table-cell;vertical-align:middle}.horizontal.collapsable .org-tree-node.collapsed{padding-right:30px}.horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after{top:0;left:100%;width:20px;height:50%;border-right:0;border-bottom:1px solid #ddd}.horizontal .org-tree-node-btn{top:50%;left:100%;margin-top:-11px;margin-left:9px}.horizontal>.org-tree-node:only-child:before{border-bottom:0}.horizontal .org-tree-node-children{display:table-cell;padding-top:0;padding-left:20px}.horizontal .org-tree-node-children:before{top:50%;left:0;width:20px;height:0;border-left:0;border-top:1px solid #ddd}.horizontal .org-tree-node-children:after{display:none}.horizontal .org-tree-node-children>.org-tree-node{display:block} */
/*# sourceMappingURL=style.css.map */
</style>
