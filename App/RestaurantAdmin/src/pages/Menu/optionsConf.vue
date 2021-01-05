<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
   style="border-radius: 28px"
      dense
      grid
      :data="elGroup"
      :columns="columns"
      title="Configuración de Opciones"
      :rows-per-page-options="[]"
      row-key="id"
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-if="$q.screen.gt.xs" v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Configuración de Opciones
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="secondary" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat color="white" no-caps push label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat color="white" no-caps push label="Eliminar" icon="delete_outline" @click="delrow"/>
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
      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="desc" :props="props">
              <q-input filled style="width: 150px" @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense  />
          </q-td>

          <q-td key="descripcion" :props="props">
              <q-editor content-class="bg-blue-6"
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"

              />
          </q-td>
          <q-td key="required" :props="props">
            <q-select filled dense
                rounded outlined
                :value="props.row.required"
                @input="(e) => saved2(e, props.row.required, props.row.id, 'required')"
                use-input
                input-debounce="0"
                :options="typeFree === '' ? [] : typeFree"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
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
              <q-select filled dense
                rounded outlined
                :value="props.row.group_id"
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
              />
          </q-td>
          <q-td key="type" :props="props">
              <q-select filled dense
                rounded outlined
                :value="props.row.type"
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
          <q-td key="free" :props="props">
            <q-select filled dense
                rounded outlined
                :value="props.row.free"
                @input="(e) => saved2(e, props.row.free, props.row.id, 'free')"
                use-input
                input-debounce="0"
                :options="typeFree === '' ? [] : typeFree"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
          <q-td key="priority" :props="props">
            <q-input filled @input="(e) => saved2(e, props.row.priority, props.row.id, 'priority')" :value="props.row.priority" dense  />
          </q-td>
          <q-td key="min" v-if="props.row.type !== 1" :props="props">
            <q-input filled @input="(e) => saved2(e, props.row.min, props.row.id, 'min')" :value="props.row.min" dense  />
          </q-td>
          <q-td key="max" v-if="props.row.type !== 1" :props="props">
            <q-input filled @input="(e) => saved2(e, props.row.max, props.row.id, 'max')" :value="props.row.max" dense  />
          </q-td>
          <q-td key="maxUnit" v-if="props.row.type == 2" :props="props">
            <q-input filled @input="(e) => saved2(e, props.row.maxUnit, props.row.id, 'maxUnit')" :value="props.row.maxUnit" dense  />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-card style="max-width: 400px" class="text-left">
              <q-card-section>
                <itemcomp
                :comp="[props.row]"
                :value="value"
              />
              </q-card-section>
              </q-card>
          </q-td>
        </q-tr>
      </template> -->
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
            <q-td><label class="label-expand">Nombre</label></q-td>
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
             <q-td><label class="label-expand">Requerido</label></q-td>
             <div class="row">
              <q-radio color="blue" v-model="props.row.required" :val="1" label="Si" />
              <q-radio color="blue" v-model="props.row.required" :val="0" label="No" />
             </div>
          </q-item>
          <q-item class="column items-start" key="group_id" :props="props">
             <q-td><label class="label-expand">Grupo</label></q-td>
              <q-select filled dense
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
              <q-select filled dense
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
                <q-td><label class="col label-expand">Vista previa (solo disponible)</label></q-td>
            <q-card style="max-width: 400px" class="text-left">
              <q-card-section>
                <itemcomp
                :comp="[props.row]"
                :value="value"
              />
              </q-card-section>
              </q-card>
              </q-item>
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
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
    <q-footer v-if="$q.screen.lt.sm" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
      <q-tab flat  push no-caps icon="add" @click="addrow"/>
        <q-tab flat color="white" push no-caps label="Eliminar" icon="delete_outline" @click="delrow"/>
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
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue')
  },
  computed: {
    ...mapGetters('menu', ['item', 'itemGroup', 'groupComp'])
  },
  data () {
    return {
      grid: false,
      value: [],
      typeOpts: [{ name: 'Seleccion Múltiple CheckBox', value: 0 }, { name: 'Seleccion Simple', value: 1 }, { name: 'Seleccion Múltiple Slider', value: 2 }, { name: 'Seleccion Múltiple Inputs', value: 3 }],
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
  mounted () {
    this.bindItem()
    this.bindItemGroup()
    this.bindGroupComp().then(e => {
      this.elGroup = JSON.parse(JSON.stringify(e))
    })
    this.filterOptions = Array.from(this.itemGroup)
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
    ...mapActions('menu', ['setValue2', 'bindItem', 'newAddRow', 'bindItemGroup', 'bindGroupComp']),
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
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.groupComp === 'undefined') {
        this.temp1.groupComp = {}
      }
      this.temp1.groupComp[rand] = { id: rand, isNew: true, price: 0, descripcion: '' }
      this.elGroup.unshift({ id: rand, descripcion: '', price: 0 })
      this.$forceUpdate()
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
