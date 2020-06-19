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
  { name: 'FechaAct', label: 'Fecha Activación', field: 'FechaAct' },
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
  mounted () {
    this.bindExtras()
  },
  methods: {
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setExtras({ value, id, key })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setExtras', 'addExtras', 'saveExtras', 'bindExtras']),
    delrow () {
      this.saveExtras(this.listext.filter(a => !this.selected.some(b => b['id'] === a['id'])))
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.listext.length}`
    },
    saveData () {
      this.saveExtras(this.listext)
    },
    addrow () {
      const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      this.addExtras(key)
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
