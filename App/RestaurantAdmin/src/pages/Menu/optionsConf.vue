<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
   style="border-radius: 28px;"
      dense
      v-if="!isDiagEasy"
      grid
      :data="elGroup"
      :columns="columns"
      title="Configuración de Opciones"
      :rows-per-page-options="[5,20,30,50,0]"
      row-key="id"
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-if="$q.screen.gt.xs || isDiag" v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Configuración de Opciones
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="blue" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat  no-caps push label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat  no-caps push label="Eliminar" icon="delete_outline" @click="delrow"/>
        </q-btn-group>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width>
            Vista Previa
          </q-th>
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Nueva Config'}}</q-item-label>
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
            <q-td><label class="label-expand">Nombre de la Configuración (Este es el título que verá el cliente para las opciones)</label></q-td>
              <q-input filled dense
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
          <q-item class="column items-start" key="required" :props="props">
             <q-td><label class="label-expand">La opción es obligatoria?</label></q-td>
             <div class="row">
              <q-radio color="blue" v-model="props.row.required" :val="1" label="Si" />
              <q-radio color="blue" v-model="props.row.required" :val="0" label="No" />
             </div>
          </q-item>
          <q-item class="column items-start" key="group_id" :props="props">
             <q-td><label class="label-expand">Grupo a asociar a esta Configuración</label></q-td>
              <q-select options-selected-class="text-blue" filled dense
                rounded outlined
                v-model="props.row.group_id"
                @input="(e) => saved(e, props.row.group_id, props.row.id, 'group_id')"
                use-input
                use-chips
                input-debounce="0"
                :options="filterOptions === '' ? [] : filterOptions"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.id"
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
                    @click.stop="opcionesGroup = true"
                  />
                </template>
              </q-select>
          </q-item>
          <q-item class="column items-start" key="group_id2" :props="props">
             <div class="label-expand">Opciones en el grupo
               <!-- <q-icon name="add" @click="addopt = !addopt" /> -->
             </div>
              <itemcomp
              :elitempass="elitempass"
                :comp="[props.row]"
                :value="value"
                :readOnly="true"
              />
          </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col-12" key="descripcion" :props="props">
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                    />
                </q-td>
              </q-item>
              <q-item class="row justify-center" v-show="props.expand" :props="props">
                <div class="col q-pa-xs">
                  <p class="text-bold">Prioridad</p>
                  <q-input filled dense
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  v-model="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Tipo</label></q-td>
              <q-td key="type" :props="props">
              <q-select options-selected-class="text-blue" filled dense
                rounded outlined
                v-model="props.row.type"
                @input="(e) => saved2(e, props.row.type, props.row.id, 'type')"
                use-input
                input-debounce="0"
                :options="typeOpts === '' ? [] : typeOpts"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Gratis</label></q-td>
          <q-td key="free" :props="props">
            <div class="row">
              <q-radio color="blue" v-model="props.row.free" :val="1" label="Si" />
              <q-radio color="blue" v-model="props.row.free" :val="0" label="No" />
             </div>
          </q-td>
          </q-item>
          <q-item v-if="props.row.type !== 1" class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Min</label></q-td>
          <q-td key="min" :props="props">
            <q-input filled rounded outlined @input="(e) => saved2(e, props.row.min, props.row.id, 'min')" type="number" v-model="props.row.min" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-if="props.row.type !== 1" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Max</label></q-td>
          <q-td key="max" :props="props">
            <q-input type="number" filled rounded outlined @input="(e) => saved2(e, props.row.max, props.row.id, 'max')" v-model="props.row.max" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-if="props.row.type == 2" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Max Unidades</label></q-td>
          <q-td key="maxUnit" :props="props">
            <q-input filled rounded outlined @input="(e) => saved2(e, props.row.maxUnit, props.row.id, 'maxUnit')" v-model="props.row.maxUnit" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Vista previa (disponible luego de seleccionar el tipo)</label></q-td>
            <q-card style="max-width: 400px" class="text-left">
              <q-card-section>
                <itemcomp
                :elitempass="elitempass"
                :comp="[props.row]"
                :value="value"
                :readOnly="false"
              />
              </q-card-section>
              </q-card>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
    <q-dialog full-width v-model="opcionesGroup">
      <opcionesGroup :isDiag="true"/>
    </q-dialog>
    <q-dialog v-model="noSelect">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Eliminar Configuración de Opciones</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-space />
       <q-card-section>
          Debe seleccionar una Configuración de Opción a Eliminar
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
     v-model="addopt"
      full-width
      >
      <AddOpt :isDiag="true"  />
    </q-dialog>
    <div class="bg-transparent" v-if="opcionesConf">
            <q-list v-if="isDiagEasy && opcionesConf">
          <q-item class="column items-start" key="desc" >
            <q-td><label class="label-expand">Nombre (Este es el título que verá el cliente para las opciones)</label></q-td>
              <q-input filled dense
              @input="(e) => saved(e, temp1.groupComp[tempid].name, temp1.groupComp[tempid].id, 'name')"
              v-model="temp1.groupComp[tempid].name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-start" key="estatus" >
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => {temp1.groupComp[tempid].estatus=!temp1.groupComp[tempid].estatus; saved(e, temp1.groupComp[tempid].estatus, temp1.groupComp[tempid].id, 'estatus')}"
                v-model="temp1.groupComp[tempid].estatus"
                color="blue"
              />
          </q-item>
          <q-item class="column items-start" key="required" >
             <q-td><label class="label-expand">Requerido</label></q-td>
             <div class="row">
              <q-radio color="blue" @input="$forceUpdate()" v-model="temp1.groupComp[tempid].required" :val="1" label="Si" />
              <q-radio color="blue" @input="$forceUpdate()" v-model="temp1.groupComp[tempid].required" :val="0" label="No" />
             </div>
          </q-item>
              <q-item class="column items-start"  >
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col-12" key="descripcion" >
                    <q-editor content-class="bg-blue-6"
                      @input="(e) => saved(e, temp1.groupComp[tempid].descripcion, temp1.groupComp[tempid].id, 'descripcion')"
                      v-model="temp1.groupComp[tempid].descripcion"
                    />
                </q-td>
              </q-item>
              <q-item class="row justify-center"  >
                <div class="col q-pa-xs">
                  <p class="text-bold">Prioridad (Colocar un número, esto sirve para ordenar las opciones que ve el cliente, la opción que tenga menor número será la que aparezca primero para tus clientes)</p>
                  <q-input filled dense
                  rounded
                  outlined @input="(e) => saved(e, parseInt(temp1.groupComp[tempid].priority), temp1.groupComp[tempid].id, 'priority')"
                  v-model="temp1.groupComp[tempid].priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
              <q-item class="column items-start"  >
                <q-td><label class="col label-expand">Tipo</label></q-td>
              <q-td key="type" >
              <q-select options-selected-class="text-blue" filled dense
                rounded outlined
                v-model="temp1.groupComp[tempid].type"
                @input="(e) => saved2(e, temp1.groupComp[tempid].type, temp1.groupComp[tempid].id, 'type')"
                use-input
                input-debounce="0"
                :options="typeOpts === '' ? [] : typeOpts"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
          </q-item>
          <q-item class="column items-start"  >
                <q-td><label class="col label-expand">Gratis</label></q-td>
          <q-td key="free" >
            <div class="row">
              <q-radio color="blue" @input="$forceUpdate()" v-model="temp1.groupComp[tempid].free" :val="1" label="Si" />
              <q-radio color="blue" @input="$forceUpdate()" v-model="temp1.groupComp[tempid].free" :val="0" label="No" />
             </div>
          </q-td>
          </q-item>
          <q-item v-if="temp1.groupComp[tempid].type !== 1" class="column items-start"  >
                <q-td><label class="col label-expand">Min</label></q-td>
          <q-td key="min" >
            <q-input filled rounded outlined @input="(e) => saved2(e, temp1.groupComp[tempid].min, temp1.groupComp[tempid].id, 'min')" type="number" v-model="temp1.groupComp[tempid].min" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-if="temp1.groupComp[tempid].type !== 1"  >
                <q-td><label class="col label-expand">Max</label></q-td>
          <q-td key="max" >
            <q-input type="number" filled rounded outlined @input="(e) => saved2(e, temp1.groupComp[tempid].max, temp1.groupComp[tempid].id, 'max')" v-model="temp1.groupComp[tempid].max" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start" v-if="temp1.groupComp[tempid].type == 2 || temp1.groupComp[tempid].type == 3"  >
                <q-td><label class="col label-expand">Max Unidades</label></q-td>
          <q-td key="maxUnit" >
            <q-input filled rounded outlined @input="(e) => saved2(e, temp1.groupComp[tempid].maxUnit, temp1.groupComp[tempid].id, 'maxUnit')" v-model="temp1.groupComp[tempid].maxUnit" dense  />
          </q-td>
          </q-item>
          <q-item class="column items-start">
                <q-td><label class="col label-expand">Vista previa (disponible luego de seleccionar el tipo)</label></q-td>
            <q-card style="max-width: 320px" class="text-left q-cardGlass">
              <q-card-section>
                <itemcomp
                :elitempass="elitempass"
                :comp="[temp1.groupComp[tempid]]"
                :value="value"
                :readOnly="false"
              />
              </q-card-section>
              </q-card>
              </q-item>
              <q-item>
                <div class="full-width row justify-between">
                  <q-btn @click="executeCancel()" label="Cancelar" color="green" rounded no-caps />
                  <q-btn @click="executeSave();" label="Guardar" color="blue" rounded no-caps icon="save" />
                </div>
              </q-item>
            </q-list>
          </div>
    <q-footer class="bg-primary" style="z-index: 9999" v-if="$q.screen.lt.md && !isDiag && !opcionesConf" reveal>
    <q-tabs class="bg-primary" mobile-arrows indicator-color="transparent" no-caps >
      <routetabmenu></routetabmenu>
      <q-tab flat  push no-caps icon="add" @click="addrow"/>
        <q-tab flat  push no-capsicon="delete_outline" @click="delrow"/>
   </q-tabs>
   </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion' },
  { name: 'required', align: 'center', label: 'Requerido', field: 'required' },
  { name: 'estatus', align: 'left', label: 'Activar', field: 'estatus' },
  { name: 'group_id', align: 'center', label: 'Grupos', field: 'group_id' },
  { name: 'type', align: 'center', label: 'Tipo', field: 'type' },
  { name: 'free', align: 'center', label: 'Gratis', field: 'free' },
  { name: 'priority', align: 'center', label: 'Prioridad', field: 'priority' },
  { name: 'min', align: 'center', label: 'Min', field: 'min' },
  { name: 'max', align: 'center', label: 'Max', field: 'max' },
  { name: 'maxUnit', align: 'center', label: 'MaxUnit', field: 'maxUnit' }
]

