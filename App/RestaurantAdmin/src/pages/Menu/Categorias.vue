<template>
<q-page class="q-pa-md" >
   <div class="q-pa-md">
   <q-table
      :data="categorias"
      :columns="columns"
      title="Categorias"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="single"
      :selected.sync="selected"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
    >
    <template v-slot:top-right>
        <q-btn-group flat push >
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push label="Eliminar" icon="fas fa-minus" @click="softDelete"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td  auto-width>
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td key="desc" :props="props">
              <q-input  @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
                :value="props.row.name"
                dense
                />
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
                :value="props.row.estatus"
                color="#3c8dbc"
              />
          </q-td>

          <q-td key="categorias" :props="props">
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
 </q-page>
</template>
<script>
const columns = [
  { name: 'desc', style: 'min-width: 280px; width: 280px', align: 'left', label: 'Nombre', field: 'name' },
  { name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'estatus', align: 'left', label: 'Activar', field: 'estatus' }
]

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias'])
  },
  data () {
    return {
      columns,
      selected: [],
      noSelect: false,
      popupEditData: ''
    }
  },
  mounted () {
    this.bindCategorias()
    console.log(this.$router)
  },
  methods: {
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      if (key === 'estatus') {
        value = value === false ? 0 : 1
      }
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue({ payload: { value, id, key }, collection: 'categorias' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindCategorias']),
    /* delrow () {
      this.delrows({ payload: this.selected, collection: 'categorias' })
    }, */
    softDelete () {
      let id = ''
      let value = 2
      let key = 'estatus'
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        id = this.selected[0].id
        this.$q.dialog({
          title: 'Borrar categoria',
          message: '¿Desea Borrar la categoria seleccionada ?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.setValue({ payload: { value, id, key }, collection: 'categorias' })
        }).onCancel(() => {
        })
      }
    },
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.categorias.length}`
      return objSelectedString
    },
    addrow () {
      this.addRow({ collection: 'categorias' })
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
