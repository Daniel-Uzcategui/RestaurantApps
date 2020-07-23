<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Sedes</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="back"/>
            <q-btn class="header-btn" flat color="white" push label="Guardar" icon="update" v-if="false" @click="saveLocation"/>
          </div>
       </q-card-section>
         <div class='filled'></div>
       <div v-if="typeof localization !== 'undefined'">
       <div class="row header-container">
        <div class="header-cell col-6">
          <label>Sede</label>
          <q-input :value="localization.name"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'name')"  type="text" float-label="Float Label" placeholder="Nombre de la Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select map-options emit-value standout="bg-teal text-white"  :value="localization.status"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'status')"
            :options="estatus_options" label="Estatus" />
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="header-cell col-6">
          <q-btn v-if="!markers" color="primary" class="q-py-md" label="Agregar Localización" icon="fas fa-map-marker-alt"/>
          <q-btn v-if="markers" color="primary" class="q-py-md" label="Localización" icon="fas fa-check"/>
          <q-popup-edit buttons :value="markers" @save="(e) => saveGeoPoint(e, this.$route.query.Localization_Id, 'localizacion_sede')">
              <google-map
                :center="center"
                :markers="markers" />
            </q-popup-edit>
        </div>
         <div class="header-cell col-5">
          <label>Dirección</label>
         <q-input :value="localization.address"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'address')" filled type="textarea" placeholder="Dirección"  />
      </div>
      <div class="flex-break q-py-md "></div>
         <div class="header-cell col-3">
            <div class="col-3">
            <label>Tipo de Servicios</label>
            </div>
            <div class="div-typeServices">
              <q-checkbox dense label="Pick-up" color="teal" class="typeServices"  :value="localization.PickUP" @input="(e) => saved(e, this.$route.query.Localization_Id, 'PickUP')" />
              <q-checkbox dense label="Delivery" color="orange" class="typeServices" :value="localization.Delivery" @input="(e) => saved(e, this.$route.query.Localization_Id, 'Delivery')" />
              <q-checkbox dense label="In local" color="red" class="typeServices" :value="localization.Inlocal" @input="(e) => saved(e, this.$route.query.Localization_Id, 'Inlocal')" />
            </div>
        </div>
        <div class="header-cell col-4" v-show="localization.Inlocal">
          <label>Mesas</label>
          <q-input :value="localization.tables"  type="text" float-label="Float Label" @input="(e) => saved(e, this.$route.query.Localization_Id, 'tables')" />
        </div>
         <div class="header-cell col-4"  v-show="localization.Inlocal">
          <label>Capacidad</label>
          <q-input :value="localization.capacity"  type="text" float-label="Float Label" @input="(e) => saved(e, this.$route.query.Localization_Id, 'capacity')" />
        </div>
      </div>
     </div>
      <div class='filled'></div>
     </q-card>
  </div>
  <q-dialog v-model="validationError">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <q-card-section>
          El campo {{messageError}} es requerido
        </q-card-section>
      </q-card>
    </q-dialog>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { GeoPoint } from '../../services/firebase/db.js'
export default {
  components: {
    GoogleMap: require('../../components/GoogleMap.vue').default
  },
  data () {
    return {
      tables: '',
      capacity: '',
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ],
      PickUP: false,
      Delivery: false,
      Inlocal: false,
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
      validationError: false,
      messageError: []
    }
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    localization () {
      return this.localizations.find(obj => {
        return obj.id === this.$route.query.Localization_Id
      })
    }
  },
  mounted () {
    this.markers = [{ position: { lat: this.localization.localizacion_sede.Rc, lng: this.localization.localizacion_sede.Ac } }]
  },
  methods: {
    ...mapActions('localization', ['saveLocation']),
    saved (value, id, key) {
      if (value.length === 0) {
        this.messageError = []
        if (key === 'name') {
          this.messageError.push(' Nombre de la Sede ')
        }
        if (key === 'address') {
          this.messageError.push(' Dirección ')
        }
        if (this.localization.Inlocal) {
          if (key === 'tables' || this.localization.tables === 0) {
            this.messageError.push(' Mesa ')
          }
          if (key === 'capacity') {
            this.messageError.push(' capacidad ')
          }
        }
        this.validationError = true
        return
      }
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveLocation({ value, id, key })
    },
    saveGeoPoint (valu, id, key) {
      const loc = JSON.parse(JSON.stringify(valu[0]))
      const value = new GeoPoint(loc.position.lat, loc.position.lng)
      console.log(value)
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveLocation({ value, id, key })
    },
    back () {
      this.$router.replace('/localization/index')
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
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
.filled
  padding-top: 50px
.div-typeServices
 padding-top: 20px
.typeServices
 padding-left: 10px
</style>
