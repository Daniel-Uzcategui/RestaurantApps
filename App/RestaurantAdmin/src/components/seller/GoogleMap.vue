<template>
  <div>
    <gmap-autocomplete ref="gmapAutocomplete" :position.sync="markersClone[0].position" v-if="!readOnly" class="introInput" @place_changed="(e) => {consoleme(e); addMark({ latLng: { lat: e.geometry.location.lat(), lng: e.geometry.location.lng()}})}" >
                    <template v-slot:input="slotProps">
                        <q-input filled outlined
                                      prepend-inner-icon="place"
                                      placeholder="Buscar"
                                      ref="input"
                                      v-on:listeners="slotProps.listeners"
                                      v-on:attrs="slotProps.attrs">
                        </q-input>
                    </template>
        </gmap-autocomplete>  <div class="column items-center q-pa-md"><q-btn v-if="!readOnly" @click="geolocalize" color="white" text-color="black" no-caps rounded label="Localizarme" /></div>
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
   disableDefaultUI: true
 }"
    >
    <gmap-polygon v-if="poly" :paths="poly" :options="{ clickable: false }" :draggable="false" :clickable="false" :editable="false" />
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
/* eslint-disable no-undef */
Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyCM_ORgfn8E1W6pFQQ-2HTAuZ9KcundblI',
    libraries: 'places'
  }
})
export default {
  props: ['markers', 'center', 'readOnly', 'poly'],
  name: 'GoogleMap',
  data () {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      google: window.google,
      places: [],
      currentPlace: null,
      markersClone: this.markers.length ? Array.from(this.markers) : [{ position: { lat: 0, lng: 0 } }],
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
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ 'latLng': e.latLng }, (result, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.$refs.gmapAutocomplete.$refs.input.value = result[0].formatted_address
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
            this.$refs.gmapAutocomplete.$refs.input.value = result[0].formatted_address
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
    markersClone (e) {
      this.$emit('update-mark', e)
    }
  }
}
</script>

<style lang="stylus" >
.pac-container
 z-index: 99999999 !important
</style>
