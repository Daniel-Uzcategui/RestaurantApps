<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
      style="border-radius: 28px"
      :data="elitemGroup"
      :columns="columns"
      title="Opciones"
      :rows-per-page-options="[20, 30, 0]"
      row-key="id"
      grid
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      ref="table"
    >
    <template v-if="$q.screen.gt.xs || isDiag" v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Grupos de Opciones
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click.stop="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat color="white" no-caps push label="Agregar" icon="add" @click="createValue()"/>
          <q-btn flat color="white" no-caps push label="Eliminar" icon="delete_outline" @click="delrow"/>
        </q-btn-group>
      </template>
      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit
            :value="props.row.name"
            @show="() => showPopup(props.row, 'name')"
            >
              <q-input filled @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense  />
            </q-popup-edit>
          </q-td>

          <q-td key="descripcion" :props="props">
            <div v-html="props.row.descripcion"></div>
              <q-editor content-class="bg-blue-6"
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"

              />
          </q-td>

          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="group_id" :props="props">
              <q-select options-selected-class="text-blue" filled
                :value="props.row.group_id"
                @input="(e) => saved(e, props.row.group_id, props.row.id, 'group_id')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                @new-value="createValue"
                :options="filterOptions"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                @filter="filterFn"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
           <q-td key="priority" :props="props">
              <q-input filled @input="(e) => saved(e || 0, props.row.priority, props.row.id, 'priority')" type="number" :value="props.row.priority" dense  />
           </q-td>
           <q-td key="price" :props="props">
            <q-decimal style="width: 135px" :rules="[validate]"
            outlined
            @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                :value="props.row.price" input-style="text-align: right"></q-decimal>
          </q-td>
        </q-tr>
      </template> -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Nueva Opción'}}</q-item-label>
                </q-item-section>
                <!-- <q-item-section class="text-caption text-grey">
                  <q-icon
                    @click.stop="(e) => {saved(
                        typeof props.row.estatus === 'undefined' ? true : !props.row.estatus,
                          props.row.estatus, props.row.id,
                          `estatus`);
                        typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus
                        }"
                      :color="props.row.estatus ? 'blue' : 'red'"
                   style="min-width: 25px" class="col-1 self-center full-height" size="md" :name="props.row.estatus ? 'toggle_on' : 'toggle_off'" />
                </q-item-section> -->
                <!-- <q-item-section>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption> {{(props.row.price).toFixed(2)}}
                  </q-item-label>
                </q-item-section> -->
                <q-item-section side>
                <q-icon name="edit" @click.stop="props.expand = !props.expand" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
              <!-- <q-item>
                <div class="row full-width">
                <q-btn class="col-4 q-ma-xs" flat dense rounded no-caps color="blue" :label="item.name" v-for="(item, index) in findItemsonGroup(props.row.id)" :key="index">
                </q-btn>
                </div>
              </q-item> -->
        </q-list>
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
          <q-item class="column items-start" key="desc" :props="props">
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled
              @input="(e) => saved(e, props.row.name, props.row.id, 'name', 'itemGroup')"
              v-model="props.row.name"
              rounded
              outlined />
          </q-item>
           <q-item class="column items-start" key="groupComp" :props="props">
             <div class="label-expand full-width row justify-between">
               <div class="text-h6">Opciones</div>
               <q-btn
               rounded
                    label="Añadir"
                    color="blue"
                    no-caps
                    class="cursor-pointer"
                    @click.stop="opciones = true; propspass = props"
                  />
             </div>
             <q-list>
               <q-item v-for="(item, index) in findItemsonGroup(props.row.id)" :key="index">
                 <div>
                    <q-chip removable clickable @click="propspass = item; opcionesView = true" @remove="(e) => saved3(item, findItemsonGroup(props.row.id), props.row.id, 'group_id')" color="green"  icon="filter_frames">
                       {{item.name}}
                    </q-chip>
                 </div>
               </q-item>
             </q-list>
          </q-item>
          <q-item v-if="findItemsonGroup(props.row.id).length" class="column items-start">
             <div class="label-expand full-width row justify-between">
             <div class="text-h6">Configuración de Opciones</div>
               <q-btn
               rounded
                    label="Añadir"
                    color="blue"
                    no-caps
                    class="cursor-pointer"
                    @click.stop="opcionesconf = true; propspass = props.row"
                  />
             </div>
                <q-list>
               <q-item v-for="(item, index) in findConfsonGroup(props.row.id)" :key="index">
                 <div>
                    <q-chip removable clickable @click="propspass = item; opcionesconfView = true" @remove="(e) => saved3(item, findConfsonGroup(props.row.id), props.row.id, 'group_id', 'groupComp')" color="red"  icon="tune">
                       {{item.name}}
                    </q-chip>
                 </div>
               </q-item>
             </q-list>
          </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
    <q-dialog full-width v-model="opciones">
      <opciones v-if="opciones" :isDiagEasy="true" @updateOpt="(e) => {opciones = false; tempid = {id:e}}" />
    </q-dialog>
    <q-dialog full-width v-model="opcionesView">
      <opciones v-if="opcionesView" :isDiagEasy="true" :isDiagView="true" :itemsDiag="propspass" @updateOpt="(e) => {opcionesView = false}" />
    </q-dialog>
    <q-dialog full-width v-model="opcionesconf">
      <opcionesconf v-if="opcionesconf" :itemsDiag="propspass" :isDiagEasy="true" @updateOpt="(e) => {opcionesconf = false}" />
    </q-dialog>
    <q-dialog full-width v-model="opcionesconfView">
      <opcionesconf v-if="opcionesconfView" :isDiagEasy="true" :isDiagView="true" :itemsDiag="propspass" @updateOpt="(e) => {opcionesconfView = false}" />
    </q-dialog>
    <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Opciones</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar un opción a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-footer v-if="$q.screen.lt.md && !isDiag" style="z-index: 9999" reveal>
    <q-tabs class="bg-primary" dense mobile-arrows indicator-color="transparent" no-caps >
      <routetabmenu></routetabmenu>
      <q-tab flat color="white" no-caps push icon="add" @click="addrow"/>
          <q-tab flat color="white" no-caps push icon="delete_outline" @click="delrow"/>
   </q-tabs>
   </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 260px; width: 260px', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'right', label: 'Activar', field: 'estatus', style: 'min-width: 100px; width: 100px' },
  { name: 'group_id', style: 'min-width: 300px; width: 300px', align: 'center', label: 'Grupos', field: 'group_id' },
  { name: 'priority', style: 'min-width: 10px; width: 10px', align: 'left', label: 'Prioridad ', field: 'priority' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price', style: 'min-width: 135px; width: 135px' }
]

