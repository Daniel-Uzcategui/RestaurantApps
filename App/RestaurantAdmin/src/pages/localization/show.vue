<template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Editar Sedes</div>
          <div>
            <q-btn class="header-btn" flat color="white" push  icon="arrow_back" @click="back"/>
            <!-- <q-btn class="header-btn" flat color="white" push  icon="update" v-if="false" @click="saveLocation"/> -->
          </div>
       </q-card-section>
       <q-card-section class="row justify-between" v-if="typeof localization !== 'undefined'">
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-input filled rounded outlined label="Sede" :value="localization.name"
          @input="(e) => saved(e, this.$route.query.Localization_Id, 'name')"
          type="text" float-label="Float Label"
          placeholder="Nombre de la Sede"
          />
        </div>
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-select options-selected-class="text-blue" filled rounded outlined map-options emit-value standout="bg-teal "
          :value="localization.status"
          @input="(e) => saved(e, this.$route.query.Localization_Id, 'status')"
          :options="estatus_options" />
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-6">
           <google-map
                :center="center"
                :markers="markers"
                :readOnly="false"
                @update-mark="(e) => { saveGeoPoint(e.position, this.$route.query.Localization_Id, 'localizacion_sede'); saved(e.address, this.$route.query.Localization_Id, 'address') }" />
        </div>
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-5">
          <label>Dirección</label>
         <q-input filled rounded outlined :value="localization.address"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'address')" type="textarea" placeholder="Dirección"  />
      </div>
      <div class="flex-break q-py-md "></div>
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div class="col-3">
            <label>Tipo de Servicios</label>
            <div class="label-error" v-if="config && config.statusPickup === 0 && config.statusDelivery === 0 && config.statusInlocal === 0 && config.statusEncomienda === 0">Tipo de Servicios no disponibles </div>
            </div>
            <div class="div-typeServices">
              <q-checkbox v-if="config && config.statusPickup"  dense label="Pick-up" color="teal" class="typeServices"  :value="localization.PickUP" @input="(e) => saved(e, this.$route.query.Localization_Id, 'PickUP')" />
              <q-checkbox v-if="config && config.statusDelivery" dense label="Delivery" color="orange" class="typeServices" :value="localization.Delivery" @input="(e) => saved(e, this.$route.query.Localization_Id, 'Delivery')" />
              <q-checkbox v-if="config && config.statusInlocal" dense label="En local" color="red" class="typeServices" :value="localization.Inlocal" @input="(e) => saved(e, this.$route.query.Localization_Id, 'Inlocal')" />
              <q-checkbox v-if="config && config.statusEncomienda"  dense label="Encomienda" color="teal" class="typeServices"  :value="localization.Encomienda" @input="(e) => saved(e, this.$route.query.Localization_Id, 'Encomienda')" />
              <q-checkbox dense label="Orden de Compra" color="red" class="typeServices" :value="localization.statusSeller" @input="(e) => beforeSaved(e, this.$route.query.Localization_Id, 'statusSeller')" />
            </div>
        </div>
        <div v-if="config && config.statusInlocal">
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-3" v-show="localization.Inlocal">
          <q-input filled rounded outlined :value="localization.tables"
          type="number"
          label="Mesas"
          float-label="Float Label"
          @input="(e) => saved(parseInt(e), this.$route.query.Localization_Id, 'tables')"
          class="label-width"/>
        </div>
        </div>
        <div v-if="config && config.statusInlocal">
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-3 col-lg-3"  v-show="localization.Inlocal">
          <q-input filled rounded outlined :value="localization.capacity"
          type="numbery"
          label="Capacidad"
          float-label="Float Label"
          @input="(e) => saved(parseInt(e), this.$route.query.Localization_Id, 'capacity')"
          />
        </div>
       </div>
 <div v-if="config && config.statusEncomienda">
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-3 col-lg-3"  v-show="localization.Encomienda">
          <q-input filled rounded outlined v-model="pesoDefaults"
          type="numbery"
          label="Peso Defaults"
          float-label="Float Label"
          @input="guardarpeso()"
          />
        </div>
       </div>
     </q-card-section>
     </q-card>
     <q-card class="q-cardGlass" v-if="config && config.statusDelivery && localization.Delivery">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Zonas de delivery (Opcional)</div>
       </q-card-section>
       <q-card-section class="column items-center">
        <gzones :value="localization.deliveryZone" @input="(e) => saved(e, this.$route.query.Localization_Id, 'deliveryZone')" />
      </q-card-section>
     </q-card>
  </div>
  <q-dialog v-model="validationError">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <q-card-section>
          El campo {{messageError}} es requerido
        </q-card-section>
      </q-card>
    </q-dialog>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { GeoPoint } from '../../services/firebase/db.js'
