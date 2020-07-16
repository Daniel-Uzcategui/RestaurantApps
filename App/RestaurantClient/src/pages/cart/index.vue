<template>
  <q-page padding>
        <div class="q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <div class="text-h5 menuTop">Carrito {{CheckAv}}</div>

         <q-list v-for="(item, index) in cart" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
                  <q-item-label >$ {{item.prodPrice.toFixed(2)}}</q-item-label>
                  <q-btn style="width: 50px" size="xs" color="primary" @click="delCartItem(index)" dense>Eliminar</q-btn>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h6">
                    <q-btn size="0.5em" color="grey" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)-1)}); (item.quantity < 1) ? modCartVal({id: index, key: 'quantity', value: 1}) : false" icon="fas fa-minus" text-color="white" dense />
                    {{item.quantity}}
                    <q-btn size="0.5em" color="orange" @click="(!checkAvail(item.prodId, item.prodType)) ? false : modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)+1)})" icon="fas fa-plus" text-color="white" dense >
                      <q-badge color="red" v-if="checkAvail(item.prodId, item.prodType) == 0" floating style="left: 10px; right: auto;">max</q-badge>
                      <q-badge color="red" v-if="checkAvail(item.prodId, item.prodType) == 2" floating style="left: 10px; right: auto;"><q-icon name="fas fa-exclamation-circle" size="15px" color="white" /></q-badge>
                    </q-btn>
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item v-if="getExtras(item.prodId, item.prodType).length">
              <q-item-section>
                  <q-select
                    class="full-width"
                    dense
                    label="Extras"
                    filled
                    :value="item.extras"
                    @input="(e) => modCartVal({id: index, key: 'extras', value: e })"
                    use-chips
                    multiple
                    input-debounce="0"
                    @new-value="createValue"
                    :options="getExtras(item.prodId, item.prodType)"
                    @filter="filterFn"
                    style="width: 250px"
                    map-options
                    stack-label
                  />
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section v-if="cart.length > 1" class="text-h6 text-right">
                  <q-item-label v-if="item.quantity > 1">
                    Subtotal: $ {{(parseFloat(parseFloat(item.prodPrice)) * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label v-if="getExtrasTot(item.extras)">
                    Extras:     + <u> {{ ((getExtrasTot (item.extras)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    Total:      $ {{(parseFloat(parseFloat(item.prodPrice) + getExtrasTot (item.extras)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
         <q-list>
           <p v-if="cart.length == 0" class="text-h6 q-pa-md">No hay productos en el carrito</p>
          <q-item v-if="cart.length" >
            <q-item-section class="text-h5 text-right">
              <q-item-label v-if="getTotalCarrito()[1] > 0">
                        Subtotal: {{getTotalCarrito()[0].toFixed(2)}}
              </q-item-label>
              <q-item-label v-if="getTotalCarrito()[1].toFixed(2) > 0">
                        Extras:  + <u> {{getTotalCarrito()[1].toFixed(2)}} </u>
              </q-item-label>
              <q-item-label>
                        Total: $ {{getTotalCarrito()[2].toFixed(2)}}
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
            <q-btn name="cart" class="full-width" rounded color="primary" icon="fas fa-cash-register" v-if="cart.length && !CheckAv" @click="ordenar = true" label="Ordenar"/>
      </div>
      <q-dialog
         content-class="full-width q-pa-lg"
         square
         v-model="ordenar"
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
               <q-stepper
                  v-model="step"
                  vertical
                  color="primary"
                  animated
                  >
                  <q-step
                     :name="1"
                     title="Seleccionar Tipo de Servicio"
                     icon="add_comment"
                     :done="step > 1"
                     >
                     <div class="q-pa-sm" >
                       <q-radio v-if="getLocBySede('Delivery')" class="q-pa-sm" dense v-model="tipEnvio" val=1 label="Delivery + 3$" />
                       <q-radio v-if="getLocBySede('PickUP')"  class="q-pa-sm" dense v-model="tipEnvio" val=0 label="Pick-up" />
                       <q-radio v-if="getLocBySede('Inlocal')"  class="q-pa-sm" dense v-model="tipEnvio" val=2 label="In-Local" />
                     </div>
                     <addresses v-if="tipEnvio == 1" v-model="addId"/>
                     <q-stepper-navigation>
                        <q-btn color="primary" v-if="tipEnvio == 1 && addId != null" @click="step = 2" label="Continuar" />
                        <q-btn color="primary" v-if="tipEnvio == 0 || tipEnvio == 2" @click="step = 2" label="Continuar" />
                     </q-stepper-navigation>
                  </q-step>
                  <q-step
                     :name="2"
                     title="Seleccionar tipo de Pago"
                     icon="settings"
                     :done="step > 2"
                  >
                    <q-option-group
                      :options="tipoPago"
                      label="Tipo de Pago"
                      type="radio"
                      v-model="pagoSel"
                    />
                    <q-stepper-navigation>
                      <transition-group
                        appear
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                      >
                        <q-btn key="Continue" v-if="pagoSel" @click="step = 3" color="primary" label="Continuar" />
                        <q-btn key="Atras" flat @click="step = 1" color="primary" label="Atras" class="q-ml-sm" />
                      </transition-group>
                    </q-stepper-navigation>
                  </q-step>
                  <q-step
                    :name="3"
                    title="Finalizar"
                    icon="fas fa-money"
                  >
                  <p class="text-h6" v-if="false">Total: $ {{tipEnvio ? (getTotalCarrito()[2] + 3).toFixed(2) : getTotalCarrito()[2].toFixed(2)}}</p>
                  <q-btn flat @click="step = 2" color="primary" label="Atras" class="q-ml-sm" />
                   <q-btn @click="confirm = true" v-if="!CheckAv" color="primary" label="Ordenar" />
                  </q-step>
               </q-stepper>
         </q-card>
      </q-dialog>
      <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Confirmar Orden</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Confirmar" @click="makeOrder()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    'addresses': () => import('../../components/addresses.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras', 'sede', 'promos']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    promoData () {
      var prom = []
      this.promos.forEach(e => {
        var y = { prods: [] }
        e.prods.forEach(i => {
          var its = this.menu.find(x => x.id === i.id)
          y.prods.push({ id: its.id, name: its.name, photo: its.photo, stock: its.stock })
        })
        y.name = e.name
        y.id = e.id
        y.price = e.price
        y.estatus = e.estatus
        y.descripcion = e.descripcion
        y.prodType = 1
        y.photo = e.photo
        prom.push(y)
      })
      return prom
    }
  },
  data () {
    return {
      CheckAv: false,
      confirm: false,
      tipEnvio: null,
      addId: null,
      step: 1,
      maximizedToggle: true,
      ordenar: false,
      notifications: 0,
      leftDrawerOpen: false,
      pagoSel: null,
      tipoPago: [
        { label: 'Punto de Venta', value: 'punto', color: 'red' },
        { label: 'Efectivo ($)', value: 'cash', color: 'green' },
        { label: 'Zelle', value: 'Zelle', color: 'blue' }
      ]
    }
  },
  created () {
    this.bindLocalizations()
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    ...mapActions('order', ['addOrder']),
    ...mapMutations('menu', ['delCart']),
    ...mapActions('localization', ['bindLocalizations']),
    showNotif () {
      this.$q.notify({
        timeout: 0,
        position: 'right',
        message: 'Un producto ha cambiado la disponibilidad',
        color: 'alert',
        actions: [
          { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },
    getLocBySede (tip) {
      var locs = this.localizations.find(x => x.id === this.sede)
      if (typeof locs === 'undefined') { return false }
      return locs[tip]
    },
    getStock (id, type) {
      if (!type) {
        console.log({ cart: this.cart })
        var item = this.menu.find(x => x.id === id)
        return item.stock[this.sede]
      }
    },
    getExtras (id, type) {
      var prodExtras = []
      if (!type) {
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
      }
      return prodExtras
    },
    makeOrder () {
      if (this.tipEnvio !== '1') { this.addId = '' }
      this.addOrder({ sede: this.sede, cart: this.cart, tipEnvio: this.tipEnvio, address: this.addId, typePayment: this.pagoSel, customer_id: this.currentUser.id, status: 0, table: 0, paid: this.tipEnvio ? this.getTotalCarrito()[2] + 3 : this.getTotalCarrito()[2].toFixed(2) }).then(e => { this.ordenar = false; this.delCart(); this.$router.push({ path: '/orders/index' }) })
    },
    getExtrasTot (e) {
      console.log({ e })
      var sum = 0
      if (typeof e === 'undefined') { return 0 }
      if (e.length === 0) { return 0 }
      e.forEach((element) => {
        sum = element.price + sum
      })
      return sum
    },
    getTotalCarrito () {
      console.log({ cart: this.cart })
      var sumProd = 0
      var sumExtra = 0
      this.cart.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        if (typeof e.extras !== 'undefined') {
          e.extras.forEach((element) => {
            sumExtra = (element.price * e.quantity) + sumExtra
          })
        }
      })
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    getProdValById (id, val, type) {
      console.log({ id, val, type })
      if (type === 0) {
        var obj = this.menu.find(e => { return e.id === id })
        return obj[val]
      } else {
        obj = this.promos.find(e => { return e.id === id })
        return obj[val]
      }
    },
    createValue (val, done) {
      if (val.length > 0) {
        if (!this.listextras.includes(val)) {
          this.listextras.push(val)
        }
        done(val, 'toggle')
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.listextras
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.listextras.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    checkAvail (id, type) {
      console.log(id, type)
      if (typeof id === 'undefined' || typeof type === 'undefined') { return false }
      if (type === 0) {
        console.log('0')
        var counter = 0
        var inCart = this.cart.filter(x => x.prodId === id)
        var product = this.menu.find(x => x.id === id)
        inCart.forEach(element => {
          counter = element.quantity + counter
        })
        this.cart.forEach(y => {
          if (typeof y.prods !== 'undefined') {
            var producto = y.prods.find(j => j.id === product.id)
            if (typeof producto === 'undefined') { producto = { quantity: 0 } }
            counter = producto.quantity * y.quantity + counter
          }
        })
        if (typeof product !== 'undefined' && typeof product.stock !== 'undefined') {
          if (counter === parseInt(product.stock[this.sede])) {
            this.CheckAv = false
            return 0
          } else if (counter >= parseInt(product.stock[this.sede])) {
            this.CheckAv = true
            return 2
          } else {
            this.CheckAv = false
            return 1
          }
        }
      } else {
        var promotion = this.promoData.find(e => e.id === id)
        for (let e in promotion.prods) {
          counter = 0
          inCart = this.cart.filter(x => x.prodId === promotion.prods[e].id)
          product = promotion.prods[e]
          inCart.forEach(element => {
            counter = element.quantity + counter
          })
          this.cart.forEach(y => {
            if (typeof y.prods !== 'undefined') {
              var producto = y.prods.find(j => j.id === promotion.prods[e].id)
              if (typeof producto === 'undefined') { producto = { quantity: 0 } }
              counter = producto.quantity * y.quantity + counter
            }
          })
          console.log({ product })
          if (typeof product !== 'undefined' && typeof product.stock !== 'undefined' && typeof product.stock[this.sede] !== 'undefined') {
            if (counter === parseInt(product.stock[this.sede])) {
              this.CheckAv = false
              return 0
            } else if (counter >= parseInt(product.stock[this.sede])) {
              this.CheckAv = true
              return 2
            }
          }
        }
        this.CheckAv = false
        return true
      }
    }
  },
  watch: {
    CheckAv () {
      if (this.CheckAv) this.showNotif()
    }
  }
}
</script>
<style lang="stylus">
  .menuTop
    height 50px
    margin-left 10%
    padding-top 20px
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
