<template>
  <div>
    <gmap-map :center="centerClone" :zoom="12" style="width: 100%; height: 500px">
      <gmap-polygon :draggable="true" :paths="paths" :editable="true" @paths_changed="updateEdited($event)">
      </gmap-polygon>
      <gmap-polygon :paths="paths" >
      </gmap-polygon>
    </gmap-map>
    {{isit}} {{centerClone}} {{paths}}
    <ul v-if="edited" @click="edited = null">
      <li v-for="(path, index) in edited" :key="index">
        <ol>
          <li v-for="(point, indx) in path" :key="indx">
            {{point.lat}}, {{point.lng}}
          </li>
        </ol>
      </li>
    </ul>
     <q-btn color="white" text-color="black" @click="getpoint" label="Standard" />
  </div>
</template>

<script>
import Vue from 'vue'
import * as GmapVue from 'gmap-vue'
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
      isit: '',
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      edited: null,
      paths: [],
      google: window.google,
      places: [],
      currentPlace: null,
      markersClone: this.markers.length ? Array.from(this.markers) : [{ position: '' }],
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
    updateEdited (mvcArray) {
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
    },
    getpoint () {
      var triangle = new google.maps.Polygon({ paths: this.edited })
      var point = new google.maps.LatLng(this.markersClone)
      if (isNaN(point.lat)) {
        return
      }
      this.isit = google.maps.geometry.poly.containsLocation(point,
        triangle)
    },
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
          let a = 0.1
          this.paths = [ { lat: this.centerClone.lat + a, lng: this.centerClone.lng + a }, { lat: this.centerClone.lat - a, lng: this.centerClone.lng + a }, { lat: this.centerClone.lat - a, lng: this.centerClone.lng - a }, { lat: this.centerClone.lat + a, lng: this.centerClone.lng - a } ]
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

<style lang="sass" >
.pac-container
 z-index: 99999999 !important
</style>
