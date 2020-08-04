<template>
  <q-page padding>
        <div class="q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <div class="text-h5 menuTop">Carrito</div>

         <q-list v-for="(item, index) in cart" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
                  <q-item-label >$ {{item.prodPrice}}</q-item-label>
                  <q-btn style="width: 50px" size="xs" color="primary" @click="delCartItem(index)" dense>Eliminar</q-btn>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h6">
                    <q-btn size="0.5em" color="grey" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)-1)}); (checkAvail(item.prodId, item.prodType, index)[0] === 1) ;(item.quantity < 1) ? modCartVal({id: index, key: 'quantity', value: 1}) : false" icon="fas fa-minus" text-color="white" dense />
                    {{item.quantity}}
                    <q-btn size="0.5em" color="orange" @click="(checkAvail(item.prodId, item.prodType, index)[0] === 1) ? modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)+1)}) : false" icon="fas fa-plus" text-color="white" dense >
                      <q-badge color="red" v-if="item.avail === 0" floating style="left: 10px; right: auto;">max</q-badge>
                      <q-badge color="red" v-if="item.avail == 2" floating style="left: 10px; right: auto;"><q-icon name="fas fa-exclamation-circle" size="15px" color="white" /></q-badge>
                    </q-btn>
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item >
              <q-item-section>
                  <itemcomp
                  :value="item.items"
                  :readOnly="true"
                  />
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section v-if="cart.length > 1" class="text-h6 text-right">
                  <q-item-label v-if="totalItComp(item.items)">
                    Subtotal: $ {{(parseFloat(parseFloat(item.prodPrice)) * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label v-if="totalItComp(item.items)">
                    Extras:     + <u> {{ ((totalItComp(item.items)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    Total:      $ {{(parseFloat(parseFloat(item.prodPrice) + totalItComp(item.items)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
         <q-list>
           <p v-if="cart.length == 0" class="text-h4 text-center">No ha seleccionado productos</p>
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
            <q-btn name="cart" class="full-width" rounded color="primary" icon="fas fa-cash-register" v-if="cart.length && (CheckAv === 1 || CheckAv === 0)" @click="ordenar = true" label="Ordenar"/>
      </div>
      <q-dialog
         content-class="full-width q-pa-lg"
         square
         v-model="ordenar"
         persistent
         :maximized="maximizedToggle"
         transition-show="slide-up"
         transition-hide="slide-down"
         @show="showme()"
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
                        <q-btn key="Continue" v-if="pagoSel" @click="pagoSel === 3 ? step = 3 : step = 4" color="primary" label="Continuar" />
                        <q-btn key="Atras" flat @click="step = 1" color="primary" label="Atras" class="q-ml-sm" />
                      </transition-group>
                    </q-stepper-navigation>
                  </q-step>
                  <q-step
                     v-if="step === 3"
                     :name="3"
                     title="Tarjeta o Paypal"
                     icon="settings"
                     :done="step > 4"
                  >
                    <div id="paypal-button-container" ref="payp"></div>
                    <q-stepper-navigation>
                      <transition-group
                        appear
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                      >
                        <q-btn key="Atras" flat @click="step = 2" color="primary" label="Atras" class="q-ml-sm" />
                      </transition-group>
                    </q-stepper-navigation>
                  </q-step>
                  <q-step
                    :name="4"
                    title="Finalizar"
                    icon="fas fa-money"
                  >
                  <p class="text-h6" v-if="false">Total: $ {{tipEnvio == 1 ? (getTotalCarrito()[2] + 3).toFixed(2) : getTotalCarrito()[2].toFixed(2)}}</p>
                  <q-btn flat @click="step = 2" color="primary" label="Atras" class="q-ml-sm" />
                   <q-btn @click="confirm = true" v-if="cart.length && (CheckAv === 1 || CheckAv === 0)" color="primary" label="Ordenar" />
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
    'addresses': () => import('../../components/addresses.vue'),
    'itemcomp': () => import('../../components/itemComp.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'sede', 'promos']),
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
      paypal: window.paypal,
      CheckAv: 1,
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
        { label: 'Punto de Venta', value: 0, color: 'red' },
        { label: 'Efectivo ($)', value: 1, color: 'green' },
        { label: 'Zelle', value: 2, color: 'blue' },
        { label: 'Tarjeta o Paypal', value: 3, color: 'blue' }
      ]
    }
  },
  created () {
    this.bindLocalizations()
    console.log(this.cart)
    console.log(this.$refs)
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    ...mapActions('order', ['addOrder']),
    ...mapMutations('menu', ['delCart']),
    ...mapActions('localization', ['bindLocalizations']),
    showme () {
      this.$nextTick(() => console.log(this.$refs))
    },
    totalItComp (its) {
      var sum = 0
      its.forEach(x => {
        if (typeof x.quantity === 'undefined') {
          sum = sum + x.price
        } else {
          sum = sum + (x.price * x.quantity)
        }
      })
      return sum
    },
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
        // console.log({ cart: this.cart })
        var item = this.menu.find(x => x.id === id)
        return item.stock[this.sede]
      }
    },
    makeOrder () {
      if (this.tipEnvio !== '1') { this.addId = '' }
      this.addOrder({ sede: this.sede, cart: this.cart, tipEnvio: this.tipEnvio, address: this.addId, typePayment: this.pagoSel, customer_id: this.currentUser.id, status: 0, table: 0, paid: this.tipEnvio === '1' ? this.getTotalCarrito()[2] + 3 : this.getTotalCarrito()[2] }).then(e => { this.ordenar = false; this.delCart(); this.$router.push({ path: '/orders/index' }) })
    },
    getTotalCarrito () {
      // console.log({ cart: this.cart })
      var sumProd = 0
      var sumExtra = 0
      this.cart.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        sumExtra = (this.totalItComp(e.items) * e.quantity) + sumExtra
      })
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    getProdValById (id, val, type) {
      // console.log({ id, val, type })
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
    checkAvail (id, type, index) {
      var exists = 0
      if (typeof id === 'undefined' || typeof type === 'undefined') { return false }
      if (type === 0) {
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
        if (counter) { exists = 1 }
        // console.log({ sede: product.stock[this.sede], counter })
        if (typeof product !== 'undefined' && typeof product.stock !== 'undefined' && typeof product.stock[this.sede] !== 'undefined') {
          if (counter === parseInt(product.stock[this.sede])) {
            this.modCartVal({ id: index, key: 'avail', value: 0 })
            this.CheckAv = 0
            return [0, exists]
          } else if (counter > parseInt(product.stock[this.sede])) {
            this.modCartVal({ id: index, key: 'avail', value: 2 })
            this.CheckAv = 2
            return [2, exists]
          } else {
            this.modCartVal({ id: index, key: 'avail', value: 1 })
            this.CheckAv = 1
            return [1, exists]
          }
        } else { return [0, exists] }
      } else {
        var promotion = this.promoData.find(e => e.id === id)
        for (let e in promotion.prods) {
          product = promotion.prods[e]
          counter = 0
          inCart = this.cart.filter(x => x.prodId === promotion.prods[e].id)
          inCart.forEach(element => {
            counter = element.quantity + counter
          })
          this.cart.forEach(y => {
            if (typeof y.prods !== 'undefined') {
              var producto = y.prods.find(j => j.id === promotion.prods[e].id)
              if (typeof producto === 'undefined') { producto = { quantity: 0 } }
              counter = (producto.quantity * y.quantity) + counter
            }
          })
          exists = 0
          if (counter) { exists = 1 }

          if (typeof product !== 'undefined') {
            if (counter > parseInt(product.stock[this.sede])) {
              return [2, exists]
            } else if (counter === parseInt(product.stock[this.sede]) || counter + product.quantity > parseInt(product.stock[this.sede])) {
              return [0, exists]
            }
          }
        }
        return [1, exists]
      }
    }
  },
  watch: {
    CheckAv () {
      if (this.CheckAv === 2) this.showNotif()
    },
    step () {
      if (this.step === 3) {
        this.$nextTick(() => {
          let that = this
          this.paypal.Buttons({
            createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: that.tipEnvio === '1' ? that.getTotalCarrito()[2] + 3 : that.getTotalCarrito()[2]
                  }
                }]
              })
            },
            onApprove: function (data, actions) {
              // This function captures the funds from the transaction.
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                console.log({ details })
                that.makeOrder()
              })
            }
          }).render('#paypal-button-container')
        })
      }
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
