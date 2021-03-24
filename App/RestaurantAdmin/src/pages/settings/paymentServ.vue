<template>
  <div style="min-width: 320px;" :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Ajustes de Medios de Pagos</div>
          <div>
           <div v-if="config">
              <q-btn class="header-btn" flat color="white" push  @click="validator" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push  @click="add" icon="fas fa-save"/>
            </div>
            <q-btn v-if="quick" class="header-btn-back" flat color="white" push  icon="arrow_back" @click="$router.replace('/home')"/>
          </div>
         </q-card-section>

        <q-card-section>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <p>Punto de Venta</p>
<q-option-group color="blue" inline  filled rounded v-model="statusPto" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Punto de Venta" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Zelle</p>
<q-option-group color="blue" inline  filled rounded v-model="statusZelle" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Zelle" />
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Venmo</p>
<q-option-group color="blue" inline  filled rounded v-model="statusVenmo" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Venmo" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Efectivo</p>
<q-option-group color="blue" inline  filled rounded v-model="statusCash" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Efectivo" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Paypal</p>
<q-option-group color="blue" inline  filled rounded v-model="statusPaypal" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Paypal" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>CreditCorp</p>
<q-option-group color="blue" inline  filled rounded v-model="statusCreditCorp" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="CreditCorp" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Pago Móvil</p>
<q-option-group color="blue" inline  filled rounded v-model="statuspagomovil" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Pago Móvil" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <p>Transferencia Bancaria</p>
<q-option-group color="blue" inline  filled rounded v-model="statustransfer" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Transferencia Bancaria" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Mercantil</p>
<q-option-group color="blue" inline  filled rounded v-model="statusMercantil" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Mercantil" />
        </div>
        </div>
        <div v-if="statusPaypal || statusCreditCorp || statusMercantil" class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Configuraciones especiales API</div>
       </div>
        <div v-if="statusPaypal" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Paypal</div>
       </div>
       <div v-if="statusPaypal" class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PaypalApi" standout="bg-teal "
          outlined label="Paypal API" />
        </div>
        </div>
        <div  v-if="statusCreditCorp" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tarjeta crédito CreditCorp</div>
       </div>
       <div v-if="statusCreditCorp"  class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="CreditCorp" standout="bg-teal "
          outlined label="CreditCorp API" />
        </div>
        </div>
        <div  v-if="statusCreditCorp" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tarjeta crédito Mercantil</div>
       </div>
       <div v-if="statusMercantil"  class="row header-container">
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Ambiente</p>
<q-option-group color="blue" inline  filled rounded v-model="Mercantil.ambiente" map-options emit-value standout="bg-teal "
          outlined :options="[{value: 0, label: 'Producción'}, {value: 1, label: 'Prueba'}]" label="Ambiente" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Mercantil.xibm" standout="bg-teal "
          outlined label="x-ibm-client-id" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Mercantil.integratorId" standout="bg-teal "
          outlined label="integratorId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Mercantil.merchantId" standout="bg-teal "
          outlined label="merchantId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Mercantil.terminalId" standout="bg-teal "
          outlined label="terminalId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Mercantil.claveSecreta" standout="bg-teal "
          outlined label="Clave secreta" />
        </div>
        </div>
         <div class="flex-break q-py-md "></div>
        <div v-if="statusZelle || statusVenmo || statuspagomovil || statustransfer" class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Configuraciones textos Medios de pago</div>
       </div>
        <div v-if="statusZelle" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Zelle</div>
       </div>
       <div v-if="statusZelle" class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="zelleEmail" standout="bg-teal "
          outlined label="Email Zelle" />
        </div>
        </div>
        <div v-if="statusVenmo" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Venmo</div>
       </div>
       <div v-if="statusVenmo" class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="venmoAcc" standout="bg-teal "
          outlined label="Cuenta/Teléfono Venmo" />
        </div>
        </div>
          <div  v-if="statuspagomovil" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Pago móvil</div>
       </div>
       <div v-if="statuspagomovil"  class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="pagomovil" standout="bg-teal "
          outlined label="Pago Movil" />
        </div>
        </div>
          <div v-if="statustransfer" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Transferencia Bancaria</div>
       </div>
       <div v-if="statustransfer"  class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="transfer" standout="bg-teal "
          outlined label="Datos para Transferir" />
        </div>
        </div>
         </q-card-section>
     </q-card>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    quick: {
      type: Boolean,
      default: () => true
    }
  },
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
      statusMercantil: 0,
      Mercantil: {
        xibm: '',
        integratorId: '',
        merchantId: '',
        terminalId: '',
        ambiente: 0,
        claveSecreta: ''
      },
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
        Mercantil: this.Mercantil,
        statusPaypal: this.statusPaypal,
        PaypalApi: this.PaypalApi,
        zelleEmail: this.zelleEmail,
        venmoAcc: this.venmoAcc,
        CreditCorp: this.CreditCorp,
        transfer: this.transfer,
        pagomovil: this.pagomovil,
        source: 'paymentServ'
      }
      this.addConfig2({ payload, doc: 'paymentServ' }).then(e => { this.$q.loading.hide(); this.$emit('done', true) })
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
      id = this.config.id
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
      value = this.statusPto
      key = 'statusPto'
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
      value = this.statusMercantil
      key = 'statusMercantil'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.Mercantil
      key = 'Mercantil'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
        this.$emit('done', true)
      })
    },
    afterBindigs () {
      if (this.config.source !== '') {
        for (let i of Object.keys(this.config)) {
          try {
            Object.assign(this, { [i]: this.config[i] })
          } catch (e) {
            console.log(e)
          }
        }
        // this.statusDelivery = this.config.statusDelivery
        // this.statusPickup = this.config.statusPickup
        // this.statusInlocal = this.config.statusInlocal
        // this.statusPto = this.config.statusPto
        // this.statusRewards = this.config.statusRewards
        // this.statusZelle = this.config.statusZelle
        // this.statusCreditCorp = this.config.statusCreditCorp
        // this.statuspagomovil = this.config.statuspagomovil
        // this.statustransfer = this.config.statustransfer
        // this.statusMercantil = this.config.statusMercantil
        // this.statusVenmo = this.config.statusVenmo
        // this.statusCash = this.config.statusCash
        // this.statusPaypal = this.config.statusPaypal
        // this.PaypalApi = this.config.PaypalApi
        // this.zelleEmail = this.config.zelleEmail
        // this.venmoAcc = this.config.venmoAcc
        // this.CreditCorp = this.config.CreditCorp
        // this.transfer = this.config.transfer
        // this.pagomovil = this.config.pagomovil
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

.filled
  padding-top: 50px
</style>
