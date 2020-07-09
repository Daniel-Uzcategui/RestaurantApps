<template>
  <div class="q-pa-md">
   <q-table
      :data="listext"
      :columns="columns"
      title="Extras"
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
            <q-popup-edit
              :value="props.row.descripcion"
            >
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
              />
            </q-popup-edit>
          </q-td>

          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus"
                color="#3c8dbc"
              />
          </q-td>

          <q-td key="price" :props="props">
            <div class="text-pre-wrap">{{ props.row.price }}</div>
            <q-popup-edit :value="props.row.price">
              <q-input
                @input="(e) => saved(e, props.row.price, props.row.id, 'price')"
                :value="props.row.price"
                dense
                autofocus
                type="number"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 160px; width: 160px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'price', label: 'Precio', field: 'price' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['listext'])
  },
  data () {
    return {
      columns,
      selected: [],
      popupEditData: ''
    }
  },
  methods: {
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'extras' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindExtras']),
    delrow () {
      this.delrows({ payload: this.selected, collection: 'extras' })
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.listext.length}`
    },
    addrow () {
      this.addRow({ collection: 'extras' })
    }
  },
  mounted () {
    this.bindExtras()
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
