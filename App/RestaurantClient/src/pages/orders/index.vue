<template>
   <q-page>
      <q-card flat class="bg-dark text-white q-cardGlass">
         <q-card-section class="q-pa-xl text-h5 text-bold" :class="$q.screen.lt.md ? 'text-center' : ''">
            <div class="q-pt-xl">
               Status de
            </div>
            <div>
               sus pedidos
            </div>
         </q-card-section>
         <q-card-section :style="$q.screen.gt.sm ? 'margin-left: 20vmin' : ''">
            <div class="row justify-center">
               <q-spinner v-if="loading" size="lg" color="primary" />
               <p v-if="orderSort.length === 0 && !loading" class="text-h4 text-center">No existen pasadas ordenes</p>
               <q-list style="min-width: 320px" :class="'q-pa-' + $q.screen.name" class="col-6 q-pb-xl relative-position" separator v-for="(items, index) in orderSort" :key="index">
                  <q-item @click="carritoDialog(items)" clickable v-ripple>
                     <q-item-section>
                        <q-icon name="fas fa-dot-circle" class="absolute-top" size="50px" :style="getcolor(items.status)" v-if="items.status == 4"/>
                        <q-knob
                           class="absolute-top"
                           v-if="items.status < 4"
                           disable
                           v-model="items.status"
                           :max="3"
                           size="50px"
                           :thickness="0.22"
                           track-color="grey-3"
                           :style="getcolor(items.status)"
                           >
                        </q-knob>
                     </q-item-section>
                     <q-item-section class="text-h6 text-left">
                        <q-item-label lines="2" >{{formatDate(items.dateIn)}}</q-item-label>
                        <q-item-label lines="2" >{{estatus_options[items.status]['label']}}</q-item-label>
                        <q-item-label lines="2"  v-if="typeof items.factura !== 'undefined'">Nro. Pedido: {{items.factura}}</q-item-label>
                        <q-item-label lines="2"  v-if="typeof items.factura === 'undefined'">
                           Nro. Pedido:
                           <q-spinner color="primary" />
                        </q-item-label>
                        <q-item-label lines="2" caption class="text-grey">Ver detalles</q-item-label>
                     </q-item-section>
                  </q-item>
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
         maximized
         transition-show="slide-up"
         transition-hide="slide-down"
         >
         <q-card class="full-width q-fullscreen-glassMorph">
           <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 9999" dense flat icon="fas fa-chevron-left" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section>
               <div :class="$q.screen.gt.xs ? 'text-h4 q-pa-xl' : 'text-h5 q-pa-md' " class="text-bold">
                  <p>Orden # {{ordenDet.factura}}</p>
                  <p :class="$q.screen.gt.xs ? 'text-h5' : 'text-h6' " >Status: {{estatus_options[ordenDet.status]['label']}}</p>
               </div>
            </q-card-section>
            <q-card-section class="column items-center" style="">
               <q-list v-for="(item, index) in carrito" :key="index" class="full-width">
                  <q-item class="row justify-between">
                     <q-item-section class="col">
                        <div class="row">
                           <div>
                              <div class="q-ma-md position-relative">
                                 <div class="bg-primary" style="border-radius: 15px">
                                    <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="q-ma-md rounded-borders" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </q-item-section>
                     <q-item-section :style="$q.screen.lt.sm ? 'margin-left: 75px;' : ''" :class="$q.screen.lt.md ? 'col column items-end' : ''">
                        <div>
                           <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
                           <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">$ {{item.prodPrice}}</q-item-label>
                        </div>
                     </q-item-section>
                     <q-item-section :class="$q.screen.lt.md ? 'col column items-end' : ''">
                        <q-item-label class="text-h6 row">
                           <div class="text-weight-thin">{{item.quantity}}</div>
                           <q-btn-group  style="transform: rotateZ(90deg); border-radius: 0.5em">
                              <q-btn size="0.3em" class="q-pl-xs" color="white" icon="fas fa-chevron-left" text-color="dark" dense >
                                 <q-badge color="red" v-if="item.avail === 0" floating style="left: 10px; right: auto;">max</q-badge>
                                 <q-badge color="red" v-if="item.avail == 2" floating style="left: 10px; right: auto;">
                                    <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                                 </q-badge>
                              </q-btn>
                              <q-btn size="0.3em" color="white" text-color="black" label="│" dense/>
                              <q-btn size="0.3em" class="q-pr-xs" color="white" icon="fas fa-chevron-right" text-color="dark" dense />
                           </q-btn-group>
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
                  <q-item v-if="carrito.length > 1">
                     <q-item-section class="text-h6 text-right">
                        <q-item-label v-if="totalItComp (item.items)">
                           SubTotal:        {{(item.prodPrice * item.quantity).toFixed(2)}}
                        </q-item-label>
                        <q-item-label v-if="totalItComp (item.items)">
                           Extras:     + <u> {{ ((totalItComp (item.items)) * item.quantity).toFixed(2) }} </u>
                        </q-item-label>
                        <q-item-label v-if="totalItComp (item.items)">
                           Total:      $ {{((parseFloat(item.prodPrice) + totalItComp (item.items)) * item.quantity).toFixed(2)}}
                        </q-item-label>
                     </q-item-section>
                  </q-item>
               </q-list>
            </q-card-section>
            <q-card-section class="column items-center">
               <q-card bordered class="q-cardGlass q-pa-lg q-ma-xs" style="border-radius: 28px; min-width: 40vmin">
                  <q-card-section>
                     <p v-if="carrito.length == 0" class="text-h4 text-center">No hay productos en esta orden</p>
                     <div v-if="carrito.length" >
                        <div class="text-h7 text-left">
                           <div class="row" v-if="getTotalCarrito()[1] > 0">
                              <p class="col-6"> Subtotal </p>
                              <p class="text-right col-6">$ {{getTotalCarrito()[0].toFixed(2)}}</p>
                           </div>
                           <div class="row" v-if="getTotalCarrito()[1] && ordenDet.tipEnvio != 1">
                              <p class="col-6">Extras</p>
                              <p class="text-right col-6"> + <u> $ {{getTotalCarrito()[1].toFixed(2)}} </u> </p>
                           </div>
                           <div class="row" v-if="getTotalCarrito()[1] && ordenDet.tipEnvio == 1">
                              <p class="col-6">Extras</p>
                              <p class="text-right col-6"> $ {{getTotalCarrito()[1].toFixed(2)}} </p>
                           </div>
                           <div class="row" v-if="ordenDet.delivery > 0">
                              <p class="col-6"> Delivery </p>
                              <p class="text-right col-6"> $ {{parseFloat(ordenDet.delivery).toFixed(2)}}</p>
                           </div>
                           <div class="row">
                              <p class="col-6">Total</p>
                              <p class="text-right col-6">$ {{getTotalCarrito()[2].toFixed(2)}}</p>
                           </div>
                        </div>
                     </div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section style="max-width: 70vmin">
                     <div v-if="ordenDet.typePayment == 0 || ordenDet.typePayment == 1 || ordenDet.typePayment ===2  || ordenDet.typePayment ===4 || ordenDet.typePayment ===8 || ordenDet.typePayment ===7"  class="text-center">
                        <div class=" column items-center" >
                         <img :src="ordenDet.photo" class="q-mb-sm" style="width:100%">
                        </div>
                        <!--div class=" column items-center" v-if="showDefaultPhoto(getOrdedVal(ordenDet.id, 'photo'))">
                           <q-btn style="border-radius: 28px;" push>
                              <q-avatar rounded class="q-mb-sm" icon="collections" font-size="50px" size="130px" text-color="grey-4"></q-avatar>
                           </q-btn>
                           <div class="q-pt-md">
                             <span class="text-caption" v-if="ordenDet.typePayment == 2">Haga click cargar captura del pago realizado a {{ordenDet.payto}}</span>
                           <span class="text-caption" v-if="ordenDet.typePayment == 1">Porfavor Subir Foto del Efectivo</span>
                           </div>
                        </div>
                        <div class="column items-center" v-else>
                           <q-btn style="border-radius: 28px;" :style="`background-image: url(${getOrdedVal(ordenDet.id, 'photo')}); background-size: cover; background-repeat: no-repeat; max-width: 100%; background-position: center;`"  @click="showPhotoUpload(ordenDet.id)" push>
                            <img style="visibility: hidden;" :src="getOrdedVal(ordenDet.id, 'photo')">
                           </q-btn>
                           <span>
                              <q-icon class="q-mr-sm" color="blue-grey-10" name="edit" size="16px"></q-icon>
                              Click para editar
                           </span>
                        </div!-->
                     </div>
                  </q-card-section>
               </q-card>
               <q-card-section>
                 <p class="text-h5 text-center">Servicio: {{tipoServ[ordenDet.tipEnvio]}}</p>
                  <p class="text-center">Forma de Pago {{typePay}}</p>
                  <strong>NOTA: Estos precios incluyen el IVA</strong>
                  <p v-if="ordenDet.tipEnvio == 1">{{getAddById(ordenDet.address)}}</p>

                 <q-input filled label="Fecha de Entrega" readonly v-if="(ordenDet && ordenDet.orderWhen && ordenDet.orderWhen.orderWhen == '1')" :value=" ordenDet && ordenDet.orderWhen && ordenDet.orderWhen.orderWhen == '1' ? new Date(ordenDet.orderWhen.orderDate.seconds * 1000).toLocaleString() : 'De inmediato'"  type="text" disabled />
               </q-card-section>
            </q-card-section>
            <q-card-section :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
               <q-input filled
                  @input="(e) => saved(e, ordenDet.id, 'userComment')"
                  :value="ordenDet.userComment"
                  label="Añade tu comentario"
                  type="textarea"
                  min-height="5rem"

                  />
            </q-card-section>
         </q-card>
      </q-dialog>
      <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
         <fbq-uploader
            class="q-my-lg"
            label="Please Upload a Photo"
            :meta="meta"
            :prefixPath="prefixPath"
            @uploaded="uploadComplete"
            document='orders'
            ></fbq-uploader>
      </q-dialog>
   </q-page>
