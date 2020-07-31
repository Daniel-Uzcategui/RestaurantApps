<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Orden</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/Orders/index')"/>
          </div>
       </q-card-section>
         <div class='filled'></div>
       <div v-if="typeof order !== 'undefined'">
       <div class="row header-container">
         <div class="header-cell col-4">
          <q-input label="Nombre del Cliente" :value="this.getClient(order.customer_id)"  type="text" float-label="Float Label" disabled/>
        </div>
        <div class="header-cell col-4">
          <q-input label="Factura" :value="order.factura"  @input="(e) => saved(e, this.$route.query.Order_Id, 'factura')"  type="text" float-label="Float Label" disabled />
        </div>
        <div class="header-cell col-3">
          <q-input label="Monto" :value="(order.paid).toFixed(2)"  @input="(e) => saved(e, this.$route.query.Order_Id, 'paid')"  type="text" float-label="Float Label"  />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-input label="Sede" :value="this.getLocalization (order.sede)"  type="text" float-label="Float Label" placeholder="Sede de la Orden" disabled />
        </div>
        <div class="header-cell col-4" v-if="order.tipEnvio==2">
          <q-input label="Mesa" :value="order.table"  @input="(e) => saved(e, this.$route.query.Order_Id, 'table')" type="text" float-label="Float Label" placeholder="Mesa de la Orden" />
        </div>
        <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-select :value="order.status"  @input="(e) => saved(e, this.$route.query.Order_Id, 'status')" map-options emit-value standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
        <div class="header-cell col-3">
          <q-select :value="order.typePayment" @input="(e) => saved(e, this.$route.query.Order_Id, 'typePayment')" standout="bg-teal text-white"
            :options="typePayment_options" map-options emit-value label="Tipo de Pago" />
        </div>
         <div class="flex-break q-pa-md"></div>
         <div class="header-cell col-6">
            <q-input label="punto de Referencia" :value="puntoRef"  filled type="textarea" placeholder="Punto de referencia"  disabled/>
         </div>
         <div class="header-cell col-6">
            <q-input label="Dirección de entrega" :value="addressDelivery"  filled type="textarea" placeholder="Dirección del cliente" disabled />
         </div>
      </div>
      <div v-if="order.typePayment == 0 || order.typePayment == 2" class="column items-center filled-soport">
        <div class="col">
          <label><strong>Soporte de pago</strong></label>
          <viewer :img="order.photo"></viewer>
          <span>Presione en la imagen para ampliar</span>
      </div>
      </div>
     </div>
      <div class="flex-break q-py-md "></div>
     <div class="header-cell col-7 filled">
          <q-table
          title="Detalle de Orden"
          color="primary"
          :data="detailOrder"
          :columns="columns"
          :dense="$q.screen.lt.md"
          row-key="id"
          no-data-label="No se encontraron registros"
          class="table"
      >
      <template v-slot:body="props">
        <q-tr :props="props">
           <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit
            :value="props.row.name"
            @show="() => showPopup(props.row, 'name')"
            >
              <q-input @input="(e) => saved(e, props.row.name, props.row.id, 'name')" :value="props.row.name" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="quantity" :props="props">
              <q-input
                @input="(e) => saved(e, props.row.quantity, props.row.id, 'quantity')"
                :value="props.row.quantity"
                dense
                autofocus
                type="number"
              />
          </q-td>
          <q-td key="price" :props="props">
              <q-input
                @input="(e) => saved(e, props.row.prodPrice, props.row.id, 'price')"
                :value="props.row.prodPrice"
                dense
                autofocus
                type="number"
              />
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.row.items.length">
          <q-td colspan="100%">
            <div class="text-bold">Opciones</div>
            <q-list class="text-center">
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label class="text-bold">Nombre</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">Cantidad</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">Precio</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
            <q-list v-for="(items, index) in props.row.items" :key="index+props.row.prodId" class="text-center">
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ items.quantity ? items.quantity : 1}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.price ? '$ ' +items.price : 'incluido'}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </div>
    <div class='filled'></div>
     </q-card>
  </div>
  <q-dialog v-model="validationError" >
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <q-card-section>
          Los siguientes campos son requeridos
          {{messageError}}
        </q-card-section>
      </q-card>
    </q-dialog>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Viewer: require('../../components/Viewer.vue').default
  },
  data () {
    return {
      photoDiag: false,
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ],
      typePayment_options: [
        { label: 'Punto de venta', value: 0 },
        { label: 'Efectivo', value: 1 },
        { label: 'Zelle', value: 2 }
      ],
      columns: [
        { name: 'name', required: true, align: 'center', label: 'Nombre', field: 'name' },
        { name: 'quantity', required: true, align: 'center', label: 'Cantidad', field: 'quantity' },
        { name: 'price', required: true, align: 'center', label: 'Precio/Unidad', field: 'price' }
      ],
      puntoRef: '',
      addressDelivery: '',
      validationError: false,
      messageError: []
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('menu', ['menu', 'item', 'promos']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('address', ['address']),
    ...mapGetters('localization', ['localizations']),
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.Order_Id
      })
    },
    detailOrder () {
      let productsOrder = []
      let ord, prods
      for (ord of this.orders) {
        if (ord.id === this.$route.query.Order_Id) {
          for (prods of ord.cart) {
            productsOrder.push({ ...this.getProducts(prods.prodId, prods.prodType), ...prods })
          }
        }
      }
      console.log({ productsOrder })
      return productsOrder
    }
  },
  created () {
    this.bindMenu()
    this.bindClients()
    this.bindAddress()
    this.bindLocalizations()
    this.bindPromos()
  },
  updated () {
    this.getAddress(this.order.address)
  },
  methods: {
    ...mapActions('order', ['saveOrder']),
    ...mapActions('menu', ['bindMenu', 'bindPromos']),
    ...mapActions('client', ['bindClients']),
    ...mapActions('address', ['bindAddress']),
    ...mapActions('localization', ['bindLocalizations']),
    saved (value, id, key) {
      //  console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveOrder({ value, id, key })
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
    getClient (value) {
      let fullname
      let objclients
      objclients = this.clients.find(obj => {
        return obj.id === value
      })
      fullname = typeof objclients !== 'undefined' ? objclients.nombre + ' ' + objclients.apellido : 'No disponible'
      return fullname
    },
    getAddress (value) {
      let objaddress
      let tmpAddressDelivery = ''
      objaddress = this.address.find(obj => {
        return obj.id === value
      })
      this.puntoRef = typeof objaddress !== 'undefined' ? objaddress.puntoRef : 'No disponible'
      if (typeof objaddress !== 'undefined') {
        this.addressDelivery = tmpAddressDelivery.concat(
          typeof objaddress.estado !== 'undefined' ? objaddress.estado : '', ' ',
          typeof objaddress.ciudad !== 'undefined' ? objaddress.ciudad : '', ' ',
          typeof objaddress.municipio !== 'undefined' ? objaddress.municipio : '', ' ',
          typeof objaddress.calle !== 'undefined' ? objaddress.calle : '', ' ',
          typeof objaddress.domicilio !== 'undefined' ? objaddress.domicilio : '', ' '
        )
      } else {
        this.addressDelivery = 'No disponible'
      }
      console.log({ objaddress })
      return objaddress
    },
    getLocalization (value) {
      let name
      let objLocalization
      objLocalization = this.localizations.find(obj => {
        return obj.id === value
      })
      name = typeof objLocalization !== 'undefined' ? objLocalization.name : 'No disponible'
      return name
    }
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
.filled
  padding-top: 50px
.filled-soport
  padding-top: 30px
.table
  width: 90%
</style>
