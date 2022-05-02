<template>
    <div>
        <div class="row col-12" >
            <q-form class="q-gutter-md formulario row">
                <div class="col-12">
                    <q-select v-model="courier" :options="couriersList" label="Couriers" />
                </div>

                <div class="col-12">
                    <q-input v-model="guiaNro" label="Nro de guía" />
                </div>
                  <div class="col-12">
                    <q-input v-model="guiaId" label="Id Guia" />
                </div>
            </q-form>
        </div>

       <div class="row q-ma-md">
            <q-btn :loading="generandoTracking" color="primary" @click="generarTracking()" style="width: 150px">
                Buscar
                <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Loading...
                </template>
            </q-btn>
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
       </div>
      <div class="row col-12 q-py-md">
        <q-badge class="col-2" color="red" v-if="errorList">
            {{errorList}}
        </q-badge>
      </div>
              <br>
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

      <br>

    </div>

</template>

<script>
import { mapState } from 'vuex'
// import { defineComponent } from 'vue'

export default ({
  name: 'trackingDatos',
  components: {
  },
  data () {
    return {
      loading: true,
      alerta: false,
      tarifaModal: false,
      alertaMsg: '',
      limpiando: false,
      courier: '',
      guiaId: '',
      guiaNro: '',
      generandoTracking: false,
      mensajeError: null,
      dense: false
    }
  },
  computed: {
    ...mapState('data', [
      'couriersList',
      'tracking',
      'errorList'
    ])
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
    generarTracking () {
      if (!this.courier || !this.guiaNro) {
        this.alerta = true
        this.alertaMsg = 'Completar los Datos'
      } else {
        this.solicitartracking()
      }
    },
    async solicitartracking () {
      try {
        this.alertaMsg = ''
        this.generandoTracking = true
        await this.$store.dispatch('data/getTracking', {
          courier: this.courier.value,
          guia_id: this.guiaId,
          numero_guia: this.guiaNro
        })
        if (this.tracking.error) {
          this.alerta = true
          this.alertaMsg = 'Opcion no Disponible'
        }
        console.log('Data:', this.tracking)
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = 'Opcion no Disponible'
      } finally {
        this.generandoTracking = false
      }
    }
  }

})
</script>
