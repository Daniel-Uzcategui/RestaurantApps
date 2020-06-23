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
           <label>Nombre</label>
          <q-input :value="order.name"  @input="(e) => saved(e, this.$route.query.Order_Id, 'name')"  type="text" float-label="Float Label" placeholder="Nombre del Cliente" />
        </div>
        <div class="header-cell col-4">
          <q-input :value="order.paid"  @input="(e) => saved(e, this.$route.query.Order_Id, 'paid')"  type="text" float-label="Float Label" placeholder="Monto" />
        </div>
        <div class="header-cell col-4">
          <q-select :value="order.status"  @input="(e) => saved(e, this.$route.query.Order_Id, 'status')" standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-input :value="order.responsable"  @input="(e) => saved(e, this.$route.query.Order_Id, 'responsable')"  type="text" float-label="Float Label" placeholder="Responsable" />
        </div>
        <div class="header-cell col-4">
          <q-input :value="order.sede"  @input="(e) => saved(e, this.$route.query.Order_Id, 'sede')"  type="text" float-label="Float Label" placeholder="Sede de la Orden" />
        </div>
        <div class="header-cell col-4">
          <q-select :value="order.typePayment"  @input="(e) => saved(e, this.$route.query.Order_Id, 'typePayment')" standout="bg-teal text-white"  :options="typePayment_options" label="Tipo de Pago" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-5">
            <label>Dirección</label>
            <q-input :value="order.delivered"  @input="(e) => saved(e, this.$route.query.Order_Id, 'delivered')"  filled type="textarea" placeholder="Dirección"  />
         </div>
     </div>
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
        'En Espera', 'En progreso', 'Completado'
      ],
      typePayment_options: [
        'Efectivo', 'Paypal', 'Zelle'
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.Order_Id
      })
    }
  },
  methods: {
    ...mapActions('order', ['saveOrder']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveOrder({ value, id, key })
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
</style>
