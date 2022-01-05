<template>
<div class="column items-center">
    <VuePaycard
      class='q-pa-none q-ma-none'
      :value-fields='valueFields'
      :labels='labels'
      :hasRandomBackgrounds='true'
    />
 <div class="q-gutter-md q-gutter-lg">
 <div class="row header-container">
 <q-item-section>
   {{responseBank}}
 <q-item>
    <div class="row filled">
    <div class="col-12">
    <div class="card-input"><label for="cardNumber" >Numero de tarjeta</label>
      <q-input filled mask="###### #### ########" type="tel" rounded outlined v-model="valueFields.cardNumber" title="Number" data-card-field="" autocomplete="off" maxlength="21" class=""/>
    </div>
    <div class="row justify-start"><label class="col-12" for="cardName" >Cédula</label>
      <q-select filled class="col-3" rounded outlined v-model="valueFields.customerIdV" :options="['V','E']" />
      <q-input filled type="number" class="col-9" rounded outlined v-model="valueFields.customerId" title="v-card-name" data-card-field="" autocomplete="off"/>
    </div>
    <div class="row justify-start"><label class="col-12" for="cardName" >Nombre Completo</label>
      <q-input filled type="text" class="col-9" rounded outlined v-model="valueFields.cardName" title="v-card-fulname" data-card-field="" autocomplete="off"/>
    </div>
     <div class="row">
        <div class="col-12">
            <div class="card-input">
                    <label for="cardMonth" aria-label="Expiration Date" >Fecha de Expiración</label>
                    <div class="card-input">
                      <label>Mes</label>
                      <q-select filled rounded outlined map-options emit-value standout="bg-teal text-white"
                      v-model="valueFields.cardMonth"
                      :options="month_options" />
                      <label>Año</label>
                      <q-select filled rounded outlined map-options emit-value standout="bg-teal text-white"
                      v-model="valueFields.cardYear"
                      :options="year_options" />
                    </div>
              </div>
        </div>
      </div>
        <div >
            <div class="card-input"><label for="cardCvv" aria-label="Card CVV" >CVV</label>
                <q-input filled rounded outlined type="tel" v-model="valueFields.cardCvv"  title="CVV" maxlength="3" data-card-field="" autocomplete="off"/>
            </div>
        </div>
    <div class="column items-center">
        <div class="col-12">
          <q-btn v-if="$q.screen.gt.sm" rounded color="primary" class="q-ma-md q-mr-lg" @click="payment"  >Pagar</q-btn>
        </div>
    </div>
    </div>
</div>
 </q-item>
</q-item-section>
 </div>
 </div>
 </div>
</template>
<script>

import { VuePaycard } from 'vue-paycard'
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
export default {
  components: {
    VuePaycard
  },
  props: {
    amount: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this.firstname = this.currentUser.nombre
    this.lastname = this.currentUser.apellido
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  data () {
    return {
      keybankhash: '',
      phonePassword: '',
      responseBank: '',
      valueFields: {
        account_type: 'CC',
        cardName: ' ',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
        customerIdV: 'V'
      },
      labels: {
        cardHolder: 'Nombre y Apellido',
        cardMonth: 'MM',
        cardYear: 'YY',
        cardExpires: 'Expiración',
        cardCvv: 'CVV'
      },
      month_options: [
        { label: '01', value: 1 },
        { label: '02', value: 2 },
        { label: '03', value: 3 },
        { label: '04', value: 4 },
        { label: '05', value: 5 },
        { label: '06', value: 6 },
        { label: '07', value: 7 },
        { label: '08', value: 8 },
        { label: '09', value: 9 },
        { label: '10', value: 10 },
        { label: '11', value: 11 },
        { label: '12', value: 12 }

      ],
      year_options: [
        { label: '2021', value: 2021 },
        { label: '2022', value: 2022 },
        { label: '2023', value: 2023 },
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 },
        { label: '2026', value: 2026 },
        { label: '2027', value: 2027 },
        { label: '2028', value: 2028 },
        { label: '2029', value: 2029 }
      ]
    }
  },
  methods: {
    ...mapActions('transactions', ['addTransaction']),
    async payment () {
      // eslint-disable-next-line no-unused-vars
      let typePasswordBank = ''
      // eslint-disable-next-line no-unused-vars
      let encodedEncryptedData = ''
      let respuestaPay = await this.paymentbank()
      console.log({ respuestaPay })
      this.$emit('payment-done', respuestaPay)
      if (respuestaPay) {
        this.$q.loading.hide()
      }
    },
    async paymentbank () {
      try {
        this.$q.loading.show()
        let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
        let cardNumber = this.valueFields.cardNumber.replace(/\s+/g, '') // this.valueFields.cardNumber
        let cardName = this.valueFields.cardName // this.valueFields.cardName
        let customerId = this.valueFields.customerIdV + this.valueFields.customerId
        let exdate = this.valueFields.cardMonth + '/' + this.valueFields.cardYear
        let cvv = this.valueFields.cvv
        let amount = this.amount
        let options = { method: 'post',
          // url: window.location.origin + '/transact',
          url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
          headers:
          { accept: 'application/json',
            'content-type': 'application/json'
          },
          data:
          {
            bank: 'MercantilTDC',
            'HEADER_PAGO_REQUEST': {
              'IDENTIFICADOR_UNICO_GLOBAL': '900',
              'IDENTIFICACION_CANAL': '06',
              'SIGLA_APLICACION': 'CHOPZY',
              'IDENTIFICACION_USUARIO': '200273',
              'DIRECCION_IP_CONSUMIDOR': ipaddress,
              'DIRECCION_IP_CLIENTE': ipaddress,
              'FECHA_ENVIO_MENSAJE': date.formatDate(Date.now(), 'YYYY-MM-DD'),
              'HORA_ENVIO_MENSAJE': date.formatDate(Date.now(), 'HH:mm:ss'),
              'CANTIDAD_REGISTROS': 1
            },
            'BODY_PAGO_REQUEST': {
              'IDENTIFICADOR_COMERCIO': 57896786,
              'TIPO_TRANSACCION': 'TDC',
              'MONTO_TRANSACCION': amount,
              'NUMERO_FACTURA': 0,
              'IDENTIFICACION_TARJETAHABIENTE': customerId,
              'NOMBRE_TARJETAHABIENTE': cardName,
              'NUMERO_TARJETA': cardNumber,
              'FECHA_VENCIMIENTO_TARJETA': exdate,
              'CODIGO_SEGURIDAD_TARJETA': cvv,
              'NUMERO_LOTE': '1'
            }
          }
        }
        console.log(options)
        let respuesta = await this.$axios(options)
        let responseBody = respuesta.data
        return responseBody
      } catch (err) {
        this.$q.loading.hide()
        console.error({ err })
        if (err.response) {
          return this.$q.dialog(err.response.data)
        } else {
          return this.$q.dialog({
            title: 'Error',
            message: 'Error inesperado, intente más tarde'
          })
        }
      }
    },
    getBrowserInfo () {
      var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [ ]
        return 'IE' + (tem[1] || '')
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera')
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1])
      return M.join(' ')
    }
  }
}
</script>
<style lang="stylus" scoped>
.card-form
    background: #fff
    box-shadow: 0px 30px 60px 0 rgba(90, 116, 148, 0.4)
    border-radius: 10px
    padding: 45px 45px 25px 80px
    align: center
.card-input
    padding-top: 20px
.filled
    padding-top: 50px
 </style>
