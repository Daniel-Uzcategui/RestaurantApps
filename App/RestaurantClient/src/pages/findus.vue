<template>
  <q-page >
     <q-card flat class="menudiv full-height" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section>
        <div class="text-h5 menuTop">Encuentranos</div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <google-map
          v-if="markers.length"
          :center="center"
          :markers="markers"
          :readOnly="true" />
          </q-card-section>
          <q-card-section>
          <q-list v-for="(sede, index) in localizations" :key="index">

            <q-item>
              <q-item-section>
                <q-item-label class="text-h6">{{sede.name}}</q-item-label>
                <q-item-label class="text-h7" lines="10">{{sede.address}}</q-item-label>
                <q-item-label class="text-h7 row" v-if="isOpen(sede.id)[0]">Abierto - Cierra {{isOpen(sede.id)[1]}}
                </q-item-label>
                <q-item-label class="text-h7 text-red" v-else>Cerrado<div v-if="isOpen(sede.id)[1]"> - Abre {{isOpen(sede.id)[1]}}</div></q-item-label>
                <q-item-label v-if="sede.localizacion_sede && distances[sede.id]" class="text-h7">{{distances[sede.id].toFixed(2)}} Km</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset />
          </q-list>
       </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    GoogleMap: require('../components/GoogleMap').default
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configurations']),
    markers () {
      var mark = this.localizations.map(x => {
        return {
          position: {
            lat: x.localizacion_sede.latitude,
            lng: x.localizacion_sede.longitude
          }
        }
      })
      console.log(mark)
      return mark
    }
  },
  created () {
    this.bindLocalizations().then(e => e.forEach(el => {
      console.log({ el })
      this.distance2(el.localizacion_sede, el.id)
    })
    )
    this.bindConfigs().then(e => console.log({ config: e }))
  },
  methods: {
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindConfigs']),
    get24hrs () {
      var a = new Date()
      var hrs = a.getHours().toString().length > 1 ? `${a.getHours()}` : '0' + a.getHours()
      var mins = a.getMinutes().toString().length > 1 ? `${a.getMinutes()}` : '0' + a.getMinutes()
      return hrs + mins
    },
    isOpen (sede) {
      var isClosed = 0
      var closes = 0
      const sched = this.getTodaySchedule(sede)
      const today = parseInt(this.get24hrs())
      for (let i of sched) {
        var open = i.open !== '24hrs' ? parseInt(i.open) : 0
        var close = i.close !== '24hrs' ? parseInt(i.close) : 2400
        console.log({ open, close, today, sched })
        if (today >= open && today <= close) {
          isClosed = 1
          closes = close
          closes = this.timeFormat(closes)
          return [isClosed, closes]
        } else if (today <= close) {
          if (closes > open || closes === 0) {
            closes = open
          }
        }
      }
      closes = this.timeFormat(closes)
      return [isClosed, closes]
    },
    async distance2 (geo, sede) {
      if (typeof geo === 'undefined') { return Vue.set(this.distances, sede, 0) }
      function toRad (e) {
        return e * Math.PI / 180
      }
      return this.getPosition().then(pos => {
        var lon1 = pos.coords.longitude
        var lat1 = pos.coords.latitude
        var lon2 = geo.longitude
        var lat2 = geo.latitude
        var R = 6371 // Radius of the earth in km
        var dLat = toRad(lat2 - lat1) // Javascript functions in radians
        var dLon = toRad(lon2 - lon1)
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c // Distance in km
        console.log({ d })
        Vue.set(this.distances, sede, d)
        console.log({ kk: this.distances })
      })
    },
    getPosition () {
      return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    timeFormat (closes) {
      if (closes.toString().length === 4) {
        let first, second, hr
        first = closes.toString().slice(0, 2)
        first = (parseInt(first) % 12) || 12
        if (first === 0) { first = 12 }
        second = (closes.toString().slice(2, 4) === '00' ? '' : ':' + closes.toString().slice(2, 4))
        hr = (closes >= 1200 ? 'PM' : 'AM')
        closes = first + second + hr
      }
      if (closes.toString().length === 3) {
        closes = closes.toString().slice(0, 1) + (closes.toString().slice(1, 3) === '00' ? '' : ':' + closes.toString().slice(1, 3)) + 'AM'
      }
      return closes
    },
    getConfig (e) {
      console.log({ e: e, config: this.configurations })
      return this.configurations.find((i) => i.id === `sede${e}`)
    },
    getTodaySchedule (e) {
      const sched = this.getConfig(e)
      if (typeof sched !== 'undefined') {
        return sched.days[(this.weekdayUs[(new Date()).getDay()]).toLowerCase()]
      } else {
        return []
      }
    }
  },
  data () {
    return {
      distances: {},
      weekdayEs: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      weekdayUs: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      markup: [{
        position: { lat: 45.505834523198175, lng: -73.59815798950196 }
      }],
      center: { lat: 45.508, lng: -73.587 }
    }
  }
}
</script>
<style lang="sass" scoped>
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.totalCard
   width: 30%
.menuTop
  height: 50px
  margin-left: 10%
  padding-top: 20px
.menudiv
  overflow: hidden
  border-top-left-radius: 50px
  border-top-right-radius: 50px
  border-bottom-left-radius: 50px
  border-bottom-right-radius: 50px
</style>
