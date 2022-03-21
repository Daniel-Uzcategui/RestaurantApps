<template>
    <div>
        <div class="row">
            <q-form class="q-gutter-md formulario row">
                <div class="col-2">
                    <q-select v-model="courier" :options="couriersList" label="Couriers" @blur="actualizarCourier()"  @change="actualizarCourier()"/>
                </div>
                <div class="col-2">
                    <q-select v-model= "estado" :options="estadosList" label="Estado" @blur="actualizarEstado()"  @change="actualizarEstado()" :disable="estadosList.length<=0 ? true : false"/>
                </div>
                <div class="col-2">
                    <q-select v-model="ciudad" :options="ciudadesList" label="Ciudad" @blur="actualizarCiudad()" :disable="ciudadesList.length<=0 ? true : false"  />
                </div>
                <div class="col-2">
                    <q-select v-model="municipio" :options="municipiosList" label="Municipio" @blur="actualizarMunicipio()" :disable="municipiosList.length<=0 ? true : false"/>
                </div>
                <div class="col-2">
                    <q-select v-model="parroquia" :options="parroquiasList" label="Parroquia" @blur="actualizarParroquia()" :disable="parroquiasList.length<=0 ? true : false"/>
                </div>
                <div class="col-2">
                    <q-select v-model="oficina" :options="oficinasList" label="Oficina" @blur="actualizarOficina()" :disable="oficinasList.length<=0 || isLiberty ? true : false"/>
                </div>
                <div class="col-12"></div>
                                <div class="col-2">
                    <q-input v-model="numeroPiezas" type="number" label="Número de Piezas" />
                </div>
                <div class="col-2">
                    <q-input v-model="peso" type="number" label="Peso" />
                </div>

                <div class="col-2">
                    <q-input v-model="valor" type="number" label="Valor" />
                </div>
                <div class="col-2">
                    <q-input v-model="tipoServicio" label="Tipo de Servicio" />
                </div>
                <div class="col-2">
                    <q-toggle v-model="retirarOficina" label="Retirar en la Oficina" :disable="isLiberty ? true:false" />
                </div>
                <div class="col-2">
                    <q-toggle v-model="seguro" label="Seguro" />
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

            <q-btn :loading="generandoTarifa" color="primary" @click="generarTarifa()" style="width: 150px" class="q-ma-sm">
                Tarifa
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
import validarDatos from '../../middleware/validateData'
import { mapState } from 'vuex'
export default {
  name: 'couriers',
  components: {
  },
  data () {
    return {
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
      isLiberty: false,
      taficacompleto: {}

    }
  },
  computed: {
    ...mapState('data', [
      'couriersList',
      'estadosList',
      'ciudadesList',
      'municipiosList',
      'parroquiasList',
      'oficinasList',
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
  mounted () {
    this.getCouriers()
    this.$store.commit('data/initTracking')
  },

  methods: {
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
      this.oficina = null
      this.$store.dispatch('data/loadOficinas', this.ciudad)
    },
    actualizarOficina () {
      this.$store.commit('data/updateOficina', this.oficina)
    },
    generarGuia () {
      validarDatos(this)
      if (!this.errorValidacion) {
        this.cargarDatos()
        this.solicitarGuia()
      }
    },
    generarTarifa () {
      /* if (!this.guia.ok) {
        this.generarGuia()
      } */
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
        tipoEnvio: this.tipoEnvio,
        valor: this.valor,
        tipoServicio: this.tipoServicio,
        retirarOficina: this.retirarOficina,
        seguro: this.seguro
      })
    },

    async solicitarGuia () {
      try {
        this.alertaMsg = ''
        this.generandoGuia = true
        await this.$store.dispatch('data/generateGuia', {
          courier: this.dataSelected.courier.value,
          estado: this.dataSelected.estado.value,
          ciudad: this.dataSelected.ciudad.value,
          municipio: this.dataSelected.municipio.value,
          parroquia: this.dataSelected.parroquia.value,
          destinatario: this.dataSelected.destinatario,
          contacto: this.dataSelected.contacto,
          cirif: this.dataSelected.cirif,
          telefono: this.dataSelected.telefono,
          direccion: this.dataSelected.direccion,
          inmueble: this.dataSelected.inmueble,
          descripcionPaquete: this.dataSelected.descripcionPaquete,
          referencia: this.dataSelected.referencia,
          numeroPiezas: this.dataSelected.numeroPiezas,
          peso: this.dataSelected.peso,
          tipoEnvio: this.dataSelected.tipoEnvio,
          valor: this.dataSelected.valor,
          tipoServicio: this.dataSelected.tipoServicio,
          retirarOficina: this.dataSelected.retirarOficina,
          oficina: this.dataSelected.oficina.value,
          seguro: this.dataSelected.seguro
        })
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
      }
    },
    async solicitartracking () {
      try {
        this.alertaMsg = ''
        this.generandoTracking = true
        await this.$store.dispatch('data/getTracking', {
          courier: this.dataSelected.courier.value,
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
      let modalidad = this.retirarOficina ? 'oficina' : 'puerta'
      this.generandoTarifa = true
      this.alertaMsg = ''
      try {
        await this.$store.dispatch('data/getTarifa', {
          courier: this.courier.value,
          ciudad: this.ciudad.value,
          cantidadPiezas: this.numeroPiezas,
          peso: this.peso,
          seguro: seguro,
          valor: this.valor,
          tipoTarifa: this.tipoServicio,
          modalidadTarifa: modalidad,
          oficina: this.oficina.value
        })

        if (this.tarifa.error) {
          this.alerta = true
          this.alertaMsg = this.tarifa.error
        } else {
          this.tarifaModal = true
          this.taficacompleto = {
            tarifa: this.tarifa.data,
            tarifaOrden: {
              // courier: this.courier.label,
              courier: this.courier,
              estado: this.estado,
              ciudad: this.ciudad,
              municipio: this.municipio,
              parroquia: this.parroquia,
              cantidadPiezas: this.numeroPiezas,
              peso: this.peso,
              seguro: seguro,
              valor: this.valor,
              tipoTarifa: this.tipoServicio,
              modalidadTarifa: modalidad,
              oficina: this.oficina,
              status: 'enviar'
            }
          }
          this.$emit('tarifa-done', this.taficacompleto)
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
          courier: this.dataSelected.courier.value,
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