</template>

<script>
import { date, QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [ QUploaderBase ],
  components: {
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    'itemcomp': () => import('../../components/itemComp.vue')
  },
  data () {
    return {
      loading: true,
      texto: 'Por confirmar',
      texto2: 'Estamos trabajando Para entregarle su orden',
      value: 20,
      maximizedToggle: true,
      dialog: false,
      carrito: [],
      photoType: '',
      photoUpload: false,
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
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos']),
    ...mapGetters('editor', ['page']),
    orderSort () {
      var ord = this.orders.map(x => {
        return {
          userComment: typeof x.userComment === 'undefined' ? '' : x.userComment,
          id: x.id,
          address: x.address,
          cart: x.cart,
          customer_id: x.customer_id,
          dateIn: x.dateIn,
          factura: x.factura,
          paid: x.paid,
          sede: x.sede,
          status: x.status,
          table: x.table,
          tipEnvio: x.tipEnvio,
          typePayment: x.typePayment,
          photo: x.photo,
          payto: x.payto,
          orderWhen: x.orderWhen,
          delivery: x.delivery
        }
      })
      return ord.sort((a, b) => {
        if (typeof b.factura === 'undefined') {
          return 999999 - a.factura
        } else if (typeof a.factura === 'undefined') {
          return b.factura - 999999
        }
        return b.factura - a.factura
      })
    },
    typePay () {
      if (typeof this.ordenDet === 'undefined') {
        return ''
      }
      let f = [
        { label: 'Punto de venta', value: 0 },
        { label: 'Efectivo', value: 1 },
        { label: 'Zelle', value: 2 },
        { label: 'Tarjeta o Paypal', value: 3 },
        { label: 'Venmo', value: 4 },
        { label: 'Tarjeta de Crédito', value: 5 },
        { label: 'Tarjeta Venezolana', value: 6 },
        { label: 'Transferencia Bancaria', value: 7 },
        { label: 'Pago móvil', value: 8 }
      ].find(e => e.value === this.ordenDet.typePayment)
      return f.label
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
  methods: {
    getcolor (e) {
      if (this.page && this.page.knob && this.page.knob['knob' + e]) {
        return 'color: ' + this.page.knob['knob' + e]
      } else {
        return 'color: #292810'
      }
    },
    saved (value, id, key) {
      this.saveOrder({ value, id, key })
      this.ordenDet.userComment = value
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
    ...mapActions('address', ['bindAddress']),
    ...mapActions('order', ['bindOrders', 'saveOrder']),
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'bindPromos', 'bindGroupComp']),
    ...mapActions('editor', ['bindPage']),
    formatDate (e) {
      return date.formatDate(e.seconds * 1000, 'DD-MM')
    },
    getAddById (id) {
      if (id === '') { return }
      var add = this.address.find(x => x.id === id)
      let tmpAddressDelivery = ''
      return tmpAddressDelivery.concat(
        typeof add.estado !== 'undefined' ? add.estado + ', ' : '', ' ',
        typeof add.ciudad !== 'undefined' ? add.ciudad + ', ' : '', ' ',
        typeof add.municipio !== 'undefined' ? add.municipio + ', ' : '', ' ',
        typeof add.calle !== 'undefined' ? add.calle + ', ' : '', ' ',
        typeof add.domicilio !== 'undefined' ? add.domicilio : '', ' '
      )
    },
    carritoDialog (e) {
      this.dialog = true
      this.carrito = e.cart
      this.ordenDet = e
      console.log({ th: this.ordenDet })
    },
    getProdbyId (id) {
      return this.menu.find(x => x.id === id)
    },
    getOrdedVal (id, value) {
      var obj = this.orders.find(x => x.id === id)
      return obj[value]
    },
    getProdValById (id, val, type) {
      if (!type) {
        var obj = this.menu.find(e => { return e.id === id })
        return obj[val]
      } else {
        obj = this.promos.find(e => { return e.id === id })
        return obj[val]
      }
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      this.carrito.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        sumExtra = (this.totalItComp(e.items) * e.quantity) + sumExtra
      })
      if (this.ordenDet.delivery) {
        sumProd = sumProd + this.ordenDet.delivery
      }
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    showPhotoUpload (type) {
      this.photoUpload = true
      this.photoType = type
    },
    showDefaultPhoto (e) {
      return e === '' ||
        e === null ||
        e === undefined
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      let fileNames = []
      info.files.forEach(file => fileNames.push(file))
      this.photoUpload = false
      this.$q.notify({
        message: `Foto subida correctamente`,
        color: 'primary'
      })
    }
  },
  created () {
    this.bindOrders(this.currentUser.id).then(() => { this.loading = false })
    //  this.bindPage()
    this.bindAddress(this.currentUser.id)
    //  this.bindMenu()
    //  this.bindCategorias()
    //  this.bindPromos()
    //  this.bindGroupComp()
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
