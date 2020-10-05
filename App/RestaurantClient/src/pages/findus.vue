<template>
  <q-page >
     <q-card flat class="menudiv full-height" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section>
        <div class="text-h5 menuTop">Encuentranos</div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-pa-md">
          <q-spinner-cube class="col" v-if="loading" size="lg" color="primary" />
        </div>
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
  mounted () {
    var el = document.querySelector('.burgericon')
    el.style.color = 'black'
    var el2 = document.querySelector('.carticon')
    el2.style.color = 'black'
    var el3 = document.querySelector('.toggleicon')
    el3.style.color = 'black'
    var el4 = document.querySelector('.q-toolbar')
    el4.style.backgroundImage = `url('data:image/svg+xml;utf8,%3Csvg%20version%3D%221.0%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20width%3D%221038.000000pt%22%20height%3D%22133.000000pt%22%20viewBox%3D%220%200%201038.000000%20133.000000%22%0A%20preserveAspectRatio%3D%22xMidYMid%20meet%22%3E%0A%0A%3Cg%20transform%3D%22translate(0.000000%2C133.000000)%20scale(0.100000%2C-0.100000)%22%0Afill%3D%22%23000000%22%20stroke%3D%22none%22%3E%0A%3Cpath%20d%3D%22M6900%201326%20c0%20-6%20-140%20-597%20-146%20-618%20-4%20-13%20-14%20-16%20-47%20-13%20-23%203%0A-175%207%20-337%2011%20-395%209%20-443%202%20-702%20-104%20-126%20-52%20-188%20-82%20-188%20-92%200%20-23%2078%0A-100%2095%20-94%208%204%2026%20-11%2045%20-38%2043%20-60%20183%20-182%20256%20-223%20149%20-85%20300%20-127%20505%0A-141%20238%20-15%20439%2042%20680%20196%20151%2096%20192%20131%20260%20223%2055%2076%2088%20158%2076%20191%20-5%0A14%20-121%2030%20-309%2042%20-54%204%20-98%208%20-98%2010%200%201%2054%20113%20119%20248%2066%20135%20122%20254%20126%0A265%204%2014%20-2%2021%20-25%2031%20-17%207%20-32%2011%20-34%209%20-2%20-2%20-59%20-127%20-127%20-278%20l-123%0A-273%20-54%205%20c-30%203%20-56%208%20-58%2010%20-3%202%2031%20144%2076%20314%2044%20171%2080%20313%2080%20317%200%203%0A-16%206%20-35%206%20-19%200%20-35%20-2%20-35%20-4z%20m-602%20-652%20c-4%20-3%20-59%20-12%20-124%20-20%20-177%0A-22%20-485%20-119%20-593%20-185%20-17%20-11%20-22%20-10%20-39%2011%20l-20%2025%2037%2020%20c46%2027%20232%20100%0A291%20116%2078%2020%20463%2049%20448%2033z%20m442%20-30%20c0%20-3%20-9%20-40%20-19%20-82%20-10%20-43%20-21%20-89%0A-25%20-103%20l-6%20-26%20-227%20-12%20c-179%20-10%20-268%20-11%20-413%20-2%20-177%2011%20-311%2025%20-375%0A38%20l-29%205%2039%2021%20c141%2072%20445%20141%20690%20156%20152%2010%20365%2013%20365%205z%20m160%20-14%20c0%20-7%0A-68%20-169%20-74%20-177%20-1%20-1%20-20%20-5%20-43%20-9%20l-41%20-6%2027%20101%2026%20101%2053%200%20c28%200%2052%0A-4%2052%20-10z%20m190%20-47%20c41%20-13%2086%20-29%2099%20-37%2023%20-13%2022%20-14%20-40%20-34%20-62%20-21%0A-249%20-55%20-256%20-48%20-2%202%2013%2038%2034%2080%2042%2086%2028%2082%20163%2039z%20m158%2010%20c28%20-8%2052%0A-18%2052%20-23%200%20-17%20-33%20-19%20-63%20-3%20-18%209%20-57%2024%20-87%2034%20l-55%2018%2050%20-5%20c28%20-3%2074%0A-13%20103%20-21z%20m106%20-45%20c-13%20-44%20-95%20-146%20-147%20-185%20-84%20-63%20-85%20-61%20-7%2033%2073%0A88%20151%20174%20158%20174%202%200%200%20-10%20-4%20-22z%20m-149%20-67%20c-6%20-5%20-65%20-28%20-133%20-50%20-205%0A-69%20-472%20-95%20-752%20-72%20l-85%207%2060%206%20c33%204%20119%2010%20190%2014%20182%208%20512%2050%20625%2078%0A52%2013%2097%2024%20100%2025%202%201%200%20-3%20-5%20-8z%20m-89%20-138%20c-30%20-43%20-62%20-85%20-72%20-94%20-50%0A-42%20-178%20-110%20-260%20-138%20-174%20-59%20-448%20-66%20-630%20-16%20-156%2043%20-174%2054%20-228%20138%0A-20%2031%20-50%2073%20-67%2092%20-20%2022%20-26%2035%20-17%2035%208%200%2092%20-7%20188%20-15%20400%20-33%20486%20-37%0A646%20-25%20129%2010%20180%2018%20312%2055%2086%2024%20162%2044%20169%2044%207%201%20-12%20-34%20-41%20-76z%0Am-1393%2038%20c80%20-38%2084%20-42%20146%20-134%20l53%20-79%20-42%2024%20c-85%2047%20-266%20218%20-231%20218%0A6%200%2039%20-13%2074%20-29z%20m190%2012%20c-13%20-2%20-35%20-2%20-50%200%20-16%202%20-5%204%2022%204%2028%200%2040%20-2%0A28%20-4z%20m100%20-10%20c-13%20-2%20-33%20-2%20-45%200%20-13%202%20-3%204%2022%204%2025%200%2035%20-2%2023%20-4z%20m155%0A-10%20c-16%20-2%20-40%20-2%20-55%200%20-16%202%20-3%204%2027%204%2030%200%2043%20-2%2028%20-4z%22%2F%3E%0A%3Cpath%20d%3D%22M1828%201281%20c-206%20-29%20-386%20-152%20-473%20-323%20-49%20-99%20-69%20-199%20-62%20-322%0A8%20-164%2069%20-299%20180%20-402%2074%20-68%20140%20-107%20242%20-141%20112%20-37%20284%20-39%20395%20-4%20113%0A35%20187%2078%20266%20156%20124%20124%20181%20278%20171%20464%20-16%20322%20-252%20553%20-587%20574%20-41%203%0A-101%202%20-132%20-2z%20m266%20-140%20c334%20-117%20437%20-552%20191%20-810%20-153%20-160%20-413%20-198%0A-617%20-89%20-107%2057%20-210%20191%20-237%20309%20-15%2062%20-13%20195%203%20254%2049%20184%20195%20319%20386%0A355%2070%2014%20207%204%20274%20-19z%22%2F%3E%0A%3Cpath%20d%3D%22M8065%201279%20c-109%20-16%20-211%20-61%20-284%20-126%20l-44%20-39%2046%20-38%2047%20-38%2037%0A32%20c137%20121%20400%20133%20510%2024%2072%20-72%2078%20-174%2017%20-297%20-20%20-40%20-93%20-119%20-320%0A-342%20l-294%20-290%200%20-47%200%20-48%20420%200%20420%200%200%2060%200%2060%20-324%200%20-324%200%20257%20257%0Ac223%20223%20263%20267%20290%20323%2057%20118%2062%20236%2016%20334%20-41%2086%20-155%20158%20-280%20176%20-80%0A11%20-107%2011%20-190%20-1z%22%2F%3E%0A%3Cpath%20d%3D%22M9795%201279%20c-120%20-18%20-234%20-70%20-298%20-137%20l-28%20-29%2041%20-36%20c22%20-21%2044%0A-37%2048%20-37%205%200%2019%2012%2033%2026%2087%2094%20316%20132%20446%2074%2091%20-40%20123%20-92%20123%20-198%200%0A-57%20-5%20-80%20-32%20-133%20-27%20-55%20-71%20-103%20-330%20-358%20l-299%20-295%203%20-40%203%20-41%20423%0A-3%20422%20-2%200%2060%200%2060%20-327%200%20-328%200%20247%20243%20c135%20133%20260%20263%20278%20290%2073%20111%0A95%20263%2051%20363%20-46%20103%20-150%20174%20-287%20194%20-79%2011%20-106%2011%20-189%20-1z%22%2F%3E%0A%3Cpath%20d%3D%22M100%20676%20l0%20-607%2063%203%2062%203%203%20186%202%20187%20228%204%20c288%206%20356%2025%20464%20126%0A59%2055%2092%20115%20108%20200%2036%20180%20-39%20351%20-188%20430%20-109%2058%20-149%2064%20-459%2069%20l-283%0A5%200%20-606z%20m631%20456%20c133%20-53%20200%20-186%20169%20-335%20-18%20-88%20-62%20-145%20-144%20-187%0Al-69%20-35%20-228%20-3%20-229%20-4%200%20297%200%20297%20223%20-4%20c201%20-4%20227%20-6%20278%20-26z%22%2F%3E%0A%3Cpath%20d%3D%22M2900%20675%20l0%20-605%2065%200%2065%200%200%20158%200%20158%20116%20122%20c64%2067%20119%20122%20124%0A122%204%200%20118%20-126%20251%20-280%20l243%20-280%2074%200%20c41%200%2072%204%2070%209%20-1%205%20-123%20152%20-270%0A325%20-148%20174%20-268%20321%20-268%20326%200%206%20113%20128%20250%20272%20138%20143%20250%20265%20250%20269%0A0%205%20-30%209%20-68%209%20l-67%200%20-350%20-361%20-350%20-362%20-3%20362%20-2%20361%20-65%200%20-65%200%200%20-605z%22%2F%3E%0A%3Cpath%20d%3D%22M4190%20675%20l0%20-605%20425%200%20426%200%20-3%2058%20-3%2057%20-357%203%20-358%202%200%20220%200%0A220%20311%200%20310%200%20-3%2053%20-3%2052%20-307%203%20-308%202%200%20210%200%20210%20345%200%20345%200%200%2060%200%2060%0A-410%200%20-410%200%200%20-605z%22%2F%3E%0A%3Cpath%20d%3D%22M8770%201220%20l0%20-60%20140%200%20140%200%200%20-545%200%20-546%2063%203%2062%203%200%20600%200%20600%0A-202%203%20-203%202%200%20-60z%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A')`
  },
  created () {
    this.bindLocalizations().then(e => e.forEach(el => {
      this.loading = false
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
      loading: true,
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
