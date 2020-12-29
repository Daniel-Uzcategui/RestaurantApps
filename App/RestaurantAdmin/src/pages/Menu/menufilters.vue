<template>
  <div :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-mt-lg'">
   <q-table
      :data="filters"
      :columns="columns"
      title="Filtros"
      :rows-per-page-options="[]"
      row-key="id"
      style="border-radius: 28px"
      :grid="$q.screen.lt.md || grid"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
    >
    <template v-if="$q.screen.gt.xs" v-slot:top-right>
        <q-btn-group flat push >
          <q-btn flat color="white" push no-caps label="Agregar" icon="fas fa-plus" @click="addrow"/>
          <q-btn flat color="white" push no-caps label="Eliminar" icon="fas fa-minus" @click="delrow"/>
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
          <q-td key="show" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.show, props.row.id, 'show')"
                :value="props.row.show ? true : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="cats" :props="props">
              <q-select filled
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
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
        <q-list @click.native="props.selected = !props.selected" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item v-ripple style="border-radius: 28px" :class="props.selected ? 'bg-secondary' : ''" >
                <q-item-section>
                  <q-item-label>{{props.row.name ? props.row.name: 'Dale a la flechita'}}</q-item-label>
                </q-item-section>
                <q-item-section class="text-caption text-grey">
                  <q-item-label>{{props.row.estatus ? 'activo' : 'inactivo'}}</q-item-label>
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
          <q-item class="column items-start" key="groupComp" :props="props">
             <q-td><label class="label-expand">Estatus</label></q-td>
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-item>
          <q-item class="column items-start" key="showmenu" :props="props">
             <q-td><label class="label-expand">Mostrar en Menú</label></q-td>
              <q-toggle
                @input="(e) => saved(e, props.row.show, props.row.id, 'show')"
                :value="props.row.show ? true : false"
                color="#3c8dbc"
              />
          </q-item>
          <q-item class="column items-start" key="icon" :props="props">
             <q-td><label class="label-expand">icono</label></q-td>
              <q-input filled @input="(e) => saved(e, props.row.icon, props.row.id, 'icon')" :value="props.row.icon" dense  />
          </q-item>
           <q-item class="column items-start" key="group" :props="props">
             <q-td><label class="label-expand">Categorías</label></q-td>
              <q-select filled
                rounded
                outlined
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
      <q-tab flat  push no-caps icon="fas fa-plus" @click="addrow"/>
        <q-tab flat color="white" push no-caps icon="fas fa-minus" @click="delrow"/>
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
    ...mapGetters('menu', ['item', 'itemGroup', 'filters', 'categorias'])
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
    console.log({ sha256: this.sha256 })
    this.bindItem()
    this.bindItemGroup()
    this.bindFilters()
    this.bindCategorias()
    console.log({ it: this.filters })
  },
  methods: {
    validate (value) {
      return value >= 0 || 'error'
    },
    showPopup (row, col) {
      this.popupEditData = row[col]
    },
    saved (value, initialValue, id, key) {
      this.setValue({ payload: { value, id, key }, collection: 'filters' })
    },
    canceled (val, initialValue) {
      console.log(`retain original value = ${initialValue}, canceled value = ${val}`)
    },
    ...mapActions('menu', ['setValue', 'addRow', 'delrows', 'bindItem', 'bindItemGroup', 'bindFilters', 'bindCategorias']),
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
    getSelectedString () {
      let literal = this.selected.length > 1 ? 's' : ''
      let objSelectedString = this.selected.length === 0 ? '' : `${this.selected.length} registro` + literal + ` seleccionado` + literal + ` de ${this.filters.length}`
      return objSelectedString
    },
    addrow () {
      this.addRow({ collection: 'filters' })
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
