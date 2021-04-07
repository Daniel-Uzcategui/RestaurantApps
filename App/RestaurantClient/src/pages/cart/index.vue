<template>
  <q-page padding class="q-fullscreen-glassMorph">
        <div class="menudiv2" >
         <div class="text-h5 menuTop q-mt-md">Tu Carrito</div>
         <div class="column items-center">
         <q-list v-for="(item, index) in cart" :key="index" class="full-width">
            <q-item class="row justify-between">
              <q-item-section class="col">
                <div class="row">
                <q-btn v-if="$q.screen.gt.sm" color="primary" class="q-ma-md q-mr-lg" style="height: 25px; width: 25px;" size="xs" round @click="delCartItem(index)" icon="clear"></q-btn>
                <div>
                <div class="q-ma-md position-relative">
                  <q-btn v-if="$q.screen.lt.md" color="black" class="q-ma-md q-ml-lg absolute-top-left" style="height: 25px; width: 25px;" size="xs" round @click="delCartItem(index)" icon="clear"></q-btn>
                  <div class="bg-primary" style="border-radius: 15px">
                  <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="q-ma-md rounded-borders" />
                  </div>
                </div>
                </div>
                </div>
               </q-item-section>
               <q-item-section :style="$q.screen.lt.sm ? 'margin-left: 62px;' : ''" :class="$q.screen.lt.md ? 'col column items-end' : ''">
                 <div>
                   <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
                  <!-- <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">$ {{ item.prodPrice }} x {{item.quantity}} = $ {{item.prodPrice * item.quantity}}</q-item-label> -->
                                   <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">$ {{(parseFloat(parseFloat(item.prodPrice) + totalItComp(item.items)) * item.quantity).toFixed(2)}}</q-item-label>
                 </div>
               </q-item-section>
               <q-item-section :class="$q.screen.lt.md ? 'col column items-end' : ''">
                <q-item-label class="text-h6 row">
                  <div class="text-weight-thin">{{item.quantity}}</div>
                  <div class="relative-position">
                  <q-btn-group v-if="!item.reward"  style="transform: rotateZ(90deg); height: 20px ; border-radius: 0.5em">
                    <q-btn size="0.3em" class="q-pl-xs" color="primary" @click="(checkAvail(item.prodId, item.prodType, index)[0] === 1) ? modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)+1)}) : false" icon="fas fa-chevron-left" text-color="white" dense >
                    </q-btn>
                     <q-btn size="0.3em" color="primary" text-color="black" label="│" dense/>
                    <q-btn size="0.3em" class="q-pr-xs" color="primary" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)-1)}); (checkAvail(item.prodId, item.prodType, index)[0] === 1) ;(item.quantity < 1) ? modCartVal({id: index, key: 'quantity', value: 1}) : false" icon="fas fa-chevron-right" text-color="white" dense />
                  </q-btn-group>
                  <div style="top: -200%; position: absolute">
                    <q-badge color="red" v-if="item.avail === 0" style="">max</q-badge>
                      <q-badge color="red" v-if="item.avail == 2" style=""><q-icon name="fas fa-exclamation-circle" size="15px" color="white" />Hay más de lo disponible</q-badge>
                  </div>
                </div>
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
            <q-item v-if="item.addressPickup && item.addressShipping">
              <q-item-section>
                <addresses
                :readOnly="true"
                :addressPickup="item.addressPickup"
                :addressShipping="item.addressShipping" />
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
                  <q-item-label >
                    Total:      $ {{(parseFloat(parseFloat(item.prodPrice) + totalItComp(item.items)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
         </q-list>
         <q-card class="q-pa-lg q-cardGlass" style="border-radius: 28px; min-width: 40vmin">
           <q-card-section>
           <p v-if="cart.length == 0" class="text-h4 text-center">No ha seleccionado productos</p>
            <div v-if="cart.length" >
            <div class="text-h7 text-left">
              <div class="row" v-if="getTotalCarrito()[1] > 0">
                       <p class="col-6"> Subtotal: </p> <p class="text-right col-6">{{getTotalCarrito()[0].toFixed(2)}}</p>
              </div>
              <div class="row" v-if="getTotalCarrito()[1].toFixed(2) > 0">
                        <p class="col-6">Extras:</p>  <p class="text-right col-6"> + <u> {{getTotalCarrito()[1].toFixed(2)}} </u> </p>
              </div>
              <div class="row">
                  <p class="col-6">Total:</p> <p class="text-right col-6">$ {{getTotalCarrito()[2].toFixed(2)}}</p>
              </div>
            </div>
          </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="q-pa-lg">
            <div class="text-caption text-center">Ingresar Código del cupón</div>
            <div class="column items-center">
            <q-input filled
              :rules="[val => val.length === 0 || 'Cupón no válido']"
              style="width: 60%" v-model="cupon" :loading="loadingState" @input="setLoadingState()" />
            </div>
          </q-card-section>
          <q-card-actions class="q-pa-md column items-center" >
            <p v-if="CheckAv === 2">
              Hay un producto que no cumple con la disponibilidad en su carrito, porfavor disminuya la cantidad o eliminelo antes de continuar
            </p>
            <div v-if="allowBuy">
              <q-btn name="cart" no-caps class="q-pr-xl q-pl-xl text-weight-thin" rounded color="primary" v-if="cart.length && (CheckAv === 1 || CheckAv === 0)" @click="ordenar = true">
              Siguiente
              </q-btn>
            </div>
            <div class="q-pt-lg" vertical v-if='!allowBuy'>
                <p> En estos momentos estamos cerrados vuelve pronto</p>
            </div>
          </q-card-actions>
         </q-card>
         </div>
      </div>
      <q-dialog
         content-class="full-width q-pa-lg"
         square
         v-model="ordenar"
         persistent
         maximized
         transition-show="slide-up"
         transition-hide="slide-down"
         @show="showme()"
         >
         <q-card
         style="width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          class="q-fullscreen-glassMorph full-width">
            <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 2001" dense flat icon="fas fa-chevron-left" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
                  <div
                      class="q-pa-xl row justify-center"
                      v-if="step === 1"
                     >
                     <div class="col-6" style="min-width: 300px">
                      <div class="q-pt-xl text-h4 text-bold">Tu carrito</div>
                      <div class="q-pt-md">Seleccionar Tipo de Servicio</div>
                      <p v-if="checkCartType[0] > 0" class="text-caption"> * Solo aplica para los productos en los cual no se ha seleccionado el Servicio</p>
                      <q-list class="q-pa-sm" v-if="config">
                          <q-item>
                            <q-radio v-show="config.statusDelivery" v-if="getLocBySede('Delivery')" class="q-pa-sm" dense v-model="tipEnvio" val=1 :label="`Delivery`"/>
                          </q-item>
                          <q-item>
                            <q-radio v-show="config.statusPickup"   v-if="getLocBySede('PickUP')"  class="q-pa-sm" dense v-model="tipEnvio" val=0 label="Pick-up" />
                          </q-item>
                          <q-item>
                            <q-radio v-show="config.statusInlocal"  v-if="getLocBySede('Inlocal')"  class="q-pa-sm" dense v-model="tipEnvio" val=2 label="In-Local" />
                        </q-item>
                      </q-list>
                     </div>
                     <div class="col-6 q-pt-xl" style="min-width: 350px">
                       <q-card class="q-pa-xl q-cardGlass" style="border-radius: 28px">
                         <q-card-section>
                           <div class="text-h5">¿Para cuando quiere su pedido?</div>
                           <p v-if="checkCartType[0] > 0" class="text-caption"> * Solo aplica para los productos en los cual no se ha seleccionado en la fecha</p>
                            <div class="q-gutter-sm">
                              <q-radio v-model="orderWhen" val=0 label="Lo más pronto posible" />
                              <q-radio v-model="orderWhen" val=1 label="Fecha en específico" />
                            </div>
                            <div v-if="orderWhen == 1" class="q-pt-md" style="max-width: 300px">
                              <q-input filled readonly v-model="orderDate" hint="Seleccione Fecha y hora">
                                <template v-slot:prepend>
                                  <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                      <q-date :options="dateOptions" v-model="orderDate" mask="YYYY-MM-DD HH:mm">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-date>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>

                                <template v-slot:append>
                                  <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                      <q-time :disable="orderDate === null" :options="optionsFnTime" v-model="orderDate" mask="YYYY-MM-DD HH:mm" format24h>
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-time>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                              </q-input>
                            </div>
                         </q-card-section>
                         <q-card-section v-show="tipEnvio != 0 && tipEnvio != 2">
                          <div class="text-h5"> Mis direcciones</div>
                          <p v-if="!validAddress" class="text-caption text-bold text-center text-red"> * Dirección no valida, no se encuentra dentro de las zonas permitidas</p>
                          <addresses @update-price="(e) => deliveryPrice = e"  class="q-pt-md" @invalid-address="(e) => validAddress = e" v-model="addId"/>
                         </q-card-section>
                         <q-card-section>
                           <div>
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 1 && addId != null && validAddress && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="(tipEnvio == 0 || tipEnvio == 2) && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          </div>
                         </q-card-section>
                       </q-card>
                     </div>
                  </div>
                  <div
                      class="q-pa-xl row justify-center"
                      v-if="step === 2"
                     >
                     <div class="col-6" style="min-width: 300px">
                      <div class="q-pt-xl q-pb-xl text-h4 text-bold">Formas de Pago</div>
                      <div v-if="tipoPago && tipoPago.length === 0">No existe ningún método de pago activo</div>
                    <q-option-group
                      :options="tipoPago"
                      label="Tipo de Pago"
                      type="radio"
                      v-model="pagoSel"
                    />
                  </div>
                  <div style="min-width: 300px" class="col-6 q-pt-xl" v-if="pagoSel === 3"> <div id="paypal-button-container" ref="payp"></div> </div>
                  <div style="min-width: 300px" class="col-6 q-pt-xl" v-if="pagoSel === 5">
                    <div>
                     <payCreditCorp
                      :ordersId=currentUser.cedula
                      :payAmount=totalPrice
                      :keyCreditCorp=config.CreditCorp
                      @click='payment' />
                     </div>
                  </div>
                     <div class="col-6 q-pt-xl" style="min-width: 350px" v-if=" pagoSel ===1 ||  pagoSel ===2  || pagoSel ===4 || pagoSel ===8 || pagoSel ===7">
                        <div style="min-width: 300px" class="col-6 q-pt-xl"  v-if="pagoSel === 2">
                        <div class="text-center">
                          <div class="text-h5 ">Zelle</div>
                          <div class="text-caption text-center filler-bottom"></div>
                            <span class="label">{{config.zelleEmail}}</span>
                          </div>
                        </div>
                         <div style="min-width: 300px" class="col-6 q-pt-xl"  v-if="pagoSel === 4">
                        <div class="text-center">
                          <div class="text-h5 ">Venmo</div>
                          <div class="text-caption text-center filler-bottom"></div>
                            <span class="label">{{config.venmoAcc}}</span>
                          </div>
                        </div>
                       <div style="min-width: 300px" class="col-6 q-pt-xl"  v-if="pagoSel === 8">
                        <div class="text-center">
                          <div class="text-h5 ">Pago Móvil</div>
                          <div class="text-caption text-center filler-bottom"></div>
                            <span class="label">{{config.pagomovil}}</span>
                          </div>
                        </div>
                      <div style="min-width: 300px" class="col-6 q-pt-xl" v-if="pagoSel ===7">
                        <div class="text-center">
                          <div class="text-h5 ">Transferencia Bancaria</div>
                          <div class="text-caption text-center filler-bottom"></div>
                            <span class="label">{{config.transfer}}</span>
                        </div>
                      </div>
                      <br>
                       <q-card class="q-pa-xl q-cardGlass" style="border-radius: 28px;"  @click="showPhotoUpload()">
                        <q-card-section>
                            <div class="column items-center ">
                                <div class=" column items-center" v-show='photoMessage'>
                                  <div>
                                  <q-btn style="border-radius: 28px;" push>
                                      <q-avatar rounded class="q-mb-sm" icon="collections" font-size="50px" size="130px" text-color="grey-4" >
                                      </q-avatar>
                                      <p v-if="pagoSel != 1">Haga click para cargar la captura del pago realizado </p>
                                      <p v-if="pagoSel == 1">Haga click para cargar foto del efectivo </p>
                                  </q-btn>
                                  </div>
                                </div>
                                <div class=" column items-center">
                                <img :src="photoSRC" class="q-mb-sm" style="width:100%">
                                </div>
                           </div>
                        </q-card-section>
                        </q-card>
                    </div>
                    <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 6">
                    <div v-if="this.rates.length">
                     <debitPayment
                      :ordersId=currentUser.cedula
                      :amount="getRates(totalPrice + deliveryPrice)"
                      @payment-done='payment' />
                     </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                     <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 9">
                    <div v-if="this.rates.length">
                     <creditPayment
                      :ordersId=currentUser.cedula
                      :credit="true"
                      :amount="getRates(totalPrice + deliveryPrice)"
                      @payment-done='payment' />
                     </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                    <div class="q-pt-md col-12 column items-center">
                      <div>
                      <div v-if="tipEnvio === '1'">
                        <div class="text-h6">SubTotal: $ {{(getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div class="text-h6">Delivery: $ {{parseFloat(deliveryPrice)}}</div>
                      </div>
                        <div class="text-h6" >Total: $ {{(tipEnvio === '1' ? parseFloat(getTotalCarrito()[2]) + parseFloat(deliveryPrice) : getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div v-if="this.rates.length">
                        <div class="text-h6" v-if="pagoSel == 0  || pagoSel == 6 ||  pagoSel == 7 ||  pagoSel == 8 ||  pagoSel == 9" >Total: Bs
                          {{ (getRates(totalPrice + deliveryPrice)).toFixed(2)}}
                        </div>
                        </div>
                        <div v-else>No hay tasa de cambio colocada</div>
                        <div v-if="CheckTDD ===true">
                        <q-btn @click="confirm = true" v-if="pagoSel !== null && pagoSel !== 3 && cart.length && (CheckAv === 1 || CheckAv === 0)" color="primary" no-caps rounded label="Finalizar orden" />
                        </div>
                        <div v-if="pagoSel ==0 || CheckTDC ===true ">
                        <q-btn @click="confirm = true" color="primary" no-caps rounded label="Finalizar orden" />
                        </div>
                        <q-btn rounded no-caps key="Atras" flat @click="step = 1" color="primary" label="Volver" class="q-ml-sm" />
                    </div>
                    </div>
                  </div>
         </q-card>
      </q-dialog>
      <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Por favor confirmar la orden</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn no-caps flat label="Cancelar" color="primary" v-close-popup  v-if="pagoSel !== 5 && CheckTDD ===false" />
          <q-btn no-caps flat label="Confirmar" @click="makeOrder()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
         <fbq-uploader
            class="q-my-lg"
            label="por favor anexe la imagen del pago"
            :meta="meta"
            :prefixPath="prefixPath"
            @uploaded="uploadComplete"
            document='orders_cache'
            ></fbq-uploader>
      </q-dialog>
   </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Addresses from '../../components/addresses.vue'
import payCreditCorp from '../../components/payCreditCorp.vue'
import debitPayment from '../../components/payment/debit'
import creditPayment from '../../components/payment/credit'
import { QUploaderBase, date } from 'quasar'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'addresses': () => import('../../components/addresses.vue'),
    'itemcomp': () => import('../../components/itemComp.vue'),
    'fbq-uploader': () => import('../../components/FBQUploader20.vue'),
    payCreditCorp: payCreditCorp,
    Addresses,
    debitPayment,
    creditPayment
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('transactions', ['transactions']),
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates']),
    ...mapGetters('user', ['currentUser']),
    checkCartType () {
      let a = 0
      let b = 0
      for (let i of this.cart) {
        if (i.dispType === 2) {
          a = a + 1
        } else {
          b = b + 1
        }
      }
      return [a, b]
    },
    configDates () {
      let cfg = this.configurations.find(e => e.id === 'sede' + this.sede)
      console.log('rutina configDates')
      console.log('cfg')
      console.log(this.sede)
      console.log(cfg)
      return cfg
    },
    config () {
      return this.paymentServ
    },
    tipoPago () {
      var tip = []
      if (this.config && this.config.statusPto) { tip.push({ label: 'Punto de Venta', value: 0, color: 'red' }) }
      if (this.config && this.config.statusCash) { tip.push({ label: 'Efectivo ($)', value: 1, color: 'green' }) }
      if (this.config && this.config.statusZelle) { tip.push({ label: 'Zelle', value: 2, color: 'blue' }) }
      if (this.config && this.config.statusPaypal) { tip.push({ label: 'Tarjeta o Paypal', value: 3, color: 'blue' }) }
      if (this.config && this.config.statusVenmo) { tip.push({ label: 'Venmo', value: 4, color: 'blue' }) }
      if (this.config && this.config.statusCreditCorp) { tip.push({ label: 'Tarjeta de Credito', value: 5, color: 'blue' }) }
      if (this.config && this.config.statusMercantil) { tip.push({ label: 'Tarjeta Débito Mercantil', value: 6, color: 'blue' }) }
      if (this.config && this.config.statustransfer) { tip.push({ label: 'Transferencia Bancaria', value: 7, color: 'red' }) }
      if (this.config && this.config.statuspagomovil) { tip.push({ label: 'Pago móvil', value: 8, color: 'red' }) }
      if (this.config && this.config.statusMercantil) { tip.push({ label: 'Tarjeta Credito', value: 9, color: 'blue' }) }
      return tip
    },
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
    },
    meta () {
      return {
        id: this.currentUser.id,
        photoType: this.photoType
      }
    },
    prefixPath () {
      const id = this.currentUser.id,
        path = `${id}/${this.photoType}Photo/${this.photoType}Photo.`
      return path
    }
  },
  data () {
    return {
      isChopzi: window.location.hostname === 'chopzi.com' || window.location.hostname === 'localhost',
      cupon: '',
      loadingState: false,
      orderDate: null,
      orderWhen: window.location.hostname === 'chopzi.com' ? '0' : null,
      paypal: window.paypal,
      deliveryPrice: 0,
      CheckAv: 1,
      CheckTDD: false,
      CheckTDC: false,
      confirm: false,
      tipEnvio: window.location.hostname === 'chopzi.com' ? '0' : null,
      lbDelivery: 'Deli',
      addId: null,
      validAddress: true,
      step: window.location.hostname === 'chopzi.com' ? 2 : 1,
      maximizedToggle: true,
      ordenar: false,
      notifications: 0,
      leftDrawerOpen: false,
      pagoSel: null,
      totalPrice: 0,
      photoType: '',
      photoUpload: false,
      photoMessage: true,
      photoSRC: '',
      allowBuy: true
    }
  },
  created () {
    console.log('created page')
    // this.bindLocalizations()
    this.bindPaymentServ().then(() => {
    }).catch(e => console.error('error fetching data firebase', { e }))
    console.log(this.cart)
    console.log(this.$refs)
    this.bindConfigs() // .then(e => this.getDays())
    this.bindOrders(this.currentUser.id)
    this.bindTransactions()
    this.bindRates().catch(e => console.error('error fetching data firebase', { e }))
    console.log(this.rates)
  },
  mounted () {
    console.log('mounted')
    this.getDays()
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    ...mapActions('order', ['bindOrders', 'addOrder']),
    ...mapActions('transactions', ['bindTransactions']),
    ...mapMutations('menu', ['delCart']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindPaymentServ', 'bindConfigs', 'bindRates']),
    ...mapActions('editor', ['bindBlocks']),
    dateOptions (date) {
      if (typeof this.configDates === 'undefined') { return new Date(date + ' 23:59:59') >= new Date() }
      let sedecfg = this.configDates
      let today = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
      if (!sedecfg.days[today][0].isOpen) {
        return false
      }
      return new Date(date + ' 23:59:59') >= new Date()
    },
    hourOptions (hr) {
      return hr >= parseInt(new Date(new Date().getTime() + 80 * 60000).toLocaleTimeString('en-GB', { hour: '2-digit' }))
    },
    minuteOptions (min) {
      if (min === null) { return true }
      return min >= parseInt(new Date(new Date().getTime() + 80 * 60000).toLocaleTimeString('en-GB', { minute: '2-digit' }))
    },
    optionsFnTime (hr, min) {
      console.log({ hr, min })
      if (typeof this.configDates === 'undefined') {
        if (!this.hourOptions(hr)) {
          return false
        }
        if (!this.minuteOptions(min)) {
          return false
        }
        return true
      }
      let sedecfg = this.configDates
      let today = new Date(this.orderDate).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
      if (min === null) {
        for (let i of sedecfg.days[today]) {
          let open = parseInt(i.open.slice(0, 2))
          let close = parseInt(i.close.slice(0, 2))
          if (hr >= open && hr <= close) {
            return true
          }
        }
      } else {
        for (let i of sedecfg.days[today]) {
          let openhr = parseInt(i.open.slice(0, 2))
          let openmin = parseInt(i.open.slice(2, 4))
          let closehr = parseInt(i.close.slice(0, 2))
          let closemin = parseInt(i.close.slice(2, 4))
          if (hr >= openhr && hr <= closehr && (hr === openhr ? min >= openmin : true) && (hr === closehr ? min <= closemin : true)) {
            return true
          }
        }
      }
      return false
    },
    setLoadingState () {
      this.loadingState = true
      setTimeout(() => {
        this.loadingState = false
      }, 1500)
    },
    showme () {
      this.$nextTick(() => console.log(this.$refs))
      if (this.checkCartType[0] > 0 && this.checkCartType[1] === 0) {
        this.step = 2
      }
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
        color: 'red',
        actions: [
          { label: 'X', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },
    showDefaultPhoto (e) {
      return e === '' ||
        e === null ||
        e === undefined
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
    getOrders () {
      return this.orders.find(obj => {
        return obj.customer_id === this.currentUser.id
      })
    },
    getRates (mto) {
      let mtoTotal = 0
      let rate
      if (typeof this.rates !== 'undefined' && this.rates.length) {
        rate = this.rates.find(obj => {
          return obj.currency === 'Bs'
        })
      }
      if (typeof mto !== 'undefined' && rate && rate.rateValue) {
        mtoTotal = rate.rateValue * mto
      }
      return mtoTotal
    },
    getDays () {
      let timeStamp = Date.now()
      let today = date.formatDate(timeStamp, 'dddd').toLowerCase()
      let sedecfg = this.configDates
      console.log('getDays')
      console.log(this.configDates)
      console.log(this.configurations)
      console.log('sedecfg', sedecfg)
      console.log(today)
      console.log(this.sede)
      if (typeof sedecfg !== 'undefined' && typeof this.configDates !== 'undefined') {
        let hr = sedecfg.days[today][0].close.substr(0, 2)
        let min = sedecfg.days[today][0].close.substr(2, 2)
        if (sedecfg.status === 1) {
          this.allowBuy = true
        } else {
          if (!sedecfg.days[today][0].isOpen) {
            this.allowBuy = false
          } else {
            if (this.optionsFnTime(hr, min)) {
              this.allowBuy = false
            } else {
              this.allowBuy = true
            }
          }
        }
        console.log(this.allowBuy)
      } else {
        this.allowBuy = true
      }
    },
    getTransactions () {
      return this.transactions.find(obj => {
        return obj.orderId === '' // && obj.customer_id === this.currentUser.id
      })
    },
    makeOrder (details) {
      this.$q.loading.show()
      if (this.tipEnvio !== '1') { this.addId = '' }
      let orderWhen = {
        orderWhen: this.orderWhen,
        orderDate: this.orderDate === null || typeof this.orderDate === 'undefined' ? 'NA' : new Date(this.orderDate)
      }
      let deliveryview = this.deliveryPrice
      console.log({ orderWhen })
      console.log({ deliveryview })
      let order = { photo: this.photoSRC, orderWhen, sede: this.sede, cart: this.cart, tipEnvio: this.tipEnvio, address: this.addId, typePayment: this.pagoSel, customer_id: this.currentUser.id, status: 0, table: 0, delivery: this.deliveryPrice, paid: this.tipEnvio === '1' ? parseFloat((parseFloat(this.getTotalCarrito()[2]) + parseFloat(this.deliveryPrice)).toFixed(2)) : parseFloat((parseFloat(this.getTotalCarrito()[2])).toFixed(2)) }
      if (typeof details !== 'undefined' && typeof details.id === 'undefined') { order = { ...order, paypal: details } }
      if (typeof details !== 'undefined' && typeof details.id !== 'undefined') { order = { ...order, onlinePay: details } }
      switch (this.pagoSel) {
        case 2:
          order = { ...order, payto: this.config.zelleEmail }
          break
        case 4:
          order = { ...order, payto: this.config.venmoAcc }
          break
        default:
          break
      }
      this.addOrder({ ...order }).then(e => {
        console.log(order)
        this.ordenar = false; this.delCart()
        let ordersFortransactions = this.getOrders()
        console.log('ordersFortransactions', ordersFortransactions.id)
        let orderbytransaction = this.getTransactions()
        console.log('orders', this.orders)
        console.log('transactions', this.transactions)
        console.log('ordertransactions', orderbytransaction)
        this.$router.push({ path: '/orders/index' })
        this.$q.loading.hide()
      }).catch(() => this.$q.loading.hide())
    },
    getTotalCarrito () {
      // console.log({ cart: this.cart })
      var sumProd = 0
      var sumExtra = 0
      this.cart.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        sumExtra = (this.totalItComp(e.items) * e.quantity) + sumExtra
      })
      this.totalPrice = sumProd + sumExtra
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    getProdValById (id, val, type) {
      // console.log({ id, val, type })
      if (type === 0) {
        var obj = this.menu.find(e => { return e.id === id })
        if (typeof obj === 'undefined') {
          return 'El Producto no existe o fue eliminado, porfavor quitar del carrito'
        }
        return obj[val]
      } else {
        obj = this.promos.find(e => { return e.id === id })
        if (typeof obj === 'undefined') {
          return 'El Producto no existe o fue eliminado, porfavor quitar del carrito'
        }
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
    },
    payment (status) {
      let that = this
      console.log(status)
      if (status && status.data && status.data.trx && status.data.trx.trx_status === 'approved') {
        this.CheckTDD = true
        console.log('CheckTDD : ', this.CheckTDD)
        that.$q.loading.show({
          delay: 400
        })
        this.makeOrder(status.data)
      }
    },
    paymentTDC (respuesta) {
      // let that = this
      let responseHeader = respuesta.HEADER_PAGO_RESPONSE
      let responseBody = respuesta.BODY_PAGO_RESPONSE
      if (responseBody.CODIGO_RETORNO === '200') {
        console.log(responseBody.CODIGO_RETORNO)
        this.$q.dialog({
          title: 'Transacción procesada',
          message: 'Transacción  procesarse codigo de confirmacion :' + responseBody.NUMERO_CONFIRMACION
        })
        this.CheckTDC = true
      } else {
        console.log(responseHeader.CODIGO_MENSAJE_USUARIO)
        this.$q.dialog({
          title: 'Error',
          message: 'Error transacción no pudo procesarse, intente más tarde'
        })
        this.CheckTDC = false
      }
    },
    showPhotoUpload () {
      this.photoUpload = true
      this.photoType = Math.random().toString(16).substr(2, 8)
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      console.log(info)
      let fileNames = []
      info.files.forEach(file => fileNames.push(file))
      console.log('info payment: ' + info.files[0])
      this.photoSRC = info.files[0]
      this.photoUpload = false
      this.photoMessage = false
      this.CheckTDD = true
      this.$q.notify({
        message: `Foto subida correctamente`,
        color: 'primary'
      })
    }
  },
  watch: {
    CheckAv () {
      if (this.CheckAv === 2) this.showNotif()
    },
    menu () {
      for (let index in this.cart) {
        let item = this.cart[index]
        this.checkAvail(item.prodId, item.prodType, index)
      }
    },
    pagoSel () {
      if (this.pagoSel === 3) {
        this.$nextTick(() => {
          let that = this
          this.paypal.Buttons({
            createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: that.tipEnvio === '1' ? parseFloat(that.getTotalCarrito()[2]) + parseFloat(that.deliveryPrice) : that.getTotalCarrito()[2]
                  }
                }]
              })
            },
            onApprove: function (data, actions) {
              // This function captures the funds from the transaction.
              that.$q.loading.show({
                message: ''
              })
              console.log({ data })
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                console.log({ details })
                that.makeOrder(details)
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
  .q-page-container
    overflow hidden
  .menuTop
    height 50px
    margin-left 10%
    padding-top 20px
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
  .filler-bottom
    padding-bottom 50px
</style>
