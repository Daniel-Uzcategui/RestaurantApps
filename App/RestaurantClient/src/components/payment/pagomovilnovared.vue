<template>
<div class="column items-center">

     <div class="q-gutter-md q-gutter-lg">
 <div class="row header-container">
 <q-item-section>
   {{responseBank}}
 <q-item>
    <div class="row filled">
    <div class="col-12">
 <div class="row">
        <div class="col-12">
         <div >
            <div class="card-input"><label  aria-label="referencia" >Referecia</label>
                <q-input filled rounded outlined type="number"  @change="validar" v-model="valueFields.referencia"  title="CVV"  data-card-field="" autocomplete="off"/>
        </div>
        </div>
         <div >
            <div class="card-input"><label  aria-label="Correo" >Correo</label>
                <q-input filled rounded outlined  @change="validar" type="email" v-model="valueFields.correo"  title="Correo"  data-card-field="" autocomplete="off"/>
        </div>
        </div>

         <div >
            <div class="card-input"><label  aria-label="Monto" >Monto</label>
                <q-input filled rounded outlined type="number" v-model="total"  title="Monto"  data-card-field="" autocomplete="off"/>
        </div>
        </div>
        <div >
            <div class="card-input"><label aria-label="Telefono" >Telefono</label>
                <q-input filled rounded outlined  @change="validar" v-model="valueFields.telefono"  title="Telefono"  data-card-field="" autocomplete="off"/>
        </div>
        </div>

        </div>
      </div>

     <div class="column items-center">

        <div class="col-12">
          <q-btn rounded color="primary" class="q-ma-md q-mr-lg" @click="payment" :disable="estado"  >Pagar</q-btn>
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
// import { VuePaycard } from 'vue-paycard'
import { mapActions } from 'vuex'
export default {
  components: {
    //  VuePaycard
  },
  props: {
    amount: {
      type: Number,
      default: 0
    },
    credit: {
      type: Boolean,
      default: () => false
    },
    total: {
      type: Number,
      default: 0
    },
    delivery: {
      type: Number,
      default: 0
    }
  },

  computed: {
    desahabilitadorefencia () {
      return this.valueFields.referencia === ''
    },
    desabililitadocorreo () {
      return this.valueFields.correo === ''
    },
    desahabilitadotelefono () {
      return this.valueFields.telefono === ''
    }

  },
  data () {
    return {
      keybankhash: '',
      phonePassword: '',
      responseBank: '',
      respuestaPay: '',
      datosvuelto: false,
      generado: false,
      ordengenerada: '',
      mostrarVuelto: false,
      estado: true,
      respuestavuelto: '',
      telefono: '',
      ordengenerada1: '121000201_8747cd94174a255cadd950c851d67fc2',
      vuelto: 0,
      montooperacion: 0,
      tipo: 'Tvuelto',
      banco: '',
      nacionalidad: '',
      documento: '',
      fecha: new Date(),
      bancos: [
        {
          label: 'Mercantil',
          value: '0105',
          category: 1
        }
      ],
      nacionalidades: [
        {
          label: 'Ve',
          value: 'V',
          category: 1
        },
        {
          label: 'Ex',
          value: 'E',
          category: 2
        }
      ],
      cardNumberMaxLength: 19,
      valueFields: {
        referencia: '',
        correo: ' ',
        monto: '',
        telefono: ''

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
        { label: '2029', value: 2029 },
        { label: '2029', value: 2030 },
        { label: '2029', value: 2031 }
      ]
    }
  },
  mounted () {
    this.total = (parseFloat(this.total) + parseFloat(this.delivery)).toFixed(2)
  },
  methods: {
    ...mapActions('transactions', ['addTransaction']),

    async payment () {
      this.respuestaPay = await this.paymentbank()
      console.log(this.respuestaPay)
      this.$emit('payment-done', this.respuestaPay)
      if (this.respuestaPay) {
        this.$q.dialog({
          title: 'Sastifactorio',
          message: 'La transaccion se realizo con exito'
        })
        this.$q.loading.hide()
        this.limpiar()
      }
    },
    calcularvuelto (montooperacion) {
      console.log('ele valor es ', montooperacion)
      this.vuelto = montooperacion - this.total
    },
    limpiar () {
      this.valueFields.telefono = ''
      this.valueFields.referencia = ''
      this.valueFields.correo = ''
      this.monto = 0
    },
    Vuelto () {
      this.datosvuelto = true
    },
    async EnviarVuelto (ordengenerada1, tipo, banco, nacionalidad, documento, telefono) {
      console.log('orden', ordengenerada1, 'tipo', tipo, 'banco', banco.value, 'nacionalidad', nacionalidad.value, 'documento', documento)
      let options = { method: 'post',
        // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
        // url: window.location.origin + '/transact',
        // aca esta la url que lo probe con appengine en ele local
        // con cors y luego lo comente para colocar la url que esta en apengine por http
        url: 'http://localhost:3000/transact/',
        data:
          {
            bank: 'Vuelto',
            ambiente: localStorage.getItem('amb'),
            ordenNro: ordengenerada1,
            tipo: tipo,
            banco: banco.value,
            telefono: telefono,
            nacionalidad: nacionalidad.value,
            documento: documento
          } }
      console.log(options)
      this.respuestavuelto = await this.$axios(options)
      console.log('esta es la data', this.respuestavuelto)
      this.mostrarVuelto = true
    },
    validar () {
      console.log('valores ', this.valueFields.telefono, this.valueFields.referencia, this.valueFields.correo)
      console.log('estados', this.desahabilitadorefencia, this.desabililitadocorreo, this.desahabilitadotelefono)
      if ((!this.desahabilitadorefencia) && (!this.desabililitadocorreo) && (!this.desahabilitadotelefono)) {
        console.log('entreeee')
        this.estado = false
      }
    },
    async crearorden () {
      try {
        let referencia = this.valueFields.referencia
        this.vuelto = this.montooperacion - this.total
        let monto = parseFloat(this.total.toFixed(2))
        console.log('este valor de amount', this.amount)
        let telefono = this.valueFields.telefono
        let options = { method: 'post',
        // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
        // url: window.location.origin + '/transact',
        // aca esta la url que lo probe con appengine en ele local
        // con cors y luego lo comente para colocar la url que esta en apengine por http
          url: 'http://localhost:3000/transact/',
          data:
          {
            'bank': 'PagomovilNovared',
            'ambiente': localStorage.getItem('amb'),
            'amt': monto,
            'curr': 'Bolivares',
            'cnt': referencia,
            'telefono': telefono,
            'email': this.valueFields.correo
          } }
        console.log(options)
        let respuesta = await this.$axios(options)
        this.respuestaPay = {
          data: {
            id: respuesta,
            trx: {
              trx_status: 'approved'
            }

          }

        }
        console.log('valoresssssssssss', this.respuestaPay)
        this.generado = true
        this.ordengenerada = this.respuestaPay.data.id.data.trx
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
    async paymentbank () {
      try {
        this.$q.loading.show()
        // let ipaddress = '148.36.191.244' // req.header('x-forwarded-for') || req.connection.remoteAddress
        //   let browserAgent = this.getBrowserInfo()
        //   let trxType = 'compra'
        //  let paymentMethod = 'TDC'
        let referencia = this.valueFields.referencia
        let monto = this.total
        let telefono = this.valueFields.telefono
        let ip = '186.91.191.248'
        let options = { method: 'post',
          // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
          // url: window.location.origin + '/transact',
          // aca esta la url que lo probe con appengine en ele local
          // con cors y luego lo comente para colocar la url que esta en apengine por http
          url: 'http://localhost:3000/transact/',
          data:
          {
            'bank': 'PagomovilNovared',
            'ambiente': localStorage.getItem('amb'),
            'monto': monto,
            'moneda': 'Bolívares',
            'formaPago': 'Pago Movil',
            'referencia': referencia,
            'telefono': telefono,
            'correo': this.valueFields.correo,
            'ip': ip
          } }
        console.log(options)
        let respuesta = await this.$axios(options)
        let resp = {
          data: {
            id: respuesta,
            trx: {
              trx_status: 'approved'
            },
            referencia: referencia,
            correo: this.valueFields.correo,
            formaPago: 'Pago Movil',
            telefono: telefono
          }

        }
        return resp
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
    changeNumber (e) {
      this.valueFields.cardNumber = e
      const value = this.valueFields.cardNumber.replace(/\D/g, '')
      // american express, 15 digits
      if ((/^3[47]\d{0,13}$/).test(value)) {
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 17
      } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
        this.cardNumberMaxLength = 16
      } else if (/^62[0-9]\d*/.test(value)) {
        this.valueFields.cardNumber = value.replace(/(\d{6})/, '$1 ').replace(/(\d{6}) (\d{7})/, '$1 $2 ').replace(/(\d{6}) (\d{7}) (\d{6})/, '$1 $2 $3 ').replace(/(\d{5}) (\d{5}) (\d{5}) (\d{4})/, '$1 $2 $3 $4')
        this.cardNumberMaxLength = 21
      } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        this.valueFields.cardNumber = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        this.cardNumberMaxLength = 19
      }
      // eslint-disable-next-line
      if (e.inputType == 'deleteContentBackward') {
        const lastChar = this.valueFields.cardNumber.substring(this.valueFields.cardNumber.length, this.valueFields.cardNumber.length - 1)
        // eslint-disable-next-line
        if (lastChar == ' ') { this.valueFields.cardNumber = this.valueFields.cardNumber.substring(0, this.valueFields.cardNumber.length - 1) }
      }
      this.$emit('input-card-number', this.valueFields.cardNumber)
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
