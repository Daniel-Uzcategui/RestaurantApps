<template>
<div>
  <div>
    <div :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <q-btn-group rounded spread class="full-width">
      <q-btn v-if="localZones.length !== 0" no-caps color="secondary" @click="dialog = true; dialogType = 'visual'; setDialog()" icon="search" />
      <q-btn no-caps color="secondary" @click="dialog = true; dialogType = 'new'; newAddDialog()" icon="add" />
      <q-btn v-if="localZones.length !== 0" no-caps color="secondary" icon="remove" @click="deleteLocalZones({id: value})" />
    </q-btn-group>
    <div class="row justify-center q-pa-md">
      <q-spinner-cube class="col" v-if="loading && (typeof noload === 'undefined' || noload === null)" size="lg" color="primary" />
      <p v-if="localZones.length === 0 && !loading" class="text-h4 text-center col">No existe un mapa de Zonas de Entrega asociadas</p>
    </div>
    <q-option-group
      :value="value"
      @input="(e) => $emit('input', e)"
      :options="localZonesRadio"
      color="primary"
    />
  </div>
  <q-dialog
  style="z-index: 9999999"
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card
    style="width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          :class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 2001" dense flat icon="fas fa-chevron-left" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
    <q-card-section @click.prevent class="q-pt-none q-pa-md">
    <gmap-map :center="center" :options="{ styles: styles }" :zoom="12" style="width: 100%; height: 500px">
      <gmap-polygon :options="{ strokeColor:'#' + colors[index]}" v-for="(polypath, index) in path" :key="index" :draggable="true" :paths="polypath" :editable="true" @click="clickedPoly(index)" @paths_changed="updateEdited($event, index)" />
    </gmap-map>
    <div class="row justify-center">
    <q-btn label="Añadir Zona" class="q-ma-md" rounded @click="addPoly()"></q-btn>
    <q-btn label="Eliminar Zona" class="q-ma-md" rounded @click="rmPoly()"></q-btn>
    </div>
    </q-card-section>
      <q-card-section class="q-pt-none q-pa-md">
        <q-form
          ref="addrs"
          class="q-gutter-md"
        >
      <div class="column items-center">
        <q-input class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="alias" label="Alias de Mapa" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
          <div class="col-12 row justify-center">
            <div class="q-pa-md" v-for="(zone, index) in zones" :key="index" >
              <q-input class="q-pb-md" :value="zone.alias" @input="(e) => zone.alias = e" ref="zonealias" rounded outlined :label="'Zona ' + index + ' Alias'" />
              <q-input rounded outlined :value="zone.price" @input="(e) => zone.price = parseInt(e)" type="number" :label="'Zona ' + index + ' Costo delivery'" />
            </div>
          </div>
      </div>
    </q-form>
    </q-card-section>
    <q-card-actions align="around">
        <q-btn color="secondary" v-close-popup no-caps rounded >Cancelar</q-btn>
        <q-btn color="primary" no-caps rounded @click="$refs.addrs.validate().then(e => { if (e) {
          if (alias !== null) {
            confirm()
            } else {
            showNotif()
          }
          }})">Guardar</q-btn>
      </q-card-actions>
       </q-card>
  </q-dialog>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import * as GmapVue from 'gmap-vue'
