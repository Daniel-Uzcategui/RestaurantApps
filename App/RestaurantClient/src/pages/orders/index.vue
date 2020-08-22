<template>
  <q-page padding>
    <q-card class="menudiv">
    <q-card-section>
    <div class="q-pa-md flex flex-center">
      <q-spinner-cube v-if="loading" size="lg" color="primary" />
      <p v-if="orderSort.length === 0 && !loading" class="text-h4 text-center">No existen pasadas ordenes</p>
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
    <q-item-label lines="2" class="text-h7 text-center" v-if="typeof items.factura !== 'undefined'">Nro. Pedido: {{items.factura}}</q-item-label>
    <q-item-label lines="2" class="text-h7 text-center" v-if="typeof items.factura === 'undefined'">Nro. Pedido: <q-spinner-cube color="primary" /></q-item-label>
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
        <div v-if="ordenDet.typePayment == 2 || ordenDet.typePayment == 1" class="text-center q-pa-md" @click="showPhotoUpload(ordenDet.id)">
            <div class=" column items-center" v-if="showDefaultPhoto(getOrdedVal(ordenDet.id, 'photo'))">
                <q-avatar rounded class="q-mb-sm" color="blue-grey-10" icon="fas fa-file-invoice" font-size="50px" size="180px" text-color="white"></q-avatar>
                <span class="text-caption" v-if="ordenDet.typePayment == 2">Haga click cargar captura del pago realizado a Mi_Restaurant@Company.io</span>
                <span class="text-caption" v-if="ordenDet.typePayment == 1">Porfavor Subir Foto del Efectivo</span>
                </div>
            <div class="column items-center" v-else>
                <q-avatar rounded style="border-radius: 0%" class="q-mb-sm shadow-5" size="180px" @click="showPhotoUpload(ordenDet.id)">
                    <q-img :src="getOrdedVal(ordenDet.id, 'photo')"></q-img>
                </q-avatar><span><q-icon class="q-mr-sm" color="blue-grey-10" name="edit" size="16px"></q-icon>Click para editar</span></div>
                </div>
        <div class="text-h6 q-pa-md">
          <p>Servicio: {{tipoServ[ordenDet.tipEnvio]}}</p>
          <p v-if="ordenDet.tipEnvio == 1">Despacho a dirección: {{getAddById(ordenDet.address)}}</p>
        </div>
         <q-list :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'" v-for="(item, index) in carrito" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h7 text-bold">
                    Cantidad: {{item.quantity}}
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
                  <q-item-label>
                    Total:      $ {{((parseFloat(item.prodPrice) + totalItComp (item.items)) * item.quantity).toFixed(2)}}
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
              <q-item-label v-if="getTotalCarrito()[1] && ordenDet.tipEnvio != 1">
                        Extras:  + <u> {{getTotalCarrito()[1].toFixed(2)}} </u>
              </q-item-label>
              <q-item-label v-if="getTotalCarrito()[1] && ordenDet.tipEnvio == 1">
                        Extras:  {{getTotalCarrito()[1].toFixed(2)}}
              </q-item-label>
              <q-item-label v-if="ordenDet.tipEnvio == 1">
                        Delivery: {{ordenDet.delivery}}
              </q-item-label>
              <q-item-label>
                        Total: $ {{ordenDet.paid}}
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
         <q-card-section :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
           <q-input
                @input="(e) => saved(e, ordenDet.id, 'userComment')"
                :value="ordenDet.userComment"
                label="Añade tu comentario"
                type="textarea"
                min-height="5rem"
                autofocus
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
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'promos']),
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
    this.bindAddress(this.currentUser.id)
    this.bindMenu()
    this.bindCategorias()
    this.bindPromos()
    this.bindGroupComp()
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
