<template>
  <div class="fontsize-18 column items-center q-ma-md">
      <div class="row justify-center q-mb-md">
        <q-btn color="purple" @click="clavemesa = !clavemesa" no-caps label="Ver clave de Mesa" />
      </div>
      <div class="full-width" v-for="(listorder, index) of Object.keys(this.selectedMesa.order)" :key="index">
        <q-list v-if="Object.keys(order[listorder]).length" class="full-width" bordered separator>
          <q-item @click="selectedProduct = { listorder, product }; opendiag = !opendiag" v-for="(product, index2) of Object.keys(order[listorder])" :key="index2" clickable v-ripple :props="order[listorder][product]">
            <q-item-section v-if="order[listorder][product]['items']">{{order[listorder][product]['name']}} * {{order[listorder][product]['quantity']}}
              <q-item-label v-for="(options, index3) of Object.keys(order[listorder][product]['items'])" :key="index3" caption>
                {{order[listorder][product]['items'][options]['name']}} * {{order[listorder][product]['items'][options]['quantity']}}
              </q-item-label>
            </q-item-section >
            <q-item-section v-else>{{order[listorder][product]['name']}} * {{order[listorder][product]['quantity']}}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    <div class="row q-mt-md full-width justify-around">
      <q-btn class="col-5" color="blue" @click="agregarprod = !agregarprod" no-caps label="Agregar" />
      <q-btn class="col-5" color="green" no-caps label="Aceptar Orden" />
    </div>
     <q-dialog v-model="opendiag">
     <q-card>
     <q-card-actions align="right">
      <q-btn class="q-ma-sm" label="Eliminar" @click="deleteSelected()" color="blue" v-close-popup />
      <q-btn class="q-ma-sm" label="Cancelar" color="green" v-close-popup />
     </q-card-actions>
     </q-card>
     </q-dialog>
     <q-dialog v-model="clavemesa">
     <q-card class="full-width">
     <q-card-section>
     <div class="text-h6">Clave</div>
     </q-card-section>
     <q-card-section>
     Clave: {{clave}}
     </q-card-section>
     <q-card-actions align="right">
     <q-btn flat label="OK" color="primary" v-close-popup />
     </q-card-actions>
     </q-card>
     </q-dialog>
     <q-dialog persistent v-model="agregarprod">
      <q-card class="full-width">
        <q-card-section>
          <div class="text-h6">Agregar</div>
        </q-card-section>
        <q-card-section>
      <q-form  @submit="addprod" class="full-width" >
          <q-select square outlined v-model="selectedprod" :options="menu" :option-disable="cannotSelect" :option-label="(x) => x.name" map-options emit-value label="producto"
            :rules="[ val => val !== null || 'Seleccionar un producto']"/>
            <q-input square outlined v-model.number="quantity" label="Cantidad"
            :rules="[
            val => val !== null && val !== '' || 'Agregue una cantidad',
            val => val > 0 && val < 100 || 'Agregue una cantidad'
            ]"/>
            <div class="row justify-center">
              <q-btn flat label="Cancelar" v-close-popup type="reset" color="red" />
            <q-btn flat label="Agregar" type="submit" color="green" />
            </div>
        </q-form>
          </q-card-section>
          <q-card-actions align="right">

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
      selectedProduct: null,
      clavemesa: false,
      clave: '1253234',
      selectedprod: null,
      agregarprod: false,
      quantity: 1
    }
  },
  methods: {
    deleteSelected () {
      let { listorder, product } = this.selectedProduct
      delete this.selectedMesa.order[listorder][product]
    },
    cannotSelect (e) {
      console.log(e.estatus[this.setSede])
      return e.estatus[this.setSede]
    },
    addprod () {
      let keynum = Math.floor(Math.random() * 10000) + 1
      console.log(keynum, this.selectedprod)
      this.selectedMesa.order[keynum] = {}
      this.$set(this.selectedMesa.order[keynum], this.selectedprod.id + keynum, { ...this.selectedprod, quantity: this.quantity })
      console.log(this.selectedMesa)
      this.quantity = 1
      this.agregarprod = false
    },
    ...mapActions('order', ['setOrderMesa'])
  },
  computed: {
    ...mapGetters('order', ['ordersClient', 'selectedmesa', 'ordermesa']),
    ...mapGetters('menu', ['menu']),
    ...mapGetters('config', ['setSede']),
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