import * as GmapVue from 'gmap-vue'
import Vue from 'vue'
/* eslint-disable no-undef */
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyCM_ORgfn8E1W6pFQQ-2HTAuZ9KcundblI',
    libraries: 'places'
  }
})
export default {
  components: {
    gzones: require('../../components/GmapZones').default,
    GoogleMap: require('../../components/GoogleMap.vue').default
  },
  data () {
    return {
      deliveryZone: null,
      tables: '',
      capacity: '',
      encomienda: '',
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ],
      PickUP: false,
      Delivery: false,
      Inlocal: false,
      Encomienda: false,
      pesoDefaults: '',
      center: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 },
      marker: [{ position: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 } }],
      places: [],
      currentPlace: null,
      validationError: false,
      messageError: []
    }
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs', 'configs2']),
    markers: {
      get () {
        if (this.localization && this.localization.localizacion_sede) {
          return [{ position: { 'lat': this.localization.localizacion_sede.latitude, 'lng': this.localization.localizacion_sede.longitude } }]
        } else {
          return [{ position: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 } }]
        }
      },
      set (e) {
        this.marker = e
      }
    },
    config () {
      return this.configs.find(obj => {
        return obj.source === 'paymentServ'
      })
    },
    localization () {
      return this.localizations.find(obj => {
        return obj.id === this.$route.query.Localization_Id
      })
    }
  },
  created () {
    this.bindConfigs()
  },
  async mounted () {
    if (!this.configs2.length) {
      await this.bindpaymentsev()
    }

    this.markers = [{ position: { 'lat': this.localization.localizacion_sede.latitude, 'lng': this.localization.localizacion_sede.longitude } }]
    this.center = { 'lat': this.localization.localizacion_sede.latitude, 'lng': this.localization.localizacion_sede.longitude }
    console.log({ mark: this.markers })
    this.pesoDefaults = this.configs2.pesoDefault
    console.log('el peso por defaults', this.pesoDefaults)
  },
  methods: {
    ...mapActions('localization', ['saveLocation']),
    ...mapActions('config', ['bindConfigs', 'saveConfig', 'saveConfig2', 'bindpaymentsev']),
    beforeSaved (value, id, key) {
      if (!value) {
        return this.saved(value, id, key)
      }
      this.$q.dialog({
        message: '¿Desea activar orden de compra? Esto activará las funcionalidades de reporteria y configuración para clientes corporativos, esta funcionalidad necesita que configure un usuario como tipo vendedor, diríjase a configuracion Usuarios y cambie el tipo de aplicacion del usuario cual desea como vendedor ',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.saved(value, id, key)
        this.saveConfig({ value: 1, id: 'paymentServ', key }).catch(e => console.log(e))
      })
    },
    guardarpeso () {
      console.log('el valor del id', this.config)
      console.log('el valor del peso', this.pesoDefaults)
      if (this.pesoDefaults !== '') {
        this.saveConfig2({
          id: this.config.id,
          pesoDefault: this.pesoDefaults })
      }
    },
    saved (value, id, key) {
      console.log(value, id, key)
      if (value.length === 0) {
        this.messageError = []
        if (key === 'name') {
          this.messageError.push(' Nombre de la Sede ')
        }
        if (key === 'address') {
          this.messageError.push(' Dirección ')
        }
        if (this.localization.Inlocal) {
          if (key === 'tables' || this.localization.tables === 0) {
            this.messageError.push(' Mesa ')
          }
          if (key === 'capacity') {
            this.messageError.push(' capacidad ')
          }
        }
        this.validationError = true
        return
      }
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveLocation({ value, id, key })
    },
    saveGeoPoint (valu, id, key) {
      const loc = JSON.parse(JSON.stringify(valu[0]))
      const value = new GeoPoint(loc.position.lat, loc.position.lng)
      console.log(value)
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveLocation({ value, id, key })
    },
    back () {
      this.$router.replace('/localization/index')
    }
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute
  right: 10px !important
.header-btn-back
  position: absolute
  right: 120px !important
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
.filled
  padding-top: 50px
.div-typeServices
 padding-top: 20px
.typeServices
 padding-left: 10px
.label-width
 width: 50%
.label-error
 color: red
</style>

<style lang="stylus" >
.pac-container
 z-index: 99999999 !important
</style>
