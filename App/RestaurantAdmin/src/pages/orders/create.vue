<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Agregar Ordenes</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Agregar" @click="agregar" icon="fas fa-plus"/>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/orders/index')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <div class="row header-container">
        <div class="header-cell col-4">
          <q-input v-model="name"  type="text" float-label="Float Label" placeholder="Nombre del Cliente" />
        </div>
        <div class="header-cell col-4">
          <q-input v-model="paid"  type="text" float-label="Float Label" placeholder="Monto" />
        </div>
        <div class="header-cell col-4">
          <q-select v-model="status" standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-input v-model="responsable"  type="text" float-label="Float Label" placeholder="Responsable" />
        </div>
        <div class="header-cell col-4">
          <q-input v-model="sede"  type="text" float-label="Float Label" placeholder="Sede de la Orden" />
        </div>
        <div class="header-cell col-4">
          <q-select v-model="typePayment" standout="bg-teal text-white"  :options="typePayment_options" label="Tipo de Pago" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-5">
            <q-input v-model="delivered" filled type="textarea" placeholder="Dirección de entrega"  />
         </div>
         <div class="header-cell col-3">
            <q-input v-model="description" type="text" float-label="Float Label"  placeholder="Descripción del plato"  />
         </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
  </div>
 </q-page>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      noLoc: false,
      paid: '',
      sede: '',
      typePayment: '',
      responsable: '',
      name: '',
      smallAddress: '',
      status: 'En Espera',
      delivered: '',
      address: '',
      description: '',
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ],
      typePayment_options: [
        'Efectivo', 'Paypal', 'Zelle'
      ],
      markers: [],
      places: []
    }
  },
  methods: {
    ...mapActions('order', ['addOrder']),
    agregar () {
      this.$q.loading.show()
      const payload = {
        name: this.name,
        status: this.status,
        typePayment: this.typePayment,
        responsable: this.responsable,
        delivered: this.delivered,
        sede: this.sede,
        paid: this.paid,
        description: this.description

      }
      this.addOrder(payload).then(e => { this.$q.loading.hide(); this.$router.replace('/orders/index') })
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
  padding-left: 30px
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
</style>
