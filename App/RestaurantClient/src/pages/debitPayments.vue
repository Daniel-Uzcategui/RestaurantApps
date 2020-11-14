<template>
<div class="column items-center">
    <VuePaycard
    class="q-pa-none q-ma-none"
    :value-fields="valueFields"
    :labels="labels"
    :hasRandomBackgrounds=false
    :backgroundImage=10
    />
     <div class="q-gutter-md q-gutter-lg">
 <div class="row header-container">
 <q-item-section>
   {{responseBank}}
 <q-item>
    <div class="row filled">
    <div class="col-12">
    <div class="card-input"><label for="cardNumber" >Numero de tarjeta</label>
      <q-input type="tel"  v-model="valueFields.cardNumber" title="Number" data-card-field="" autocomplete="off" maxlength="19" class=""/>
    </div>
    <div class="card-input"><label for="cardName" >Nombre Completo</label>
      <q-input type="text" v-model="valueFields.cardName" title="v-card-name" data-card-field="" autocomplete="off" class=""/>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="card-input">
                    <label for="cardMonth" aria-label="Expiration Date" >Fecha de Expiración</label>
                    <div class="card-input">
                      <label>Mes</label>
                      <q-select map-options emit-value standout="bg-teal text-white"
                      v-model="valueFields.cardMonth"
                      :options="month_options" />
                      <label>Año</label>
                      <q-select map-options emit-value standout="bg-teal text-white"
                      v-model="valueFields.cardYear"
                      :options="year_options" />
                    </div>
              </div>
        </div>
      </div>
        <div >
            <div class="card-input"><label for="cardCvv" aria-label="Card CVV" >CVV</label>
                <q-input type="tel" v-model="valueFields.cardCvv"  title="CVV" maxlength="4" data-card-field="" autocomplete="off"/>
            </div>
        </div>
    <div >
        <div class="card-input"><label for="phonePassword" aria-label="Card CVV" >Clave telefonica</label>
             <q-input type="tel" v-model="phonePassword"  title="CVV" maxlength="4" data-card-field="" autocomplete="off"/>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
          <q-btn v-if="$q.screen.gt.sm" color="primary" class="q-ma-md q-mr-lg" @click="payment"  >Pagar</q-btn>
        </div>
    </div>
    </div>
</div>
<div class="row">
       <div class="col-6">
        {{/* createKeyhash(encode_utf8('C10326667541120190822FA06')) */ }}
       </div>
       <div class="col-5">
        {{/* encryptar (encode_utf8('752') )*/}}
       </div>
       <div class="col-1">
        {{/* decrypt ('MlxsA1tW7ID4DzkMBWLEnQ==') */}}
       </div>
     </div>
 </q-item>
</q-item-section>
 </div>
 </div>
 </div>
