<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Agregar Sedes</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Agregar" @click="agregar" icon="fas fa-plus"/>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/localization/index')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <div class="row header-container">
        <div class="header-cell col-6">
          <q-input v-model="name"  type="text" float-label="Float Label" placeholder="Nombre de la Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select v-model="status" standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-6">
          <q-btn v-if="localizacion_sede.length === 0" color="primary" class="q-py-md" label="Agregar Localizacion" icon="fas fa-map-marker-alt"/>
          <q-btn v-if="localizacion_sede.length > 0" color="primary" class="q-py-md" label="Localizacion Agregada" icon="fas fa-check"/>
          <q-popup-edit :value="localizacion_sede" buttons>
              <google-map
                :center="center"
                :markers="localizacion_sede" />
            </q-popup-edit>
        </div>
         <div class="header-cell col-5">
            <q-input v-model="address" filled type="textarea" placeholder="Dirección"  />
      </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
  </div>
  <q-dialog v-model="noLoc">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Alerta</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Debe agregar una localización.
        </q-card-section>
      </q-card>
    </q-dialog>
</q-page>
</template>
<script>
import { GeoPoint } from '../../services/firebase/db.js'
import { mapActions } from 'vuex'
export default {
  components: {
    GoogleMap: require('../../components/GoogleMap.vue').default
  },
  data () {
    return {
      noLoc: false,
      name: '',
      smallAddress: '',
      status: 'En Espera',
      address: '',
      localizacion_sede: [],
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ],
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: []
    }
  },
  methods: {
    ...mapActions('localization', ['addLoc']),
    agregar () {
      if (this.localizacion_sede.length === 0) { this.noLoc = true; return }
      this.$q.loading.show()
      const loc = JSON.parse(JSON.stringify(this.localizacion_sede[0]))
      const payload = {
        name: this.name,
        smallAddress: this.smallAddress,
        status: this.status,
        address: this.address,
        localizacion_sede: new GeoPoint(loc.position.lat, loc.position.lng)
      }
      this.addLoc(payload).then(e => { this.$q.loading.hide(); this.$router.replace('/localization/index') })
    }
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
</style>