/* eslint-disable no-undef */
var styles = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#212121'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#212121'
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#bdbdbd'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#181818'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#1b1b1b'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#2c2c2c'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#8a8a8a'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#373737'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#3c3c3c'
      }
    ]
  },
  {
    'featureType': 'road.highway.controlled_access',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#4e4e4e'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#000000'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#3d3d3d'
      }
    ]
  }
]
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAKdg_8yzT05nhZDrFRu4viy2-K-4KXIJQ',
    libraries: 'places'
  }
})
import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['value', 'noload', 'readOnly', 'addressPickup', 'addressShipping'],
  computed: {
    ...mapGetters('localization', ['localZones']),
    ...mapGetters('user', ['currentUser']),
    localZonesRadio () {
      return this.localZones.map(x => {
        return {
          value: x.id,
          label: x.alias
        }
      })
    },
    path: {
      get () {
        if (!this.paths.length) {
          let a = 0.05
          return [[ { lat: this.center.lat + a, lng: this.center.lng + a }, { lat: this.center.lat - a, lng: this.center.lng + a }, { lat: this.center.lat - a, lng: this.center.lng - a }, { lat: this.center.lat + a, lng: this.center.lng - a } ]]
        } else {
          return this.paths
        }
      },
      set (e) {
        this.paths = e
      }
    }
  },
  methods: {
    ...mapActions('localization', ['bindLocalZones', 'addLocalZones', 'updateLocalZones', 'deleteLocalZones']),
    clickedPoly (e) {
      this.selectedPoly = e
      this.$refs.zonealias[e].focus()
    },
    addPoly () {
      let point = this.path[0][0]
      let a = 0.05
      let newPath = [{ lat: point.lat + a, lng: point.lng + a }, { lat: point.lat - a, lng: point.lng + a }, { lat: point.lat - a, lng: point.lng - a }, { lat: point.lat + a, lng: point.lng - a }]
      this.paths.push(newPath)
      this.zones.push({ alias: '', price: 0 })
      this.$forceUpdate()
    },
    rmPoly () {
      if (this.selectedPoly === null) { return }
      this.paths.splice(this.selectedPoly, 1)
      this.zones.splice(this.selectedPoly, 1)
      this.$forceUpdate()
    },
    consoleme (e) {
      console.log(e)
    },
    getPosition () {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    updateEdited (mvcArray, index) {
      let paths = []
      for (let i = 0; i < mvcArray.getLength(); i++) {
        let path = []
        for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {
          let point = mvcArray.getAt(i).getAt(j)
          path.push({ lat: point.lat(), lng: point.lng() })
        }
        paths.push(path)
      }
      this.edited = paths
      this.paths[index] = paths[0]
      this.$forceUpdate()
    },
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar la ubicación en el mapa`,
        color: 'red',
        actions: [
          { label: 'X', color: 'white' }
        ]
      })
    },
    confirm () {
      this.newAddress()
      this.dialog = false
    },
    newAddress () {
      this.dialogType === 'new' ? this.addLocalZones({
        paths: JSON.stringify(this.path),
        status: 1,
        alias: this.alias,
        zones: this.zones }) : this.updateLocalZones({
        id: this.id,
        paths: JSON.stringify(this.path),
        alias: this.alias,
        zones: this.zones })
      this.$forceUpdate()
    },
    setDialog () {
      this.readAddr = true
      if (this.value === null) { this.dialog = false; return }
      const obj = this.localZones.find(x => x.id === this.value)
      this.alias = obj.alias
      this.paths = JSON.parse(obj.paths)
      this.center = this.paths[0][0]
      this.id = obj.id
      this.zones = obj.zones
      this.$forceUpdate()
    },
    newAddDialog () {
      this.id = null
      this.alias = null
      this.paths = []
      this.paths = Array.from(this.path)
      this.zones = [{ alias: '', price: 0 }]
      this.$forceUpdate()
    }
  },
  async mounted () {
    var binded = await this.bindLocalZones()
    if (binded) {
      this.loading = false
    }
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
  },
  watch: {
    loading () {
      this.$emit('stoploading', true)
    }
  },
  data () {
    return {
      styles: styles,
      colors: ['fb5276', 'd7124e', 'dc388c', 'bad481', '3434aa', '455005', '5a10ce', '59cc30', '7be3dc', '517160'],
      selectedPoly: null,
      edited: null,
      paths: [],
      zones: [],
      contact: '',
      phone: '',
      readAddr: false,
      addressOpt: [],
      addressIn: {},
      loading: true,
      id: null,
      dialogType: null,
      alias: null,
      puntoRef: null,
      maximizedToggle: true,
      dialog: false,
      center: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 },
      places: [],
      options: [],
      estado: null,
      urb: null,
      ciudad: null,
      municipio: null,
      calle: null,
      domicilio: null,
      translationJson: {
        Venezuela: {
          country: 'País',
          postal_code: 'Código Postal',
          administrative_area_level_1: 'Estado',
          administrative_area_level_2: 'Municipio',
          locality: 'Ciudad',
          route: 'Calle/Avenida',
          premise: 'Domicilio',
          political: 'Urbanización',
          street_number: '# de Calle'
        },
        Panamá: {
          country: 'País',
          postal_code: 'Código Postal',
          administrative_area_level_1: 'Provincia',
          administrative_area_level_2: 'Localización',
          locality: 'Ciudad',
          route: 'Calle/Avenida',
          premise: 'Domicilio',
          political: 'Urbanización',
          street_number: '# de Calle'
        }
      }
    }
  }
}
</script>
