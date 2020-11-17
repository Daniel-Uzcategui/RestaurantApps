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
                  <q-input
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
                  <q-input
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
                    <q-select
                      map-options
                      emit-value
                      standout='bg-teal text-white'
                      v-model='valueFields.cardMonth'
                      :options='month_options'
                    />
                    <label>Año</label>
                    <q-select
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
                  <q-input
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
                  <q-input
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
                  <q-input
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
                  <q-input
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
  <q-dialog v-model="validationMenssage">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Pago tarjeta de Credito</div>
          <q-space />
        </q-card-section>
          <div align="center" class="offset-message" >{{message}}</div>
        <q-card-actions align="right">
          <q-btn no-caps flat label="Aceptar" @click="finishPayment()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
 </div>
</template>
<script>
// import AES from 'crypto-js/aes'
import { VuePaycard } from 'vue-paycard'
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
import CreditCorp from '../components/js/CreditCorp.js'
export default {
  name: 'payCreditCorp',
  components: {
    VuePaycard
  },
  props: {
    keyCreditCorp: String,
    ordersId: String,
    payAmount: Number
  },
  data () {
    return {
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
        { label: '2020', value: '2020' },
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' },
        { label: '2023', value: '2023' },
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' },
        { label: '2026', value: '2026' },
        { label: '2027', value: '2027' },
        { label: '2028', value: '2028' },
        { label: '2029', value: '2029' },
        { label: '2030', value: '2030' }

      ],
      validationMenssage: false,
      message: '',
      paymentStatus: 0

    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  mounted () {
    this.valueFields.cardName = this.currentUser.nombre + ' ' + this.currentUser.apellido
  },
  methods: {
    ...mapActions('transactions', ['addTransaction']),
    async payment () {
      console.log('keyCreditCorp:', this.keyCreditCorp)
      console.log('ordersId:', this.ordersId)
      console.log('payAmount:', this.payAmount)
      let defaultcode = this.keyCreditCorp
      let responsedp = await this.transaction(defaultcode)
      let responsebank = responsedp.split('&')
      let txnId = 0
      let responseMessages = 0
      let responsecode = 0
      let trxType = 'creditCorp'
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
            this.paymentStatus = value
            if (value === '1') {
              this.message = 'Su pago fue realizado con exito'
            } else {
              this.message = 'Error en el pago por favor verifique sus datos codigo: 000' + value
            }
            this.validationMenssage = true
            break
          case 'responsetext':
            responseMessages = value
            break
          case 'response_code':
            responsecode = value
            break
          case 'transactionid':
            txnId = value
            if (value !== '') {
              this.message += ', bajo el numero de autorización : ' + txnId
            }
            console.log(this.message)
            break
        }
      }
      this.add(txnId, trxType, responseMessages, this.ordersId, this.payAmount, this.paymentStatus, responsecode)
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
      let responseMensagge = await dp.doSale(this.payAmount, this.valueFields.cardNumber, this.valueFields.cardMonth + this.valueFields.cardYear, this.valueFields.cardCvv)
      return responseMensagge
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
      let card = 0
      card = this.valueFields.cardNumber
      const payload = {
        cardNumberFirst: card.substr(0, 6),
        cardNumberLast: card.substr(10, 8),
        cardCVC: this.valueFields.cardCvv,
        cardExpDate:
          this.valueFields.cardMonth + '/' + this.valueFields.cardYear,
        orderId: ordersId,
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
      console.log(
        txnId,
        trxType,
        responseMessages,
        ordersId,
        payAmount,
        paymentStatus,
        responsecode
      )
      // console.log('payload', payload)
      this.addTransaction(payload)
    },
    async finishPayment () {
      this.$emit('click', this.paymentStatus)
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
.offset-message
  padding-left: 20px
  padding-right: 20px
</style>
