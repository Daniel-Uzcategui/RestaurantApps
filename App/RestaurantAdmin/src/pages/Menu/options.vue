<template>
  <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
   <q-table
      style="border-radius: 28px"
      :data="itemPlain"
      :columns="columns"
      title="Opciones"
      :rows-per-page-options="[]"
      row-key="id"
      :grid="$q.screen.lt.md || grid"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-if="$q.screen.gt.xs" v-slot:top-right>
        <q-btn-group flat push >
          <q-btn flat color="white" no-caps push v-if="$q.screen.gt.sm" icon="fas fa-grip-horizontal" @click="grid = !grid"/>
          <q-btn flat color="white" no-caps push label="Agregar" icon="add" @click="addrow"/>
          <q-btn flat color="white" no-caps push label="Eliminar" icon="fas fa-minus" @click="delrow"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
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
              <q-editor
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
              <q-select filled
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
      </template>
      <template v-slot:item="props">
        <div v-if="sede !== null" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Dale a la flechita'}}</q-item-label>
                </q-item-section>
                <q-item-section class="text-caption text-grey">
                  <q-item-label>{{props.row.estatus ? props.row.estatus[sede] ? 'activo' : 'inactivo' : 'inactivo'}}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption> {{(props.row.price).toFixed(2)}}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-icon name="fas fa-chevron-right" @click="props.expand = !props.expand" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
        </q-list>
          <q-card>
            <q-list v-if="props.expand">
          <q-item class="column items-start" key="desc" :props="props">
            <q-td><label class="label-expand">Nombre</label></q-td>
              <q-input filled
              @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
              :value="props.row.name"
              rounded
              outlined />
          </q-item>
          <q-item class="column items-start" key="estatus" :props="props">
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-item>
           <q-item class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Grupos</label></q-td>
              <q-select filled
                rounded
                outlined
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
          </q-item>
              <q-item class="column items-start" v-show="props.expand" :props="props">
                <q-td><label class="col label-expand">Descripción</label></q-td>
                <q-td class="col-12" key="descripcion" :props="props">
                    <q-editor
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      :value="props.row.descripcion"
                    />
                </q-td>
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
                  <q-input filled
                  rounded
                  outlined @input="(e) => saved(e, parseInt(props.row.priority), props.row.id, 'priority')"
                  :value="props.row.priority"
                  min="1" max="999"
                  type="number">
                  </q-input>
                </div>
              </q-item>
            </q-list>
          </q-card>
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
      <q-tab flat color="white" no-caps push label="Agregar" icon="add" @click="addrow"/>
          <q-tab flat color="white" no-caps push label="Eliminar" icon="fas fa-minus" @click="delrow"/>
   </q-tabs>
   </q-footer>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 260px; width: 260px', align: 'left', label: 'Nombre', field: 'name', sortable: true },
  { name: 'descripcion', style: 'min-width: 300px; width: 300px', align: 'left', label: 'Descripción', field: 'descripcion' },
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
  data () {
    return {
      grid: false,
      columns,
      selected: [],
      popupEditData: '',
      filterOptions: '',
      noSelect: false
    }
  },
  watch: {
    itemGroup (e) {
      console.log({ e })
      this.filterOptions = Array.from(e)
    }
  },
  created () {
    this.bindItem()
    this.bindItemGroup()
    console.log({ it: this.itemGroup })
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
    },
    createValue (val, done) {
      if (val.length > 0) {
        if (!this.itemGroup.includes(val)) {
          this.addRow({ collection: 'itemGroup' })
            .then(x => { console.log(x); this.setValue({ payload: { value: val, id: x, key: 'name', estatus: 0 }, collection: 'itemGroup' }) })
        }
        done(val, 'toggle')
      }
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      this.setValue({ payload: { value, id, key }, collection: 'item' })
    },
    saved2 (value, initialValue, id, key) {
      if (key === 'price') { value = isNaN(parseInt(value)) ? 0 : parseInt(value) }
      this.setValue({ payload: { value: parseFloat(value), id, key }, collection: 'item' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindItem', 'bindItemGroup']),
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
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.itemPlain.length}`
      return objSelectedString
    },
    addrow () {
      this.addRow({ collection: 'item' })
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
  .q-table__top
    background-color $secondary
    color white

</style>
