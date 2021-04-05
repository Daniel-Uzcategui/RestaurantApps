<template>
     <q-card flat class="menudiv full-height q-cardGlass">
      <q-card-section>
        <div class="text-h5 menuTop">Encuentranos</div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-pa-md">
          <q-spinner class="col" v-if="true" size="lg" color="primary" />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <google-map
          v-if="markers.length"
          :center="center"
          :markers="markers"
          :readOnly="true" />
       </q-card-section>
    </q-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GoogleMap from '../components/GoogleMap'
export default {
  components: {
    GoogleMap: GoogleMap
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    markers () {
      var mark = this.localizations.map(x => {
        return {
          position: {
            lat: x.localizacion_sede.latitude,
            lng: x.localizacion_sede.longitude
          }
        }
      })
      // console.log(mark)
      return mark
    }
  },
  created () {
    this.bindLocalizations().then(() => { this.loading = false })
  },
  methods: {
    ...mapActions('localization', ['bindLocalizations'])
  },

  data () {
    return {
      loading: true,
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
