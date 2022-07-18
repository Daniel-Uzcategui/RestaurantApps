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
         <div class="col-12">
        <div>
           <q-select

            bottom-slots
            v-model="metodopago"
            :options="metodospagos"
            label="Banco"
            @input="actualizar()"

          />
        </div>
         </div>
             <div >
                              <div class="col-12">
                               <div>
                                 <q-select

                                   bottom-slots
                                   v-model="nacionalidad"
                                 :options="nacionalidades"
                                 label="Nacionalidad"

                               />
                          </div>
                           </div>
                            <div  class="card-input"><label  aria-label="monto" >Cedula</label>
                            <q-input filled mask="########" v-model="CedulaEnviar"  title="Cedula" @input="validar"  />
                         </div>
                         </div>
        <div >
            <div class="card-input"><label aria-label="Telefono" >Telefono</label>
                <q-input filled rounded outlined mask="(####) ###.##.##" type="text"  v-model="valueFields.telefono"  title="Telefono"  @input="validar" />
        </div>
        </div>

        </div>
      </div>

    <div class="column items-center">

        <div class="col-12">
          <q-btn rounded color="primary" class="q-ma-md q-mr-lg" :loading="pagando" @click="payment" :disable="estado" >Pagar</q-btn>
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
// import { VuePaycard } from 'vue-paycard's
import { mapActions, mapGetters } from 'vuex'
import { copyToClipboard } from 'quasar'
// import { date } from 'quasar'
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
  mounted () {
    this.bindPaymentServ()
    /*  this.operacion = this.obtenerprimeraletra(this.metodospagos[0].value)
    this.ambientes = this.obtenerprimeraletra(localStorage.getItem('amb')) */
    // this.serie = this.obtenerSerie(this.paymentServ.referencia)
    // let fecha = new Date()
    // let diaA = fecha.getDate()
    // let hoy = fecha.getDate()
    //   console.log('aaaa', hoy)
    //  console.log(fecha)

    // this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + '00' + hoy + this.serie
    //  this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + hoy + this.paymentServ.referencia
    /*  this.referenciacompleta = this.referenciacompleta.toUpperCase()
    console.log('este el valor de referencia', this.referenciacompleta) */
    console.log('este el valor de total', this.total)
    this.total2 = parseFloat(this.total) + parseFloat(this.delivery)
  },
  watch: {
    desahabilitadorefencia () {
    },
    desabililitadocorreo () {
      return false
    },
    desahabilitadotelefono () {
      return false
    }
  },
  computed: {

    desahabilitadorefencia () {
      return this.metodopago === ''
    },
    desabililitadocorreo () {
      return this.valueFields.correo === ''
    },
    desahabilitadotelefono () {
      return this.valueFields.telefono === ''
    },
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates'])

  },

  data () {
    return {
      montoTotal: 0,
      keybankhash: '',
      phonePassword: '',
      responseBank: '',
      respuestaPay: '',
      ordengenerada: '',
      pagando: false,
      mostrarVuelto: false,
      estado: true,
      operacion: '',
      total2: 0,
      referenciacompleta: '',
      ambientes: '',
      CedulaEnviar: '',
      nacionalidad: '',
      serie: '',
      metodopago: '',
      metodospagos: [
        {
          label: 'Mercantil',
          value: '0105',
          category: 1
        },

        {
          label: 'PresidentBanco Nacional de Credito',
          value: '0191',
          category: 3
        },
        {
          label: 'Mi Banco',
          value: '0169',
          category: 4
        },
        {
          label: 'Banco del Pueblo Soberano',
          value: '0149',
          category: 5
        },
        {
          label: 'Banco del Tesoro',
          value: '0163',
          category: 6
        },
        {
          label: 'Bancaribe',
          value: '0114',
          category: 7
        },
        {
          label: 'Banco Caroni',
          value: '0128',
          category: 8
        },
        {
          label: 'Banco de la Gente Emprendedora C.A.',
          value: '0146',
          category: 9
        },
        {
          label: '100% Banco',
          value: '0156',
          category: 10
        },
        {
          label: 'Banco Central de Venezuela',
          value: '0001',
          category: 11
        },
        {
          label: 'BFC Banco Fondo Comun',
          value: '0151',
          category: 12
        },
        {
          label: 'Banco Espirito Santo',
          value: '0176',
          category: 13
        },
        {
          label: 'Citibank N.A.',
          value: '0190',
          category: 14
        },
        {
          label: 'Banco Occidental de Descuento',
          value: '0121',
          category: 15
        },
        {
          label: 'Banco Agrícola de Venezuela',
          value: '0166',
          category: 16
        },
        {
          label: 'Instituto Municipal de Credito Popular',
          value: '0601',
          category: 17
        },
        {
          label: 'Banco Provincial',
          value: '0108',
          category: 18
        },
        {
          label: 'Banplus',
          value: '0174',
          category: 19
        },
        {
          label: 'Banco Industrial de Venezuela',
          value: '0003',
          category: 20
        },
        {
          label: 'Banco Bicentenario',
          value: '0175',
          category: 21
        },
        {
          label: 'Banco de la Fuerza Armada Nacional Bolivariana',
          value: '0177',
          category: 22
        },
        {
          label: 'Banco de Venezuela',
          value: '0102',
          category: 23
        },
        {
          label: 'Banco Internacional de Desarrollo',
          value: '0173',
          category: 24
        }
      ],
      fecha: new Date(),
      ordengenerada1: '121000201_8747cd94174a255cadd950c851d67fc2',
      banco: '',
      datosvuelto: false,
      telefono: '',
      documento: '',
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
      generado: false,
      tipo: 'Tvuelto',
      cardNumberMaxLength: 19,
      montooperacion: 0,
      btnvuelto: false,
      respuestavuelto: '',
      vuelto: 0,
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
  methods: {
    ...mapActions('transactions', ['addTransaction', 'cambiarBase64']),
    ...mapActions('config', ['bindPaymentServ', 'bindConfigs', 'bindRates']),
    async payment () {
      this.estado = false
      this.pagando = true
      this.respuestaPay = await this.paymentbank()
      console.log(this.respuestaPay)

      this.$emit('payment-done', this.respuestaPay)
      /* if (this.respuestaPay) {
        this.$q.dialog({
          title: 'Sastifactorio',
          message: 'La transaccion de orden de pago se realizo con exito se realizo con exito'
        })
        //  this.$q.loading.hide()
        this.limpiar()
      } */
    },
    copy (referencia) {
      copyToClipboard(referencia)
      return this.$q.dialog({ title: 'Sastifactorio', message: 'Código copiado' })
    },
    actualizar () {
    /*  let fecha = new Date()
      // let diaA = fecha.getDate()
      let hoy = fecha.getDate()
      console.log('aaaa', hoy)
      console.log(fecha)

      // this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + '00' + hoy + this.serie
      this.referenciacompleta = this.operacion + this.paymentServ.Novared.nombreComercio + hoy + this.paymentServ.referencia
      this.referenciacompleta = this.referenciacompleta.toUpperCase()
      console.log('este el valor de referencia', this.referenciacompleta)
      this.validar() */
    },
    formatoTelefono (tel) {
      return `58${tel.substr(2, 3)}${tel.substr(7).replace(/\./g, '')}`
    },
    async verificarPago (respuesta) {
      try {
        // donde se esta colocando el numero manuel debe ir la variable respuesta lo que pasa
        // es que el valor de la orden generada no sirve para consultar el abono en la api de prueba

        let ordenNro = '121000201_8747cd94174a255cadd950c851d67fc2'
        let formaPago = this.metodopago.value
        let referencia = this.valueFields.referencia
        let telefono = this.valueFields.telefono
        let correo = this.valueFields.correo
        let ip = '186.91.191.248'

        let options = { method: 'post',

          // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
          // url: window.location.origin + '/transact',
          // aca esta la url que lo probe con appengine en ele local
          // con cors y luego lo comente para colocar la url que esta en apengine por http
          url: 'http://localhost:3000/transact/',
          data:
          {
            'bank': 'VerificarAbono',
            'ambiente': localStorage.getItem('amb'),
            'ordenNro': ordenNro,
            'formaPago': formaPago,
            'referencia': referencia,
            'telefono': telefono,
            'correo': correo,
            'ip': ip
          } }
        console.log(options)
        let respuesta2 = await this.$axios(options)
        return respuesta2
      } catch (err) {
        //  this.$q.loading.hide()
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
    validar () {
      console.log('el valor de correo', this.valueFields.correo)
      console.log('el valor de telefono', this.valueFields.telefono)
      // let correovalidado = this.validEmail(this.valueFields.correo)
      if ((!this.desahabilitadorefencia) && (!this.desahabilitadocedula) && (!this.desahabilitadotelefono)) {
        console.log('entreeee')
        this.estado = false
      }
    },
    soloNumeros (e) {
      var key = e.charCode
      console.log(key)
      return key >= 48 && key <= 57
    },
    limpiar () {
      this.valueFields.telefono = ''
      this.valueFields.referencia = ''
      this.valueFields.correo = ''
      this.monto = 0
    },
    async crearorden () {
      try {
        let referencia = this.valueFields.referencia
        let correo = this.valueFields.correo
        this.vuelto = this.montooperacion - this.total
        let monto = this.total
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
            'bank': 'Zelle',
            'ambiente': localStorage.getItem('amb'),
            'amt': monto,
            'curr': 'USD',
            'cnt': referencia,
            'telefono': telefono,
            'email': correo
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
      //  this.$q.loading.hide()
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
    obtenerprimeraletra (palabra) {
      return palabra[0]
    },
    validEmail (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    obtenerSerie (numero) {
      let numeroAumentado = Number(numero) + 1
      let length = numeroAumentado.toString().length
      // let width = 9 - length
      // let numeroConvertido = NumeroString12(numeroAumentado, width)
      let numerostring = numeroAumentado.toString()
      var zero = '0'
      let numeroConvertido = (zero.repeat(8 - length)) + numerostring
      return numeroConvertido
    },
    async EnviarVuelto (ordengenerada1, tipo, banco, nacionalidad, documento, telefono) {
      console.log('orden', ordengenerada1, 'tipo', tipo, 'banco', banco.value, 'nacionalidad', nacionalidad.value, 'documento', documento)
      let options = { method: 'post',
        // url: 'http://localhost:5001/qa-restaurant-testnet/us-central1/MakePay',
        // url: window.location.origin + '/transact',
        // aca esta la url que lo probe con appengine en ele local
        // con cors y luego lo comente para colocar la url que esta en apengine por http
        url: 'http://localhost/transact/',
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
    calcularvuelto (montooperacion) {
      console.log('ele valor es ', montooperacion)
      this.vuelto = montooperacion - this.total
    },
    cambiarBase6411 (archivo) {
      return window.atob(archivo)
    },
    async paymentbank () {
      let respuesta
      try {
        // this.$q.loading.show()
        // let referencia = this.valueFields.referencia
        this.vuelto = this.montooperacion - this.total
        let monto = this.total2
        console.log('este valor de total', monto)
        //   let telefono = this.formatoTelefono(this.valueFields.telefono)
        // let ip = '186.91.191.248'
        let telefono = this.formatoTelefono(this.valueFields.telefono)
        let options = { method: 'post',

          url: window.location.origin + '/transact',
          data:
          {
            'bank': 'PagoMovil',
            'token': this.paymentServ.apiKeyDev,
            'ambiente': localStorage.getItem('amb'),
            'transaction_c2p': {
              'currency': 'VES',
              'amount': monto.toFixed(2),
              'destination_bank_id': this.metodopago.value,
              'destination_mobile_number': this.paymentServ.pagomovil,
              'destination_id': this.nacionalidad.value + this.CedulaEnviar,
              'origin_mobile_number': telefono
            }
          } }
        console.log(options)
        respuesta = await this.$axios(options)
        console.log('estaaaaaaaaaaaa', respuesta)
        let resp = {
          data: {
            id: respuesta,
            trx: {
              trx_status: 'approved'
            }

          }

        }
        return resp
      } catch (err) {
        // let mensaje
        this.pagando = false
        // this.$q.loading.hide()
        console.error({ err })
        if (err.response) {
          console.log('errorrrrrrr', err.response)
          //   mensaje = this.error.find(x => x.codigo === err.response.status)
          this.pagando = false
          this.estado = true
          return this.$q.dialog({
            title: 'Error',

            message: err.response.data.message.error_list[0].description
          })
        } else {
          // let mensaje = this.eror.find(x => x.id === err.response.status)
          console.log('errorrrrrrr', err.response)

          return this.$q.dialog({
            title: 'Error',

            message: 'Ha ocurrido un Error'
          })
        }
      }
    },
    Vuelto () {
      this.datosvuelto = true
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
