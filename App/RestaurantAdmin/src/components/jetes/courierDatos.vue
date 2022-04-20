<template>
    <div>
        <div class="row">
            <q-form class="q-gutter-md formulario row">
                <div class="col-2">
                    <q-select v-model="courier" :options="couriersList"  label="Couriers" @blur="actualizarCourier()"  @change="actualizarCourier()"/>
                </div>
                <div class="col-2">
                    <q-select v-model= "estado" :options="estadosList"  label="Estado" @blur="actualizarEstado()"  @change="actualizarEstado()" />
                </div>

                <div class="col-2">
                    <q-select v-model="ciudad" :options="ciudadesList"  label="Ciudad" @blur="actualizarCiudad()"   />
                </div>
                <div class="col-2">
                    <q-select v-model="municipio" :options="municipiosList"  label="Municipio" @blur="actualizarMunicipio()" />
                </div>
                <div class="col-2">
                    <q-select v-model="parroquia" :options="parroquiasList"  label="Parroquia" @blur="actualizarParroquia()" />
                </div>
                <div class="col-2">
                    <q-select v-model="oficina" :options="oficinasList"  label="Oficina" @blur="actualizarOficina()" />
                </div>
                 <div v-if="loading2">
                  <q-spinner color="primary" size="15em" />
              </div>
                <div class="col-12"></div>
                <div class="col-2">
                    <q-input v-model="destinatario" label="Destinatario" />
                </div>
                <div class="col-2">
                    <q-input v-model="contacto" label="Contacto" />
                </div>
                <div class="col-2">
                    <q-input v-model="cirif" label="CI/RIF" />
                </div>
                <div class="col-2">
                    <q-input v-model="telefono" type="tel" label="Telefono" />
                </div>
                <div class="col-2">
                    <q-input v-model="direccion" label="Dirección" />
                </div>
                <div class="col-2">
                    <q-input v-model="inmueble" label="Inmueble" />
                </div>
                <div class="col-2">
                    <q-input v-model="descripcionPaquete" label="Descripción Paquete" />
                </div>
                <div class="col-2">
                    <q-input v-model="referencia" label="Referencia" />
                </div>
                <div class="col-2">
                    <q-input v-model="numeroPiezas" type="number" disable label="Número de Piezas" />
                </div>
                <div class="col-2">
                    <q-input v-model="peso" type="number" disable label="Peso" />
                </div>
                 <div class="col-2">
                  <q-select v-model="tipoEnvio" :options="tipoEnvios"  label="Tipo Envio"  />
                </div>
                <div class="col-2">
                    <q-input v-model="valor" type="number" disable label="Valor" />
                </div>
                <div class="col-2">
                  <q-select v-model="tipoServicio" :options="tipoServicioList" disable label="Tipo de Servicio"  />
                </div>
                <div class="col-2">
                    <q-toggle v-model="retirarOficina"  label="Retirar en la Oficina"  />
                </div>
                <div class="col-2">
                    <q-toggle v-model="seguro"  label="Seguro" />
                </div>
            </q-form>
        </div>
        <br>
        <q-badge color="red" v-if="errorList">
            {{errorList}}
        </q-badge>
        <q-badge color="red" v-if="errorValidacion">
            {{mensajeError}}
        </q-badge>
        <br>
        <div class="row">
            <q-btn :loading="generandoGuia" color="primary" @click="generarGuia()" style="width: 150px" class="q-ma-sm">
                Crear Guía
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
            <q-btn :loading="generandoTracking" color="primary" @click="generarTracking()" style="width: 150px" class="q-ma-sm">
                Tracking
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
            <q-btn :loading="generandoTarifa" color="primary" @click="generarTarifa()" style="width: 150px" class="q-ma-sm">
                Tarifa
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
            <q-btn :loading="generandoPdfGuia" color="primary" @click="generarPdfGuia()" style="width: 150px" class="q-ma-sm">
                Generar PDF
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
            <q-btn :loading="limpiando" color="secondary" @click="limpiar()" style="width: 150px" class="q-ma-sm">
                Limpiar
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
        </div>
        <q-dialog v-model="alerta">
            <q-card>
                <q-card-section>
                <div class="text-h6">Error</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                {{alertaMsg}}
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
            </q-card>
        </q-dialog>
        <br>
        <div class="row" v-if="guia.ok">
            <div class="col-2 q-px-sm" >
                <q-input v-model="guia.data.guia" hint="Guia" :dense="dense" disable />
            </div>
            <div class="col-2 q-px-sm">
                <q-input v-model="guia.data.referencia" hint="Referencia" :dense="dense" disable />
            </div>
        </div>
        <q-badge color="red" v-if="guia.error">
            {{guia.error}}
        </q-badge>
        <br>
        <q-dialog v-model="tarifaModal">
            <q-card>
                <q-card-section>
                <div class="text-h6">Tarifa Aproximada</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row" v-if="tarifa.ok">
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.combustible" hint="Combustible" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-1 q-px-sm" >
                        <q-input v-model="tarifa.data.flete" hint="Flete" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.franqueo_postal" hint="Franqueo Postal" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-1 q-px-sm" >
                        <q-input v-model="tarifa.data.iva" hint="Iva" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.seguro" hint="Seguro" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.subtotal" hint="SubTotal" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm">
                        <q-input v-model="tarifa.data.total" hint="TOTAL" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
            </q-card>
        </q-dialog>
        <q-badge color="red" v-if="tarifa.error">
            Tarifa: {{tarifa.error}}
        </q-badge>
        <br>
        <span class="text-h6" v-if="tracking.ok">Tracking</span>
        <div class="row" v-if="tracking.ok">
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.guia" hint="Guia" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.referencia" hint="Referencia" :dense="dense" disable />
          </div>
          <div class="col-2 q-px-sm" >
              <q-input v-model="tracking.data.codigo_cliente" hint="Código de Clinte" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm">
              <q-input v-model="tracking.data.receptor" hint="Receptor" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.fecha" hint="Fecha" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.codigo_estatus" hint="Cod. Estatus" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.siglas" hint="Siglas" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm">
              <q-input v-model="tracking.data.hora" hint="Hora" :dense="dense" disable />
          </div>
          <div class="col-6 q-px-sm">
              <q-input v-model="tracking.data.descripcion_estatus" hint="Desc. Estatus" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.fechapro" hint="Fecha Pro." :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm" >
              <q-input v-model="tracking.data.sello" hint="Sello" :dense="dense" disable />
          </div>
          <div class="col-1 q-px-sm">
              <q-input v-model="tracking.data.codtipo" hint="Cod. Tipo" :dense="dense" disable />
          </div>
        </div>
        <q-badge color="red" v-if="tracking.error">
           Tracking: {{tracking.error}}
        </q-badge>
        <br>

        <q-dialog v-model="pdfModal" full-width>
            <q-card>
                <q-card-section>
                <div class="text-h6">Guía PDF</div>
            </q-card-section>

            <q-card-section class="q-pt-none scroll" style="max-height: 60vh">
                <div class="row" v-if="pdfGuia.ok">
                    <object :data="`data:application/pdf;base64,${pdfGuia.data.value}`" type="application/pdf" width="100%" height="600px"></object>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
            </q-card>
        </q-dialog>
        <q-badge color="red" v-if="pdfGuia.error">
           Pdf: {{pdfGuia.error}}
        </q-badge>

    </div>
