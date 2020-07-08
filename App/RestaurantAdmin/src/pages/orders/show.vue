<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Orden</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/Orders/index')"/>
          </div>
       </q-card-section>
         <div class='filled'></div>
       <div v-if="typeof order !== 'undefined'">
       <div class="row header-container">
         <div class="header-cell col-4">
          <q-input label="Nombre del Cliente" :value="order.name"  type="text" float-label="Float Label" disabled/>
        </div>
        <div class="header-cell col-4">
          <q-input label="Factura" :value="order.factura"  @input="(e) => saved(e, this.$route.query.Order_Id, 'factura')"  type="text" float-label="Float Label"  />
        </div>
        <div class="header-cell col-3">
          <q-input label="Monto" :value="order.paid"  @input="(e) => saved(e, this.$route.query.Order_Id, 'paid')"  type="text" float-label="Float Label"  />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-input label="Responsable" :value="order.responsable"  @input="(e) => saved(e, this.$route.query.Order_Id, 'responsable')"  type="text" float-label="Float Label"  />
         </div>
         <div class="header-cell col-4">
          <q-select :value="order.status"  @input="(e) => saved(e, this.$route.query.Order_Id, 'status')" map-options emit-value standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
        <div class="header-cell col-3">
          <q-select :value="order.typePayment"  @input="(e) => saved(e, this.$route.query.Order_Id, 'typePayment')" standout="bg-teal text-white"  :options="typePayment_options" label="Tipo de Pago" />
        </div>
         <div class="flex-break q-py-md "></div>
          <div class="header-cell col-3">
          <q-input label="Responsable" :value="order.responsable"  @input="(e) => saved(e, this.$route.query.Order_Id, 'responsable')"  type="text" float-label="Float Label"  />
         </div>
        <div class="header-cell col-4">
          <q-input label="Sede" :value="order.sede"  @input="(e) => saved(e, this.$route.query.Order_Id, 'sede')"  type="text" float-label="Float Label" placeholder="Sede de la Orden" />
        </div>
         <div class="header-cell col-4">
            <q-input label="Dirección de entrega" :value="order.address"  @input="(e) => saved(e, this.$route.query.Order_Id, 'address')"  filled type="textarea" placeholder="Dirección del cliente"  />
         </div>
      </div>
     </div>
      <div class="flex-break q-py-md "></div>
     <div class="header-cell col-6 filled">
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

          <q-td key="descripcion" :props="props">
            <div v-html="props.row.descripcion"></div>
            <q-popup-edit
              :value="props.row.descripcion"
            >
              <q-editor
                @input="(e) => saved(e, props.row.descripcion, props.row.id, 'descripcion')"
                :value="props.row.descripcion"
                min-height="5rem"
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props">
            <div class="text-pre-wrap">{{ props.row.price }}</div>
            <q-popup-edit :value="props.row.price">
              <q-input
                @input="(e) => saved(e, props.row.price, props.row.id, 'price')"
                :value="props.row.price"
                dense
                autofocus
                type="number"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    </div>
    <div class='filled'></div>
     </q-card>
  </div>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ],
      typePayment_options: [
        'Efectivo', 'Paypal', 'Zelle'
      ],
      columns: [
        { name: 'name', required: true, align: 'center', label: 'Nombre', field: 'name' },
        { name: 'descripcion', required: true, align: 'left', label: 'Decripción', field: 'descripcion' },
        { name: 'price', required: true, align: 'center', label: 'Precio', field: 'price' }
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('menu', ['menu', 'listext']),
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.Order_Id
      })
    },
    detailOrder () {
      let productsOrder = []
      let i, j, obj
      console.log('detailorder ' + this.orders.length)
      for (i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        if (obj.id === this.$route.query.Order_Id) {
          for (j = 0; j < obj.cart.length; j++) {
            productsOrder.push(this.products(obj.cart[j].prodId))
            console.log(productsOrder)
          }
        }
      }
      return productsOrder
    }
  },
  mounted () {
    this.bindMenu()
  },
  methods: {
    ...mapActions('order', ['saveOrder']),
    ...mapActions('menu', ['bindMenu']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveOrder({ value, id, key })
    },
    products (value) {
      return this.menu.find(obj => {
        return obj.id === value
      })
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
.table
  width: 90%
</style>
