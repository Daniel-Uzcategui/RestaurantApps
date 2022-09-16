<template>
  <q-card v-if="subCatTemp.softDelete !== 1" square flat bordered>
    <q-expansion-item
      expand-separator
      :label="subCatTemp.name"
      default-opened
    >
    <template v-slot:header>

  <q-item-section>
    {{subCatTemp.name}}
  </q-item-section>
  <q-item-section side>
    <div class="row items-center">
      <q-btn-group push>
      <q-btn color="red" rounded label="Borrar" @click.stop="(e) => { subCatTemp.softDelete = 1, subCatTemp.estatus = false }" />
     <q-btn color="blue" rounded label="Añadir" @click.stop="addSubCat(subCatTemp)" />
      </q-btn-group>
    </div>
  </q-item-section>
  </template>
    <q-list class="">
                      <q-expansion-item
                    expand-separator
                    icon="settings"
                    label="Avanzado"
                  >
                      <q-item class="column items-start">
                          <p class="text-bold">Color de Fondo</p>
                      <q-color
                        default-value="#2B3742"
                        v-model="subCatTemp.color"
                        default-view="palette"
                        :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                        style="max-width: 250px"
                        />
                    </q-item>
                    <q-item class="column items-start">
                          <p class="text-bold">Color de Texto</p>
                      <q-color
                        default-value="#2B3742"
                        v-model="subCatTemp.textcolor"
                        default-view="palette"
                        :palette="[ '#019A9D', '#D9B801', '#E8045A', '#B2028A','#FFFFFF', '#000000']"
                        style="max-width: 250px"
                        />
                    </q-item>
                    <q-item class="column items-start" key="priority" >
                       <p class="text-bold">Prioridad (número más bajo se muestra primero)</p>
                      <q-input filled dense rounded outlined v-model="subCatTemp.priority"  />
                  </q-item>
                  </q-expansion-item>
                  <q-item class="column items-start" key="desc" >
                    <p class="text-bold">Nombre</p>
                      <q-input filled dense rounded outlined
                        v-model="subCatTemp.name"
                        @input="(e) => subCatTemp.name=e"
                        />
                  </q-item>
                  <q-item class="column items-start" key="estatus" >
                      <q-toggle
                        label="Estatus"
                        @input="(e) => {typeof subCatTemp.estatus === 'undefined' ? subCatTemp.estatus=true : subCatTemp.estatus=!subCatTemp.estatus}"
                        :value="subCatTemp.estatus ? true : false"
                        color="blue"
                      />
                  </q-item>
                  <div v-if="subCatTemp.subCat && Object.keys(subCatTemp.subCat).length">
                  <subCatList class="q-ml-md" @subCat="(e) => subCatTemp.subCat[sub] = e" v-for="(sub, index) in Object.keys(subCatTemp.subCat)" :key="index" :subCat="subCatTemp.subCat[sub]" />
                  </div>
              </q-list>
    </q-expansion-item>
  </q-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    subCat: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    subCatTemp: {
      handler (value) {
        this.$emit('subCat', value)
        console.log('deeeep')
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('menu', ['createId']),
    async addSubCat () {
      let newId = await this.createId('categorias')
      let val = {
        id: newId,
        name: 'Nueva Categoría',
        estatus: true,
        softDelete: 0,
        subCat: {}
      }
      this.$set(this.subCatTemp.subCat, newId, val)
      // this.subCatTemp.subCat = Object.assign({}, this.subCatTemp.subCat, { [newId]: val })
      this.$emit('subCat', this.subCatTemp)
    }
  },
  computed: {
    subCatTemp: {
      get () {
        return this.subCat
      },
      set () {
        console.log('seting')
      }
    }
  },
  name: 'subCatList'
}
</script>
