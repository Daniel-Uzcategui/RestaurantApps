<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Pago</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/payments/index')"/>
          </div>
       </q-card-section>
         <div class='filled'></div>
       <div v-if="typeof payment !== 'undefined'">
       <div class="row header-container">
        <div class="header-cell col-4">
          <label>Monto</label>
          <q-input :value="payment.amount"  @input="(e) => saved(e, this.$route.query.payment_Id, 'amount')"  type="text" float-label="Float Label" placeholder="Monto" />
        </div>
        <div class="header-cell col-4">
          <label>Estatus del Pago</label>
          <q-select :value="payment.status"  @input="(e) => saved(e, this.$route.query.payment_Id, 'status')" standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <label>Factura</label>
          <q-input :value="payment.invoice"  @input="(e) => saved(e, this.$route.query.payment_Id, 'invoice')"  type="text" float-label="Float Label" placeholder="Factura" />
        </div>
        <div class="header-cell col-4">
          <label>Tipo de Pago</label>
          <q-select :value="payment.typePayment"  @input="(e) => saved(e, this.$route.query.payment_Id, 'typePayment')" standout="bg-teal text-white"  :options="typePayment_options" label="Tipo de Pago" />
        </div>
      </div>
     </div>
      <div class='filled'></div>
     </q-card>
  </div>
</q-page>
</template>
<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters('payment', ['payments']),
    payment () {
      return this.payments.find(obj => {
        return obj.id === this.$route.query.payment_Id
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
</style>
