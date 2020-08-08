<template>
  <div>
    <gmap-autocomplete v-if="!readOnly" class="introInput" @place_changed="(e) => addMark({ latLng: { lat: e.geometry.location.lat(), lng: e.geometry.location.lng()}})" >
                    <template v-slot:input="slotProps">
                        <q-input outlined
                                      prepend-inner-icon="place"
                                      placeholder="Buscar"
                                      ref="input"
                                      v-on:listeners="slotProps.listeners"
                                      v-on:attrs="slotProps.attrs">
                        </q-input>
                    </template>
        </gmap-autocomplete>  <q-btn v-if="!readOnly" @click="geolocalize" color="white" text-color="black" label="Localizarme" />
    <gmap-map
      :center="centerClone"
      :zoom="12"
      style="width:100%;  height: 300px;"
      @click="addMark"
      :options="{
   zoomControl: true,
   mapTypeControl: true,
   scaleControl: false,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
   disableDefaultUI: false
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

Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAiUb3VghW0YlWkGkx-nNbG_tLm3tKDnDM',
    libraries: 'places'
  }
})
export default {
  props: ['markers', 'center', 'readOnly'],
  name: 'GoogleMap',
  data () {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      places: [],
      currentPlace: null,
      markersClone: Array.from(this.markers),
      centerClone: this.center
    }
  },

  mounted () {
    this.geolocate()
    this.$nextTick(() => {
      console.log({ ref: this.$refs })
      this.opensearch = true
    })
  },

  methods: {
    addMark (e) {
      console.log({ e })
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
      }
    },
    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.centerClone = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
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

<style lang="sass" >
.pac-container
 z-index: 99999999 !important
</style>