</template>
<script>
import CryptoJs from 'crypto-js'
// import CryptoJs from 'aes-ecb'
import hasha from 'hasha'
import { TextDecoder } from 'text-decoding'
import { VuePaycard } from 'vue-paycard'
import { mapActions } from 'vuex'
import { date } from 'quasar'
// eslint-disable-next-line no-unused-vars
import request from 'request'
export default {
  components: {
    VuePaycard
  },
  props: [ 'id' ],
  data () {
    return {
      keybankhash: '',
      hasha: hasha,
      TextDecoder: TextDecoder,
      CryptoJs: CryptoJs,
      phonePassword: '',
      responseBank: '',
      valueFields: {
        cardName: ' ',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: ''
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
        { label: '2020', value: 2020 },
        { label: '2021', value: 2021 }
      ]
    }
  },
  methods: {
    ...mapActions('transactions', ['addTransaction']),
    createKeyhash (keybank) {
      let hash, hexbankhash
      hash = this.hasha(keybank, { algorithm: 'sha256', Type: 'string', options: 'buffer' })
      hexbankhash = this.hexStringToByte(hash.toString())
      this.keybankhash = new TextDecoder('utf-8').decode(hexbankhash)
      // this.keybankhash = hash
      return this.keybankhash
    },
    encryptar (data) {
      let encodedEncryptedData
      let keypadding = this.keybankhash
      encodedEncryptedData = this.CryptoJs.encrypt(keypadding.substr(0, 16), data)
      return encodedEncryptedData
    },
    decrypt (data) {
      let keypadding = this.keybankhash
      console.log({ keypadding })
      if (keypadding.length < 16) {
        keypadding = keypadding.padStart(16, '0')
      }
      let key = keypadding.substr(0, 16)
      console.log('data en deencriptar:', { data })
      console.log('key en deencriptar:', { key })
      let decodedEncryptedData = data.toString()
      let dec = this.CryptoJs.AES.decrypt(decodedEncryptedData, key)
      console.log({ dec })
      return dec
    },
    hexStringToByte (str) {
      if (!str) {
        return new Uint8Array()
      }
      var a = []
      for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16))
      }
      return new Uint8Array(a)
    },
    encode_utf8 (s) {
      return unescape(encodeURIComponent(s))
    },
    async payment () {
      // eslint-disable-next-line no-unused-vars
      let typePasswordBank = ''
      // eslint-disable-next-line no-unused-vars
      let encodedEncryptedData = ''
      let defaultcode = 'C10326667541120190822FA06'
      let respuestaAuth = await this.authbank()
      console.log('createKeyhash:', this.createKeyhash(this.encode_utf8(defaultcode)))
      // autenticando la transaccion
      if (respuestaAuth.status !== 200) {
        return console.error('error in requiest')
      }
      console.log('respuestaBank:', respuestaAuth)
      console.log('respuestaBank:', respuestaAuth.data.authentication_info.twofactor_type)
      typePasswordBank = this.decrypt(respuestaAuth.data.authentication_info.twofactor_type)
      // typePasswordBank = this.decrypt('MlxsA1tW7ID4DzkMBWLEnQ==')
      // console.log('decodedEncryptedData:', { typePasswordBank })
      // this.add (0, trxType, responseMessages, ordersId, payAmount, paymentStatus, procesingDate)
      // proceso de pago
      // encodedEncryptedData = this.encryptar(this.encode_utf8(this.valueFields.cardCvv))
      // console.log('encodedEncryptedData:', encodedEncryptedData)
      // let respuestaPay = this.paymentbank(respuestaAuth.data.authentication_info.twofactor_type)
      // console.log(respuestaPay)
      // log de transaccion
    },
    async paymentbank (twofactorAuth) {
      let integratorId = 1
      let merchantId = 200273
      let terminalId = '1'
      let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
      let browserAgent = this.getBrowserInfo()
      let trxType = 'compra'
      let paymentMethod = 'TDD'
      let cardNumber = '501878200028558700' // this.valueFields.cardNumber
      let customerId = 'V20328261' // temp
      let invoiceNumber = '10082'
      let accountType = 'CC'
      let cvv = 'PFyDJwOukJXFEtC0s0t6Mg=='
      let currency = 'ves'
      let amount = 123
      let options = { method: 'post',
        url: 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/pay',
        headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': '81188330-c768-46fe-a378-ff3ac9e88824' },
        data:
          {
            'merchant_identify': {
              'integratorId': integratorId,
              'merchantId': merchantId,
              'terminalId': terminalId
            },
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
              'invoice_number': invoiceNumber,
              'account_type': accountType,
              'twofactor_auth': 'j3e9XtKKf1irg+xP/+aBKw==',
              'cvv': cvv,
              'currency': currency,
              'amount': amount
            }
          },
        json: true }
      console.log(options)
      let respuesta = await this.$axios(options)
      return respuesta
    },
    async authbank () {
      let integratorId = 1
      let merchantId = 200273
      let terminalId = 1
      let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
      let browserAgent = this.getBrowserInfo()
      let trxType = 'solaut'
      let paymentMethod = 'TDD'
      let cardNumber = this.valueFields.cardNumber
      let customerId = 'V18366876'// temp
      let options = { method: 'post',
        url: 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/getauth',
        headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': '81188330-c768-46fe-a378-ff3ac9e88824' },
        data:
          {
            'merchant_identify': {
              'integratorId': integratorId,
              'merchantId': merchantId,
              'terminalId': terminalId
            },
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
          },
        json: true }
      let respuesta = await this.$axios(options)
      return respuesta
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
    },
    add (txnId, trxType, responseMessages, ordersId, payAmount, paymentStatus, procesingDate) {
      console.log(txnId, trxType, responseMessages, ordersId, payAmount, paymentStatus, procesingDate)
      let card = this.valueFields.cardNumber
      const payload = {
        cardNumberFirst: card.substr(0, 6),
        cardNumberLast: card.substr(10, 8),
        cardCVC: this.valueFields.cardCvv,
        cardExpDate: this.valueFields.cardMonth + '/' + this.valueFields.cardYear,
        orderId: 0,
        paidAmount: payAmount,
        paidAmountCurrency: 'ves',
        rateId: 0,
        txnBankId: txnId,
        trxType: trxType,
        trxProcesingDate: procesingDate,
        paymentStatus: paymentStatus,
        responseMessage: responseMessages,
        DateIn: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
      this.addTransaction(payload)
    }
  }
}
//  {{createKeyhash(encode_utf8('C10326667541120190822FA06'))}}
// {{encryptar (encode_utf8('752'))}}
// {{decrypt ('MlxsA1tW7ID4DzkMBWLEnQ==')}}
</script>
<style lang="sass" scoped>
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
