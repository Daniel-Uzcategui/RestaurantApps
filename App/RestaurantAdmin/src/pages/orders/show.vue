<template>
  <q-page
    v-if="typeof order !== 'undefined'"
    :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'"
  >
    <div class="q-gutter-md">
      <q-card class="q-cardGlass">
        <q-card-section class="q-cardtop header">
          <div class="text-h5">Orden {{order.factura}}</div>
          <div class="absolute-bottom-right q-pa-md">
            <q-btn v-if="Status !== '' && Ordersfilter !== ''"
              flat
              color="white"
              icon="arrow_back"
              @click="$router.push({ path: '/orders/index', query: { valor: 5} })"
            >
            </q-btn>
            <q-btn v-if="Status === ''"
              flat
              color="white"
              icon="arrow_back"
              @click="$router.push({ path: '/orders/index', query: { status: 3} })"
            >
            </q-btn>
             <q-btn v-if="Status === '' &&  Ordersfilter === ''"
              flat
              color="white"
              icon="arrow_back"
              @click="$router.push({ path: '/orders/index', query: { status: 3} })"
            >
            </q-btn>
          </div>
        </q-card-section>
        <div class="filled"></div>
        <q-card-section class="q-mr-lg">
          <div v-if="typeof order !== 'undefined'">
            <div class="row header-container">
            <div class="header-cell q-ma-sm col-2">
              <p class="text-bold">{{userTitle()}}</p>
                <q-btn
                  push
                  color="secondary"
                  no-caps
                  @click="$router.push({ path: '/users/index', query: { filter: getClientValue('id') } })"
                  :label="getClientValue('nombre') + ' ' + getClientValue('apellido')"
                />
            </div>
              <div class="header-cell q-ma-sm col-1">
                <p class="text-bold">Teléfono</p>
                <p>{{getClientValue('phone')}}</p>
              </div>
              <div class="header-cell q-ma-sm col-1">
                <p class="text-bold">Nro. Pedido</p>
                <p>{{order.factura}}</p>
              </div>
              <div class="header-cell q-ma-sm col-2">
                <p class="text-bold">SubTotal</p>
                <p>
                  $
                  {{(order.subtotal ? order.subtotal : order.paid && order.delivery ? order.paid - order.delivery : order.paid).toFixed(2)}}
                </p>
              </div>
              <div v-if="order.extras" class="header-cell q-ma-sm col-2">
                <p class="text-bold">Extras</p>
                <p>$ {{order.extras}}</p>
              </div>
              <div v-if="order.cuponTotal" class="header-cell q-ma-sm col-2">
                <p class="text-bold">Cupones</p>
                <p>- $ {{order.cuponTotal}}</p>
                <span v-for="(cupon, index) of order.cupons" :key="index"
                  >{{ cupon.name }}
                </span>
              </div>
              <div v-if="order.delivery" class="header-cell q-ma-sm col-2">
                <p class="text-bold">Costo Delivery</p>
                <p>{{(order.delivery).toFixed(2)}}</p>
              </div>
              <div class="header-cell q-ma-sm col-2">
                <p class="text-bold">Total $</p>
                <p>{{order.paid}}</p>
              </div>
                 <div class="header-cell q-ma-sm col-2" v-if="verificarVuelto">
                <p class="text-bold">Total Recibido $</p>
                <p>{{(order.paid + order.vuelto.VueltoDolares).toFixed(2)}}</p>
              </div>
              <div class="header-cell q-ma-sm col-2" v-if="verificarVuelto">
                <p class="text-bold">Vuelto Bs</p>
                <p>{{(order.vuelto.VueltoBolivares)}}</p>
              </div>
               <div class="header-cell q-ma-sm col-2" v-if="verificarVuelto2 && verificarVuelto">
                <p class="text-bold">Referencia</p>
                <p class="text-green">{{order.vuelto.trx.referencia}}</p>
              </div>
              <div class="header-cell q-ma-sm col-2" v-if="verificarPagoMovil">
                <p class="text-bold">Referencia</p>
                <p class="text-green">{{order.onlinePay.payment_reference}}</p>
              </div>

              <div class="header-cell q-ma-sm col-2">
                <q-btn
                  push
                  color="red"
                  no-caps
                  label="Realizar Vuelto"
                  :loading=realizado
                  v-show="statusVuelto"
                  @click="RealizarVuelto"
                />
              </div>
               <div class="header-cell q-ma-sm col-2">
                <q-btn
                  push
                  color="red"
                  no-caps
                  label="Renviar Correo"
                  :loading=realizado2
                  v-show="statusmail"
                  @click="RenviarCorreo"
                />
              </div>
              <div
                v-if="order.typePayment==8 || order.typePayment == 0"
                class="header-cell q-ma-sm col-2"
              >
                <p class="text-bold">Total Bs</p>
                <p>{{getRates(order.paid).toLocaleString()}}</p>
              </div>
              <div class="flex-break q-py-md"></div>
              <view-client
                v-if="order.buyOrder"
                class="
                  header-cell
                  q-ma-sm
                  col-md-12 col-lg-4 col-sm-12 col-xs-12
                "
                :client="order.buyOrder.Client.name"
                :branch="order.buyOrder.Branch.name"
              >
              </view-client>
              <div class="flex-break q-py-md"></div>
              <div class="header-cell q-ma-sm col-md-4 col-xs-12">
                <q-input
                  filled
                  rounded
                  outlined
                  label="Sede"
                  :value="order.sede.name"
                  type="text"
                  float-label="Float Label"
                  placeholder="Sede de la Orden"
                  disable
                ></q-input>
              </div>
              <div
                style="min-width: 300px"
                class="header-cell q-ma-sm col-md-4 col-xs-12"
              >
                <q-input
                  filled
                  rounded
                  outlined
                  label="Fecha de Entrega"
                  v-if="order && order.orderWhen && order.orderWhen.orderWhen == '1'"
                  v-model="orderDate"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="orderDate" mask="MM/D/YY, HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            >
                            </q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="orderDate"
                          mask="MM/D/YY, HH:mm"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            >
                            </q-btn>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  filled
                  rounded
                  outlined
                  label="Fecha de Entrega"
                  v-if="!(order && order.orderWhen && order.orderWhen.orderWhen == '1')"
                  :value=" order && order.orderWhen && order.orderWhen.orderWhen == '1' ? new Date(order.orderWhen.orderDate.seconds * 1000) : 'De inmediato'"
                  type="text"
                  disabled
                >
                </q-input>
              </div>
              <div class="header-cell q-ma-sm col-4 col-xs-12 col-md-4">
                <q-input
                  filled
                  rounded
                  outlined
                  label="Tipo Servicio"
                  :value="tipServ()"
                  type="text"
                  float-label="Float Label"
                  disabled
                >
                </q-input>
              </div>
              <q-btn
                label="Copiar URL de google maps"
                class="col-md-2 col-sm-5 col-xs-12 q-ma-md"
                no-caps
                color="blue"
                rounded
                icon="place"
                v-if="addressLocation"
                @click="copyToClip()"
              >
              </q-btn>
              <q-btn
                label="abrir localización en google maps"
                class="col-md-2 col-sm-5 col-xs-12 q-ma-md"
                no-caps
                color="green"
                rounded
                icon="place"
                v-if="addressLocation"
                @click="openGmap()"
              >
              </q-btn>
              <div
                class="header-cell q-ma-sm col-md-4 col-xs-12"
                v-if="order.tipEnvio==2"
              >
                <q-input
                  filled
                  rounded
                  outlined
                  label="Mesa"
                  :value="order.table"
                  @input="(e) => saved(e, this.$route.query.Order_Id, 'table')"
                  type="text"
                  float-label="Float Label"
                  placeholder="Mesa de la Orden"
                >
                </q-input>
              </div>
              <div class="flex-break q-py-md"></div>
              <div class="header-cell q-ma-sm col-md-4 col-xs-12">
                <q-select
                  options-selected-class="text-blue"
                  filled
                  rounded
                  :value="orderStatus"
                  @input="(e) => { checkOrder(e)
            }"
                  map-options
                  emit-value
                  standout="bg-teal "
                  :options="estatusOptions"
                  label="Estatus"
                  :disable="order.status === '4'"
                >
                  <template v-slot:append>
                    <q-btn
                      v-if="order.statusLog"
                      round
                      dense
                      flat
                      icon="search"
                      @click.stop
                      @click="showLog = true"
                    >
                    </q-btn>
                  </template>
                </q-select>
              </div>
              <div class="header-cell q-ma-sm col-3 col-md-4 col-xs-12">
                <q-select
                  options-selected-class="text-blue"
                  filled
                  rounded
                  :value="order.typePayment"
                  @input="(e) => { saved(e, this.$route.query.Order_Id, 'typePayment'); addPay = true }"
                  standout="bg-teal "
                  :options="typePayment_options"
                  map-options
                  emit-value
                  label="Tipo de Pago"
                >
                  <template v-slot:append>
                    <q-btn
                      v-if="order.soportePago"
                      round
                      dense
                      flat
                      icon="search"
                      @click.stop
                      @click="addPay = true"
                    >
                    </q-btn>
                  </template>
                </q-select>
              </div>
              <div
                v-if="order.buyOrderBranch"
                class="header-cell q-ma-sm col-3 col-md-4 col-xs-12"
              >
                <q-input
                  type="number"
                  filled
                  rounded
                  :value="order.creditDays"
                  @input="(e) => {saved(parseInt(e), this.$route.query.Order_Id, 'creditDays')}"
                  label="Dias de crédito"
                >
                </q-input>
              </div>
              <div
                class="header-cell q-ma-sm col-3"
              >
                <label>Comanda</label><br />
                <i class="fa fa-search" @click="photoDiag=true"></i>
              </div>
              <div class="flex-break q-pa-md"></div>
              <div class="flex-break q-pa-md"></div>
              <div
                v-if="puntoRef && puntoRef !== 'No disponible'"
                class="header-cell2 q-pa-sm col-6"
              >
                <q-input
                  filled
                  rounded
                  outlined
                  label="punto de Referencia"
                  :value="puntoRef"
                  type="textarea"
                  placeholder="Punto de referencia"
                  disabled
                >
                </q-input>
              </div>
              <div
                v-if="addressDelivery && addressDelivery !== 'No disponible'"
                class="header-cell2 q-pa-sm col-6"
              >
                <q-input
                  filled
                  rounded
                  outlined
                  label="Dirección de entrega"
                  :value="addressDelivery"
                  type="textarea"
                  placeholder="Dirección del cliente"
                  disabled
                >
                </q-input>
              </div>
              <div class="flex-break q-pa-md"></div>
              <div class="header-cell q-ma-sm col-6" v-if="order.userComment">
                <q-input
                  filled
                  rounded
                  outlined
                  label="Comentario del Cliente"
                  :value="order.userComment"
                  type="textarea"
                  placeholder="Punto de referencia"
                  disabled
                >
                </q-input>
              </div>
            </div>
            <div
              v-if="(order.typePayment !== 3 ) && order.photo"
              class="column items-center filled-soport"
            >
              <div class="col">
                <label><strong>Soporte de pago</strong></label>
                <viewer :img="order.photo"></viewer>
                <span>Presione en la imagen para ampliar</span>
              </div>
            </div>
            <div
              v-if="order.typePayment == 3 && order.paypal && order.paypal.purchase_units"
              class="column items-center filled-soport"
            >
              <div class="col">
                <div class="text-center text-bold q-pb-md">
                  Soporte de pago Paypal
                </div>
                <q-card>
                  <q-card-section>
                    <div>Email: {{order.paypal.payer.email_address}}</div>
                    <div>
                      Nombre: {{order.paypal.payer.name.given_name}}
                      {{order.paypal.payer.name.surname}}
                    </div>
                    <div>
                      Total: {{order.paypal.purchase_units[0].amount.value}}
                      {{order.paypal.purchase_units[0].amount.currency_code}}
                    </div>
                    <div>Fecha: {{new Date(order.paypal.create_time)}}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <div class="flex-break q-py-md"></div>
          <div class="header-cell q-ma-sm col-7 filled">
            <q-table
              title="Detalle de Orden"
              style="border-radius: 28px"
              :data="detailOrder"
              :columns="columns"
              :visible-columns="visibleColumns"
              :dense="$q.screen.lt.md"
              row-key="id"
              no-data-label="No se encontraron registros"
            >
              <template v-slot:top-right>
               <q-btn  push
                  color="red"
                  no-caps label="Ver Detalle"
                  @click="verorden=true"
                  />
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    <div class="column items-start">
                      <div>
                        {{ props.row.name }}
                      </div>
                      <div v-if="props.row.discount">
                        - {{ props.row.discount }} %
                      </div>
                    </div>
                    <q-popup-edit
                      :value="props.row.name"
                    >
                      <q-input
                        filled
                        rounded
                        outlined
                        @input="(e) => {saved(e, $route.query.Order_Id, `productos.${props.row.index}.name`, props.row.index)}"
                        :value="props.row.name"
                        dense
                      >
                      </q-input>
                    </q-popup-edit>
                  </q-td>
                  <q-td key="quantity" :props="props">
                    {{props.row.quantity}}
                    <q-popup-edit @input="(e) => {if (true) {quantityOrPriceChange(parseInt(e), $route.query.Order_Id, `productos.${props.row.index}.quantity`, props.row.index, 0)}}"
                      :value="props.row.quantity" title="Actualizar cantidad" buttons persistent v-slot="scope">
                      <q-input type="number" v-model="scope.value"  dense autofocus hint="Usar el botón para cerrar" />
                    </q-popup-edit>
                  </q-td>
                  <q-td key="price" :props="props">
                    {{props.row.prodPrice}}
                    <q-popup-edit @input="(e) => {if (e > -1) {quantityOrPriceChange(parseFloat(e), $route.query.Order_Id, `productos.${props.row.index}.prodPrice`, props.row.index, 1)}}"
                      :value="props.row.prodPrice" title="Actualizar Precio" buttons persistent v-slot="scope">
                      <q-input type="number" v-model="scope.value"  dense autofocus hint="Usar el botón para cerrar" />
                    </q-popup-edit>
                  </q-td>
                </q-tr>
                <q-tr
                  :props="props"
                  v-if="props.row.items && props.row.items.length"
                >
                  <q-td colspan="100%">
                    <div class="text-bold">Opciones</div>
                    <q-list class="text-center">
                      <q-item tag="label" v-ripple>
                        <q-item-section>
                          <q-item-label class="text-bold">Nombre</q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-bold"
                            >Cantidad</q-item-label
                          >
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-bold">Precio</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <q-list
                      v-for="(items, index) in props.row.items"
                      :key="index+props.row.prodId"
                      class="text-center"
                    >
                      <q-item tag="label" v-ripple>
                        <q-item-section>
                          <q-item-label>{{items.name}}</q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{ items.quantity ? items.quantity : 1}}</q-item-label
                          >
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{items.price ? '$ ' +items.price : 'incluido'}}</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-td>
                </q-tr>
                <q-tr :props="props" v-if="props.row.prods">
                  <q-td colspan="100%">
                    <div class="text-bold">Productos</div>
                    <q-list class="text-center">
                      <q-item tag="label" v-ripple>
                        <q-item-section>
                          <q-item-label class="text-bold">Nombre</q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-bold"
                            >Cantidad</q-item-label
                          >
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-bold">Precio</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <q-list
                      v-for="(items, index) in props.row.prods"
                      :key="index+props.row.prodId"
                      class="text-center"
                    >
                      <q-item tag="label" v-ripple>
                        <q-item-section>
                          <q-item-label>{{items.name}}</q-item-label>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{ items.quantity ? items.quantity : 1}}</q-item-label
                          >
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{items.price ? '$ ' +items.price : 'incluido'}}</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
        <q-dialog v-model="photoDiag">
          <q-card>
            <q-btn
              flat
              color="primary"
              label="Descargar Factura"
              icon="fas fa-download"
              @click="downloadWithCSS"
            >
            </q-btn>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Comprobante de Pago</div>
              <q-space> </q-space>
              <q-btn icon="close" flat round dense v-close-popup> </q-btn>
            </q-card-section>
            <q-card-section>
              <div ref="content" class="q-pa-md">
                <q-card
                  style="width: 500px"
                  class="text-uppercase"
                  ref="doccontext"
                >
                  <q-card-section class="text-center text-h2 q-pa-none">
                    {{order.factura}}
                  </q-card-section>
                  <q-card-section class="text-center text-h2 q-pa-none">
                    ------------------
                  </q-card-section>
                  <q-card-section
                    class="text-center text-h4 q-pa-none bg-black"
                  >
                    ** {{this.getLocalization (order.sede)}} **
                  </q-card-section>
                  <!-- <q-card-section class="text-center text-h6">
        ...info sede para factura...
      </q-card-section>
      <q-card-section class="text-center text-h6">
        ...info factura...
      </q-card-section> -->
                  <q-card-section class="text-left text-h7">
                    {{'Direccion:' + addressDelivery}}
                  </q-card-section>
                  <q-card-section v-if="puntoRef" class="text-left text-h7">
                    {{'Punto de referencia:' + puntoRef}}
                  </q-card-section>
                  <q-card-section v-if="order.buyOrder" class="text-left text-h7">
                    {{'Cliente:' + order.buyOrder.Client.name + ' ' + order.buyOrder.Branch.name}}
                  </q-card-section>
                  <q-card-section class="text-h7">
                    <q-item
                      ><q-item-section
                        >{{(new Date(order.dateIn.seconds * 1000)).toLocaleString("es-MX")}}</q-item-section
                      >
                      <q-item-section side
                        >TOTAL {{order.paid}}</q-item-section
                      ></q-item
                    >
                  </q-card-section>
                  <q-card-section class="text-left text-h7">
                    CANT ITEM
                  </q-card-section>
                  <q-card-section class="text-left">
                    <div v-for="(ord, index) in detailOrder" :key="index">
                      {{ord.quantity}} {{ord.name}}
                      <div
                        style="padding-left: 10px"
                        v-for="(items, index) in ord.prods"
                        :key="index"
                      >
                        {{items.quantity}} {{items.name}}
                      </div>
                      <div
                        style="padding-left: 20px"
                        v-for="(items, index) in ord.items"
                        :key="index"
                      >
                        {{items.quantity}} {{items.name}}
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <div class="filled"></div>
      </q-card>
    </div>
    <q-dialog v-model="validationError">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space> </q-space>
          <q-btn icon="close" flat round dense v-close-popup> </q-btn>
        </q-card-section>
        <q-card-section>
          Los siguientes campos son requeridos
          {{messageError}}
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showLog">
      <log-estatus :log="order.statusLog"> </log-estatus>
    </q-dialog>
    <q-dialog v-model="selectRider">
      <select-or-create-rider
        @close="selectRider = false"
        @riderInput="(e) => checkOrder(2, e)"
      >
      </select-or-create-rider>
    </q-dialog>
    <q-dialog v-model="addPay">
      <add-payment
        :soportePago="order.soportePago"
        @sumbit="(e) => saved(e, $route.query.Order_Id, 'soportePago').then(() => { addPay = false })"
      >
      </add-payment>
    </q-dialog>
    <q-dialog  v-if="verificarOrdenCompra" v-model="verorden" transition-show="rotate" transition-hide="rotate"  style="max-width: 80% !important;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;">
          <q-card>
            <q-card-section>
              <h6>Detalle</h6>
            </q-card-section>
      <q-card-section>
             <q-input disable label="Fecha Vencimiento" v-model="order.ordencompra.date"></q-input>
             <br>
              <q-input disable label="Monto" v-model="order.ordencompra.monto"></q-input>
            <br>
             <q-input disable label="Porcentaje de Retención" v-model="order.ordencompra.porcentaje"></q-input>
             <br>
             <q-input disable label="Nro Orden Compra" v-model="order.ordencompra.ordencompra"></q-input>
             <br>
              <viewer :img="order.ordencompra.photo"></viewer>
        </q-card-section>
        <q-card-section>
          <br>
             <q-btn push no-caps label="Aceptar" color="blue" v-close-popup/>
             </q-card-section>
          </q-card>

           </q-dialog>
  </q-page>
