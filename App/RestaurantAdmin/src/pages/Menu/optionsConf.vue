<template>
  <div class="q-pa-md">
   <q-table
      dense
      :data="groupComp"
      :columns="columns"
      title="Configuración de Opciones"
      :rows-per-page-options="[]"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-slot:top-right>
        <q-btn-group flat push >
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="delrow"/>
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="desc" :props="props">
              <q-input style="width: 150px" @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
          </q-td>

          <q-td key="descripcion" :props="props">
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
              />
          </q-td>
          <q-td key="required" :props="props">
            <q-select
                filled
                :value="props.row.required"
                @input="(e) => saved2(e, props.row.required, props.row.id, 'required')"
                use-input
                input-debounce="0"
                :options="typeFree"
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
              <q-select
                filled
                :value="props.row.group_id"
                @input="(e) => saved(e, props.row.group_id, props.row.id, 'group_id')"
                use-input
                use-chips
                input-debounce="0"
                :options="filterOptions"
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
              <q-select
                filled
                :value="props.row.type"
                @input="(e) => saved2(e, props.row.type, props.row.id, 'type')"
                use-input
                input-debounce="0"
                :options="typeOpts"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
          <q-td key="free" :props="props">
            <q-select
                filled
                :value="props.row.free"
                @input="(e) => saved2(e, props.row.free, props.row.id, 'free')"
                use-input
                input-debounce="0"
                :options="typeFree"
                :option-label="(item) => item === null || typeof item === 'undefined' ? null : item.name"
                :option-value="(item) => item === null || typeof item === 'undefined' ? null : item.value"
                style="width: 250px"
                stack-label
                emit-value
                map-options
              />
          </q-td>
          <q-td key="priority" :props="props">
            <q-input @input="(e) => saved2(e, props.row.priority, props.row.id, 'priority')" :value="props.row.priority" dense autofocus />
          </q-td>
          <q-td key="min" v-if="props.row.type !== 1" :props="props">
            <q-input @input="(e) => saved2(e, props.row.min, props.row.id, 'min')" :value="props.row.min" dense autofocus />
          </q-td>
          <q-td key="max" v-if="props.row.type !== 1" :props="props">
            <q-input @input="(e) => saved2(e, props.row.max, props.row.id, 'max')" :value="props.row.max" dense autofocus />
          </q-td>
          <q-td key="maxUnit" v-if="props.row.type == 2" :props="props">
            <q-input @input="(e) => saved2(e, props.row.maxUnit, props.row.id, 'maxUnit')" :value="props.row.maxUnit" dense autofocus />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left"><itemcomp
                :comp="[props.row]"
                :value="value"
              /></div>
          </q-td>
        </q-tr>
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
  </div>
</template>
<script>
const columns = [
  { name: 'desc', align: 'center', label: 'Nombre', field: 'name' },
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
      value: [],
      typeOpts: [{ name: 'Seleccion Múltiple A', value: 0 }, { name: 'Seleccion Simple', value: 1 }, { name: 'Seleccion Múltiple B', value: 2 }],
      typeFree: [{ name: 'Si', value: 1 }, { name: 'No', value: 0 }],
      columns,
      selected: [],
      popupEditData: '',
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
    this.bindGroupComp()
    this.filterOptions = Array.from(this.itemGroup)
  },
  methods: {
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      this.setValue({ payload: { value, id, key }, collection: 'groupComp' })
    },
    saved2 (value, initialValue, id, key) {
      this.setValue({ payload: { value: parseFloat(value), id, key }, collection: 'groupComp' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindItem', 'bindItemGroup', 'bindGroupComp']),
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
    addrow () {
      this.addRow({ collection: 'groupComp' })
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
  .q-table__top
    background-color $secondary
    color white

</style>