import { mapActions, mapGetters } from 'vuex'
import Routetabmenu from '../../components/navigation/routetabmenu.vue'
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue'),
    AddOpt: () => import('./options'),
    opcionesGroup: () => import('./gruposOpt'),
    Routetabmenu
  },
  props: {
    elitempass: {
      type: Array,
      default: () => []
    },
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
  computed: {
    ...mapGetters('menu', ['item', 'itemGroup', 'groupComp'])
  },
  data () {
    return {
      opcionesGroup: false,
      opcionesConf: false,
      grid: false,
      addopt: false,
      tempid: null,
      value: [],
      typeOpts: [{ name: 'Seleccion Múltiple CheckBox', value: 0 }, { name: 'Seleccion Simple', value: 1 }, { name: 'Seleccion Múltiple Inputs', value: 3 }],
      typeFree: [{ name: 'Si', value: 1 }, { name: 'No', value: 0 }],
      columns,
      selected: [],
      popupEditData: '',
      temp1: [],
      elGroup: [],
      noSelect: false,
      filterOptions: ''
    }
  },
  watch: {
    itemGroup () {
      this.filterOptions = Array.from(this.itemGroup)
    }
  },
  created () {
    if (!this.isDiagEasy) {
      this.bindItem()
      this.bindItemGroup()
      this.bindGroupComp().then(e => {
        this.elGroup = JSON.parse(JSON.stringify(e))
      })
    } else {
      this.elGroup = JSON.parse(JSON.stringify(this.groupComp))
    }
    this.filterOptions = Array.from(this.itemGroup)
  },
  mounted () {
    if (this.isDiagEasy && !this.isDiagView) {
      const id = this.addrow()
      this.tempid = id
      this.temp1.groupComp[id].name = ''
      this.temp1.groupComp[id].estatus = true
      this.temp1.groupComp[id].group_id = this.itemsDiag.id
      console.log(this.temp1)
      this.opcionesConf = true
      this.$forceUpdate()
    }
    if (this.isDiagView) {
      this.tempid = this.itemsDiag.id
      this.temp1.groupComp = {}
      this.temp1.groupComp[this.tempid] = { ...this.itemsDiag }
      console.log(this.temp1)
      this.opcionesConf = true
    }
  },
  methods: {
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
    executeCancel () {
      this.addopt = false
      this.$emit('Cancel')
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
      this.$emit('executedSave')
      this.addopt = false
      this.$q.notify({ message: 'Cambios Guardados' })
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      this.saveTemp({ payload: { value, id, key }, collection: 'groupComp' })
    },
    saved2 (value, initialValue, id, key) {
      this.saveTemp({ payload: { value: parseFloat(value), id, key }, collection: 'groupComp' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue2', 'setValue', 'bindItem', 'addRow', 'newAddRow', 'bindItemGroup', 'bindGroupComp']),
    delrow () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar Configuración de Opciones',
          message: '¿Desea Eliminar la Configuración de Opción seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'groupComp' })
        }).onCancel(() => {
        })
      }
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.item.length}`
      return objSelectedString
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.elGroup.findIndex(x => x.id === payload.payload[i].id)
        this.elGroup.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      console.log(this.temp1)
    },
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
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.groupComp === 'undefined') {
        this.temp1.groupComp = {}
      }
      this.temp1.groupComp[rand] = { id: rand, isNew: true, price: 0, descripcion: '', estatus: true }
      this.elGroup.unshift({ id: rand, descripcion: '', price: 0, estatus: true })
      this.$forceUpdate()
      return rand
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
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