import { mapActions, mapGetters } from 'vuex'
import Routetabmenu from '../../components/navigation/routetabmenu.vue'
export default {
  computed: {
    ...mapGetters('menu', ['itemPlain', 'itemGroup', 'groupComp'])
  },
  components: {
    opciones: () => import('./options'),
    opcionesconf: () => import('./optionsConf'),
    Routetabmenu
  },
  props: {
    isDiag: {
      type: Boolean,
      default: () => false
    },
    isDiagView: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      opcionesconf: false,
      opcionesconfView: false,
      opcionesView: false,
      propspass: null,
      opciones: false,
      addopt: false,
      elGroup: [],
      tempid: null,
      elitem: [],
      elitemGroup: [],
      columns,
      selected: [],
      popupEditData: '',
      filterOptions: [],
      noSelect: false,
      temp1: {}
    }
  },
  watch: {
    itemPlain (e) {
      this.elitem = JSON.parse(JSON.stringify(e))
      this.filterOptions = JSON.parse(JSON.stringify(e))
      if (this.propspass !== null && this.tempid !== null) {
        this.saved2([...this.findItemsonGroup(this.propspass.row.id), this.tempid], this.findItemsonGroup(this.propspass.row.id), this.propspass.row.id, 'group_id')
        this.propspass = null
        this.tempid = null
      }
    },
    groupComp (e) {
      this.elGroup = JSON.parse(JSON.stringify(e))
    }
  },
  created () {
    this.bindItem().then((e) => {
      this.elitem = JSON.parse(JSON.stringify(e))
    })
    this.bindItemGroup().then((e) => {
      this.elitemGroup = JSON.parse(JSON.stringify(e))
      this.filterOptions = JSON.parse(JSON.stringify(e))
    })
    this.bindGroupComp().then(e => {
      this.elGroup = JSON.parse(JSON.stringify(e))
    })
    console.log({ it: this.elitemGroup })
  },
  mounted () {
    if (this.isDiagView) {
      this.tempid = this.itemsDiag.id
      this.temp1.item = {}
      this.temp1.item[this.tempid] = { ...this.itemsDiag }
      console.log(this.temp1)
      this.addopt = true
    }
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
    },
    // createValue (val, done) {
    //   if (val.length > 0) {
    //     if (!this.itemGroup.includes(val)) {
    //       this.addRow({ collection: 'itemGroup' })
    //         .then(x => { console.log(x); this.setValue({ payload: { value: val, id: x, key: 'name', estatus: 0 }, collection: 'itemGroup' }) })
    //     }
    //     done(val, 'toggle')
    //   }
    // },
    findItemsonGroup (groupId) {
      let items = this.elitem.filter((x) =>
        x && x.group_id && x.group_id.includes(groupId)
      )
      if (items) {
        return items.map(x => {
          return x
        })
      } else {
        return []
      }
    },
    findConfsonGroup (groupId) {
      let items = this.elGroup.filter((x) =>
        x && x.group_id && x.group_id.includes(groupId)
      )
      if (items) {
        return items.map(x => {
          return x
        })
      } else {
        return []
      }
    },
    async createValue () {
      if (Object.keys(this.temp1).length === 0) {
        this.$q.dialog({
          title: 'Crear Grupo',
          message: '¿Qué nombre desea para el nuevo grupo?',
          prompt: {
            model: '',
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(async val => {
          // /////
          if (val.length > 0) {
            if (!this.itemGroup.includes(val)) {
              let groupId = await this.addRow({ collection: 'itemGroup' })
              this.setMultiValue({ payload: { name: val, id: groupId, estatus: true }, collection: 'itemGroup' })
              let groupCompId = await this.addRow({ collection: 'groupComp' })
              this.setMultiValue({ payload: { name: val, id: groupCompId, group_id: groupId, estatus: true }, collection: 'groupComp' })
              if (groupId && groupCompId) {
                this.elGroup = JSON.parse(JSON.stringify(this.groupComp))
                this.elitemGroup = JSON.parse(JSON.stringify(this.itemGroup))
              }
            }
          }
          // /////
        })
      } else {
        this.$q.dialog({
          title: 'Crear Grupo',
          message: 'Por favor, primero guarde los cambios pendientes',
          cancel: true,
          persistent: true
        })
      }
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key, collection) {
      if (typeof collection === 'undefined') {
        collection = 'item'
      }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection })
    },
    saved2 (value, initialValue, id, key) {
      // let items = this.findItemsonGroup(id)
      // initialValue = JSON.parse(JSON.stringify(initialValue))
      // value = JSON.parse(JSON.stringify(value))
      console.log(value, 'Elvalue', initialValue, 'Initial', id)
      let toAdd = value.filter(x => {
        let ss = initialValue.find(j => j.id === x.id)
        if (ss) {
          return false
        } else {
          return true
        }
      })
      let toRemove = initialValue.filter(x => {
        let ss = value.find(j => j.id === x.id)
        if (ss) {
          return false
        } else {
          return true
        }
      })
      console.log(toAdd, 'toAdd')
      console.log(toRemove, 'toRemove')
      // let checker = (arr, target) => arr.includes(target)
      if (toAdd.length) {
        if (toAdd[0].group_id) {
          var val = [...toAdd[0].group_id, id]
        } else {
          val = [id]
        }
        this.saveTemp({ payload: { value: val, id: toAdd[0].id, key }, collection: 'item' })
        let elit = this.elitem.find(x => x.id === toAdd[0].id)
        elit.group_id = val
      }
      if (toRemove.length) {
        const index = toRemove[0].group_id.indexOf(id)
        if (index > -1) {
          toRemove[0].group_id.splice(index, 1)
        }
        let gg = toRemove[0].group_id
        toRemove[0].group_id = gg
        this.saveTemp({ payload: { value: toRemove[0].group_id, id: toRemove[0].id, key }, collection: 'item' })
        this.$forceUpdate()
      }
      // for (let item of items) {
      //   this.saveTemp({ payload: { value, id: item.id, key }, collection: 'item' })
      // }
    },
    saved3 (value, initialValue, id, key, collection) {
      if (typeof collection === 'undefined') {
        collection = 'item'
      }
      // let items = this.findItemsonGroup(id)
      // initialValue = JSON.parse(JSON.stringify(initialValue))
      // value = JSON.parse(JSON.stringify(value))
      console.log(value, 'Elvalue', initialValue, 'Initial', id)
      const index = value.group_id.indexOf(id)
      if (index > -1) {
        value.group_id.splice(index, 1)
      }
      this.saveTemp({ payload: { value: value.group_id, id: value.id, key }, collection: collection })
      // let gg = toRemove[0].group_id
      // toRemove[0].group_id = gg
      this.$forceUpdate()
      // for (let item of items) {
      //   this.saveTemp({ payload: { value, id: item.id, key }, collection: 'item' })
      // }
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
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue2', 'setValue', 'setMultiValue', 'addRow', 'newAddRow', 'bindItem', 'bindItemGroup', 'bindGroupComp']),
    delrow () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar Opciones',
          message: '¿Desea Eliminar la opción seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'itemGroup' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      console.log(payload, this.elitemGroup)
      for (let i in payload.payload) {
        let index = this.elitemGroup.findIndex(x => x.id === payload.payload[i].id)
        console.log(index)
        this.elitemGroup.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      this.$forceUpdate()
      console.log(this.elitemGroup)
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elitemGroup.length}`
      return objSelectedString
    },
    addrow (collection, data) {
      if (typeof collection === 'undefined') {
        collection = 'item'
      }
      if (typeof data === 'undefined') { data = {} }
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1[collection] === 'undefined') {
        this.temp1[collection] = {}
      }
      this.temp1[collection][rand] = { id: rand, isNew: true, descripcion: '', price: 0, ...data }
      if (collection === 'item') {
        this.elitem.unshift({ id: rand, descripcion: '', price: 0, ...data })
      } else {
        this.elitemGroup.unshift({ id: rand, descripcion: '', ...data })
      }
      console.log({ elitem: this.elitem, temp: this.temp1 })
      this.$forceUpdate()
    },
    filterFn (val, update) {
      update(() => {
        console.log({ val })
        if (val === '' || typeof val === 'undefined') {
          console.log({ val, it: this.item })
          this.filterOptions = Array.from(this.itemPlain)
        } else {
          console.log({ val })
          const needle = val.toLowerCase()
          this.filterOptions = this.itemPlain.filter(
            v => v.name.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
