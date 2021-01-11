<template>
  <div :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-mt-lg'">
   <q-table
      :data="elfilters"
      :columns="columns"
      title="Filtros"
      :rows-per-page-options="[]"
      row-key="id"
      style="border-radius: 28px"
      grid
      ref="table"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-if="$q.screen.gt.xs" v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Filtros
      </p>
      <q-btn v-if="Object.keys(temp1).length" @click="executeSave()" label="Guardar" rounded class="text-bold" no-caps color="secondary" icon="save"></q-btn>
        <q-btn-group flat push >
          <q-btn flat color="white" push no-caps label="Agregar" icon="add" @click.stop="addrow"/>
          <q-btn flat color="white" push no-caps label="Eliminar" icon="delete_outline" @click.stop="delrow"/>
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

          <q-td key="icon" :props="props">
            {{ props.row.icon }}
            <q-popup-edit
            :value="props.row.icon"
            @show="() => showPopup(props.row, 'icon')"
            >
              <q-input filled @input="(e) => saved(e, props.row.icon, props.row.id, 'icon')" :value="props.row.icon" dense  />
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
                color="blue"
              />
          </q-td>
          <q-td key="show" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.show, props.row.id, 'show')"
                :value="props.row.show ? true : false"
                color="blue"
              />
          </q-td>
          <q-td key="cats" :props="props">
              <q-select options-selected-class="text-blue" filled
                :value="props.row.cats"
                @input="(e) => saved(e, props.row.cats, props.row.id, 'cats')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="categorias"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
        </q-tr>
      </template> -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Nuevo Filtro'}}</q-item-label>
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
          <q-item class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => {saved(e, props.row.estatus, props.row.id, 'estatus'); typeof props.row.estatus === 'undefined' ? props.row.estatus=true : props.row.estatus=!props.row.estatus}"
                :value="props.row.estatus ? true : false"
                color="blue"
              />
          </q-item>
          <q-item class="column items-start" key="showmenu" :props="props">
             <q-td><label class="label-expand">Mostrar en Menú</label></q-td>
              <q-toggle
                @input="(e) => {saved(e, props.row.show, props.row.id, 'show'); typeof props.row.show === 'undefined' ? props.row.show=true : props.row.show=!props.row.show}"
                :value="props.row.show ? true : false"
                color="blue"
              />
          </q-item>
          <q-item class="column items-start" key="icon" :props="props">
             <q-td><label class="label-expand">icono</label></q-td>
              <q-input filled @input="(e) => saved(e, props.row.icon, props.row.id, 'icon')" v-model="props.row.icon" dense  />
          </q-item>
           <q-item class="column items-start" key="group" :props="props">
             <q-td><label class="label-expand">Categorías</label></q-td>
              <q-select options-selected-class="text-blue" filled
                rounded
                outlined
                v-model="props.row.cats"
                @input="(e) => saved(e, props.row.cats, props.row.id, 'cats')"
                use-input
                use-chips
                multiple
                input-debounce="0"
                :options="categorias"
                :option-label="(item) => item === null ? null : item.name"
                :option-value="(item) => item === null ? null : item.id"
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
            </q-list>
          </q-dialog>
        </div>
      </template>
    </q-table>
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
    <q-footer v-if="$q.screen.lt.sm" reveal>
    <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
      <q-tab flat  push no-caps icon="add" @click.stop="addrow"/>
        <q-tab flat color="white" push no-caps icon="delete_outline" @click.stop="delrow"/>
   </q-tabs>
   </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 260px; width: 260px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'icon', style: 'min-width: 260px; width: 260px', align: 'left', label: 'icono', field: 'icon' },
  { name: 'descripcion', style: 'min-width: 300px; width: 300px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'right', label: 'Activar', field: 'estatus', style: 'min-width: 100px; width: 100px' },
  { name: 'show', align: 'right', label: 'Mostrar en Menú', field: 'show', style: 'min-width: 100px; width: 100px' },
  { name: 'cats', style: 'min-width: 300px; width: 300px', align: 'center', label: 'Categorías', field: 'cats' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['filters', 'categorias'])
  },
  data () {
    return {
      grid: false,
      columns,
      elfilters: [],
      selected: [],
      popupEditData: '',
      filterOptions: '',
      noSelect: false,
      temp1: []
    }
  },
  created () {
    this.bindFilters().then(e => { this.elfilters = JSON.parse(JSON.stringify(e)) })
    this.bindCategorias()
    console.log({ it: this.filters })
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
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
      this.saveTemp({ payload: { value, id, key }, collection: 'filters' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue2', 'newAddRow', 'addRow', 'bindFilters', 'bindCategorias']),
    delrow () {
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar Opciones',
          message: '¿Desea Eliminar el filtro seleccionado ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.delrows({ payload: this.selected, collection: 'filters' })
        }).onCancel(() => {
        })
      }
    },
    delrows (payload) {
      this.$refs.table.clearSelection()
      for (const i in payload.payload) {
        let index = this.elfilters.findIndex(x => x.id === payload.payload[i].id)
        this.elfilters.splice(index, 1)
        if (typeof this.temp1[payload.collection] === 'undefined') {
          this.temp1[payload.collection] = {}
        }
        this.temp1[payload.collection][payload.payload[i].id] = { softDelete: 1, estatus: false }
      }
      console.log(this.temp1)
    },
    addrow () {
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.filters === 'undefined') {
        this.temp1.filters = {}
      }
      this.temp1.filters[rand] = { id: rand, isNew: true, price: 0, descripcion: '' }
      this.elfilters.unshift({ id: rand, descripcion: '' })
      this.$forceUpdate()
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.filters.length}`
      return objSelectedString
    }
  }
}
</script>
