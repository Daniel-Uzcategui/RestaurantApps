<template>
  <div style="min-width: 320px;" :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Ajustes de Medios de Pagos</div>
          <div>
           <div v-if="config">
              <q-btn class="header-btn" flat  push color="blue" @click="validator" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat  push color="blue" @click="add" icon="fas fa-save"/>
            </div>
            <q-btn v-if="quick" class="header-btn-back" flat  push  icon="arrow_back" @click="$router.replace('/home')"/>
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
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Paypal correo</p>
<q-option-group color="blue" inline  filled rounded v-model="statusPaypalTx" map-options emit-value standout="bg-teal "
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
        <!-- <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>CreditCorp</p>
<q-option-group color="blue" inline  filled rounded v-model="statusCreditCorp" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="CreditCorp" />
        </div> -->
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
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <p>Pasarela de Pago</p>
         <q-option-group color="blue" inline  filled rounded v-model="statusNovaredzelle" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Pasarela de Pago" />
        </div>
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <p>Pago Movil Mercantil</p>
         <q-option-group color="blue" inline  filled rounded v-model="statusC2P" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Pago Movil Mercantil" />
        </div>
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="row header-container">
        <!-- <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Mercantil</p>
<q-option-group color="blue" inline  filled rounded v-model="statusMercantil" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Mercantil" />
        </div> -->
        </div>
          <div class="flex-break q-py-md "></div>
        <!-- <div class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Pago Movil Novared</p>
