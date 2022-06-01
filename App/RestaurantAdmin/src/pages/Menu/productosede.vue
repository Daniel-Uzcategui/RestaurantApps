<template>
    <div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'">
    <!-- :grid="$q.screen.lt.md" -->
   <q-table
      flat bordered
      title="Producto X Sedes"
      style="border-radius: 28px"
      :dense="$q.screen.lt.md"
      :data="ordersfilter"
      :loading="loading"
      :columns="columns"

      row-key="id"
      no-data-label="No se encontraron registros"
    >
    <template  v-slot:top>
       <q-label >Producto X Sedes </q-label>
        <div class="q-pa-md">

         <q-select options-selected-class="text-blue" filled rounded dense
              v-model="sede"
             :options="locList"
             style="width: 250px"
              emit-value
              map-options
             stack-label
              label="Seleccionar"
            @input="cargarproducto"
            />

        </div>
          <q-input label="Buscar Producto" v-model="filtrado" dark  />
          <div class="absolute-bottom-right q-pa-md">
            <q-btn
              flat
              color="white"
              icon="arrow_back"
              @click="$router.replace('/Orders/index')"
            >
            </q-btn>
          </div>
    </template>

</q-table>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      sede: '',
      elmenu: [],
      texto: '',
      arr: [],
      loading: false,
      ordersfilter: [],
      columns: [
        { name: 'descripcion', label: 'Nombre', align: 'left', field: 'name' },
        { name: 'stock', label: 'Stock', align: 'center', field: 'stock' },
        { name: 'price', label: 'Precio', align: 'center', field: 'price' }],
      locList: []
    }
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('menu', ['categorias', 'menu2']),
    filtrado: {
      get () {
        return this.texto
      },
      set (value) {
        console.log(value)
        value = value.toLowerCase()

        this.ordersfilter = this.arr.filter(function (item) {
          console.log('este valor de item', item)
          if (item.name !== undefined) {
            return item.name.toLowerCase().indexOf(value) !== -1
          }
        })
        this.texto = value
        console.log('nuevos valores', this.ordersfilter)
      }
    }
  },
  async mounted () {
    this.loading = true
    if (!this.menu2.length) {
      await this.bindmenu2()
    }
    await this.bindLocalizations()
    this.loading = false
  },
  methods: {
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('menu', ['bindmenu2']),
    cargar () {
      let obj
      console.log('los valores de la sedes', this.localizations)
      for (let i = 0; i < this.localizations.length; i++) {
        obj = this.localizations[i]
        this.locList.push({ label: obj.name,
          value: obj.id })
      }
      console.log('losssssss productos', this.menu2)
    },
    cargarproducto () {
      let obj
      // let keys
      this.arr = []
      for (let i = 0; i < this.menu2.length; i++) {
        obj = this.menu2[i]
        if (obj.stock !== undefined) {
          // keys = Object.keys(obj.stock)
          if (obj.stock[this.sede] !== undefined) {
            this.arr.unshift({ id: obj.id,
              name: obj.name,
              stock: obj.stock[this.sede],
              price: obj.price })
          }
        }
      }

      console.log(this.arr)
      console.log(this.sede)
    }
  },
  watch: {
    localizations () {
      this.cargar()
    },
    arr () {
      this.ordersfilter = this.arr
    }

  }
}
</script>
