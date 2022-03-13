<template>
<div class="column items-center">
    <VuePaycard
    class="q-pa-none q-ma-none full-width"
    :value-fields="valueFields"
    :labels="labels"
    :hasRandomBackgrounds=false
    :backgroundImage=25
    card='Mercantil'
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
    <div class="row justify-start"><label class="col-12" for="cardName" >Tipo de Cuenta</label>
      <q-select filled class="col-12" rounded outlined v-model="valueFields.account_type" emit-value map-options :options="[ { label: 'Cuenta Corriente', value: 'CC' }, { label: 'Cuenta de Ahorros', value: 'CA' } ]" />
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
                <q-input filled rounded outlined type="number" v-model="valueFields.cardCvv"  title="CVV" maxlength="4" data-card-field="" autocomplete="off"/>
            </div>
        </div>
    <div class="column items-center">
        <div class="col-12">
          <q-btn rounded color="primary" class="q-ma-md q-mr-lg" @click="payment"  >Pagar</q-btn>
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
import { VuePaycard } from '../vue-paycard'
import { mapActions } from 'vuex'
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
        { label: '2019', value: 2019 },
        { label: '2020', value: 2020 },
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
      let typePasswordBank = 'clavetelefonica'
      // eslint-disable-next-line no-unused-vars
      let encodedEncryptedData = ''
      // let respuestaAuth = await this.authbank()
      // if (respuestaAuth) {
      //   this.$q.loading.hide()
      // }
      // if (respuestaAuth.status !== 200) {
      //   return console.error('error in request')
      // }
      // console.log('respuestaBank:', respuestaAuth)
      // console.log('respuestaBank:', respuestaAuth.data.auth)
      // typePasswordBank = respuestaAuth.data.auth
      if (typePasswordBank === 'clavetelefonica') {
        this.$q.dialog({
          title: 'Seguridad',
          message: '¿Cuál es su Clave telefónica?',
          prompt: {
            model: 0,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(async data => {
          let respuestaPay = await this.paymentbank(data)
          console.log(respuestaPay)
          this.$emit('payment-done', respuestaPay)
          if (respuestaPay) {
            this.$q.loading.hide()
          }
        })
      }
    },
    async paymentbank (data) {
      try {
        this.$q.loading.show()
        let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
        let browserAgent = this.getBrowserInfo()
        let trxType = 'compra'
        let paymentMethod = 'TDD'
        let cardNumber = this.valueFields.cardNumber.replace(/\s+/g, '') // this.valueFields.cardNumber
        let customerId = this.valueFields.customerIdV + this.valueFields.customerId
        let accountType = this.valueFields.account_type
        let cvv = this.valueFields.cardCvv
        // 'PFyDJwOukJXFEtC0s0t6Mg=='
        let currency = 'ves'
        let amount = parseFloat(this.amount.toFixed(2))
        let options = { method: 'post',
          // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
          url: window.location.origin + '/transact',
          data:
          {
            'bank': 'Mercantil',
            'ambiente': localStorage.getItem('amb'),
            'client_identify': {
              'ipaddress': ipaddress,
              'browser_agent': browserAgent,
              'mobile': {
                'manufacturer': 'Samsung',
                'model': 'S9',
                'os_version': 'Oreo 9.1',
                'location': {
                  'lat': 37.4224764,
                  'lng': -122.0842499
                }
              }
            },
            'transaction': {
              'trx_type': trxType,
              'payment_method': paymentMethod,
              'card_number': cardNumber,
              'customer_id': customerId,
              'account_type': accountType,
              'twofactor_auth': data,
              'cvv': cvv,
              'currency': currency,
              'amount': amount
            }
          } }
        console.log(options)
        let respuesta = await this.$axios(options)
        return respuesta
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
    async authbank () {
      try {
        this.$q.loading.show()
        let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
        let browserAgent = this.getBrowserInfo()
        let trxType = 'solaut'
        let paymentMethod = 'TDD'
        let cardNumber = this.valueFields.cardNumber.replace(/\s+/g, '') // this.valueFields.cardNumber
        let customerId = this.valueFields.customerIdV + this.valueFields.customerId // temp
        let options = { method: 'post',
          // url: 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/getauth',
          url: window.location.origin + '/getauth',
          // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/GetAuth',
          data:
          {
            'ambiente': localStorage.getItem('amb'),
            'client_identify': {
              'ipaddress': ipaddress,
              'browser_agent': browserAgent,
              'mobile': {
                'manufacturer': 'Samsung',
                'model': 'S9',
                'os_version': 'Oreo 9.1',
                'location': {
                  'lat': 37.4224764,
                  'lng': -122.0842499
                }
              }
            },
            'transaction_authInfo': {
              'trx_type': trxType,
              'payment_method': paymentMethod,
              'card_number': cardNumber,
              'customer_id': customerId
            }
          }
        }
        console.log(options)
        let respuesta = await this.$axios(options)
        return respuesta
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
