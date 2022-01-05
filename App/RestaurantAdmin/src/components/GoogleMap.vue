<template>
  <div>
    <gmap-autocomplete ref="gmapAutocomplete" :position.sync="markersClone[0].position" v-if="!readOnly" class="introInput" @place_changed="(e) => {consoleme(e); addMark({ latLng: { lat: e.geometry.location.lat(), lng: e.geometry.location.lng()}})}" >
                    <template v-slot:input="slotProps">
                        <q-input filled rounded outlined
                                      prepend-inner-icon="place"
                                      placeholder="Buscar"
                                      ref="input"
                                      :value="addFull"
                                      v-on:listeners="slotProps.listeners"
                                      v-on:attrs="slotProps.attrs">
                        </q-input>
                    </template>
        </gmap-autocomplete>  <div class="column items-center q-pa-md"><q-btn v-if="!readOnly" @click="geolocalize" color="primary" no-caps rounded label="Localizarme" /></div>
    <gmap-map
      :center="centerClone"
      :zoom="12"
      style="width:100%;  height: 300px;"
      @click="addMark"
      :options="{
   zoomControl: true,
   scaleControl: false,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
   disableDefaultUI: true,
   styles: styles
 }"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markersClone"
        :position="m.position"
        @click="centerClone=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import Vue from 'vue'
import * as GmapVue from 'gmap-vue'
var styles = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#242f3e'
      }
    ]
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#263c3f'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#6b9a76'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#38414e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#212a37'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9ca5b3'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#746855'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [
      {
        'color': '#1f2835'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#f3d19c'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2f3948'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#d59563'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#515c6d'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#17263c'
      }
    ]
  }
]
/* eslint-disable no-undef */
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAKdg_8yzT05nhZDrFRu4viy2-K-4KXIJQ',
    libraries: 'places'
  }
})
export default {
  props: ['markers', 'center', 'readOnly'],
  name: 'GoogleMap',
  data () {
    return {
      styles: styles,
      addFull: '',
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      google: window.google,
      places: [],
      currentPlace: null,
      markersClone: this.markers.length ? Array.from(this.markers) : [{ position: {} }],
      centerClone: this.center
    }
  },

  mounted () {
    console.log('mounted')
    this.geolocate()
    this.$nextTick(() => {
      // console.log({ ref: this.$refs })
      this.opensearch = true
    })
  },

  methods: {
    addMark (e) {
      // console.log({ e })
      this.centerClone = e.latLng
      var clickedLocation = e.latLng
      if (typeof this.readOnly !== 'undefined' && this.readOnly === true) { return }
      if (this.markersClone.length <= 0) {
        this.markersClone.push({
          position: clickedLocation
        })
      } else {
        this.markersClone.pop()
        this.markersClone.push({
          position: clickedLocation
        })
      }
      console.log({ mm: this.markersClone })
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ 'latLng': e.latLng }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.addFull = result[0].formatted_address
          this.$emit('address-update', result[0].address_components)
        }
      })
    },
    setPlace (place) {
      this.currentPlace = place
    },
    usePlace (place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng()
          }
        })
        this.place = null
      }
    },
    consoleme (e) {
      console.log({ e })
    },
    addMarker () {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markersClone.push({ position: marker, draggable: true })
        this.places.push(this.currentPlace)
        this.centerClone = marker
        this.currentPlace = null
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ 'latLng': marker }, (result, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            this.addFull = result[0].formatted_address
            this.$emit('address-update', result[0].address_components)
          }
        })
      }
    },
    geolocate () {
      if (this.markers && this.markers.length) {
        // console.log({ Marker: this.markers })
        this.centerClone = {
          lat: this.markers[0].position.lat,
          lng: this.markers[0].position.lng
        }
      } else {
        navigator.geolocation.getCurrentPosition(position => {
          this.centerClone = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      }
    },
    geolocalize () {
      navigator.geolocation.getCurrentPosition(position => {
        console.log({ position })
        let latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.addMark({ latLng })
      })
    }
  },
  watch: {
    markers (e) {
      this.markersClone = this.markers.length ? Array.from(e) : [{ position: {} }]
    },
    addFull (e) {
      this.$emit('update-mark', { position: this.markersClone, address: this.addFull })
    }
  }
}
</script>

<style lang="stylus" >
.pac-container
 z-index: 99999999 !important
</style>
