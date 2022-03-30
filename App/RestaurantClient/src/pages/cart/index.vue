<template>
  <q-page padding class="q-fullscreen-glassMorph">
        <div class="menudiv2" >
         <div class="text-h5 menuTop q-mt-md">Tu Carrito</div>
         <div class="column items-center">
         <q-list v-for="(item, index) in cart" :key="index" class="full-width">
           <classic-list
            :photo="getProdValById(item.prodId, 'photo', item.prodType)"
            :name="getProdValById(item.prodId, 'name', item.prodType)"
            :priceDisplay="extrasTotalItem(item) ? 'Precio base ' + priceDisplay(item) : priceDisplay(item)"
            :item="item"
            :cart="cart"
            :discount="getProdValById(item.prodId, 'discount', item.prodType)"
            :totalItComp="totalItComp(item.items)"
            :subTotalItem="subTotalItem(item)"
            :Total="roundNumber(subTotalItem(item) + extrasTotalItem(item))"
            :extrasTotalItem="extrasTotalItem(item)"
            @up="modEventUp(item, index)"
            @down="modEventDown(item, index)"
            @delcart="delCartItem(index)"
           />
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
              <div class="row" v-if="cupons.length">
                  <p class="col-6">Cupones:</p> <p class="text-right col-6">- {{getTotalCarrito()[3].toFixed(2)}}</p>
              </div>
              <div class="row">
                  <p class="col-6">Total:</p> <p class="text-right col-6">$ {{getTotalCarrito()[2].toFixed(2)}}</p>
              </div>
            </div>
          </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="q-pa-lg">
            <div class="column items-center">
            <q-btn :disable="loadingState" class="q-pr-lg q-mb-md q-pl-lg text-weight-thin" v-if="cupon.length"  @click="useCupon()" no-caps rounded color="secondary" label="Aplicar cupón"></q-btn>
            <div class="text-caption text-center">Ingresar Código del cupón</div>
            <q-input filled
              style="width: 60%" v-model="cupon" :loading="loadingState" />
            </div>
          </q-card-section>
          <q-card-actions class="q-pa-md column items-center" >
            <p v-if="CheckAv === 2">
              Hay un producto que no cumple con la disponibilidad en su carrito, porfavor disminuya la cantidad o eliminelo antes de continuar
            </p>
            <div v-if="loadingConfig">
              <q-spinner color="primary" size="3em" />
            </div>
            <div v-else>
            <div v-if="allowBuy">
              <q-btn name="cart" no-caps class="q-pr-xl q-pl-xl text-weight-thin" rounded color="primary" v-if="cart.length && (CheckAv === 1 || CheckAv === 0)" @click="ordenar = true">
              Siguiente
              </q-btn>
            </div>
            <div class="q-pt-lg" vertical v-if='!allowBuy'>
                <p> En estos momentos estamos cerrados vuelve pronto</p>
            </div>
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
                          <q-item v-if="getLocBySede('Delivery')">
                            <q-radio v-show="config.statusDelivery" class="q-pa-sm" dense v-model="tipEnvio" val=1 :label="`Delivery`"/>
                          </q-item>
                          <q-item v-if="getLocBySede('PickUP')">
                            <q-radio v-show="config.statusPickup" class="q-pa-sm" dense v-model="tipEnvio" val=0 label="Pick-up" />
                          </q-item>
                          <q-item v-if="getLocBySede('Inlocal')">
                            <q-radio v-show="config.statusInlocal" class="q-pa-sm" dense v-model="tipEnvio" val=2 label="In-Local" />
                        </q-item>
                        <q-item v-if="getLocBySede('Seller')">
                            <q-radio v-show="config.statusSeller" class="q-pa-sm" dense v-model="tipEnvio" val=3 label="Orden de Compra" />
                        </q-item>

                         <q-item v-if="getLocBySede('Encomienda')">
                            <q-radio v-show="config.statusEncomienda" class="q-pa-sm" dense v-model="tipEnvio" val=4 label="Encomienda" />
                        </q-item>
                      </q-list>
                     </div>
                     <div class="col-6 q-pt-xl" style="min-width: 350px">
                       <q-card v-show="typeof tipEnvio !== 'undefined'" class="q-pa-xl q-cardGlass" style="border-radius: 28px">
                         <q-card-section v-if="tipEnvio !== '3'">
                           <div class="text-h5">¿Para cuando quiere su pedido?</div>
                           <p v-if="checkCartType[0] > 0" class="text-caption"> * Solo aplica para los productos en los cual no se ha seleccionado en la fecha</p>
                            <div class="q-gutter-sm">
                              <q-radio v-model="orderWhen" val=0 label="Lo más pronto posible" />
                              <q-radio v-model="orderWhen" val=1 label="Fecha en específico" />
                            </div>
                            <div v-if="orderWhen == 1" class="q-pt-md" style="max-width: 300px">Micasa
                              <q-input filled readonly v-model="orderDate" hint="Seleccione Fecha y hora, esta hora es estimada para un mejor seguimiento contáctenos">
                                <template v-slot:prepend>
                                  <q-icon @click="openDate = !openDate" name="event" class="cursor-pointer">
                                    <q-dialog persistent v-model="openDate" transition-show="scale" transition-hide="scale">
                                      <q-date :options="dateOptions" v-model="orderDate" mask="YYYY-MM-DD HH:mm">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup @click="openHours = !openHours" label="Close" color="primary" flat />
                                        </div>
                                      </q-date>
                                    </q-dialog>
                                  </q-icon>
                                </template>

                                <template v-slot:append>
                                  <q-icon @click="openHours = !openHours" name="access_time" class="cursor-pointer">
                                    <q-dialog persistent v-model="openHours" transition-show="scale" transition-hide="scale">
                                      <q-time @input="canCloseHours = true" :disable="orderDate === null" :options="optionsFnTime2" v-model="orderDate" mask="YYYY-MM-DD HH:mm" format24h>
                                        <div class="row items-center justify-end">
                                          <q-btn v-if="canCloseHours" @click="canCloseHours = false; openHours = false" v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-time>
                                    </q-dialog>
                                  </q-icon>
                                </template>
                              </q-input>
                            </div>
                         </q-card-section>
                         <q-card-section v-else>
                           <div class="text-h5">Escoja o agregue un cliente</div>
                           <client-list @hook:mounted="ordCompraBranch = null; ordCompraClient = null" @branchInput="(e) => ordCompraBranch = e" @clientInput="(e) => ordCompraClient = e"/>
                         </q-card-section>
                         <q-card-section v-show="!['0', '2', '3','4'].includes(tipEnvio)" >
                          <div class="text-h5"> Mis direcciones</div>
                          <p v-if="!validAddress" class="text-caption text-bold text-center text-red"> * Dirección no valida, no se encuentra dentro de las zonas permitidas</p>
                          <addresses @update-price="(e) => deliveryPrice = e"  class="q-pt-md" @invalid-address="(e) => validAddress = e" v-model="addId"/>
                         </q-card-section>
                          <q-card-section>
                             <q-card-section v-show="!['0', '1', '2','3'].includes(tipEnvio)" >
                          <div class="text-h5"> Mis direcciones</div>

                            <Address2
                           @update-price="(e) => deliveryPrice = e" :cart="cart" :rate ="this.ratesComp.find(obj => {
        return obj.currency === 'Bs'
      })" class="q-pt-md" @invalid-address="(e) => validAddress = e" v-model="addId"
                             @tarifa2-done ='obtenertarifa'/>
                         </q-card-section>
                         <q-card-section>
                           </q-card-section>
                           <div class="column items-center">
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 1 && addId != null && validAddress && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="(tipEnvio == 0 || tipEnvio == 2) && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 3 && ordCompraClient !== null && ordCompraBranch !== null && ordCompraClient !== '' && ordCompraBranch !== ''" @click="makeOrder()" label="Registrar compra" />
                           <q-btn rounded no-caps color="primary" v-if="tipEnvio == 1  && deliveryPrice != 0 && addId != null && validAddress && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 4  && continuar != false  && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
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
                        <div style="min-width: 300px" class="col-6 q-pt-xl"  v-if="pagoSel === 10">
                        <div class="text-center">
                          <div class="text-h5 ">Dolares</div>
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
                        <div style="min-width: 300px" class="col-6 q-pt-xl"  v-if="pagoSel === 11">
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
                                  <div>make
                                  <q-btn style="border-radius: 28px;" push>
                                      <q-avatar rounded class="q-mb-sm" icon="collections" font-size="50px" size="130px" text-color="grey-4" >
                                      </q-avatar>
                                      <p v-if="pagoSel != 1">Haga click para cargar la captura del pago realizado </p>
                                      <p v-if="pagoSel == 1">Haga click para cargar foto del efectivo </p>
                                  </q-btn>
                                  </div>
                                </div>
                                <div class=" column items-center">
                                <img :src="photoSRC" class="q-mb-sm" style="width:100%; max-width: 300px;">
                                </div>
                           </div>
                        </q-card-section>
                        </q-card>
                    </div>
                    <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 6">
                    <div v-if="ratesComp.length">
                     <debitPayment
                      :ordersId=currentUser.cedula
                      :amount="getRates(totalPrice + deliveryPrice)"
                      @payment-done='payment' />
                     </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                     <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 9">
                    <div v-if="ratesComp.length">
                     <creditPayment
                      :ordersId=currentUser.cedula
                      :credit="true"
                      :amount="getRates(totalPrice + deliveryPrice)"
                      @payment-done='payment' />
                     </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                      <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 10">
                       <div v-if="ratesComp.length">
                       <NovaredPayment
                         :ordersId=currentUser.cedula
                         :credit="true"
                          :total="totalPrice"
                          :delivery ="deliveryPrice"
                        @payment-done='payment' />

                        </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                      <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 11">
                       <div v-if="ratesComp.length">
                       <NovaredPagomovil
                         :ordersId=currentUser.cedula
                         :credit="true"
                          :total="getRates(totalPrice)"
                          :delivery ="getRates(deliveryPrice)"
                        @payment-done='payment' />

                        </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                    <div class="q-pt-md col-12 column items-center">
                      <div>
                      <div v-if="tipEnvio === '1' || tipEnvio === '4'" >
                        <div class="text-h6">SubTotal: $ {{(getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div class="text-h6">Delivery o  Encomienda: $ {{parseFloat(deliveryPrice)}}</div>
                      </div>
                        <div class="text-h6" >Total: $ {{(tipEnvio === '1' || tipEnvio === '4' ? parseFloat(getTotalCarrito()[2]) + parseFloat(deliveryPrice) : getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div v-if="ratesComp.length">
                        <div class="text-h6" v-if="pagoSel == 0  || pagoSel == 6 ||  pagoSel == 7 ||  pagoSel == 8 ||  pagoSel == 9  ||  pagoSel == 10  ||  pagoSel == 11" >Total: Bs
                          {{ parseFloat((getRates(parseFloat(totalPrice) + parseFloat(deliveryPrice))).toFixed(2)).toLocaleString()}}
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
            <photo-upload
              :row="photoSRC"
              :photoUpload="photoUpload"
              @updated="uploadComplete"
            />
      </q-dialog>
   </q-page>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// import Addresses from '../../components/addresses.vue'
import payCreditCorp from '../../components/payCreditCorp.vue'
import debitPayment from '../../components/payment/debit'
import creditPayment from '../../components/payment/credit'
import { QUploaderBase, date } from 'quasar'
import NovaredPayment from '../../components/payment/novared.vue'
import NovaredPagomovil from '../../components/payment/pagomovilnovared.vue'
import photoUpload from '../../components/photoUpload/uploadphoto.vue'
import ClassicList from '../../components/cart/classicList/classicList.vue'
import Addresses from '../../components/addresses.vue'
import clientList from '../../components/seller/clientlist.vue'
import Address2 from '../../components/address2.vue'
export default {
  mixins: [ QUploaderBase ],
  components: {
    // 'itemcomp': () => import('../../components/itemComp.vue'),
    // 'fbq-uploader': () => import('../../components/FBQUploader20.vue'),
    payCreditCorp: payCreditCorp,
    // Addresses,
    debitPayment,
    clientList,
    creditPayment,
    NovaredPayment,
    NovaredPagomovil,
    photoUpload,
    ClassicList,
    Addresses,
    Address2
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('transactions', ['transactions']),
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos', 'item']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates']),
    ...mapGetters('user', ['currentUser']),
    ratesComp () {
      if (this.rates.length) {
        return this.rates
      }
      return this.rateDefault
    },
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
      if (this.config && this.config.statusNovaredzelle) { tip.push({ label: 'Dolares', value: 10, color: 'blue' }) }
      if (this.config && this.config.statusNovaredpagomovil) { tip.push({ label: 'Pago Movil Bs', value: 11, color: 'blue' }) }
      return tip
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
      ordCompraClient: null,
      ordCompraBranch: null,
      continuar: false,
      canCloseHours: false,
      loadingConfig: true,
      cupons: [],
      openDate: false,
      openHours: false,
      isChopzi: window.location.hostname === 'chopzi.com' || window.location.hostname === 'localhost',
      cupon: '',
      rateDefault: null,
      loadingState: false,
      orderDate: null,
      orderWhen: window.location.hostname === 'chopzi.com' ? '0' : null,
      paypal: window.paypal,
      deliveryPrice: 0,
      CheckAv: 1,
      CheckTDD: false,
      CheckTDC: false,
      confirm: false,
      tipEnvio: window.location.hostname === 'chopzi.com' ? '0' : undefined,
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
      allowBuy: false,
      objetotarifa: {}
    }
  },
  async created () {
    this.bindPaymentServ().then(() => {
    }).catch(e => console.error('error fetching data firebase', { e }))

    this.bindConfigs().then(() => { this.loadingConfig = false }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindOrders(this.currentUser.id)
    this.bindTransactions()
    await this.bindRates().then(async e => {
      if (!e.length) {
        await this.$axios.get('https://s3.amazonaws.com/dolartoday/data.json')
          .then(e => { this.rateDefault = [{ rateValue: e?.data?.USD?.promedio, currency: 'Bs' }] }).catch(e => console.error('error fetching data ratesApi', { e }))
      }
    }).catch(e => console.error('error fetching data firebase', { e }))
  },
  mounted () {

  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    ...mapActions('order', ['bindOrders', 'addOrder']),
    ...mapActions('transactions', ['bindTransactions']),
    ...mapMutations('menu', ['delCart']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindPaymentServ', 'bindConfigs', 'bindRates']),
    ...mapActions('editor', ['bindBlocks']),
    async useCupon () {
      this.loadingState = true
      const { cupon, cupons } = this
      if (!cupon?.length) {
        return
      }
      if (cupons?.some(item => item.name === cupon.toUpperCase())) {
        this.loadingState = false
        return this.$q.notify({ message: 'Cupón ya aplicado', color: 'red', position: 'top' })
      }
      let res
      try {
        const url = window.location.origin + '/getcoupon'

        res = await this.$axios.post(url, { ambiente: localStorage.getItem('amb'), cupon: cupon.toUpperCase() })

        console.log({ res })
      } catch (e) {
        console.error(e)
        return this.$q.notify({ message: 'Error de conexión', color: 'red', position: 'top' })
      } finally {
        this.loadingState = false
      }
      if (res?.data?.empty) {
        return this.$q.notify({ message: 'Cupón no válido', color: 'red', position: 'top' })
      } else {
        this.$q.notify({ message: 'Cupón aplicado', color: 'blue', position: 'top' })
        cupons.push(res?.data)
        this.cupon = ''
      }
    },
    modEventDown (item, index) {
      this.modCartVal({ id: index, key: 'quantity', value: (parseInt(item.quantity) - 1) })
      this.checkAvail(item.prodId, item.prodType, index)
      if (item.quantity < 1) {
        this.modCartVal({ id: index, key: 'quantity', value: 1 })
      }
    },
    modEventUp (item, index) {
      if (this.checkAvail(item.prodId, item.prodType, index)[0] === 1) {
        this.modCartVal({ id: index, key: 'quantity', value: (parseInt(item.quantity) + 1) })
      }
    },
    priceDisplay (item) {
      let prodPrice = this.getProdPrice(item)
      let classes = ''
      let discount = ''
      if (this.$q.screen.lt.md) {
        classes += 'text-caption '
      }
      if (prodPrice[1]) {
        classes += 'text-strike'
        discount = `<span>$ ${prodPrice[1]}</span>`
      }
      return `<span class="${classes}" >$ ${prodPrice[0]}</span> ${discount}`
    },
    subTotalItem (item) {
      try {
        let subtotal = this.getProdPrice(item)[1] || this.getProdPrice(item)[0]
        return this.roundNumber(subtotal)
      } catch (e) {
        console.error(e)
        return 'Precios no encontrados'
      }
    },
    extrasTotalItem (item) {
      try {
        let subtotal = this.totalItComp(item.items)
        let discount = this.getProdValById(item.prodId, 'discount', item.prodType) || 0
        discount = 1 - (discount / 100)
        let total = subtotal * discount * item.quantity
        return this.roundNumber(total)
      } catch (error) {
        console.error(error)
        return 'Precios no encontrados'
      }
    },
    dateOptions (date) {
      if (typeof this.configDates === 'undefined') { return new Date(date + ' 23:59:59') >= new Date() }
      let sedecfg = this.configDates
      let today = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
      if (!sedecfg.days[today][0].isOpen) {
        return false
      }
      return new Date(date + ' 23:59:59') >= new Date()
    },
    optionsFnTime2 (hr, min) {
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
    optionsFnTime (hrClose, minClose, hrOpen, minOpen) {
      let open = new Date()
      open.setHours(hrOpen, minOpen, 0, 0)
      console.log(open, 'OPEEEN')
      let close = new Date()
      close.setHours(hrClose, minClose, 0, 0)
      console.log(close, 'Close')
      let now = new Date()
      if (open < now && now < close) {
        console.log('Chuquiti')
        return true
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
    obtenertarifa (tarif) {
      this.objetotarifa = tarif
      console.log('objeto tarifa', this.objetotarifa)
      if (this.objetotarifa.tipoTarifa === 'nacional') {
        let rate = this.ratesComp.find(obj => {
          return obj.currency === 'Bs'
        })
        console.log('este es valor rate', rate.rateValue, 'el valor de tarifa.total', this.objetotarifa.tarifa.total)
        let valor = (parseFloat(this.objetotarifa.tarifa.total) / parseFloat(rate.rateValue))
        this.deliveryPrice = valor.toFixed(2)
        console.log('el valor de this.deliveryPrice', valor)
      } else {
        this.deliveryPrice = 0
      }
      this.continuar = true
    },
    totalItComp (its) {
      var sum = 0
      its.forEach(x => {
        let qty = x.quantity ?? 1
        sum = sum + (x.price * qty)
        sum = parseFloat(sum.toFixed(2))
        // if (typeof x.quantity === 'undefined') {
        //   sum = sum + x.price
        // } else {
        //   sum = sum + (x.price * x.quantity)
        // }
      })
      // // console.log({ sum })
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
      console.log(this.sede)
      if (typeof locs === 'undefined') { return false }
      return locs[tip]
    },
    getStock (id, type) {
      if (!type) {
        // // console.log({ cart: this.cart })
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
      if (typeof this.ratesComp !== 'undefined' && this.ratesComp.length) {
        rate = this.ratesComp.find(obj => {
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

      if (typeof sedecfg !== 'undefined' && typeof this.configDates !== 'undefined') {
        for (let today1 of sedecfg.days[today]) {
          let hrClose = today1.close.substr(0, 2)
          let minClose = today1.close.substr(2, 2)
          let hrOpen = today1.open.substr(0, 2)
          let minOpen = today1.open.substr(2, 2)
          if (sedecfg.status === 1) {
            this.allowBuy = true
            return
          }
          if (this.optionsFnTime(hrClose, minClose, hrOpen, minOpen)) {
            this.allowBuy = true
            return
          }
        }
      } else {
        this.allowBuy = true
      }
      // // console.log(this.allowBuy)
    },
    getTransactions () {
      return this.transactions.find(obj => {
        return obj.orderId === '' // && obj.customer_id === this.currentUser.id
      })
    },
    getSede () {
      return this.localizations.find(x => x.id === this.sede)
    },
    makeOrder (details) {
      console.log('este valor del registro', details)
      this.$q.loading.show()
      if (this.tipEnvio !== '1') { this.addId = '' }
      let orderWhen = {
        orderWhen: this.orderWhen,
        orderDate: this.orderDate === null || typeof this.orderDate === 'undefined' ? 'NA' : new Date(this.orderDate)
      }
      let deliveryview = this.deliveryPrice
      console.log({ orderWhen })
      console.log({ deliveryview })
      let customer = this.currentUser
      let cartManage = this.cartMan()
      let order = { productos: cartManage, photo: this.photoSRC, orderWhen, sede: this.getSede(), cart: this.cart, tipEnvio: this.tipEnvio, typePayment: this.pagoSel, customer, customer_id: this.currentUser.id, status: 0, table: 0, delivery: this.deliveryPrice, paid: (this.tipEnvio === '1' || this.tipEnvio === '4') ? parseFloat((parseFloat(this.getTotalCarrito()[2]) + parseFloat(this.deliveryPrice)).toFixed(2)) : parseFloat((parseFloat(this.getTotalCarrito()[2])).toFixed(2)) }
      if (this.addId && this.addId.id) {
        order = { ...order, address: this.addId.id, addressC: this.addId }
      }
      if (typeof details !== 'undefined' && typeof details.id === 'undefined') { order = { ...order, paypal: details } }
      if (typeof details !== 'undefined' && typeof details.id !== 'undefined') { order = { ...order, onlinePay: details } }
      if (this.cupons?.length) {
        order.cupons = this.cupons
      }
      switch (this.pagoSel) {
        case 2:
          order = { ...order, payto: this.config.zelleEmail }
          if (this.objetotarifa !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          break
        case 4:
          order = { ...order, payto: this.config.venmoAcc }
          if (this.objetotarifa !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          break
        case 10:
          let aux = order.onlinePay
          delete order.onlinePay
          console.log('valores de aux', aux)
          let reg1 = {
            idtransaccion: aux.id.data.trx,
            referencia: aux.referencia,
            telefono: aux.telefono,
            correo: aux.correo,
            formapago: aux.formaPago
          }
          order = { ...order, onlinePay: reg1 }
          if (this.objetotarifa !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }

          console.log('los valores', order.onlinePay)
          order = { ...order, payto: this.config.zelleEmail }
          break
        case 11:
          let aux1 = order.onlinePay
          delete order.onlinePay
          console.log('valores de aux', aux1)
          let reg = {
            idtransaccion: aux1.id.data.trx,
            referencia: aux1.referencia,
            telefono: aux1.telefono,
            correo: aux1.correo,
            formapago: aux1.formaPago
          }
          if (this.objetotarifa !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          order = { ...order, onlinePay: reg }
          console.log('los valores', order.onlinePay)
          order = { ...order, payto: this.config.pagomovil }
          break
        default:
          break
      }
      console.log('este valor del registro', order)
      // Add shipping and billing address for Seller buyOrder
      if (this.tipEnvio === '3') {
        order = {
          ...order,
          buyOrderClient: this.ordCompraClient.id,
          buyOrderBranch: this.ordCompraBranch.id,
          buyOrder: {
            Client: this.ordCompraClient,
            Branch: this.ordCompraBranch
          },
          address: this.ordCompraBranch.shippingAddress,
          addressC: this.ordCompraBranch.shippingAddressC
        }
      }
      this.addOrder({ ...order }).then(e => {
        // console.log(order)
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
    cartMan () {
      let productos = {}
      console.log(this.cart, 'Elcarrito no iterable?')
      for (let prod in this.cart) {
        let prods = this.cart[prod]
        let items = {}
        for (let item of prods.items) {
          items[item.item] = item
        }
        productos[prods.prodId + prod] = { ...prods, items: items }
      }
      return productos
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      // console.log(this.cupons)
      let cupon = 0
      this.cart.forEach(e => {
        let sub = this.subTotalItem(e)
        let extra = this.extrasTotalItem(e)
        if (this.cupons?.length) {
          for (let i of this.cupons) {
            let excludeProd = !i.exclude?.products?.include?.(e.prodId)
            let excludeCategory = !i.exclude?.categories?.some?.(item => e.category?.includes(item))
            let excluyente = i.includeAll && excludeProd && excludeCategory
            let incluyente = !i.includeAll && (i.include?.products?.include?.(e.prodId) || i.include?.categories?.some?.(item => e.category?.includes(item)))
            console.log(excluyente, incluyente, e.name, excludeProd, excludeCategory)
            let disctot = 0
            if (i.discount && (excluyente || incluyente)) {
              let disc = (1 - i.discount / 100)
              let subdisc = sub * disc
              let extradisc = extra * disc
              disctot = (sub - subdisc) + (extra - extradisc)
              // sub = subdisc
              // extra = extradisc
              cupon += disctot
            }
          }
        }
        sumProd = sub + sumProd
        let toSumExtra = extra
        sumExtra = toSumExtra + sumExtra
      })
      let totalPrice = this.roundNumber(sumProd + sumExtra)
      sumProd = this.roundNumber(sumProd)
      sumExtra = this.roundNumber(sumExtra)
      if (this.cupons.length) {
        for (let i of this.cupons) {
          if (i.amount) {
            cupon += i.amount
          }
        }
      }
      totalPrice = totalPrice - cupon
      this.totalPrice = totalPrice
      return [sumProd, sumExtra, totalPrice, cupon]
    },
    roundNumber (num) {
      return parseFloat(num.toFixed(2))
    },
    getProdPrice (item) {
      let check = item ?? false
      if (!check) {
        return 'Valor no encontrado'
      }
      if (item.reward) {
        return [0, 0]
      }
      let price2
      const product = this.getProd(item.prodId, item.prodType)
      let price = (product.price * item.quantity)
      if (product.discount) {
        price2 = price * (1 - (product.discount / 100))
        price2 = parseFloat(price2.toFixed(2))
      }
      // // console.log({ item }, 'geprodprice')
      return [price, price2]
    },
    getProd (id, type) {
      if (type === 0) {
        var obj = this.menu.find(e => { return e.id === id })
        if (typeof obj === 'undefined') {
          return 'El Producto no existe o fue eliminado, porfavor quitar del carrito'
        }
        return obj
      } else {
        obj = this.promos.find(e => { return e.id === id })
        if (typeof obj === 'undefined') {
          return 'El Producto no existe o fue eliminado, porfavor quitar del carrito'
        }
        return obj
      }
    },
    getProdValById (id, val, type) {
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

      }
    },
    payment (status) {
      let that = this
      // console.log(status)
      if (status && status.data && status.data.trx && status.data.trx.trx_status === 'approved') {
        this.CheckTDD = true
        // console.log('CheckTDD : ', this.CheckTDD)
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
        // console.log(responseBody.CODIGO_RETORNO)
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
      // console.log('info payment: ' + info)
      this.photoSRC = info
      this.photoUpload = false
      this.photoMessage = false
      this.CheckTDD = true
    }
  },
  watch: {
    configDates () {
      this.getDays()
    },
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
              // console.log({ data })
              return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                // console.log({ details })
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
