<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Ajustes de Medios de Pagos y Tipos de Servicios</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
          </div>
         </q-card-section>
        <div class='filled'></div>
        <div class="row header-container">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tipo de Servicios</div>
       </div>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusDelivery" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Delivery" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input
          type="text"
          float-label="Float Label"
          placeholder="Precio"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Precio']"/>
        </div>
        <div class="flex-break q-py-md "></div>
      </div>
        <div class="row header-container">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Medios de Pagos</div>
       </div>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusPto" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Punto de Venta" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusZelle" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Zelle" />
        </div>
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusCash" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Efectivo" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusPaypal" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Paypal" />
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
  computed: {
    ...mapGetters('config', ['configs'])
  },
  data () {
    return {
      statusDelivery: 1,
      statusPto: 1,
      statusZelle: 1,
      statusCash: 1,
      statusPaypal: 1,
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ]
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
