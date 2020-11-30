<template>
<q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
   <div>
   <q-table
      :grid="$q.screen.lt.md"
      :data="categorias"
      :columns="columns"
      title="Categorias"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="single"
      dense
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
              <q-input rounded outlined  @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
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
              <q-td>
                <div  class="q-pa-md row items-start q-gutter-md" key="color" :props="props">
               <q-color
                 default-value="#285de0"
                :value="props.row.color"
                 default-view="palette"
                :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                 @change="val => saved(val, props.row.color, props.row.id, 'color')"
                 style="max-width: 250px"
                 />
              </div>
             </q-td>
             <q-td>
                <div  class="q-pa-md row items-start q-gutter-md" key="textcolor" :props="props">
               <q-color
                 default-value="#285de0"
                :value="props.row.textcolor"
                 default-view="palette"
                 :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                 @change="val => saved(val, props.row.textcolor, props.row.id, 'textcolor')"
                 style="max-width: 250px"
                 />
              </div>
             </q-td>
             <q-td key="priority" :props="props">
              <q-input rounded outlined @input="(e) => saved(e, props.row.priority, props.row.id, 'priority')" :value="props.row.priority" dense autofocus />
           </q-td>
          <q-td key="estatus" :props="props">
              <q-toggle
                @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                :value="props.row.estatus ? true : false"
                color="#3c8dbc"
              />
          </q-td>
          <q-td key="categorias" :props="props">
            <div class="text-pre-wrap">{{ props.row.FechaAct }}</div>
            <q-popup-edit v-model.number="props.row.FechaAct">
              <q-input rounded outlined
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
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card>
            <q-card-section>
             <q-list dense>
              <q-item>
                <q-item-section>
                  <q-checkbox dense v-model="props.selected" :label="props.row.name" />
                </q-item-section>
                <q-item-section side>
                  <q-icon v-ripple name="edit" @click="props.expand = !props.expand" />
                </q-item-section>
              </q-item>
            </q-list>
            </q-card-section>
            <q-separator />
            <q-list v-if="!props.expand" dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" lines="3" caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list v-if="props.expand">
                <q-item class="column items-center" key="desc" :props="props">
                  <p class="text-bold">Nombre</p>
                    <q-input rounded outlined @input="(e) => saved(e, props.row.name, props.row.id, 'name')"
                      :value="props.row.name"
                      />
                </q-item>

                <q-item class="column items-center" key="descripcion" :props="props">
                  <p class="text-bold">Descripción</p>
                    <q-editor
                      rounded outlined
                      @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                      :value="props.row.descripcion"
                      min-height="5rem"
                      autofocus
                    />
                </q-item>
                    <q-item class="column items-center">
                        <p class="text-bold">Color de Fondo</p>
                    <q-color
                      default-value="#285de0"
                      :value="props.row.color"
                      default-view="palette"
                      :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                      @change="val => saved(val, props.row.color, props.row.id, 'color')"
                      style="max-width: 250px"
                      />
                  </q-item>
                  <q-item class="column items-center">
                        <p class="text-bold">Color de Texto</p>
                    <q-color
                      default-value="#285de0"
                      :value="props.row.textcolor"
                      default-view="palette"
                      :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                      @change="val => saved(val, props.row.textcolor, props.row.id, 'textcolor')"
                      style="max-width: 250px"
                      />
                  </q-item>
                  <q-item class="column items-center" key="priority" :props="props">
                     <p class="text-bold">Prioridad</p>
                    <q-input rounded outlined @input="(e) => saved(e, props.row.priority, props.row.id, 'priority')" :value="props.row.priority" autofocus />
                </q-item>
                <q-item class="column items-center" key="estatus" :props="props">
                    <q-toggle
                      label="Estatus"
                      @input="(e) => saved(e, props.row.estatus, props.row.id, 'estatus')"
                      :value="props.row.estatus ? true : false"
                      color="#3c8dbc"
                    />
                </q-item>
                <q-item class="column items-center" key="categorias" :props="props">
                  <div class="text-pre-wrap">{{ props.row.FechaAct }}</div>
                  <q-popup-edit v-model.number="props.row.FechaAct">
                    <q-input rounded outlined
                      readonly
                      @input="(e) => saved(e, props.row.FechaAct, props.row.id, 'FechaAct')"
                      :value="props.row.FechaAct"
                      label="Fecha"
                      autofocus
                    />
                  </q-popup-edit>
                </q-item>
            </q-list>
          </q-card>
        </div>
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
  { name: 'color', align: 'left', label: 'Color de fondo', field: 'color' },
  { name: 'textcolor', align: 'left', label: 'Color del texto ', field: 'textcolor' },
  { name: 'priority', style: 'min-width: 10px; width: 10px', align: 'left', label: 'Prioridad ', field: 'priority' },
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
      if (this.selected.length === 0) {
        this.noSelect = true
      }
      if (this.selected.length > 0) {
        this.$q.dialog({
          title: 'Eliminar producto',
          message: '¿Desea Eliminar el producto seleccionado ?',
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
