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
                        <q-item v-if="getLocBySede('statusSeller') && currentUser && currentUser.typeAccess == 'Seller'">
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
                            <div v-if="orderWhen == 1" class="q-pt-md" style="max-width: 300px">
                              <!-- <q-date :options="dateOptions" v-model="orderDate" mask="YYYY-MM-DD HH:mm">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup @click="openHours = !openHours" label="Close" color="primary" flat />
                                        </div>
                                      </q-date>
                                      <q-time :options="optionsFnTime2" v-model="orderDate" mask="YYYY-MM-DD HH:mm" format24h>
                                        <div class="row items-center justify-end">
                                          <q-btn v-if="canCloseHours" @click="canCloseHours = false; openHours = false" v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-time> -->
                              <q-input filled readonly v-model="orderDate" hint="Seleccione Fecha y hora, esta hora es estimada para un mejor seguimiento contáctenos">
                                <template v-slot:prepend>
                                  <q-icon @click="openDate = !openDate" name="event" class="cursor-pointer">
                                    <q-dialog persistent v-model="openDate" transition-show="scale" transition-hide="scale">
                                      <q-date :options="dateOptions" v-model="orderDate" mask="YYYY-MM-DD HH:mm">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup :disable="orderDate === null" @click="openHours = !openHours" label="Close" color="primary" flat />
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
                             <q-card-section v-if="!['0', '1', '2','3'].includes(tipEnvio)" >
                          <div class="text-h5"> Mis direcciones</div>

                            <Address2
                            v-if="!['0', '1', '2','3'].includes(tipEnvio)"
                           @update-price="(e) => deliveryPrice = e" :cart="cart" :rate ="ratesComp.find(obj => {
        return obj.currency === 'Bs'
      })" class="q-pt-md" @invalid-address="(e) => validAddress = e" v-model="addId"
                             @tarifa2-done ='obtenertarifa' @valorcontinuar = 'falsecontinuar'/>
                         </q-card-section>
                         <q-card-section>
                           </q-card-section>
                           <div class="column items-center">
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 1 && addId != null && validAddress && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="(tipEnvio == 0 || tipEnvio == 2) && (orderWhen == 0 || (orderWhen == 1 && orderDate !== null))" @click="step = 2" label="Continuar" />
                          <q-btn rounded no-caps color="primary" v-if="tipEnvio == 3 && ordCompraClient !== null && ordCompraBranch !== null && ordCompraClient !== '' && ordCompraBranch !== ''" @click="makeOrder()" label="Registrar compra" />
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
                      <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        switch-toggle-side
        icon="attach_money"
        label="Efectivo"
        caption="Envia dinero en efectivo"
        header-class="text-blue"
        default-opened
      >
        <q-card>
          <q-card-section>
           <q-option-group
        :options="tipoPago.filter(e => e.transf ==='efectivo')"
        label="Notifications"
        type="radio"
        v-model="pagoSel"
        ></q-option-group>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        switch-toggle-side
        icon="credit_card"
        label="Tarjeta Debito/Crédito"
        caption="Tus pagos se realizan de forma segura"
        header-class="text-blue"
        default-opened
      >
        <q-card>
          <q-card-section>
                  <div align="center"><img src="../../assets/visa.png" style="width: 15%;padding-right: 2%;"><img src="../../assets/mastercard.png" style="width: 15%;padding-right: 2%;"><img src="../../assets/american.png" style="width: 15%;padding-right: 2%;"></div>
           <q-option-group
           :options="tipoPago.filter(e => e.transf ===true)"
           label="Notifications"
           type="radio"
           v-model="pagoSel"
           ></q-option-group>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        switch-toggle-side
        icon="account_balance_wallet"
        label="Transferencia"
        caption="Paga directamente en nuestra cuenta de manera eléctronica"
        header-class="text-blue"
        default-opened
      >
        <q-card>
          <q-card-section>
           <q-option-group
           :options="tipoPago.filter(e => e.transf ===false)"
           label="Notifications"
           type="radio"
           v-model="pagoSel"
           ></q-option-group>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
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
                                <img :src="photoSRC" class="q-mb-sm" style="width:100%; max-width: 300px;">
                                </div>
                           </div>
                        </q-card-section>

                        </q-card>
                                <q-card  class="q-pa-xl q-cardGlass"  style="margin-top: 15px; border-radius: 15px;" v-show="pagoSel == 1 || config.statusNovaredzelle || config.statuspagomovil" >
                          <q-card-section >

                            <div >
                              <label >SI DESEA PROCESAR VUELTO, INDIQUELO EN ESTA SECCION.</label>

                                 <div v-show="pagoSel == 1" class="card-input"><label  aria-label="monto" >Monto Enviado</label>
                                <q-input filled mask="########" v-show="pagoSel == 1" v-model="montoEnviar"  title="Monto Enviar" @input="calcularVuelto()" />
                              </div>
                              <div v-show="Vuelto > 0">
                                <p v-show="Vuelto > 0">Datos para el Vuelto</p>
                              </div>

                            </div>
                          <div class="card-input "><label  aria-label="Referencia"  v-show="Vuelto > 0  && config.statusNovaredzelle && !config.statuspagomovil" >Referencia</label></div>
                            <div class="row">
                            <div class="col col-md-8"><q-input  disable v-model="referenciacompleta"   v-show="Vuelto > 0  && config.statusNovaredzelle && !config.statuspagomovil" title="Referencia"  data-card-field="" autocomplete="off" maxlength="200"/>
                            </div>

                          <div class="col-6 col-md-4"  v-show="Vuelto > 0 && config.statusNovaredzelle && !config.statuspagomovil" ><i class="material-icons" style="font-size:24px" @click="copy(referenciacompleta)">content_copy</i>
                            </div>
        </div>
                          <div >
                              <div class="col-12">
                               <div>
                                 <q-select
                                  v-show="Vuelto > 0"
                                   bottom-slots
                                   v-model="BancoEnviar"
                                 :options="BancosEnviar"
                                 label="Banco"

                               />
                          </div>
                           </div>
                            <div v-show="Vuelto > 0" class="card-input"><label  aria-label="monto" >Telefono</label>
                            <q-input filled mask="(####) ###.##.##" v-show="Vuelto > 0" v-model="TelefonoEnviar" @input="validar" title="Telefono"  />
                          </div>
                          </div>
                           <div >
                              <div class="col-12">
                               <div>
                                 <q-select
                                  v-show="Vuelto > 0"
                                   bottom-slots
                                   v-model="nacionalidad"
                                 :options="nacionalidades"
                                 label="Nacionalidad"

                               />
                          </div>
                           </div>
                            <div v-show="Vuelto > 0" class="card-input"><label  aria-label="monto" >Cedula</label>
                            <q-input filled mask="########" v-show="Vuelto > 0" v-model="CedulaEnviar"  title="Cedula" @input="validar"  />
                         </div>
                         </div>
                          <div class="card-input "><label  aria-label="Referencia"  v-show="Vuelto > 0" >Vuelto Bs.</label></div>
                         <div class="col col-md-8"><q-input  disable v-model="montoV"   v-show="Vuelto > 0" title="Referencia"  data-card-field="" autocomplete="off" maxlength="200"/>
                            </div>

                          </q-card-section>
                        </q-card>
                    </div>
                    <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 6">
                    <div v-if="ratesComp.length">
                     <debitPayment
                      :ordersId=currentUser.cedula
                      :amount="getRates(parseFloat(totalPrice) + parseFloat(deliveryPrice))"
                      @payment-done='payment' />
                     </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                     <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 9">
                    <div v-if="ratesComp.length">
                     <creditPayment
                      :ordersId=currentUser.cedula
                      :credit="true"
                      :amount="getRates(parseFloat(totalPrice) + parseFloat(deliveryPrice))"
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
                          :delivery ="parseFloat(deliveryPrice)"
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
                          :delivery ="getRates(parseFloat(deliveryPrice))"
                        @payment-done='payment' />

                        </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                    <div style="min-width: 320px" class="col-6 q-pt-xl" v-if="pagoSel === 12">
                       <div v-if="ratesComp.length">
                       <Mercantilc2p
                         :ordersId=currentUser.cedula
                         :credit="true"
                          :total="getRates(totalPrice)"
                          :delivery ="getRates(parseFloat(deliveryPrice))"
                        @payment-done='payment' />

                        </div>
                     <div v-else>No hay tasa de cambio colocada</div>
                    </div>
                    <div class="q-pt-md col-12 column items-center">
                      <div>
                      <div v-if="tipEnvio === '1' || tipEnvio === '4'" >
                        <div class="text-h6">SubTotal: $ {{(getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div class="text-h6">Delivery o  Encomienda: $ {{parseFloat(deliveryPrice).toFixed(2)}}</div>
                      </div>
                        <div class="text-h6" >Total: $ {{(tipEnvio === '1' || tipEnvio === '4' ? parseFloat(getTotalCarrito()[2]) + parseFloat(deliveryPrice) : getTotalCarrito()[2]).toFixed(2)}}</div>
                        <div v-if="ratesComp.length">
                        <div class="text-h6" v-if="pagoSel == 0  || pagoSel == 6 ||  pagoSel == 7 ||  pagoSel == 8 ||  pagoSel == 9  ||  pagoSel == 10  ||  pagoSel == 11" >Total: Bs
                          {{ parseFloat((getRates(parseFloat(totalPrice) + parseFloat(deliveryPrice))).toFixed(2)).toLocaleString()}}
                        </div>
                        </div>
                        <div v-else>No hay tasa de cambio colocada</div>
                        <div v-if="CheckTDD ===true">
                        <q-btn @click="confirm = true" v-if="pagoSel !== null && nohayVuelto && pagoSel !== 3 && cart.length && (CheckAv === 1 || CheckAv === 0)" color="primary" no-caps rounded label="Finalizar orden" />
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
import { QUploaderBase, date, copyToClipboard } from 'quasar'
import NovaredPayment from '../../components/payment/novared.vue'
import NovaredPagomovil from '../../components/payment/pagomovilnovared.vue'
import photoUpload from '../../components/photoUpload/uploadphoto.vue'
import ClassicList from '../../components/cart/classicList/classicList.vue'
import Addresses from '../../components/addresses.vue'
import clientList from '../../components/seller/clientlist.vue'
import Address2 from '../../components/address2.vue'
import Mercantilc2p from '../../components/payment/Mercantilc2p.vue'
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
    Mercantilc2p,
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
    deshabilitarcontinuar () {
      return this.continuar !== false
    },
    desahabilitadocedula () {
      return this.CedulaEnviar === ''
    },
    desahabilitadotelefono () {
      return this.TelefonoEnviar === ''
    },
    desahabilitadoBanco () {
      return this.BancoEnviar === ''
    },
    desahabilitadonacionalidad () {
      return this.nacionalidad === ''
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
      // se agrega la variable de control transf: donde es true si es una transferencia  y false si es tarjeta en caso contrario efectivo
      var tip = []
      if (this.config && this.config.statusPto) { tip.push({ label: 'Punto de Venta', value: 0, color: 'red', transf: false }) }
      if (this.config && this.config.statusCash) { tip.push({ label: 'Efectivo ($)', value: 1, color: 'green', transf: 'efectivo' }) }
      if (this.config && this.config.statusZelle) { tip.push({ label: 'Zelle', value: 2, color: 'blue', transf: false }) }
      if (this.config && this.config.statusPaypal) { tip.push({ label: 'Tarjeta o Paypal', value: 3, color: 'blue', transf: true }) }
      if (this.config && this.config.statusVenmo) { tip.push({ label: 'Venmo', value: 4, color: 'blue', transf: true }) }
      if (this.config && this.config.statusCreditCorp) { tip.push({ label: 'Tarjeta de Credito', value: 5, color: 'blue', transf: true }) }
      if (this.config && this.config.statusMercantil) { tip.push({ label: 'Tarjeta Débito Mercantil', value: 6, color: 'blue', transf: true }) }
      if (this.config && this.config.statustransfer) { tip.push({ label: 'Transferencia Bancaria', value: 7, color: 'red', transf: true }) }
      if (this.config && this.config.statuspagomovil) { tip.push({ label: 'Pago móvil', value: 8, color: 'red', transf: false }) }
      if (this.config && this.config.statusMercantil) { tip.push({ label: 'Tarjeta Credito', value: 9, color: 'blue', transf: true }) }
      if (this.config && this.config.statusNovaredzelle) { tip.push({ label: 'Pasarela Pago Dolares', value: 10, color: 'blue', transf: false }) }
      if (this.config && this.config.statusNovaredzelle) { tip.push({ label: 'Pasarela Pago Movil Bs', value: 11, color: 'blue', transf: false }) }
      if (this.config && this.config.statuspagomovil) { tip.push({ label: 'Pago Movil Mercantil Bs', value: 12, color: 'blue', transf: false }) }
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
      Vuelto: 0,
      montoV: 0,
      operacion: '',
      referenciacompleta: '',
      serie: '',
      pagando: false,
      BancoEnviar: '',
      nacionalidad: '',
      nacionalidades: [{
        label: 'Venezolano',
        value: 'V'
      },
      {
        label: 'Extrajero',
        value: 'E'
      }],
      BancosEnviar: [
        {
          label: 'Mercantil',
          value: '0105',
          category: 1
        },

        {
          label: 'PresidentBanco Nacional de Credito',
          value: '0191',
          category: 3
        },
        {
          label: 'Mi Banco',
          value: '0169',
          category: 4
        },
        {
          label: 'Banco del Pueblo Soberano',
          value: '0149',
          category: 5
        },
        {
          label: 'Banco del Tesoro',
          value: '0163',
          category: 6
        },
        {
          label: 'Bancaribe',
          value: '0114',
          category: 7
        },
        {
          label: 'Banco Caroni',
          value: '0128',
          category: 8
        },
        {
          label: 'Banco de la Gente Emprendedora C.A.',
          value: '0146',
          category: 9
        },
        {
          label: '100% Banco',
          value: '0156',
          category: 10
        },
        {
          label: 'Banco Central de Venezuela',
          value: '0001',
          category: 11
        },
        {
          label: 'BFC Banco Fondo Comun',
          value: '0151',
          category: 12
        },
        {
          label: 'Banco Espirito Santo',
          value: '0176',
          category: 13
        },
        {
          label: 'Citibank N.A.',
          value: '0190',
          category: 14
        },
        {
          label: 'Banco Occidental de Descuento',
          value: '0121',
          category: 15
        },
        {
          label: 'Banco Agrícola de Venezuela',
          value: '0166',
          category: 16
        },
        {
          label: 'Instituto Municipal de Credito Popular',
          value: '0601',
          category: 17
        },
        {
          label: 'Banco Provincial',
          value: '0108',
          category: 18
        },
        {
          label: 'Banplus',
          value: '0174',
          category: 19
        },
        {
          label: 'Banco Industrial de Venezuela',
          value: '0003',
          category: 20
        },
        {
          label: 'Banco Bicentenario',
          value: '0175',
          category: 21
        },
        {
          label: 'Banco de la Fuerza Armada Nacional Bolivariana',
          value: '0177',
          category: 22
        },
        {
          label: 'Banco de Venezuela',
          value: '0102',
          category: 23
        },
        {
          label: 'Banco Internacional de Desarrollo',
          value: '0173',
          category: 24
        }
      ],
      montoEnviar: 0,
      nohayVuelto: true,
      TelefonoEnviar: '',
      CedulaEnviar: '',
      openDate: false,
      openHours: false,
      isChopzi: window.location.hostname === 'chopzi.com' || window.location.hostname === 'localhost',
      cupon: '',
      rateDefault: [],
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
      console.log(e, 'BINDRATES')
      if (!e.length) {
        await this.$axios.get('https://s3.amazonaws.com/dolartoday/data.json')
          .then(e => { this.rateDefault = [{ rateValue: e?.data?.USD?.promedio, currency: 'Bs' }] }).catch(e => console.error('error fetching data ratesApi', { e }))
      }
    }).catch(e => console.error('error fetching data firebase', { e }))
  },
  mounted () {
    this.operacion = 'I'
    this.serie = this.obtenerSerie(this.config.referencia)
    let fecha = new Date()
    // let diaA = fecha.getDate()
    let hoy = fecha.getDate()

    this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + hoy + this.paymentServ.referencia
    this.referenciacompleta = this.referenciacompleta.toUpperCase()
    console.log('laaaaaaaaaaa referencia', this.referenciacompleta)
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
    copy (referencia) {
      copyToClipboard(referencia)
      return this.$q.dialog({ title: 'Sastifactorio', message: 'Código copiado' })
    },
    async EnviarVuelto () {
      try {
        let telefono = this.formatoTelefono(this.TelefonoEnviar)
        this.loading2 = true
        let ip = '186.91.191.248'
        let url
        // window.location.origin
        if (localStorage.getItem('amb') === 'poke') {
          url = 'http://localhost:8085' + '/transact'
        } else {
          url = window.location.origin + '/transact'
        }

        let options = { method: 'post',

          url: url,
          data:
          {
            'bank': 'createOrder',
            'token': this.config.apiKeyDev,
            'ambiente': localStorage.getItem('amb'),
            'monto': this.montoV,
            'moneda': 'VES',
            'formaPago': 'President',
            'referencia': this.referenciacompleta,
            'telefono': telefono,
            'correo': 'pruebas@gmail.com',
            'ip': ip
          } }
        console.log(options)
        let respuesta = await this.$axios(options)
        console.log('la respuesta', respuesta)
        this.loading2 = false
        return respuesta
      } catch (err) {
        let mensaje
        // this.$q.loading.hide()
        console.error({ err })
        if (err.response) {
          console.log('errorrrrrrr', err.response.status)
          this.loading2 = false
          mensaje = this.error.find(x => x.codigo === err.response.status)
          return this.$q.dialog({
            title: 'Error',

            message: mensaje.descripcion
          })
        } else {
          // let mensaje = this.eror.find(x => x.id === err.response.status)
          console.log('errorrrrrrr', err.response)

          return this.$q.dialog({
            title: 'Error',

            message: mensaje.descripcion
          })
        }
      }
    },
    modEventDown (item, index) {
      this.modCartVal({ id: index, key: 'quantity', value: (parseInt(item.quantity) - 1) })
      this.checkAvail(item.prodId, item.prodType, index)
      if (item.quantity < 1) {
        this.modCartVal({ id: index, key: 'quantity', value: 1 })
      }
    },
    noseleccionado (valor) {
      this.continuar = false
      console.log('el valor seleccionado', this.continuar)
      return this.continuar
    },
    formatoTelefono (tel) {
      return `+58${tel.substr(2, 3)}${tel.substr(7).replace(/\./g, '')}`
    },
    modEventUp (item, index) {
      if (this.checkAvail(item.prodId, item.prodType, index)[0] === 1) {
        this.modCartVal({ id: index, key: 'quantity', value: (parseInt(item.quantity) + 1) })
      }
    },
    calcularVuelto () {
      console.log('entre')
      if (this.montoEnviar !== '') {
        this.Vuelto = parseFloat(this.montoEnviar) - (parseFloat(this.totalPrice) + parseFloat(this.deliveryPrice))
        console.log('el vuelto es', this.Vuelto)
        let rate = this.ratesComp.find(obj => {
          return obj.currency === 'Bs'
        })
        this.montoV = (parseFloat(rate.rateValue) * parseFloat(this.Vuelto)).toFixed(2)
      }
    },
    setBanco () {
      console.log('banco seleccionado', this.BancosEnviar.value)
      this.BancoEnviar = this.BancosEnviar.value
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
    falsecontinuar (valor) {
      this.continuar = valor
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
    optionsFnTime3 (hr, min, sec) {
      if (hr < 6 || hr > 15 || hr % 2 !== 0) {
        return false
      }
      if (min !== null && (min <= 25 || min >= 58)) {
        return false
      }
      if (sec !== null && sec % 25 !== 0) {
        return false
      }
      return true
    },
    optionsFnTime2 (hr, min) {
      console.log({ hr, min })
      try {
        if (this.configDates === undefined) {
          // if (!this.hourOptions(hr)) {
          //   return false
          // }
          // if (!this.minuteOptions(min)) {
          //   return false
          // }
          return true
        }
        let sedecfg = this.configDates
        let today = new Date(this.orderDate).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
        if (sedecfg && sedecfg.days && typeof sedecfg.days[today] === 'undefined') {
          // if (!this.hourOptions(hr)) {
          //   return false
          // }
          // if (!this.minuteOptions(min)) {
          //   return false
          // }
          return true
        }
        // console.log('sedecfg', this.configDates)
        // alert(this.configDates)
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
      } catch (error) {
        return true
      }
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
      let rate = this.ratesComp.find(obj => {
        return obj.currency === 'Bs'
      })
      console.log('este es valor rate', rate.rateValue, 'el valor de tarifa.total', this.objetotarifa.tarifa.total)
      let valor = (parseFloat(this.objetotarifa.tarifa.total) / parseFloat(rate.rateValue))
      this.deliveryPrice = valor
      console.log('el valor de this.deliveryPrice', valor)
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
    async  makeOrder (details) {
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
      let order = { productos: cartManage, photo: this.photoSRC, orderWhen, sede: this.getSede(), cart: this.cart, tipEnvio: this.tipEnvio, typePayment: this.pagoSel, customer, customer_id: this.currentUser.id, status: 0, table: 0, delivery: this.deliveryPrice, paid: (this.tipEnvio === '1' || this.tipEnvio === '4') ? parseFloat(parseFloat(Number(this.getTotalCarrito()[2])) + parseFloat(Number(this.deliveryPrice))) : parseFloat((parseFloat(this.getTotalCarrito()[2])).toFixed(2)) }
      if (this.tipEnvio === '3') {
        order = { ...order, ordencompra: this.objetodetalleorden }
      }

      if (this.addId && this.addId.id) {
        order = { ...order, address: this.addId.id, addressC: this.addId }
      }
      if (typeof details !== 'undefined' && typeof details.id === 'undefined') { order = { ...order, paypal: details } }
      if (typeof details !== 'undefined' && typeof details.id !== 'undefined') { order = { ...order, onlinePay: details } }
      if (this.cupons?.length) {
        order.cupons = this.cupons
      }
      switch (this.pagoSel) {
        case 0:
          order = { ...order, payto: this.config.zelleEmail }
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }

          break
        case 1:
          order = { ...order, payto: this.config.zelleEmail }
          if (this.Vuelto > 0) {
            if (this.config.statusNovaredzelle && !this.config.statuspagomovil) {
              let nroOrden = await this.EnviarVuelto()
              let Vuelto = {
                nroOrden: nroOrden.data.trx,
                telefono: this.formatoTelefono(this.TelefonoEnviar),
                nacionalidad: this.nacionalidad.value,
                documento: this.CedulaEnviar,
                VueltoBolivares: this.montoV,
                VueltoDolares: this.Vuelto,
                banco: this.BancoEnviar.value,
                metodo: 'novared',
                status: true
              }
              order = { ...order, vuelto: Vuelto }
            } else {
              let Vuelto = {
                telefono: this.formatoTelefono(this.TelefonoEnviar),
                nacionalidad: this.nacionalidad.value,
                documento: this.CedulaEnviar,
                VueltoBolivares: this.montoV,
                VueltoDolares: this.Vuelto,
                banco: this.BancoEnviar.value,
                metodo: 'mercantil',
                status: true
              }
              order = { ...order, vuelto: Vuelto }
            }
          }

          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          break
        case 2:
          order = { ...order, payto: this.config.zelleEmail }
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          break
        case 3:
          order = { ...order, payto: this.config.zelleEmail }
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa.tarifa }
            order = { ...order, encomienda: this.objetotarifa.tarifaOrden }
          }
          break
        case 4:
          order = { ...order, payto: this.config.venmoAcc }
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
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
          console.log('objeto tarifa', this.objetotarifa)
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa?.tarifa }
            order = { ...order, encomienda: this.objetotarifa?.tarifaOrden }
          }

          console.log('los valores', order.onlinePay)
          order = { ...order, payto: this.config.zelleEmail }
          delete order.status
          order = { ...order, status: 6 }
          break
        case 11:
          let aux1 = order?.onlinePay
          delete order.onlinePay
          console.log('valores de aux', aux1)
          let reg = {
            idtransaccion: aux1.id.data.trx,
            referencia: aux1.referencia,
            telefono: aux1.telefono,
            correo: aux1.correo,
            formapago: aux1.formaPago
          }
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa?.tarifa }
            order = { ...order, encomienda: this.objetotarifa?.tarifaOrden }
          }
          order = { ...order, onlinePay: reg }
          console.log('los valores', order.onlinePay)
          order = { ...order, payto: this.config.pagomovil }
          delete order.status
          order = { ...order, status: 6 }
          break
        case 12:
          if (this.objetotarifa.tarifaOrden?.courier !== undefined) {
            order = { ...order, tarifa: this.objetotarifa?.tarifa }
            order = { ...order, encomienda: this.objetotarifa?.tarifaOrden }
          }

          //  order = { ...order, onlinePay: reg }
          console.log('los valores', order.onlinePay)
          order = { ...order, onlinePay: details.id.data.trx }
          delete order.status
          order = { ...order, status: 6 }
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
    soloNumeros (e) {
      console.log('la tecla', e)
      var key = e.charCode
      console.log(key)
      return key >= 48 && key <= 57
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
    validar () {
      if ((!this.desahabilitadotelefono) && (!this.desahabilitadocedula) && (!this.desahabilitadoBanco) && (!this.desahabilitadonacionalidad)) {
        this.nohayVuelto = true
      } else {
        this.nohayVuelto = false
      }
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
    continuar () {
      console.log('cambio')
    },
    nohayVuelto () {
      console.log('cambio')
      this.operacion = 'P'
      // this.serie = this.obtenerSerie(this.config.referencia)
      let fecha = new Date()
      // let diaA = fecha.getDate()
      let hoy = fecha.getDate()

      this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + hoy + this.paymentServ.referencia
      this.referenciacompleta = this.referenciacompleta.toUpperCase()
      console.log('laaaaaaaaaaa referencia', this.referenciacompleta)
    },
    Vuelto () {
      if (this.Vuelto > 0) {
        this.nohayVuelto = false
      }
      if (this.Vuelto === 0) {
        this.nohayVuelto = true
      }
    },
    desahabilitadotelefono () {
      return false
    },
    configDates () {
      this.getDays()
    },
    referenciacompleta () {
      console.log('cambio')
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
