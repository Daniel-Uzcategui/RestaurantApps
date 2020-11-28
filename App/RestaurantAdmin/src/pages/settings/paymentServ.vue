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
          label="Precio"
          type="number"
          float-label="Float Label"
          placeholder="Precio"
          outlined
          v-model="price"
          :rules="[ val => val && val >= 0 || '*Requerido el campo Precio y mayor o igual a 0']"/>
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
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Recompensas</div>
       </div>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusRewards" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Activar Recompensas" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input
          label="Cantidad Necesitada"
          type="number"
          float-label="Float Label"
          outlined
          v-model="rewards"
          :rules="[ val => val && val > 0 || '*Requerido el campo Precio y mayor a 0']"/>
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
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
        <div class="flex-break q-py-md "></div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusVenmo" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Venmo" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusCash" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Efectivo" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusPaypal" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Paypal" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statusCreditCorp" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Tarjeta crédito CreditCorp" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statuspagomovil" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Pago Móvil" />
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="statustransfer" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Transferencia Bancaria" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Configuraciones especiales API</div>
       </div>
        <div v-if="statusPaypal" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Paypal</div>
       </div>
       <div v-if="statusPaypal" class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="PaypalApi" standout="bg-teal text-white"
          outlined label="Paypal API" />
        </div>
        </div>
        <div  v-if="statusCreditCorp" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tarjeta crédito CreditCorp</div>
       </div>
       <div v-if="statusCreditCorp"  class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="CreditCorp" standout="bg-teal text-white"
          outlined label="CreditCorp API" />
        </div>
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Configuraciones textos Medios de pago</div>
       </div>
        <div v-if="statusZelle" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Zelle</div>
       </div>
       <div v-if="statusZelle" class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="zelleEmail" standout="bg-teal text-white"
          outlined label="Email Zelle" />
        </div>
        </div>
        <div v-if="statusVenmo" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Venmo</div>
       </div>
       <div v-if="statusVenmo" class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="venmoAcc" standout="bg-teal text-white"
          outlined label="Cuenta/Teléfono Venmo" />
        </div>
        </div>
          <div  v-if="statuspagomovil" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Pago móvil</div>
       </div>
       <div v-if="statuspagomovil"  class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="pagomovil" standout="bg-teal text-white"
          outlined label="Pago Movil" />
        </div>
        </div>
          <div v-if="statustransfer" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Transferencia Bancaria</div>
       </div>
       <div v-if="statustransfer"  class="row header-container">
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input v-model="transfer" standout="bg-teal text-white"
          outlined label="Transferencia Bancaria" />
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
      statusRewards: 0,
      rewards: 10,
      statusZelle: 0,
      statusVenmo: 0,
      statusCreditCorp: 0,
      statusCash: 0,
      statusPaypal: 0,
      statuspagomovil: 0,
      statustransfer: 0,
      PaypalApi: '',
      zelleEmail: '',
      venmoAcc: '',
      CreditCorp: '',
      transfer: '',
      pagomovil: '',
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
        statusRewards: this.statusRewards,
        rewards: this.rewards,
        statusZelle: this.statusZelle,
        statusVenmo: this.statusVenmo,
        statusCreditCorp: this.statusCreditCorp,
        statuspagomovil: this.statuspagomovil,
        statustransfer: this.statustransfer,
        statusCash: this.statusCash,
        statusPaypal: this.statusPaypal,
        PaypalApi: this.PaypalApi,
        zelleEmail: this.zelleEmail,
        venmoAcc: this.venmoAcc,
        CreditCorp: this.CreditCorp,
        transfer: this.transfer,
        pagomovil: this.pagomovil,
        price: parseFloat(this.price),
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
        if (this.statusPto === 0 && this.statusZelle === 0 && this.statusVenmo === 0 && this.statusPaypal === 0 && this.statusCash === 0 && this.statusCreditCrop === 0) {
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
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusPickup
      id = this.config.id
      key = 'statusPickup'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusInlocal
      id = this.config.id
      key = 'statusInlocal'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusPto
      key = 'statusPto'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusRewards
      key = 'statusRewards'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.rewards
      key = 'rewards'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusZelle
      key = 'statusZelle'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusVenmo
      key = 'statusVenmo'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusCreditCorp
      key = 'statusCreditCorp'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusCash
      key = 'statusCash'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statuspagomovil
      key = 'statuspagomovil'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statustransfer
      key = 'statustransfer'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusPaypal
      key = 'statusPaypal'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'PaypalApi'
      value = this.PaypalApi
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'CreditCorp'
      value = this.CreditCorp
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'venmoAcc'
      value = this.venmoAcc
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'zelleEmail'
      value = this.zelleEmail
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'transfer'
      value = this.transfer
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      key = 'pagomovil'
      value = this.pagomovil
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = parseFloat(this.price)
      key = 'price'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
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
        this.statusRewards = this.config.statusRewards
        this.statusZelle = this.config.statusZelle
        this.statusCreditCorp = this.config.statusCreditCorp
        this.statuspagomovil = this.config.statuspagomovil
        this.statustransfer = this.config.statustransfer
        this.statusVenmo = this.config.statusVenmo
        this.statusCash = this.config.statusCash
        this.statusPaypal = this.config.statusPaypal
        this.PaypalApi = this.config.PaypalApi
        this.zelleEmail = this.config.zelleEmail
        this.venmoAcc = this.config.venmoAcc
        this.CreditCorp = this.config.CreditCorp
        this.transfer = this.config.transfer
        this.pagomovil = this.config.pagomovil
        this.price = parseFloat(this.config.price)
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
