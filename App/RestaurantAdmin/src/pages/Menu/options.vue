<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
      v-if="!isDiagEasy"
      style="border-radius: 28px"
      :data="elitem"
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
      Opciones
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click.stop="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="secondary" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat color="white" no-caps push label="Agregar" icon="add" @click="addrow()"/>
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
          <q-item class="column items-start" key="desc" :props="props">
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              v-model="props.row.name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-start" key="estatus" :props="props">
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => {saved(e, props.row.estatus, props.row.id, 'estatus'); typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus}"
                :value="props.row.estatus ? true : false"
                color="blue"
              />
          </q-item>
           <q-item v-if="!isDiag" class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Grupos</label></q-td>
              <q-select options-selected-class="text-blue" filled
              bottom-slots
                rounded
                outlined
                v-model="props.row.group_id"
                @input="(e) => saved(e, props.row.group_id, props.row.id, 'group_id')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="filterOptions"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                @filter="filterFn"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              >
                <template v-slot:append>
                  <q-icon
                    name="add"
                    class="cursor-pointer"
                    @click="createValue()"
                  />
                </template>
              </q-select>
          </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col-12" key="descripcion" :props="props">
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                      min-height="5rem"
                    />
                </q-td>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Precio</p>
                  <q-decimal filled
                  :rules="[validate]"
                  rounded
                  outlined @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                  v-model="props.row.price"
                  input-style="text-align: right">
                  </q-decimal>
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input filled
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  v-model="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="addopt">
      <q-list v-if="addopt" class="q-diag-glassMorph">
          <q-item class="column items-start" key="desc" >
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled
              @input="(e) => saved(e, temp1.item[tempid].name, temp1.item[tempid].id, 'name')"
              v-model="temp1.item[tempid].name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-start" key="estatus" >
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => {temp1.item[tempid].estatus=!temp1.item[tempid].estatus; saved(e, temp1.item[tempid].estatus, temp1.item[tempid].id, 'estatus')}"
                v-model="temp1.item[tempid].estatus"
                color="blue"
              />
          </q-item>
              <q-item class="column items-start"  >
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col-12" key="descripcion" >
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, temp1.item[tempid].descripcion, temp1.item[tempid].id, 'descripcion')"
                      v-model="temp1.item[tempid].descripcion"
                      min-height="5rem"
                    />
                </q-td>
              </q-item>
              <q-item class="row justify-center"  >
                <div class="col-6 q-pa-xs">
                <p class="text-bold">Precio</p>
                  <q-decimal filled
                  :rules="[validate]"
                  rounded
                  outlined @input="(e) => saved(e, parseFloat(temp1.item[tempid].price), temp1.item[tempid].id, 'price')"
                  v-model="temp1.item[tempid].price"
                  input-style="text-align: right">
                  </q-decimal>
                </div>
                <div class="col-6 q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input filled
                  rounded
                  outlined @input="(e) => saved(e, parseInt(temp1.item[tempid].priority), temp1.item[tempid].id, 'priority')"
                  v-model="temp1.item[tempid].priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item>
                <div class="full-width column items-center">
                  <q-btn @click="addopt = false; executeSave()" label="Guardar" color="blue" rounded no-caps icon="save" />
                </div>
              </q-item>
            </q-list>
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
    <q-footer v-if="$q.screen.lt.sm && !isDiag" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
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
export default {
  computed: {
    ...mapGetters('menu', ['itemPlain', 'itemGroup'])
  },
  props: {
    isDiag: {
      type: Boolean,
      default: () => false
    },
    isDiagEasy: {
      type: Boolean,
      default: () => false
    },
    isDiagView: {
      type: Boolean,
      default: () => false
    },
    itemsDiag: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      addopt: false,
      elitem: [],
      tempid: null,
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
    itemGroup (e) {
      console.log({ e })
      this.filterOptions = JSON.parse(JSON.stringify(e))
    }
  },
  created () {
    if (!this.isDiagEasy) {
      this.bindItem().then((e) => {
        this.elitem = JSON.parse(JSON.stringify(e))
      })
      this.bindItemGroup().then((e) => {
        this.elitemGroup = JSON.parse(JSON.stringify(e))
        this.filterOptions = JSON.parse(JSON.stringify(e))
      })
    } else {
      this.elitem = JSON.parse(JSON.stringify(this.itemPlain))
      this.elitemGroup = JSON.parse(JSON.stringify(this.itemGroup))
      this.filterOptions = JSON.parse(JSON.stringify(this.itemGroup))
    }
    console.log({ it: this.elitemGroup })
  },
  mounted () {
    if (this.isDiagEasy && !this.isDiagView) {
      const id = this.addrow()
      this.tempid = id
      this.temp1.item[id].name = ''
      this.temp1.item[id].estatus = true
      console.log(this.temp1)
      this.addopt = true
    }
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
    createValue () {
      this.$q.dialog({
        title: 'Prompt',
        message: '¿Qué nombre desea para el nuevo grupo?',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(val => {
        // console.log('>>>> OK, received', data)
        if (val.length > 0) {
          if (!this.itemGroup.includes(val)) {
            this.addRow({ collection: 'itemGroup' })
              .then(x => { console.log(x); this.setValue({ payload: { value: val, id: x, key: 'name', estatus: 0 }, collection: 'itemGroup' }) })
          }
        }
      })
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'item' })
      this.$forceUpdate()
    },
    executeSave () {
      for (let collection in this.temp1) {
        for (let document in this.temp1[collection]) {
          if (this.temp1[collection][document].isNew) {
            let data = this.temp1[collection][document]
            delete data.isNew
            delete data.id
            this.newAddRow({ collection, data }).then(e => {
              this.$emit('updateOpt', e)
            })
          } else {
            for (let key in this.temp1[collection][document]) {
              var value = this.temp1[collection][document][key]
              console.log({ payload: { value, document, key }, collection: collection })
              this.setValue2({ payload: { value, id: document, key }, collection: collection })
            }
          }
        }
      }
      if (!this.isDiagEasy) {
        this.temp1 = {}
      }
      console.log(this.temp1, 'temp11111')
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
    saved2 (value, initialValue, id, key) {
      if (key === 'price') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) }
      this.saveTemp({ payload: { value, id, key }, collection: 'item' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue2', 'setValue', 'addRow', 'newAddRow', 'bindItem', 'bindItemGroup']),
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
          this.delrows({ payload: this.selected, collection: 'item' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      console.log(payload, this.elitem)
      for (let i in payload.payload) {
        let index = this.elitem.findIndex(x => x.id === payload.payload[i].id)
        console.log(index)
        this.elitem.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      this.$forceUpdate()
      console.log(this.elitem)
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.elitem.length}`
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
      return rand
    },
    filterFn (val, update) {
      update(() => {
        console.log({ val })
        if (val === '' || typeof val === 'undefined') {
          console.log({ val, it: this.itemGroup })
          this.filterOptions = Array.from(this.itemGroup)
        } else {
          console.log({ val })
          const needle = val.toLowerCase()
          this.filterOptions = this.itemGroup.filter(
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