<q-option-group color="blue" inline  filled rounded v-model="statusNovaredpagomovil" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Pago Movil" />
        </div>
        </div> -->
        <!-- <div v-if="statusPaypal || statusCreditCorp || statusMercantil" class="row header-container">
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
        </div> -->
        <!-- <div  v-if="statusMercantil" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tarjeta crédito Mercantil</div>
       </div> -->
       <!-- <div v-if="statusMercantil"  class="row header-container">
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Mercantil</p>
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
        </div> -->
        <!-- <div v-if="statusNovaredzelle"  class="row header-container">
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Novared</p>
<q-option-group color="blue" inline  filled rounded v-model="Novared.ambiente" map-options emit-value standout="bg-teal "
          outlined :options="[{value: 0, label: 'Producción'}, {value: 1, label: 'Prueba'}]" label="Ambiente" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.ApiKey" standout="bg-teal "
          outlined label="ApiKey" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.idComercio" standout="bg-teal "
          outlined label="idComercio" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.mockServer" standout="bg-teal "
          outlined label="Url de verificacion" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.nombreComercio" standout="bg-teal "
          outlined label="Nombre Comercio" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.requestPassword" standout="bg-teal "
          outlined label="Clave secreta" />
        </div>
         <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.requestUser" standout="bg-teal "
          outlined label="Usuario" />
        </div>
        </div> -->
         <div class="flex-break q-py-md "></div>
        <div v-if="statusZelle || statusVenmo || statuspagomovil || statustransfer || statusPaypalTx" class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Configuraciones textos Medios de pago</div>
       </div>
       <div v-if="statusPaypalTx" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">PayPal correo</div>
       </div>
       <div v-if="statusPaypalTx" class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PaypalEmail" standout="bg-teal "
          outlined label="Email Paypal" />
        </div>
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

         <div v-if="statusNovaredzelle"  class="row header-container">
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Pasarela de Pago</p>
<q-option-group color="blue" inline  filled rounded v-model="Novared.ambiente" map-options emit-value standout="bg-teal "
          outlined :options="[{value: 0, label: 'Producción'}, {value: 1, label: 'Prueba'}]" label="Ambiente" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.ApiKey" standout="bg-teal "
          outlined label="ApiKey" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.idComercio" standout="bg-teal "
          outlined label="idComercio" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.mockServer" standout="bg-teal "
          outlined label="Url de verificacion" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.nombreComercio" standout="bg-teal "
          outlined label="Nombre Comercio" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.requestPassword" standout="bg-teal "
          outlined label="Clave secreta" />
        </div>
         <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="Novared.requestUser" standout="bg-teal "
          outlined label="Usuario" />
        </div>
         <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="referencia" standout="bg-teal "
          outlined label="referencia" />
        </div>
        </div>
        <div v-if="statusC2P"  class="row header-container">
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>Pago Movil Mercantil</p>
<q-option-group color="blue" inline  filled rounded v-model="PagoMovil.ambiente" map-options emit-value standout="bg-teal "
          outlined :options="[{value: 0, label: 'Producción'}, {value: 1, label: 'Prueba'}]" label="Ambiente" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.claveSecreta" standout="bg-teal "
          outlined label="Calve Secreta" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.clavecompra" standout="bg-teal "
          outlined label="Clave de Compra" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.integratorId" standout="bg-teal "
          outlined label="integratorId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.merchantId" standout="bg-teal "
          outlined label="merchantId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.payment_method" standout="bg-teal "
          outlined label="payment_method" />
        </div>
         <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.terminalId" standout="bg-teal "
          outlined label="terminalId" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.trx_type" standout="bg-teal "
          outlined label="trx_type" />
        </div>
        <div class="header-cell q-pa-sm  q-pb-md col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="PagoMovil.xibm" standout="bg-teal "
          outlined label="xibm" />
        </div>

        </div>

        <div v-if="statusVenmo" class="row header-container q-pt-md q-pb-md">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Venmo</div>
       </div>
       <!-- <div v-if="statusVenmo" class="row header-container">
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded v-model="venmoAcc" standout="bg-teal "
          outlined label="Cuenta/Teléfono Venmo" />
        </div>
        </div> -->
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
         <q-card-section>
           <div class="q-ma-md text-h5">
             Servicios API pasarela de pagos
           </div>
           <q-btn @click="generateUUID('Dev')" label="Generar nuevo API KEY Desarrollo" no-caps color="blue" rounded>
           </q-btn>
           <q-input v-model="apiKeyDev" readonly />
         </q-card-section>
         <q-card-section>
           <q-btn @click="generateUUID('Prod')" label="Generar nuevo API KEY Producción" no-caps color="blue" rounded>
           </q-btn>
           <q-input v-model="apiKeyProd" readonly />
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
  watch: {
    // config () {
    //   if (this.config !== undefined) {
    //     console.log('valores de config', this.config.Novared)
    //     this.Novared = {
    //       ...this.config?.Novared
    //       // ApiKey: this.config.Novared.ApiKey,
    //       // ambiente: this.config.Novared.ambiente,
    //       // idComercio: this.config.Novared.idComercio,
    //       // mockServer: this.config.Novared.mockServer,
    //       // nombreComercio: this.config.Novared.nombreComercio,
    //       // requestPassword: this.config.Novared.requestPassword,
    //       // requestUser: this.config.Novared.requestUser
    //     }
    //     this.PagoMovil = {
    //       ...this.config?.PagoMovil
    //     }
    //     this.referencia = this.config.referencia
    //   }
    // }

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
      referencia: 0,
      apiKeyDev: this.generateUUID('Dev'),
      apiKeyProd: this.generateUUID('Prod'),
      statusZelle: 0,
      statusPaypalTx: 0,
      statusVenmo: 0,
      statusCreditCorp: 0,
      statusMercantil: 0,
      statusNovaredzelle: 0,
      statusNovaredpagomovil: 0,
      // statusEncomienda: 0,
      Novared: {
        ApiKey: '',
        idComercio: '',
        mockServer: '',
        nombreComercio: '',
        requestPassword: '',
        requestUser: ''

      },
      PagoMovil: {
        ambiente: '',
        claveSecreta: '',
        clavecompra: '',
        integratorId: '',
        merchantId: '',
        payment_method: '',
        terminalId: '',
        trx_type: '',
        xibm: ''

      },
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
      statusC2P: 0,
      statustransfer: 0,
      PaypalApi: '',
      zelleEmail: '',
      PaypalEmail: '',
      venmoAcc: '',
      CreditCorp: '',
      transfer: '',
      pagomovil: '',
      // pesoDefault: 0,
      price: 0,
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
      ]
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig']),
    generateUUID (e) {
      var d = new Date().getTime()

      if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now()
      }

      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      this['apiKey' + e] = uuid
      return uuid
    },
    async add () {
      this.$q.loading.show()
      const { statusDelivery,
        statusPickup,
        statusInlocal,
        statusZelle, statusVenmo, statusPaypalTx, apiKeyDev, apiKeyProd, statusCreditCorp, statusNovaredzelle, referencia, statusNovaredpagomovil, statusCash, statusPto, statuspagomovil, statusC2P, statustransfer, statusPaypal, PaypalApi, CreditCorp, venmoAcc, zelleEmail, PaypalEmail, transfer, pagomovil, statusMercantil, Mercantil, Novared, PagoMovil } = this
      const payload = {
        statusZelle,
        statusDelivery,
        statusPickup,
        statusInlocal,
        statusVenmo,
        statusPaypalTx,
        apiKeyDev,
        apiKeyProd,
        statusCreditCorp,
        statusNovaredzelle,
        referencia,
        statusNovaredpagomovil,
        statusCash,
        statusPto,
        statuspagomovil,
        statusC2P,
        statustransfer,
        statusPaypal,
        PaypalApi,
        CreditCorp,
        venmoAcc,
        zelleEmail,
        PaypalEmail,
        transfer,
        pagomovil,
        statusMercantil,
        Mercantil,
        Novared,
        PagoMovil,
        source: 'paymentServ'
      }
      try {
        await this.addConfig2({ payload, doc: 'paymentServ' }).then(e => { this.$q.loading.hide(); this.$emit('done', true) })
        return this.$q.dialog({
          title: '',
          message: 'Se han guardo exitosamente los ajustes',
          cancel: false,
          persistent: true
        }).onOk(() => {
          this.$emit('done', true)
        })
      } catch (error) {
        this.$q.dialog({
          title: '',
          message: 'Ha ocurrido un error al guardar los datos, verifique su conexión',
          cancel: false,
          persistent: true
        }).onOk(() => {
          this.$emit('done', true)
        })
      }
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
          this.add()
        }
      }
    },
    async save () {
      let value, id, arr
      id = this.config.id
      arr = ['statusZelle', 'statusVenmo', 'statusPaypalTx', 'apiKeyDev', 'apiKeyProd', 'statusCreditCorp', 'statusCreditCorp', 'statusNovaredzelle', 'referencia', 'statusNovaredpagomovil', 'statusCash', 'statusPto', 'statuspagomovil', 'statusC2P', 'statustransfer', 'statusPaypal', 'PaypalApi', 'CreditCorp', 'venmoAcc', 'zelleEmail', 'PaypalEmail', 'transfer', 'pagomovil', 'statusMercantil', 'Mercantil', 'Novared', 'PagoMovil']
      for (let i of arr) {
        try {
          value = this[i]
          console.log(i, this[i])
          if (value) {
            await this.saveConfig({ value, id, i })
          }
        } catch (error) {
          console.error(error)
        }
      }
      return this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
        this.$emit('done', true)
      })
    },
    afterBindigs () {
      if (this.config?.source === 'paymentServ') {
        for (let i of Object.keys(this.config)) {
          try {
            if (this.config[i]) {
              Object.assign(this, { [i]: this.config[i] })
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute
  right: 10px !important
.header-btn-back
  position: absolute
  right: 120px !important
.header
 padding-bottom: 50px

.filled
  padding-top: 50px
</style>
