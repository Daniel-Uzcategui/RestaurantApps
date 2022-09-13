<template>
  <div class="fontsize-18 column items-center">
    <q-list class="full-width" v-for="(listorder, index) of orderKeys" :key="index" bordered separator>
      <q-item @click="selectedProduct = { listorder, product }; opendiag = !opendiag" v-for="(product, index2) of Object.keys(order[listorder])" :key="index2" clickable v-ripple :props="order[listorder][product]">
        <q-item-section>{{order[listorder][product]['name']}}
          <q-item-label v-for="(options, index3) of Object.keys(order[listorder][product]['items'])" :key="index3" caption>
          {{order[listorder][product]['items'][options]['name']}} * {{order[listorder][product]['items'][options]['quantity']}}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row full-width">
      <q-btn class="col-6" color="blue" no-caps label="Agregar" />
      <q-btn class="col-6" color="green" no-caps label="Aceptar Orden" />
    </div>
     <q-dialog v-model="opendiag">
     <q-card>
     <q-card-actions align="right">
      <q-btn label="Eliminar" @click="deleteSelected()" color="blue" v-close-popup />
      <q-btn label="Cancelar" color="green" v-close-popup />
     </q-card-actions>
     </q-card>
     </q-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      opendiag: false,
      selectedProduct: null
    }
  },
  methods: {
    deleteSelected () {
      let { listorder, product } = this.selectedProduct
      delete this.selectedMesa.order[listorder][product]
    },
    ...mapActions('order', ['setOrderMesa'])
  },
  computed: {
    ...mapGetters('order', ['ordersClient', 'selectedmesa', 'ordermesa']),
    selectedMesa: {
      get () {
        return this.selectedmesa
      },
      set (e) {
        this.setOrderMesa(e)
      }
    },
    orderKeys () {
      return Object.keys(this.selectedMesa.order)
    },
    order () {
      return this.selectedMesa.order
    }
  }
}
</script>