</template>
<script>
// import { defineComponent, ref } from 'vue'
// import validarDatos from '../../middleware/validateData'
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'couriers',
  components: {
  },
  props: {
    propsEcomienda: {}
  },
  data () {
    return {
      tipoEnvios: [
        {
          label: 'Mercancia',
          value: 'M'
        },
        {
          label: 'Documentos',
          value: 'D'
        }
      ],
      couriersList: [],
      estadosList: [],
      ciudadesList: [],
      oficinasList: [],
      tipoServicioList: [],
      idorden: '',
      loading2: false,
      loading: true,
      alerta: false,
      tarifaModal: false,
      pdfModal: false,
      alertaMsg: '',
      generandoGuia: false,
      generandoTracking: false,
      generandoTarifa: false,
      generandoPdfGuia: false,
      limpiando: false,
      courier: '',
      estado: '',
      ciudad: '',
      municipio: '',
      parroquia: '',
      oficina: '',
      destinatario: '',
      contacto: '',
      cirif: '',
      telefono: '',
      direccion: '',
      inmueble: '',
      descripcionPaquete: '',
      referencia: '',
      numeroPiezas: 0,
      peso: 0,
      tipoEnvio: '',
      valor: 0,
      tipoServicio: '',
      retirarOficina: true,
      seguro: true,
      errorValidacion: false,
      mensajeError: null,
      dense: false,
      isLiberty: false

    }
  },
  computed: {
    ...mapGetters('order', ['orderencomienda']),
    ...mapState('data', [
      'municipiosList',
      'parroquiasList',
      'errorList',
      'dataSelected',
      'guia',
      'tarifa',
      'tracking',
      'pdfGuia'
    ])

    //   alerta(){
    //       return this.guia.error || this.tarifa.error || this.tracking.error || this.pdfGuia.error ? true : false
    //   }

  },
  async mounted () {
    if (!this.orderencomienda.length) {
      await this.bindOrdersEnvio()
    }

    this.getCouriers()
    this.$store.commit('data/initTracking')
    console.log('los valores pasados por props', this.propsEcomienda)
    this.couriersList.push(this.propsEcomienda.courier)
    this.estadosList.push(this.propsEcomienda.estado)
    this.ciudadesList.push(this.propsEcomienda.ciudad)

    this.tipoServicioList.push(this.propsEcomienda.tipoTarifa)
    this.courier = this.couriersList[0]
    this.estado = this.estadosList[0]
    this.ciudad = this.ciudadesList[0]
    if (this.propsEcomienda.oficina !== '') {
      this.oficinasList.push(this.propsEcomienda.oficina)
      this.oficina = this.oficinasList[0]
    } else {
      let ciudad2 = await this.loadOficinas2(this.ciudad)
      console.log('oficinas', ciudad2)
      for (let i = 0; i < ciudad2.data.length; i++) {
        this.oficinasList.push({ label: ciudad2.data[i].nombre,
          value: ciudad2.data[i]._id,
          category: ciudad2.data[i].codigo })
      }
      this.oficina = {
        label: '',
        value: '',
        category: ''
      }
    }
    // this.municipio = this.municipiosList[0]
    // this.parroquia = this.parroquiasList[0]

    this.tipoServicio = this.tipoServicioList[0]
    this.numeroPiezas = this.propsEcomienda?.cantidadPiezas
    this.peso = this.propsEcomienda?.peso
    this.direccion = this.propsEcomienda?.localizacion
    this.inmueble = this.propsEcomienda?.puntoreferencia
    // this.tipoServicio =this.tipoServicioList[0].value
    // this.tipoServicio = this.propsEcomienda.tipoTarifa.value
    this.tipoEnvio = this.tipoEnvios[0].value
    if (this.propsEcomienda.seguro === 1) {
      this.seguro = true
    } else {
      this.seguro = false
    }
    this.valor = this.propsEcomienda.valor
    if (this.propsEcomienda.modalidadTarifa === 'puerta') {
      this.retirarOficina = false
    } else {
      this.retirarOficina = true
    }
    console.log('las ordenes', this.orderencomienda)
    this.idorden = this.propsEcomienda.idorden
    let arreglo = await this.orderencomienda.find(x => x?.id === this.idorden)
    console.log('aaaaaaa', arreglo)
    arreglo.cart.forEach(key => {
      console.log(key)
      this.descripcionPaquete = key.name + 'X' + key.quantity + ''
    })
    /* Object.keys(arreglo.cart).forEach(key => {
      console.log(key)
    }) */
    /* for (let i = 0; i < arreglo.cart.length; i++) {

    } */
    this.destinatario = this.propsEcomienda.destinatario
    this.contacto = this.propsEcomienda.contacto
    this.cirif = this.propsEcomienda.cirif
    this.telefono = this.propsEcomienda.telefono
    this.$store.dispatch('data/loadMunicipios', this.ciudad)
    // this.actualizarCourier()
    // this.actualizarEstado()
    // this.actualizarCiudad()
    // this.actualizarMunicipio()

    // this.direccion = this.propsEcomienda.direccion
  },

  methods: {
    ...mapActions('order', ['bindOrdersEnvio', 'setencomienda']),
    ...mapActions('data', ['loadOficinas2']),
    async getCouriers () {
      try {
        this.loading = true
        await this.$store.dispatch('data/loadCouriers')
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    actualizarCourier () {
      if (this.courier.label === 'Liberty') {
        this.isLiberty = true
        this.retirarOficina = false
      } else {
        this.isLiberty = false
        this.retirarOficina = true
      }
      console.log(this.isLiberty)
      this.$store.commit('data/updateCourier', this.courier)
      this.$store.commit('data/initEstados')
      this.$store.commit('data/initCiudades')
      this.$store.commit('data/initMunicipios')
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      this.estado = null
      this.$store.dispatch('data/loadEstados', this.courier)
    },
    actualizarEstado () {
      this.$store.commit('data/updateEstado', this.estado)
      this.$store.commit('data/initCiudades')
      this.$store.commit('data/initMunicipios')
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      this.ciudad = null
      this.$store.dispatch('data/loadCiudades', this.estado)
    },
    actualizarCiudad () {
      this.$store.commit('data/updateCiudad', this.ciudad)
      this.$store.commit('data/initMunicipios')
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      this.municipio = null
      this.$store.dispatch('data/loadMunicipios', this.ciudad)
    },
    actualizarMunicipio () {
      this.$store.commit('data/updateMunicipio', this.municipio)
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      this.parroquia = null
      this.$store.dispatch('data/loadParroquias', { ciudad: this.ciudad, municipio: this.municipio })
    },
    actualizarParroquia () {
      this.$store.commit('data/updateParroquia', this.parroquia)
      this.$store.commit('data/initOficinas')
      // this.oficina = null
      this.$store.dispatch('data/loadOficinas', this.ciudad)
    },
    actualizarOficina () {
      this.$store.commit('data/updateOficina', this.oficina)
    },
    generarGuia () {
      // validarDatos(this)
      if (!this.errorValidacion) {
        this.cargarDatos()
        this.solicitarGuia()
      }
    },
    generarTarifa () {
      if (!this.guia.ok) {
        this.generarGuia()
      }
      this.calcularTarifa()
    },
    generarTracking () {
      if (!this.guia.ok) {
        this.generarGuia()
      }
      this.solicitartracking()
    },
    generarPdfGuia () {
      if (!this.guia.ok) {
        this.generarGuia()
      }
      this.solicitarPdfGuia()
    },
    async  guardarguia () {
      let guia = {
        idorden: this.idorden,
        courier: this.courier.value,
        guia_id: this.guia.data._id,
        numero_guia: this.guia.data.guia
      }
      console.log(guia)
      await this.setencomienda(guia)
    },
    cargarDatos () {
      this.$store.commit('data/updateOtherData', {
        destinatario: this.destinatario,
        contacto: this.contacto,
        cirif: this.cirif,
        telefono: this.telefono,
        direccion: this.direccion,
        inmueble: this.inmueble,
        descripcionPaquete: this.descripcionPaquete,
        referencia: this.referencia,
        numeroPiezas: this.numeroPiezas,
        peso: this.peso,
        tipoEnvio: this.tipoEnvio.value,
        valor: this.valor,
        tipoServicio: this.tipoServicio,
        retirarOficina: this.retirarOficina,
        seguro: this.seguro
      })
    },

    async solicitarGuia () {
      let mun, parr
      // let seguro = this.seguro ? 1 : 0
      //  let modalidad = this.retirarOficina ? 'oficina' : 'puerta'
      if (this.municipio.value === undefined) {
        mun = ''
      } else {
        mun = this.municipio.value
      }
      if (this.parroquia.value === undefined) {
        parr = ''
      } else {
        parr = this.parroquia.value
      }
      this.loading2 = true
      try {
        this.alertaMsg = ''
        this.generandoGuia = true
        await this.$store.dispatch('data/generateGuia', {
          courier: this.courier.value,
          estado: this.estado.value,
          ciudad: this.ciudad.value,
          municipio: mun,
          parroquia: parr,
          destinatario: this.destinatario,
          contacto: this.contacto,
          cirif: this.cirif,
          telefono: this.telefono,
          direccion: this.direccion,
          inmueble: this.inmueble,
          descripcionPaquete: this.descripcionPaquete,
          referencia: this.referencia,
          numeroPiezas: this.numeroPiezas,
          peso: this.peso,
          tipoEnvio: this.tipoEnvio.value,
          valor: this.dataSelected.valor,
          tipoServicio: this.tipoServicio.value,
          retirarOficina: this.retirarOficina,
          oficina: this.oficina.value,
          seguro: this.seguro
        })
        await this.guardarguia()
        if (this.guia.error) {
          this.alerta = true
          this.alertaMsg = this.guia.error
        }
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = error
      } finally {
        this.generandoGuia = false
        this.loading2 = false
      }
    },
    async solicitartracking () {
      try {
        this.alertaMsg = ''
        this.generandoTracking = true
        console.log('valores para tracking', this.courier.value, this.guia.data._id, this.guia.data.guia)
        await this.$store.dispatch('data/getTracking', {
          courier: this.courier.value,
          guia_id: this.guia.data._id,
          numero_guia: this.guia.data.guia
        })
        if (this.tracking.error) {
          this.alerta = true
          this.alertaMsg = this.tracking.error
        }
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = error
      } finally {
        this.generandoTracking = false
      }
    },
    async calcularTarifa () {
      let seguro = this.dataSelected.seguro ? 1 : 0
      let modalidad = this.dataSelected.retirarOficina ? 'oficina' : 'puerta'
      this.generandoTarifa = true
      this.alertaMsg = ''
      try {
        await this.$store.dispatch('data/getTarifa', {
          courier: this.courier.value,
          ciudad: this.ciudad.value,
          cantidadPiezas: this.dataSelected.numeroPiezas,
          peso: this.dataSelected.peso,
          seguro: seguro,
          valor: this.dataSelected.valor,
          tipoTarifa: this.dataSelected.tipoServicio,
          modalidadTarifa: modalidad,
          oficina: this.oficina.value
        })
        if (this.tarifa.error) {
          this.alerta = true
          this.alertaMsg = this.tarifa.error
        } else {
          this.tarifaModal = true
        }
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = error
      } finally {
        this.generandoTarifa = false
      }
    },
    async solicitarPdfGuia () {
      try {
        this.alertaMsg = ''
        this.generandoPdfGuia = true
        await this.$store.dispatch('data/generatePdfGuia', {
          courier: this.courier.value,
          guia_id: this.guia.data._id,
          numero_guia: this.guia.data.guia
        })
        if (this.pdfGuia.error) {
          this.alerta = true
          this.alertaMsg = this.pdfGuia.error
        } else {
          this.pdfModal = true
        }
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = error
      } finally {
        this.generandoPdfGuia = false
      }
    },
    limpiar () {
      this.$store.commit('data/initDatos')
      this.loading = true
      this.alerta = false
      this.tarifaModal = false
      this.pdfModal = false
      this.alertaMsg = ''
      this.generandoGuia = false
      this.generandoTracking = false
      this.generandoTarifa = false
      this.generandoPdfGuia = false
      this.limpiando = false
      this.courier = ''
      this.estado = ''
      this.ciudad = ''
      this.municipio = ''
      this.parroquia = ''
      this.oficina = ''
      this.errorValidacion = false
      this.mensajeError = null
      this.dense = false
    }

  }
}
</script>
<style scoped>
    .formulario>*{
        min-width: 300px ;
    }
</style>
