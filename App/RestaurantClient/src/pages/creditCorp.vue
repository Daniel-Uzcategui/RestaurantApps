<template>
  <div class='column items-center'>
    <VuePaycard
      class='q-pa-none q-ma-none'
      :value-fields='valueFields'
      :labels='labels'
      :hasRandomBackgrounds='false'
      :backgroundImage='10'
    />
    <div class='q-gutter-md q-gutter-lg'>
      <div class='row header-container'>
        <div class='col-12'>
           <div class='row filled'>
              <div class='col-6 '>
                <div class='card-input'>
                  <label for='cardNumber'>Numero de tarjeta</label>
                  <q-input filled
                    type='tel'
                    v-model='valueFields.cardNumber'
                    title='Number'
                    data-card-field=''
                    autocomplete='off'
                    maxlength='16'
                    class=''
                    outlined
                  />
                </div>
              </div>
              <div class='col-6 offset-col'>
                <div class='card-input'>
                  <label for='cardName'>Nombre Completo</label>
                  <q-input filled
                    outlined :value="currentUser.nombre + ' ' + currentUser.apellido "  @input="(e) => saved(e, '', 'nombre')" disable
                  />
                </div>
              </div>
            </div>
            <div class='row'>
              <div class='col-12'>
                <div class='card-input'>
                  <label for='cardMonth' aria-label='Expiration Date'
                    >Fecha de Expiración</label>
                  <div class='card-input'>
                    <label>Mes</label>
                    <q-select filled
                      map-options
                      emit-value
                      standout='bg-teal text-white'
                      v-model='valueFields.cardMonth'
                      :options='month_options'
                    />
                    <label>Año</label>
                    <q-select filled
                      map-options
                      emit-value
                      standout='bg-teal text-white'
                      v-model='valueFields.cardYear'
                      :options='year_options'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class='row'>
              <div class='col-6'>
                <div class='card-input'>
                  <label for='cardCvv' aria-label='Card CVV'>CVV</label>
                  <q-input filled
                    type='tel'
                    v-model='valueFields.cardCvv'
                    title='CVV'
                    maxlength='3'
                    data-card-field=''
                    autocomplete='off'
                    outlined
                  />
                </div>
              </div>
              <div class='col-6 offset-col'>
                <div class='card-input'>
                  <label for='city' aria-label='city'>Ciudad</label>
                  <q-input filled
                    type='text'
                    v-model='valueFields.cardcity'
                    title='ciudad'
                    data-card-field=''
                    autocomplete='off'
                    outlined
                  />
                </div>
              </div>
            </div>
            <div class='row'>
              <div class='col-6'>
                <div class='card-input'>
                  <label for='state' aria-label='state'>Estado</label>
                  <q-input filled
                    type='text'
                    v-model='valueFields.cardstate'
                    title='Estado'
                    data-card-field=''
                    autocomplete='off'
                    outlined
                  />
                </div>
              </div>
              <div class='col-6 offset-col'>
                <div class='card-input'>
                  <label for='zipcode' aria-label='zipcode'
                    >Codigo postal</label
                  >
                  <q-input filled
                    type='text'
                    v-model='valueFields.cardzipcode'
                    title='zipcode'
                    data-card-field=''
                    autocomplete='off'
                    outlined
                    maxlength='6'
                  />
                </div>
              </div>
            </div>
            <div class='row'>
              <div class='col-12'>
                <q-btn
                  v-if='$q.screen.gt.sm'
                  color='primary'
                  class='q-ma-md q-mr-lg'
                  @click='payment'
                  >Pagar</q-btn
                >
              </div>
            </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { VuePaycard } from 'vue-paycard'
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
import CreditCorp from '../components/js/CreditCorp.js'
export default {
  components: {
    VuePaycard
  },
  props: ['id'],
  data () {
    return {
      payamount: 999,
      phonePassword: '',
      valueFields: {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
        cardcity: '',
        cardstate: '',
        cardzipcode: ''
      },
      labels: {
        cardHolder: 'Nombre y Apellido',
        cardMonth: 'MM',
        cardYear: 'YY',
        cardExpires: 'Expiración',
        cardCvv: 'CVV'
      },
      month_options: [
        { label: '01', value: '01' },
        { label: '02', value: '02' },
        { label: '03', value: '03' },
        { label: '04', value: '04' },
        { label: '05', value: '05' },
        { label: '06', value: '06' },
        { label: '07', value: '07' },
        { label: '08', value: '08' },
        { label: '09', value: '09' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' }
      ],
      year_options: [
        { label: '2020', value: 20 },
        { label: '2021', value: 21 },
        { label: '2022', value: 22 },
        { label: '2023', value: 23 },
        { label: '2024', value: 24 },
        { label: '2025', value: 25 },
        { label: '2026', value: 26 },
        { label: '2027', value: 27 },
        { label: '2028', value: 28 },
        { label: '2029', value: 29 },
        { label: '2030', value: 30 }

      ]
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    ...mapActions('transactions', ['addTransaction']),
    async payment () {
      let defaultcode = '6457Thfj624V5r7WUwc5v6a68Zsd6YEm'
      let responsedp = await this.transaction(defaultcode)
      let responsebank = responsedp.split('&')
      let txnId = 0
      let responseMessages = 0
      let responsecode = 0
      let paymentStatus = 0
      let trxType = 'creditCorp'
      let payAmount = 0
      let ordersId = 0
      let pos = 0
      let campo = ''
      let value = 0
      console.log('response:', responsedp)
      for (var i = 0; i < responsebank.length; i++) {
        pos = responsebank[i].search('=')
        campo = responsebank[i].substr(0, pos)
        value = responsebank[i].substr(pos + 1, responsebank[i].length)
        switch (campo) {
          case 'response':
            paymentStatus = value
            break
          case 'responsetext':
            responseMessages = value
            break
          case 'response_code':
            responsecode = value
            break
          case 'transactionid':
            txnId = value
            break
        }
      }
      this.add(txnId, trxType, responseMessages, ordersId, payAmount, paymentStatus, responsecode)
    },
    async transaction (defaultcode) {
      const dp = new CreditCorp(defaultcode)
      const security = { security_key: defaultcode }
      const billingInfo = {
        first_name: this.currentUser.nombre,
        last_name: this.currentUser.apellido,
        address1: this.valueFields.cardcity + ' ' + this.valueFields.cardstate,
        city: this.valueFields.cardcity,
        state: this.valueFields.cardstate,
        zip: this.valueFields.cardzipcode
      }
      const shippingInfo = {
        shipping_first_name: this.currentUser.nombre,
        shipping_last_name: this.currentUser.apellido,
        shipping_address1: this.valueFields.cardcity + ' ' + this.valueFields.cardstate,
        shipping_city: this.valueFields.cardcity,
        shipping_state: this.valueFields.cardstate,
        shipping_zip: this.valueFields.cardzipcode
      }
      dp.setBilling(billingInfo)
      dp.setShipping(shippingInfo)
      dp.setSecurity(security)
      let responseMensagge = await dp.doSale(this.payamount, this.valueFields.cardNumber, this.valueFields.cardMonth + this.valueFields.cardYear, this.valueFields.cardCvv)
      return responseMensagge
    },
    getBrowserInfo () {
      var ua = navigator.userAgent,
        tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || []
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []
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
    add (
      txnId,
      trxType,
      responseMessages,
      ordersId,
      payAmount,
      paymentStatus,
      responsecode
    ) {
      console.log(
        txnId,
        trxType,
        responseMessages,
        ordersId,
        payAmount,
        paymentStatus,
        responsecode
      )
      let card = 0
      card = this.valueFields.cardNumber
      const payload = {
        cardNumberFirst: card.substr(0, 6),
        cardNumberLast: card.substr(10, 8),
        cardCVC: this.valueFields.cardCvv,
        cardExpDate:
          this.valueFields.cardMonth + '/' + this.valueFields.cardYear,
        orderId: this.currentUser.cedula,
        paidAmount: payAmount,
        paidAmountCurrency: 'ves',
        rateId: 0,
        txnBankId: txnId,
        trxType: trxType,
        trxProcesingDate: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
        paymentStatus: paymentStatus,
        responseMessage: responseMessages,
        DateIn: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
      this.addTransaction(payload)
    }
  }
}
</script>
<style lang='sass' scoped>
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
.offset-col
  padding-left: 20px
</style>
