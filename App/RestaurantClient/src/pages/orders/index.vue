<template>
  <q-page padding>
    <q-card class="menudiv">
    <q-card-section>
    <div class="q-pa-md flex flex-center">
      <q-list separator v-for="(items, index) in orderSort" :key="index">
      <q-item @click="carritoDialog(items)" clickable v-ripple>
      <q-item-section>
      <q-icon name="fas fa-dot-circle" size="100px" color="secondary" v-if="items.status == 4"/>
      <q-knob
      v-if="items.status < 4"
      disable
      v-model="items.status"
      :max="3"
      size="100px"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"
      class="text-primary"
    >
    </q-knob>
    </q-item-section>
    <q-item-section>
      <q-item-label lines="2" class="text-h7 text-center">{{formatDate(items.dateIn)}}</q-item-label>
    <q-item-label lines="2" class="text-h7 text-center">{{estatus_options[items.status]['label']}}</q-item-label>
    <q-item-label lines="2" class="text-h7 text-center">Nro. Pedido: {{items.factura}}</q-item-label>
    <q-item-label lines="2" class="text-center" caption>Click para ver Detalles</q-item-label>
    </q-item-section>
      </q-item>
      <q-separator/>
      </q-list>
  </div>
    </q-card-section>
    </q-card>
    <q-dialog
         v-if="carrito.length"
         content-class="full-width q-pa-lg"
         square
         v-model="dialog"
         persistent
         :maximized="maximizedToggle"
         transition-show="slide-up"
         transition-hide="slide-down"
         >
         <q-card class="bg-secondary full-width">
            <q-bar class="bg-primary">
               <q-space />
               <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                  <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
               </q-btn>
               <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                  <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
               </q-btn>
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
        <div class="text-h6 q-pa-md">
          <p>Servicio: {{tipoServ[ordenDet.tipEnvio]}}</p>
          <p v-if="ordenDet.tipEnvio == 1">Despacho a dirección: {{getAddById(ordenDet.address)}}</p>
        </div>
         <q-list :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'" v-for="(item, index) in carrito" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo')" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name')}}</q-item-label>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h7 text-bold">
                    Cantidad: {{item.quantity}}
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item v-if="item.extras.length">
              <q-item-section>
                  <q-select
                    class="full-width"
                    dense
                    label="Extras"
                    filled
                    :value="item.extras"
                    use-chips
                    multiple
                    input-debounce="0"
                    readonly
                    :options="item.extras"
                    style="width: 250px"
                    map-options
                    stack-label
                  />
               </q-item-section>
            </q-item>
            <q-item v-if="carrito.length > 1">
              <q-item-section class="text-h6 text-right">
                  <q-item-label v-if="getExtrasTot (item.extras)">
                    SubTotal:        {{(item.prodPrice * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label v-if="getExtrasTot (item.extras)">
                    Extras:     + <u> {{ ((getExtrasTot (item.extras)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    Total:      $ {{((parseFloat(item.prodPrice) + getExtrasTot (item.extras)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
         <q-list>
          <q-item>
            <q-item-section class="text-h5 text-right">
              <q-item-label v-if="getTotalCarrito()[1]">
                        SubTotal: {{getTotalCarrito()[0].toFixed(2)}}
              </q-item-label>
              <q-item-label v-if="getTotalCarrito()[1]">
                        Extras:  + <u> {{getTotalCarrito()[1].toFixed(2)}} </u>
              </q-item-label>
              <q-item-label>
                        Total: $ {{ordenDet.tipEnvio == '1' ? parseFloat(getTotalCarrito()[2].toFixed(2)) + 3 : getTotalCarrito()[2].toFixed(2)}}
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
         </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  // name: 'PageName',
  data () {
    return {
      texto: 'Por confirmar',
      texto2: 'Estamos trabajando Para entregarle su orden',
      value: 20,
      maximizedToggle: true,
      dialog: false,
      carrito: [],
      ordenDet: {},
      tipoServ: ['Pick-up', 'Delivery', 'In-Local'],
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('address', ['address']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
    orderSort () {
      var ord = JSON.parse(JSON.stringify(this.orders))
      return ord.sort((a, b) => b.factura - a.factura)
    }
  },
  methods: {
    ...mapActions('address', ['bindAddress']),
    ...mapActions('order', ['bindOrders']),
    formatDate (e) {
      return date.formatDate(e.seconds * 1000, 'DD-MM')
    },
    getAddById (id) {
      if (id === '') { return }
      var add = this.address.find(x => x.id === id)
      return add.alias
    },
    carritoDialog (e) {
      this.dialog = true
      this.carrito = e.cart
      this.ordenDet = e
    },
    getProdbyId (id) {
      return this.menu.find(x => x.id === id)
    },
    getProdValById (id, val) {
      var obj = this.menu.find(e => { return e.id === id })
      return obj[val]
    },
    getExtras (id) {
      var prodExtras = []
      var displayVal = this.menu.find((e) => {
        return e.id === id
      })
      displayVal.extras.forEach(x => {
        var estrafind = this.listextras.find(e => e.value === x)
        if (typeof estrafind !== 'undefined') {
          prodExtras.push(estrafind)
        }
      })
      console.log({ prodExtras })
      return prodExtras
    },
    getExtrasTot (e) {
      var sum = 0
      if (e.length === 0) { return 0 }
      e.forEach((element) => {
        sum = parseFloat(element.price) + sum
      })
      return sum
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      this.carrito.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        e.extras.forEach((element) => {
          sumExtra = (element.price * e.quantity) + sumExtra
        })
      })
      return [sumProd, sumExtra, sumProd + sumExtra]
    }
  },
  created () {
    this.bindOrders(this.currentUser.id)
    this.bindAddress(this.currentUser.id)
  }
}
</script>

<style lang="stylus">
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
