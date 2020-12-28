<template>
  <div style="min-width: 320px" :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card style="border-radius: 28px" >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Agregar Sedes</div>
          <div>
            <q-btn v-if="!quickAdded" class="header-btn" flat color="white" push label="Agregar" @click="agregar" icon="fas fa-plus"/>
            <q-btn v-if="quick" class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/localization/index')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <div class="row justify-between">
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-input rounded
          v-model="name"
          type="text"
          float-label="Float Label"
          placeholder="Nombre de la Sede"
          ref="name"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Nombre de la Sede']"/>
        </div>
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <q-select rounded v-model="status" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Estatus" />
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="q-pa-md col-xs-12 col-sm-6 col-md-5 col-lg-4">
          <google-map
                :center="localizacion_sede"
                :markers="localizacion_sede"
                :readOnly="false"
                @update-mark="(e) => { localizacion_sede = e.position; address = e.address }" />
        </div>
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-5 col-lg-5">
            <q-input rounded v-model="address" filled type="textarea"
            placeholder="Dirección"
            :rules="[ val => val && val.length > 0 || '*Requerido el campo de dirección']"  />
        </div>
        <div class="flex-break q-py-md "></div>
         <div class="q-pa-md col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div class="col-3">
            <label>Tipo de Servicios</label>
            </div>
            <div class="div-typeServices">
              <q-checkbox v-model="PickUP"  dense label="Pick-up" color="teal" class="typeServices" />
              <q-checkbox v-model="Delivery" dense label="Delivery" color="orange" class="typeServices" />
              <q-checkbox v-model="Inlocal" dense label="En local" color="red" class="typeServices" />
            </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-show="Inlocal">
          <q-input rounded v-model="tables" outlined  type="text" float-label="Float Label" placeholder="Mesas" />
        </div>
         <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-show="Inlocal">
          <q-input rounded v-model="capacity" outlined type="text" float-label="Float Label" placeholder="Capacidad" />
        </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
     <q-card style="border-radius: 28px" v-if="Delivery">
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Zonas de delivery (Opcional)</div>
       </q-card-section>
       <q-card-section class="column items-center">
        <gzones v-model="deliveryZone" />
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
          Los siguientes campos son requeridos
          {{messageError}}
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</template>
<script>
import { GeoPoint } from '../../services/firebase/db.js'
import { mapActions } from 'vuex'
import * as GmapVue from 'gmap-vue'
import Vue from 'vue'
/* eslint-disable no-undef */
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAKdg_8yzT05nhZDrFRu4viy2-K-4KXIJQ',
    libraries: 'places'
  }
})
export default {
  props: {
    quick: {
      type: Boolean,
      default: () => true
    }
  },
  components: {
    gzones: require('../../components/GmapZones').default,
    GoogleMap: require('../../components/GoogleMap.vue').default
  },
  data () {
    return {
      validationError: false,
      name: '',
      quickAdded: false,
      tables: '',
      capacity: '',
      status: 0,
      deliveryZone: null,
      PickUP: true,
      Delivery: true,
      Inlocal: false,
      address: '',
      messageError: [],
      localizacion_sede: [],
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ],
      typeServices_options: [
        'Pick-up', 'Delivery', 'In local'
      ],
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: []
    }
  },
  methods: {
    ...mapActions('localization', ['addLoc']),
    agregar () {
      if (this.localizacion_sede.length === 0 || this.name.length === 0 || this.address.length === 0) {
        this.messageError = []
        if (this.localizacion_sede.length === 0) {
          this.messageError.push(' Localización ')
        }
        if (this.name.length === 0) {
          this.messageError.push(' Nombre de la Sede ')
        }
        if (this.address.length === 0) {
          this.messageError.push(' Dirección ')
        }
        this.validationError = true
        return
      }
      this.$q.loading.show()
      const loc = JSON.parse(JSON.stringify(this.localizacion_sede[0]))
      const payload = {
        name: this.name,
        deliveryZone: this.deliveryZone,
        tables: this.tables,
        status: this.status,
        capacity: this.capacity,
        address: this.address,
        localizacion_sede: new GeoPoint(loc.position.lat, loc.position.lng),
        PickUP: this.PickUP,
        Delivery: this.Delivery,
        Inlocal: this.Inlocal
      }
      this.addLoc(payload).then(e => {
        this.$q.loading.hide(); if (this.quick) { this.$router.replace('/localization/index') }
        this.quickAdded = true
        this.$emit('done', true)
      })
    }
  },
  mounted () {
    this.$refs.name.focus()
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
.filled
  padding-top: 50px
.header-cell
  padding-left: 30px
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
.div-typeServices
 padding-top: 20px
.typeServices
 padding-left: 10px
.pac-container
 z-index: 99999999 !important
 </style>
