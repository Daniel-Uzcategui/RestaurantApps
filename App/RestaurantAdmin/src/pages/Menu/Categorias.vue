<template>
<div v-if="!isDiag" :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
   <div>
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
          <q-dialog class="bg-transparent" v-model="props.expand">
            <q-list class="q-diag-glassMorph">
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
                <!-- <q-item class="column items-start" key="descripcion" :props="props">
                  <p class="text-bold">Descripción</p>
                    <q-editor content-class="bg-blue-6"
                      rounded outlined
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      v-model="props.row.descripcion"
                      min-height="5rem"

                    />
                </q-item> -->
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

                <!-- <q-item class="column items-start" key="categorias" :props="props">
                  <div class="text-pre-wrap">{{ props.row.FechaAct }}</div>
                  <q-popup-edit v-model.number="props.row.FechaAct">
                    <q-input filled dense rounded outlined
                      readonly
                      @input="(e) => saved(e, props.row.FechaAct, props.row.id, 'FechaAct')"
                      v-model="props.row.FechaAct"
                      label="Fecha"

                    />
                  </q-popup-edit>
                </q-item> -->
            </q-list>
          </q-dialog>
          </q-list>
      </template>
    </q-table>
  </div>
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
    <q-footer v-if="$q.screen.lt.sm && !isDiag" reveal>
   <q-tabs dense mobile-arrows indicator-color="transparent" no-caps >
     <q-tab flat  push no-caps icon="add" @click="addrow"/>
      <q-tab flat push no-caps icon="delete_outline" @click="softDelete"/>
   </q-tabs>
 </q-footer>
 </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'width: 150px;', align: 'center', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'max-width: 250px;', align: 'center', label: 'Descripción', field: 'descripcion' },
  { name: 'color', align: 'center', label: 'Color de fondo', field: 'color' },
  { name: 'textcolor', align: 'center', label: 'Color del texto ', field: 'textcolor' },
  { name: 'priority', style: 'min-width: 10px; width: 10px', align: 'center', label: 'Prioridad ', field: 'priority' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias'])
  },
  props: {
    isDiag: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      elcat: [],
      temp1: {},
      columns,
      selected: [],
      noSelect: false,
      popupEditData: ''
    }
  },
  mounted () {
    this.bindCategorias().then((e) => {
      this.elcat = JSON.parse(JSON.stringify(e))
      console.log(e, 'cats')
    })
    console.log(this.$router)
    if (this.isDiag) {
      this.showprompt()
    }
  },
  watch: {
    categorias (e) {
      this.elcat = JSON.parse(JSON.stringify(e))
    }
  },
  methods: {
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
        // console.log('>>>> OK, received', data)
        if (data.length > 0) {
          this.addrow({ name: data, estatus: true, softDelete: 0 })
          this.executeSave()
        }
      })
    },
    // saved (value, initialValue, id, key) {
    //   console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
    //   this.setValue({ payload: { value, id, key }, collection: 'categorias' })
    // },
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveTemp({ payload: { value, id, key }, collection: 'categorias' })
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
    ...mapActions('menu', ['setValue2', 'newAddRow', 'bindCategorias']),
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
    addrow (data) {
      if (typeof data === 'undefined') {
        data = {}
      }
      const rand = Math.random().toString(16).substr(2, 8)
      if (typeof this.temp1.categorias === 'undefined') {
        this.temp1.categorias = {}
      }
      this.temp1.categorias[rand] = { id: rand, isNew: true, descripcion: '', ...data }
      this.elcat.unshift({ id: rand, descripcion: '', ...data })
      this.$forceUpdate()
    }
  }
}
</script>
