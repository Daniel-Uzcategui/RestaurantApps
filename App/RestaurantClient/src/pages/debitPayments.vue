<template>
<q-page class="q-pa-lg" >
     <div class="q-gutter-md">
 <div class="row header-container">
 <q-item-section>
 <q-item>
    <div class="row filled">
    <div class="card-form col-12">
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
    <div class="row">
       <div class="col-12">
        <VuePaycard
        :value-fields="valueFields"
        :labels="labels"
        :hasRandomBackgrounds=false
        :backgroundImage=10
        >
        </VuePaycard>
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
 </q-page>
</template>
<script>
// import AES from 'crypto-js/aes'
import CryptoJs from 'aes-ecb'
import hasha from 'hasha'
import { TextDecoder } from 'text-decoding'
import { VuePaycard } from 'vue-paycard'
import { mapActions } from 'vuex'
import { date } from 'quasar'
import request from 'request'
export default {
  components: {
    VuePaycard
  },
  props: [ 'id' ],
  data () {
    return {
      keybankhash: '',
      CryptoJs: CryptoJs,
      hasha: hasha,
      TextDecoder: TextDecoder,
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
      hash = this.hasha(keybank, { algorithm: 'sha256', Type: 'string' })
      hexbankhash = this.hexStringToByte(hash.toString())
      this.keybankhash = new TextDecoder('utf-8').decode(hexbankhash)
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
      let key = keypadding.substr(0, 16)
      let decodedEncryptedData = data
      return this.CryptoJs.decrypt(key, decodedEncryptedData)
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
    payment () {
      let TypePasswordBank = ''
      let encodedEncryptedData = ''
      let defaultcode = 'C10326667541120190822FA06'
      /* let txnId = '1'
      let responseMessages = ''
      let ordersId = '3'
      let payAmount = 12 */
      console.log(this.createKeyhash(this.encode_utf8(defaultcode)))
      // autenticando la transaccion
      TypePasswordBank = this.authbank()
      console.log('decodedEncryptedData')
      console.log(TypePasswordBank)
      // proceso de pago
      encodedEncryptedData = this.encryptar(this.encode_utf8(this.valueFields.cardCvv))
      console.log('encodedEncryptedData')
      console.log(encodedEncryptedData)
      // log de transaccion
    },
    authbank () {
      let integratorId = 1
      let merchantId = 200273
      let terminalId = 1
      let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
      let browserAgent = this.getBrowserInfo()
      let trxType = 'solaut'
      let paymentMethod = 'TDD'
      let cardNumber = this.valueFields.cardNumber
      let customerId = 'V18366876'// temp
      let invoiceNumber = 1 // temp
      let accountType = 'CC'
      let twofactorAuth = ''
      let cvv = this.valueFields.cardCvv
      let currency = 'ves'
      let amount = 12 // temp
      let TypePasswordBank = ''
      let PasswordBank = ''
      /* let responseMessages = ''
      let txnId = 0
      let ordersId = 0
      let payAmount = 0 */
      let merchantIdentify = []
      let clientIdentify = []
      let transSendBank = []
      // let transactionAuthInfo = []
      // transactionAuthInfo = JSON.stringify([])
      clientIdentify = JSON.stringify([{
        'client_identify': { 'ipaddress': ipaddress, 'browser_agent': browserAgent }
      }])
      merchantIdentify = JSON.stringify([{
        'integratorId': integratorId, 'merchantId': merchantId, 'terminalId': terminalId
      }])
      transSendBank = JSON.stringify([{
        'merchant_identify': merchantIdentify, clientIdentify, 'transaction_authInfo': { 'trx_type': ipaddress, 'payment_method': browserAgent, 'card_number': cardNumber, 'customer_id': customerId }
      }])
      //
      var options = { method: 'POST',
        url: 'https://apimbu.mercantilbanco.com/mercantil-banco/sandbox/v1/payment/getauth',
        headers:
          { accept: 'application/json',
            'content-type': 'application/json',
            'x-ibm-client-id': '81188330-c768-46fe-a378-ff3ac9e88824' },
        body:
          {
            'merchant_identify': {
              'integratorId': 31,
              'merchantId': 150332,
              'terminalId': 'abcde'
            },
            'client_identify': {
              'ipaddress': '10.0.0.1',
              'browser_agent': 'Chrome 18.1.3',
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
              'trx_type': 'solaut',
              'payment_method': 'tdd',
              'card_number': '36133484450025',
              'customer_id': 'V901582'
            }
          },
        json: true }
      request(options, function (error, response, body) {
        if (error) { return console.error('Failed: %s', error.message) }
        console.log('Success: ', body)
      })
      //
      TypePasswordBank = this.decrypt(PasswordBank)
      // console.log(merchantIdentify)
      // console.log(clientIdentify)
      console.log(transSendBank)
      console.log(integratorId)
      console.log(merchantId)
      console.log(terminalId)
      console.log(ipaddress)
      console.log(browserAgent)
      console.log(trxType)
      console.log(paymentMethod)
      console.log(cardNumber)
      console.log(customerId)
      console.log(invoiceNumber)
      console.log(accountType)
      console.log(twofactorAuth)
      console.log(cvv)
      console.log(currency)
      console.log(amount)
      return TypePasswordBank
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
    add (txnId, responseMessages, ordersId, payAmount) {
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
        paymentStatus: 'ACT',
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
