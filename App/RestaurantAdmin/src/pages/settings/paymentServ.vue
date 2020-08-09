<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Ajustes de Medios de Pagos y Tipos de Servicios</div>
          <div>
           <div v-if="config">
              <q-btn class="header-btn" flat color="white" push label="Guardar" @click="save" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push label="Agregar" @click="add" icon="fas fa-plus"/>
            </div>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
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
          v-model="price"
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
import { mapGetters, mapActions } from 'vuex'
export default {
  created () {
    this.bindConfigs().then(e => console.log(this.afterBindigs()))
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(obj => {
        return obj.source === 'paymentServ'
      })
    }
  },
  data () {
    return {
      validationError: false,
      messageError: [],
      statusDelivery: 1,
      statusPto: 1,
      statusZelle: 1,
      statusCash: 1,
      statusPaypal: 1,
      price: 0,
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ]
    }
  },
  methods: {
    ...mapActions('config', ['addConfig', 'bindConfigs', 'saveConfig']),
    add () {
      this.$q.loading.show()
      const payload = {
        statusDelivery: this.statusDelivery,
        statusPto: this.statusPto,
        statusZelle: this.statusZelle,
        statusCash: this.statusCash,
        statusPaypal: this.statusPaypal,
        price: this.price,
        source: 'paymentServ'
      }
      this.addConfig(payload).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    save () {
      let value, id, key
      value = this.statusDelivery
      id = this.config.id
      key = 'statusDelivery'
      this.saveConfig({ value, id, key })
      value = this.statusPto
      key = 'statusPto'
      this.saveConfig({ value, id, key })
      value = this.statusZelle
      key = 'statusZelle'
      this.saveConfig({ value, id, key })
      value = this.statusCash
      key = 'statusCash'
      this.saveConfig({ value, id, key })
      value = this.statusPaypal
      key = 'statusPaypal'
      this.saveConfig({ value, id, key })
      value = this.price
      key = 'price'
      this.saveConfig({ value, id, key }).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    afterBindigs () {
      if (this.config.source !== '') {
        this.statusDelivery = this.config.statusDelivery
        this.statusPto = this.config.statusPto
        this.statusZelle = this.config.statusZelle
        this.statusCash = this.config.statusCash
        this.statusPaypal = this.config.statusPaypal
        this.price = this.config.price
      }
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
