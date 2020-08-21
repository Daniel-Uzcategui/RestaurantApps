<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Ajustes de Medios de Pagos y Tipos de Servicios</div>
          <div>
           <div v-if="config">
              <q-btn class="header-btn" flat color="white" push label="Guardar" @click="validator" icon="fas fa-save"/>
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
          type="number"
          float-label="Float Label"
          placeholder="Precio"
          outlined
          v-model="price"
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Precio']"/>
        </div>
        <div class="flex-break q-py-md "></div>
      </div>
       <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusPickup" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Pick Up" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusInlocal" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="In Local" />
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
        return obj.id === 'paymentServ'
      })
    }
  },
  data () {
    return {
      validationError: false,
      messageError: [],
      statusDelivery: 1,
      statusPickup: 1,
      statusInlocal: 1,
      statusPto: 1,
      statusZelle: 1,
      statusCash: 1,
      statusPaypal: 1,
      price: 0,
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
      ]
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig']),
    add () {
      this.$q.loading.show()
      const payload = {
        statusDelivery: this.statusDelivery,
        statusPickup: this.statusPickup,
        statusInlocal: this.statusInlocal,
        statusPto: this.statusPto,
        statusZelle: this.statusZelle,
        statusCash: this.statusCash,
        statusPaypal: this.statusPaypal,
        price: this.price,
        source: 'paymentServ'
      }
      this.addConfig2({ payload, doc: 'paymentServ' }).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    validator () {
      if (this.statusDelivery === 0 && this.statusPickup === 0 && this.statusInlocal === 0) {
        this.$q.dialog({
          title: 'Error al guardar sección de tipo de servicios',
          message: 'Debe seleccionar al menos un tipo de Servicio Activo ',
          cancel: false,
          persistent: true
        }).onOk(() => {
        })
      } else {
        if (this.statusPto === 0 && this.statusZelle === 0 && this.statusPaypal === 0 && this.statusCash === 0) {
          this.$q.dialog({
            title: 'Error al guardar sección de medios de pago',
            message: 'Debe seleccionar al menos un medio de pago Activo ',
            cancel: false,
            persistent: true
          }).onOk(() => {
          })
        } else {
          this.save()
        }
      }
    },
    save () {
      let value, id, key
      value = this.statusDelivery
      id = this.config.id
      key = 'statusDelivery'
      this.saveConfig({ value, id, key })
      value = this.statusPickup
      id = this.config.id
      key = 'statusPickup'
      this.saveConfig({ value, id, key })
      value = this.statusInlocal
      id = this.config.id
      key = 'statusInlocal'
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
      this.saveConfig({ value, id, key })
      this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
      })
    },
    afterBindigs () {
      if (this.config.source !== '') {
        this.statusDelivery = this.config.statusDelivery
        this.statusPickup = this.config.statusPickup
        this.statusInlocal = this.config.statusInlocal
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