</template>

<script>
import logEstatus from '../../components/order/logEstatus.vue'
import { mapGetters, mapActions } from 'vuex'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image-more'
import { copyToClipboard } from 'quasar'
import selectOrCreateRider from '../../components/order/selectOrCreateRider.vue'
import viewClient from '../../components/order/viewClient.vue'
import addPayment from '../../components/order/addPayment.vue'
export default {
  components: {
    Viewer: require('../../components/Viewer.vue').default,
    logEstatus,
    selectOrCreateRider,
    addPayment,
    viewClient
  },
  data () {
    return {
      label: 'tes',
      selectRider: false,
      respuesta: {},
      addPay: false,
      statusVuelto: false,
      statusmail: false,
      showLog: false,
      realizado: false,
      realizado2: false,
      photoDiag: false,
      verorden: false,
      columns: [
        { name: 'name', required: true, align: 'center', label: 'Nombre', field: 'name' },
        { name: 'quantity', required: true, align: 'center', label: 'Cantidad', field: 'quantity' },
        { name: 'price', required: true, align: 'center', label: 'Precio/Unidad', field: 'price' },
        { name: 'discount', align: 'center', label: 'discount', field: 'discount' }
      ],
      visibleColumns: ['name', 'quantity', 'price'],
      validationError: false,
      messageError: []
    }
  },
  mounted () {
    this.bindpaymentsev()
    this.binderrores()
    console.log('los valores de los errores ', this.error)
    if (this.order.vuelto !== undefined) {
      this.statusVuelto = this.order.vuelto.status
    } else {
      this.statusVuelto = false
    }
  },

  computed: {
    addressLocation () {
      let address = this.order.addressC?.location || null
      if (address !== null) {
        address = JSON.parse(address)
      }
      return address
    },
    puntoRef () {
      return typeof this.order.addressC !== 'undefined' ? this.order.addressC.puntoRef : 'No disponible'
    },
    addressDelivery () {
      let objaddress = this.order.addressC
      if (typeof objaddress !== 'undefined') {
        let tempString = ''
        console.log(objaddress)
        for (let i of Object.keys(objaddress.address)) {
          tempString = tempString + objaddress.address[i] + ' '
        }
        return tempString
      } else {
        return 'No disponible'
      }
    },
    phone () {
      let objaddress = this.order.addressC
      if (typeof objaddress !== 'undefined') {
        return objaddress.phone
      }
      return null
    },
    ...mapGetters('order', ['orders', 'typePayment_options', 'tipoServicio', 'estatus_options', 'estatus_optionsOrd', 'Status', 'Ordersfilter']),
    ...mapGetters('config', ['rates', 'configs2']),
    ...mapGetters('errores', ['error']),
    ...mapGetters('user', ['currentUser']),
    orderStatus () {
      if (this.order.tipEnvio === '3' && this.order.status === 3 && this.order.creditDays) {
        let dateIn = this.getLogDate(this.order)
        let differenceDates = (new Date()).getTime() - dateIn.getTime()
        let daysDif = differenceDates / (1000 * 60 * 60 * 24)
        return daysDif > this.order.creditDays ? 5 : this.order.status
      } else {
        return this.order.status
      }
    },
    verificarVuelto () {
      if (this.order?.vuelto === undefined) {
        return false
      } else {
        return true
      }
    },
    verificarPagoMovil () {
      if (this.order?.onlinePay === undefined) {
        return false
      } else {
        return true
      }
    },
    verificarOrdenCompra () {
      if (this.order?.ordencompra === undefined) {
        return false
      } else {
        return true
      }
    },
    verificarVuelto2 () {
      if (this.order.vuelto?.trx === undefined) {
        return false
      } else {
        return true
      }
    },

    estatusOptions () {
      if (this.order.tipEnvio === '3') {
        return this.estatus_optionsOrd
      }
      return this.estatus_options
    },
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.Order_Id
      })
    },

    getClient () {
      let order = this.order
      if (order && order.id) {
        if (order.customer) {
          return order.customer
        }
        return this.clients.find(obj => obj.id === order.customer_id)
      } else {
        return {}
      }
    },
    orderDate: {
      get () {
        let test = (new Date(this.order.orderWhen.orderDate.seconds * 1000)).toLocaleString('en-US', { timeStyle: 'short', dateStyle: 'short', hour12: false })
        console.log({ test })
        return test
      },
      set (value) {
        console.log({ value })
        this.saved(new Date(value), this.$route.query.Order_Id, 'orderWhen.orderDate')
      }
    },
    detailOrder () {
      let orderArray = []
      let order = this.orders.find(ord => ord.id === this.$route.query.Order_Id)
      console.log(this.orders, order, 'EPAAA')
      let products = order?.productos || {}
      for (let prods in products) {
        orderArray.push({ ...products[prods], index: prods })
      }
      console.log(orderArray, 'ORDEN ARRAY')
      return orderArray
    }
  },
  watch: {
    statusVuelto () {
      console.log('cambio')
    }
  },
  created () {
    // this.bindMenu()
    // this.bindClients()
    // this.getAddress(this.order?.address)
    // this.bindLocalizations()
    // this.bindPromos()
    this.bindRates()
    // console.log(this.rates)
  },
  methods: {
    async quantityOrPriceChange (value, id, key, product, priceChange, prop) {
      // priceChange = 0 changing quantity // priceChange = 1 changing price
      if (this.order.status !== 0) {
        return this.$q.notify({
          color: 'red',
          message: 'Solo se puede acutalizar cantidades de ordenes de estado por confirmar'
        })
      }
      try {
        this.$q.loading.show()
        let total = this.order.paid
        let producto = this.order.productos[product]
        let totalNoProduct = total - (producto.quantity * producto.prodPrice)
        let prodTot = value * producto.prodPrice
        if (priceChange) {
          prodTot = producto.quantity * value
        }
        let NewTotal = totalNoProduct + (prodTot)
        NewTotal = parseFloat(NewTotal.toFixed(2))
        console.log(NewTotal, 'NewTotal')
        await this.saved(value, id, key).then(async () => {
          console.log('Saving', NewTotal, id, 'paid')
          await this.saved(NewTotal, id, 'paid').then(() => {
            this.$q.loading.hide()
          })
        })
      } catch (e) {
        this.$q.loading.hide()
        this.$q.notify({
          color: 'red',
          message: 'Ocurrió un error intente más tarde, verifique su conexión'
        })
      }
    },
    userTitle () {
      return this.order && this.order.tipEnvio === '3' ? 'Vendedor' : 'Cliente'
    },
    tipServ () {
      return this.order && typeof this.order.tipEnvio !== 'undefined' ? this.getTypeService(this.order.tipEnvio) : 'NA'
    },
    RenviarCorreo () {
      this.emailClients({ ambiente: localStorage.getItem('amb'), order: this.order })
      this.$q.notify({
        color: 'blue',
        message: 'El Correo se ha Reenviado con Exito'
      })
    },
    async RealizarVuelto () {
      try {
        // this.$q.loading.show()
        // let referencia = this.valueFields.referencia
        this.realizado = true
        console.log('la url')
        // window.location.origin
        let options = { method: 'post',
          url: window.location.origin + '/transact',
          data:
          {
            'bank': 'Vuelto',
            'token': this.configs2.apiKeyDev,
            'ambiente': localStorage.getItem('amb'),
            'ordenNro': this.order.vuelto.nroOrden,
            'tipo': 'Tvuelto',
            'banco': this.order.vuelto.banco,
            'telefono': this.order.vuelto.telefono,
            'nacionalidad': this.order.vuelto.nacionalidad,
            'documento': this.order.vuelto.documento
          } }
        console.log(options)
        this.respuesta = await this.$axios(options)
        console.log('la respuesta', this.respuesta)
        let valores = await this.setVuelto({ idorden: this.$route.query.Order_Id,
          trx: this.respuesta.data,
          status: false })
        console.log(valores)
        this.statusVuelto = false
        this.realizado = false
        this.$q.notify({
          color: 'blue',
          message: 'El Vuelto se ha enviado con Exito'
        })
        let respuesta2 = await this.emailAdminClients({ ambiente: localStorage.getItem('amb'), order: this.order })
        console.log('respuesta2', respuesta2)
        this.statusmail = true

        return this.respuesta
      } catch (err) {
        let mensaje
        // this.$q.loading.hide()
        console.error({ err })
        if (err.response) {
          console.log('errorrrrrrr', err.response.status)
          mensaje = this.error.find(x => x.codigo === err.response.status)
          this.realizado = false
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
    consolee (e, b, c, s) {
      console.log(e, b, c, s)
    },
    ...mapActions('order', ['saveOrder', 'setVuelto', 'emailAdminClients', 'emailClients']),
    ...mapActions('menu', ['bindMenu', 'bindPromos']),
    ...mapActions('client', ['bindClients']),
    ...mapActions('errores', ['binderrores']),
    ...mapActions('address', ['bindAddress']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindRates', 'bindpaymentsev']),
    getLogDate (obj) {
      let ret = obj.statusLog?.find(x => x.status === 3)
      if (typeof ret === 'undefined') {
        return new Date()
      }
      return ret.dateIn.toDate()
    },
    copyToClip () {
      let position = this.addressLocation[0].position
      let toClip = 'https://www.google.com/maps/dir/?api=1&destination=' + position.lat + ',' + position.lng
      copyToClipboard(toClip)
        .then(() => {
          this.$q.notify({
            message: `URL Copiado al Clipboard`,
            color: 'positive'
          })
        })
        .catch(() => {
          this.$q.notify({
            message: `Error copiando url al Clipboard`,
            color: 'positive'
          })
        })
    },
    openGmap () {
      let position = this.addressLocation[0].position
      let toClip = 'https://www.google.com/maps/dir/?api=1&destination=' + position.lat + ',' + position.lng
      window.open(toClip)
    },
    download () {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      const contentHtml = this.$refs.content.innerHTML
      doc.fromHTML(contentHtml, 15, 15, {
        width: 170
      })
      doc.save('sample.pdf')
    },
    getTypeService (e) {
      e = parseInt(e)
      let tip = this.tipoServicio.find(x => x.value === e)
      if (typeof tip === 'undefined') {
        return null
      }
      return tip.label
    },
    getRates (mto) {
      let mtoTotal = 0
      let rate = ''
      rate = this.rates?.find(obj => {
        return obj.currency === 'Bs'
      })
      if (mto !== 'undefined' && rate && rate.rateValue) {
        mtoTotal = rate.rateValue * mto
      }
      return mtoTotal
    },
    downloadWithCSS () {
      /** WITH CSS */
      // eslint-disable-next-line no-undef
      let ref = this.$refs
      domtoimage
        .toPng(this.$refs.content)
        .then(function (dataUrl) {
          var img = new Image()
          img.src = dataUrl
          // eslint-disable-next-line new-cap
          const doc = new jsPDF({
            orientation: 'portrait',
            // unit: "pt",
            format: [ref.doccontext.$el.clientHeight, 500]
          })
          doc.addImage(img, 'PNG', 20, 20)
          const date = new Date()
          const filename =
          'timechart_' +
          date.getFullYear() +
          ('0' + (date.getMonth() + 1)).slice(-2) +
          ('0' + date.getDate()).slice(-2) +
          ('0' + date.getHours()).slice(-2) +
          ('0' + date.getMinutes()).slice(-2) +
          ('0' + date.getSeconds()).slice(-2) +
          '.pdf'
          doc.save(filename)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
    },
    async saved (value, id, key) {
      //  console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      try {
        return this.saveOrder({ value, id, key })
      } catch (e) {
        throw e
      }
    },
    getProducts (value, type) {
      if (type) {
        return this.promos.find(obj => {
          return obj.id === value
        })
      } else {
        return this.menu.find(obj => {
          return obj.id === value
        })
      }
    },
    getClientValue (key) {
      if (this.getClient && this.getClient[key]) {
        return this.getClient[key]
      } else {
        return 'No disponible'
      }
    },
    checkOrder (e, rider) {
      switch (e) {
        case 2:
          if (this.selectRider === true) {
            this.saved(e, this.$route.query.Order_Id, 'status')
            this.statusLog(e, rider)
            this.selectRider = false
            break
          }
          this.selectRider = true
          break
        case 3:
          // if (this.order.tipEnvio !== '3') {
          //   this.$q.dialog({
          //     title: 'Alerta!',
          //     message: 'Al colocar la orden como entregada se liberan los puntos de fidelidad al cliente, esto no se puede reversar '
          //   }).onOk(() => {
          //     this.saved(e, this.$route.query.Order_Id, 'status')
          //     this.statusLog(e, this.rider)
          //   })
          // } else {
          this.$q.dialog({
            title: 'Receptor',
            message: 'Nombre de la persona que recibió la entrega',
            prompt: {
              model: '',
              type: 'text' // optional
            }
          }).onOk(data => {
            this.saved(e, this.$route.query.Order_Id, 'status')
            this.statusLog(e, undefined, data)
          })
          // }
          break
        case 4:
          this.$q.dialog({
            title: 'Alerta!',
            message: 'Al colocar la orden como anulada se acutalizará el stock, esto no se puede reversar '
          }).onOk(() => {
            this.saved(e, this.$route.query.Order_Id, 'status')
            this.statusLog(e)
          })
          break
        default:
          this.saved(e, this.$route.query.Order_Id, 'status')
          this.statusLog(e)
      }
    },
    statusLog (e, rider, receptor) {
      let log = this.order.statusLog || []
      console.log('el valor de los parametros', e, rider, receptor)
      let newData = { user: this.currentUser.id, status: e, dateIn: new Date() }
      if (typeof rider !== 'undefined') {
        newData.rider = rider
      }
      if (typeof receptor !== 'undefined') {
        newData.receptor = receptor
      }
      console.log('los valores a guardar ', newData, this.$route.query.Order_Id)
      this.saved([...log, newData], this.$route.query.Order_Id, 'statusLog')
    },
    // getAddress (value) {
    //   let objaddress
    //   objaddress = this.order.addressC
    //   console.log({ objaddress, add: this.address })
    //   if (typeof objaddress === 'undefined') {
    //     return
    //   }
    //   this.addressLocation = JSON.parse(objaddress?.location)
    //   this.puntoRef = typeof objaddress !== 'undefined' ? objaddress.puntoRef : 'No disponible'
    //   if (typeof objaddress !== 'undefined') {
    //     let tempString = ''
    //     this.phone = objaddress.phone
    //     console.log(objaddress)
    //     for (let i of Object.keys(objaddress.address)) {
    //       tempString = tempString + objaddress.address[i] + ' '
    //     }
    //     this.addressDelivery = tempString
    //   } else {
    //     this.addressDelivery = 'No disponible'
    //   }
    //   console.log({ objaddress })
    //   return objaddress
    // },
    getLocalization (value) {
      return typeof this.order?.sede?.name !== 'undefined' ? this.order.sede.name : 'No disponible'
    }
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute
  right: 10px !important
.header-btn-back
  position: absolute
  right: 120px !important
.header
 padding-bottom: 50px
.header-cell
  min-width: 130px
.header-cell2
  min-width: 200px
.filled-soport
  padding-top: 30px
.table
  width: 90%
</style>
