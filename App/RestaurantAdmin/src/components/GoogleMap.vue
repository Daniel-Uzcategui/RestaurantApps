<template>
  <div>
    <gmap-autocomplete class="introInput" @place_changed="(e) => addMark({ latLng: { lat: e.geometry.location.lat(), lng: e.geometry.location.lng()}})" >
                    <template v-slot:input="slotProps">
                        <q-input outlined
                                      prepend-inner-icon="place"
                                      placeholder="Buscar"
                                      ref="input"
                                      v-on:listeners="slotProps.listeners"
                                      v-on:attrs="slotProps.attrs">
                        </q-input>
                    </template>
        </gmap-autocomplete>
    <gmap-map
      :center="centerClone"
      :zoom="12"
      style="width:100%;  height: 400px;"
      @click="addMark"
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
  props: ['markers', 'center'],
  name: 'GoogleMap',
  data () {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      places: [],
      currentPlace: null,
      markersClone: this.markers,
      centerClone: this.center
    }
  },

  mounted () {
    this.geolocate()
  },

  methods: {
    addMark (e) {
      console.log(e)
      var clickedLocation = e.latLng
      this.centerClone = e.latLng
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
    }
  }
}
</script>
