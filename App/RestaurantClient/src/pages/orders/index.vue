<template>
   <q-page>
      <q-card flat class="bg-dark text-white q-cardGlass" :class="$q.screen.lt.md ? 'q-mb-lg' : ''">
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
               <q-list style="min-width: 300px" :class="'q-pa-' + $q.screen.name" class="col-6 q-pb-xl relative-position" separator v-for="(items, index) in orderSort" :key="index">
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
                        <q-item-label v-if="typeof items.status === 'number'" lines="2" >{{estatus_options[items.status]['label']}}</q-item-label>
                        <q-item-label lines="2"  v-if="typeof items.factura === 'undefined'">
                           Nro. Pedido:
                           <q-spinner color="primary" />
                        </q-item-label>
                        <q-item-label lines="2"  v-else>Nro. Pedido: {{items.factura}}</q-item-label>
                        <q-item-label lines="2" caption class="text-grey">Ver detalles</q-item-label>
                     </q-item-section>
                  </q-item>
               </q-list>
            </div>
         </q-card-section>
      </q-card>
      <q-dialog
         v-if="carrito && Object.keys(carrito).length && ordenDet !== {}"
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
               <classic-list
                  :photo="getProdValById(item.prodId, 'photo', item.prodType)"
                  :name="getProdValById(item.prodId, 'name', item.prodType)"
                  :priceDisplay="item.prodPrice"
                  :item="item"
                  :orders="true"
                  :cart="cart"
                  :totalItComp="totalItComp(item.items)"
                  :subTotalItem="subTotalItem(item)"
                  :Total="totalItem(item)"
                  :extrasTotalItem="extrasTotalItem(item)"
               />
               </q-list>
            </q-card-section>
            <q-card-section class="column items-center">
               <q-card bordered class="q-cardGlass q-pa-lg q-ma-xs" style="border-radius: 28px; min-width: 40vmin">
                  <q-card-section>
                     <p v-if="carrito && Object.keys(carrito).length == 0" class="text-h4 text-center">No hay productos en esta orden</p>
                     <div v-if="carrito && Object.keys(carrito).length" >
                        <div class="text-h7 text-left">
                           <div class="row" >
                              <p class="col-6"> Subtotal </p>
                              <p class="text-right col-6">$ {{getTotalCarrito()[3].toFixed(2)}}</p>
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
                            <div class="row" v-if="ordenDet.cuponTotal > 0">
                              <p class="col-6"> Cupones </p>
                              <p class="text-right col-6"> - $ {{parseFloat(ordenDet.cuponTotal).toFixed(2)}}</p>
                           </div>
                           <div class="row">
                              <p class="col-6">Total</p>
                              <p class="text-right col-6">$ {{ordenDet.paid.toLocaleString()}}</p>
                           </div>
                           <div class="row" v-if="ordenDet.typePayment==8 || ordenDet.typePayment == 0">
                              <p class="col-6"></p>
                              <p class="text-right col-6">Bs {{parseFloat(getRates(ordenDet.paid).toFixed(2)).toLocaleString()}}</p>
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
   </q-page>
</template>

<script>
import { date, QUploaderBase } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import ClassicList from '../../components/cart/classicList/classicList.vue'
export default {
  mixins: [ QUploaderBase ],
  components: {
    ClassicList
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
        { label: 'Anulada', value: 4 },
        { label: 'Vencida', value: 5 },
        { label: 'Pagada', value: 6 }
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('address', ['address']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos']),
    ...mapGetters('editor', ['page']),
    ...mapGetters('config', ['rates']),
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
          productos: x.productos,
          paid: x.paid,
          sede: x.sede,
          cuponTotal: x.cuponTotal,
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
        { label: 'Tarjeta Débito Venezolana', value: 6 },
        { label: 'Transferencia Bancaria', value: 7 },
        { label: 'Pago móvil', value: 8 },
        { label: 'Tarjeta Crédito Venezolana', value: 9 }
      ].find(e => e.value === this.ordenDet.typePayment)
      return f && f.label ? f.label : 'N/A'
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
    totalItem (item) {
      return ((parseFloat(item.prodPrice) + this.totalItComp(item.items)) * item.quantity).toFixed(2)
    },
    extrasTotalItem (item) {
      let price = item.extras ?? ((this.totalItComp(item.items)) * item.quantity).toFixed(2)
      return price
    },
    subTotalItem (item) {
      let price = item.subtotal ?? parseFloat((item.prodPrice * item.quantity).toFixed(2))
      return price
    },
    getRates (mto) {
      let mtoTotal = 0
      let rate = ''
      rate = this.rates.find(obj => {
        return obj.currency === 'Bs'
      })
      if (mto !== 'undefined' && rate && rate.rateValue) {
        mtoTotal = rate.rateValue * mto
      }
      return mtoTotal
    },
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
      let item = its ?? {}
      Object.keys(item).forEach(x => {
        let qty = item[x].quantity ?? 1
        sum = sum + (item[x].price * qty)
        sum = parseFloat(sum.toFixed(2))
        // if (typeof x.quantity === 'undefined') {
        //   sum = sum + x.price
        // } else {
        //   sum = sum + (x.price * x.quantity)
        // }
      })
    },
    ...mapActions('address', ['bindAddress']),
    ...mapActions('order', ['bindOrders', 'saveOrder']),
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'bindPromos', 'bindGroupComp']),
    ...mapActions('editor', ['bindPage']),
    ...mapActions('config', ['bindRates']),
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
      console.log(e)
      this.carrito = e.productos
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
        return obj && obj[val] ? obj[val] : null
      } else {
        obj = this.promos.find(e => { return e.id === id })
        return obj && obj[val] ? obj[val] : null
      }
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      var sumProdDelivery = 0
      this.carrito.forEach(e => {
        sumProd = (e.prodPrice * e.quantity) + sumProd
        sumExtra = (this.totalItComp(e.items) * e.quantity) + sumExtra
      })

      if (this.ordenDet.delivery) {
        sumProdDelivery = sumProd + this.ordenDet.delivery + sumExtra
      }
      return [sumProdDelivery, sumExtra, sumProd + sumExtra, sumProd]
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
    this.bindRates()
    console.log(this.rates)
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
