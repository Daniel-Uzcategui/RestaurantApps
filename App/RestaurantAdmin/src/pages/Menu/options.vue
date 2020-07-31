<template>
  <div class="q-pa-md">
   <q-table
      :data="item"
      :columns="columns"
      title="Opciones"
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
              <q-input @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="descripcion" :props="props">
            <div v-html="props.row.descripcion"></div>
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
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
           <q-td key="price" :props="props">
            <q-decimal style="width: 135px" :rules="[validate]"
            outlined
            @input="(e) => saved(e, parseFloat(props.row.price), props.row.id, 'price')"
                :value="props.row.price" input-style="text-align: right"></q-decimal>
          </q-td>
        </q-tr>
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
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 260px; width: 260px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'min-width: 300px; width: 300px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'right', label: 'Activar', field: 'estatus', style: 'min-width: 100px; width: 100px' },
  { name: 'group_id', style: 'min-width: 300px; width: 300px', align: 'center', label: 'Grupos', field: 'group_id' },
  { name: 'price', align: 'center', label: 'Precio', field: 'price', style: 'min-width: 135px; width: 135px' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['item', 'itemGroup'])
  },
  data () {
    return {
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
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.item.length}`
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
