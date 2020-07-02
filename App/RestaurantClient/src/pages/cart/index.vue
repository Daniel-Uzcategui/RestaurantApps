<template>
  <q-page padding>
        <div class="q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <div class="text-h5 menuTop">Carrito</div>

         <q-list v-for="(item, index) in cart" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo')" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name')}}</q-item-label>
                  <q-btn style="width: 50px" size="xs" color="primary" @click="delCartItem(index)" dense>Eliminar</q-btn>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h6">
                    <q-btn size="0.5em" color="grey" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)-1)}); (item.quantity < 1) ? modCartVal({id: index, key: 'quantity', value: 1}) : false" icon="fas fa-minus" text-color="white" dense />
                    {{item.quantity}}
                    <q-btn size="0.5em" color="orange" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)+1)})" icon="fas fa-plus" text-color="white" dense />
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-select
                    class="full-width"
                    dense
                    label="Extras"
                    filled
                    :value="item.extras"
                    @input="(e) => modCartVal({id: index, key: 'extras', value: e})"
                    use-chips
                    multiple
                    input-debounce="0"
                    @new-value="createValue"
                    :options="getExtras(item.prodId)"
                    @filter="filterFn"
                    style="width: 250px"
                    map-options
                    emit-value
                    stack-label
                  />
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-h6 text-right">
                  <q-item-label>
                    Platos:        {{(parseFloat(getProdValById(item.prodId, 'price')) * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label>
                    Extras:     + <u> {{ ((getExtrasTot (item.extras)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    SubTotal:      $ {{(parseFloat(getProdValById(item.prodId, 'price') + getExtrasTot (item.extras)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
         <q-list>
          <q-item>
            <q-item-section class="text-h5 text-right">
              <q-item-label>
                        Total Platos: {{getTotalCarrito()[0].toFixed(2)}}
              </q-item-label>
              <q-item-label>
                        Total Extras:  + <u> {{getTotalCarrito()[1].toFixed(2)}} </u>
              </q-item-label>
              <q-item-label>
                        Total: $ {{getTotalCarrito()[2].toFixed(2)}}
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
            <q-btn name="cart" class="full-width" rounded color="primary" icon="fas fa-cash-register" @click="ordenar = true" label="Ordenar"/>
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
                     title="Seleccionar Tipo de envio"
                     icon="add_comment"
                     :done="step > 1"
                     >
                     <div class="q-pa-sm">
                       <q-radio class="q-pa-sm" dense v-model="tipEnvio" val=1 label="Delivery + 3$" />
                       <q-radio class="q-pa-sm" dense v-model="tipEnvio" val=0 label="Pick-up" />
                     </div>
                     <addresses v-if="tipEnvio == 1" v-model="addId"/>
                     <q-stepper-navigation>
                        <q-btn color="primary" @click="step = 2" label="Continuar" />
                     </q-stepper-navigation>
                  </q-step>
                  <q-step
                     :name="2"
                     title="Seleccionar tipo de Pago"
                     icon="settings"
                     :done="step > 1"
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
                        <q-btn key="Continue" v-if="pagoSel" @click="(pagoSel === 'punto') ? step = 4 : step = 3" color="primary" label="Continuar" />
                        <q-btn key="Atras" flat @click="step = 1" color="primary" label="Atras" class="q-ml-sm" />
                      </transition-group>
                    </q-stepper-navigation>
                  </q-step>
                  <q-step
                    :name="3"
                    title="Subir Foto"
                    icon="fas fa-camera"
                    :done="step > 1"
                  >
                  <p v-if="pagoSel === 'cash'">Porfavor cargar Foto del efectivo $</p>
                  <p v-if="pagoSel === 'Zelle'">Porfavor cargar captura del pago Zelle</p>
                    <q-uploader
                      url="http://localhost:4444/upload"
                      label="Carga de Fotos"
                      color="primary"
                      square
                      flat
                      bordered
                      style="max-width: -webkit-fill-available;"
                    />
                     <q-stepper-navigation>
                        <q-btn @click="step = 3" color="primary" label="Continuar" />
                        <q-btn flat @click="step = 1" color="primary" label="Atras" class="q-ml-sm" />
                     </q-stepper-navigation>
                  </q-step>
                  <q-step
                    :name="4"
                    title="Finalizar"
                    icon="fas fa-money"
                  >
                  <p class="text-h6">Total: $ {{getTotalCarrito()[2].toFixed(2)}}</p>
                   <q-btn @click="makeOrder()" color="primary" label="Ordenar" />
                  </q-step>
               </q-stepper>
         </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'addresses': () => import('../../components/addresses.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
    ...mapGetters('user', ['currentUser'])
  },
  data () {
    return {
      tipEnvio: 1,
      addId: '',
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
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    ...mapActions('order', ['addOrder']),
    getExtras (id) {
      console.log('GETECSD')
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
    makeOrder () {
      if (!this.tipEnvio) { this.addId = '' }
      this.addOrder({ cart: this.cart, tipEnvio: this.tipEnvio, address: this.addId, typePayment: this.pagoSel, customer_id: this.currentUser.id, status: 'En Espera', paid: this.getTotalCarrito()[2].toFixed(2) })
      console.log({ cart: this.cart, tipEnvio: this.tipEnvio, address: this.addId, typePayment: this.pagoSel, customer_id: this.currentUser.id, status: 'En Espera', paid: this.getTotalCarrito()[2].toFixed(2) })
    },
    getExtrasTot (e) {
      var sum = 0
      e.forEach((element) => {
        var extra = this.plainExtras.find(e => e.id === element)
        if (typeof extra === 'undefined') { extra = { price: 0 } }
        sum = parseFloat(extra.price) + sum
      })
      return sum
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      this.cart.forEach(e => {
        var prod = this.menu.find(element => element.id === e.prodId)
        if (typeof prod === 'undefined') { prod = { price: 0 } }
        sumProd = (parseFloat(prod.price) * e.quantity) + sumProd

        e.extras.forEach((element) => {
          var extra = this.plainExtras.find(i => i.id === element)
          if (typeof extra === 'undefined') { extra = { price: 0 } }
          sumExtra = (parseFloat(extra.price) * e.quantity) + sumExtra
        })
      })
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    getProdValById (id, val) {
      var obj = this.menu.find(e => { return e.id === id })
      return obj[val]
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
