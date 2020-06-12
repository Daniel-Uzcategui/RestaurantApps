<template>
  <div class="q-pa-md">
   <q-table
      :data="menu"
      :columns="columns"
      title="Menu"
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
          <q-btn flat color="white" push label="Guardar" icon="update" @click="saveData"/>
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

          <q-td key="categoria" :props="props">
              <q-select
                @input="(e) => saved(e, props.row.categoria, props.row.id, 'categoria')"
                :options="listcategorias"
                :value="plaincategorias[props.row.categoria] ? plaincategorias[props.row.categoria].name : 'N/A'"
                color="green"
                emit-value
              />
          </q-td>

          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus"
                color="green"
              />
          </q-td>

          <q-td key="FechaAct" :props="props">
            <div class="text-pre-wrap">{{ props.row.FechaAct }}</div>
            <q-popup-edit v-model.number="props.row.FechaAct">
              <q-input
                readonly
                @input="(e) => saved(e, props.row.FechaAct, props.row.id, 'FechaAct')"
                :value="props.row.FechaAct"
                dense
                autofocus
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
  { name: 'desc', style: 'min-width: 80px; width: 100px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', style: 'min-width: 80px; width: 120px', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria' },
  { name: 'estatus', align: 'center', label: 'Activar', field: 'estatus' },
  { name: 'FechaAct', label: 'Fecha Activación', field: 'FechaAct' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'listcategorias', 'plaincategorias'])
  },
  data () {
    return {
      columns,
      selected: [],
      popupEditData: ''
    }
  },
  mounted () {
    console.log(this.listcategorias, 'VUE?')
  },
  methods: {
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setMenu({ value, id, key })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setMenu', 'addMenu', 'saveMenu']),
    delrow () {
      this.saveMenu(this.menu.filter(a => !this.selected.some(b => b['id'] === a['id'])))
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.menu.length}`
    },
    saveData () {
      this.saveMenu(this.menu)
    },
    addrow () {
      const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      this.addMenu(key)
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
