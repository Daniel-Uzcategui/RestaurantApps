<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Editar Clientes</div>
          <div>
            <q-btn class="header-btn-back" flat color="white" push  icon="arrow_back" @click="$router.replace('/clients/index')"/>
          </div>
       </q-card-section>
        <div class="row header-container">
         <div class="header-cell col-4" v-if="typeof client !== 'undefined'">
           <q-input filled label="Identificación"
             :value="client.cedula"
             @input="(e) => saved(e, this.$route.query.client_Id, 'cedula')"
             type="text" float-label="Float Label" placeholder="Identificación" />
          <q-input filled label="Nombre"
             :value="client.nombre"
             @input="(e) => saved(e, this.$route.query.client_Id, 'nombre')"
             type="text" float-label="Float Label" placeholder="Nombre" />
          <q-input filled label="Apellido"
             :value="client.apellido"
             @input="(e) => saved(e, this.$route.query.client_Id, 'apellido')"
            type="text" float-label="Float Label" placeholder="Apellido" />
          <q-input filled label="Correo Electrónico"
            :value="client.email"
            @input="(e) => saved(e, this.$route.query.client_Id, 'email')"
            type="text" float-label="Float Label" placeholder="Correo Electrónico" />
          <q-input filled label="Telefono"
            :value="client.phone"
            @input="(e) => saved(e, this.$route.query.client_Id, 'phone')"
            type="text" float-label="Float Label" placeholder="Telefono" />
          <label>Estatus</label>
          <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
            :value="client.status"
            @input="(e) => saved(e, this.$route.query.client_Id, 'status')"
            :options="estatus_client" />
          <br>
          <q-input filled  label="Dirección" :value="addressDelivery"
           type="textarea" placeholder="Dirección" disabled  />
        </div>
        <div class="header-cell col-6 filled">
          <q-table
          title="Ordenes"
          color="primary"
          :data="clientOrders"
          :columns="columns"
          :dense="$q.screen.lt.md"
          row-key="id"
          no-data-label="No se encontraron registros"
      >
      <template v-slot:body="props">
        <q-tr>
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
        </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
  </div>

</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      columns: [
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'typeService', required: true, label: 'Tipo Servicio', align: 'left', field: 'typeService', sortable: true },
        { name: 'typePayment', required: true, label: 'Tipo de Pago', align: 'left', field: 'typePayment', sortable: true },
        { name: 'paid', label: 'Pago Realizado', field: 'paid' }
      ],
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ],
      tipo_pago: [
        { label: 'Punto de venta', value: 0 },
        { label: 'Efectivo', value: 1 },
        { label: 'Zelle', value: 2 },
        { label: 'Tarjeta o Paypal', value: 3 }

      ],
      tipo_servicio: [
        { label: 'Pick-up', value: 0 },
        { label: 'Delivery', value: 1 },
        { label: 'In-Local', value: 2 }
      ],
      estatus_client: [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
      ],
      addressDelivery: ''
    }
  },
  computed: {
    ...mapGetters('client', ['clients']),
    ...mapGetters('order', ['orders']),
    ...mapGetters('address', ['address']),
    client () {
      return this.clients.find(obj => {
        return obj.id === this.$route.query.client_Id
      })
    },
    clientOrders () {
      return this.getClientOrders(this.$route.query.client_Id)
    }
  },
  mounted () {
    this.bindClients()
    this.bindAddress()
    this.bindOrders()
  },
  updated () {
    this.getAddress(this.$route.query.client_Id)
  },
  methods: {
    ...mapActions('client', ['saveClient', 'bindClients']),
    ...mapActions('order', ['bindOrders']),
    ...mapActions('address', ['bindAddress']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveClient({ value, id, key })
    },
    getClientOrders (value) {
      let OrderClient = []
      let i, obj, tipoPago
      let fullname, statusOrder, tableOrder, typeService
      for (i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        if (obj.customer_id === value) {
          typeService = typeof obj.tipEnvio !== 'undefined' ? this.tipo_servicio[obj.tipEnvio]['label'] : 'No disponible'
          tipoPago = this.tipo_pago[obj.typePayment]['label']
          statusOrder = typeof obj.status !== 'undefined' ? this.estatus_options[obj.status]['label'] : ''
          tableOrder = obj.table !== 0 ? obj.table : 'No asignada'
          OrderClient.push({
            'id': obj.id,
            'nombre': fullname,
            'typePayment': tipoPago,
            'status': statusOrder,
            'paid': obj.paid.toFixed(2),
            'dateIn': obj.dateIn,
            'factura': obj.factura,
            'table': tableOrder,
            'typeService': typeService
          })
        }
      }
      return OrderClient
    },
    getAddress (value) {
      let objaddress
      let tmpAddressDelivery = ''
      objaddress = this.address.find(obj => {
        return obj.user === value
      })
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
      return objaddress
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
.filled
  padding-top: 50px
.header-cell
  padding-left: 50px
.header-btn-back
  position: absolute; right:20px !important
.header
 padding-bottom: 50px
</style>
