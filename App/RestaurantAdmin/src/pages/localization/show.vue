<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Sedes</div>
          <div> <q-btn class="header-btn" flat color="white" push label="Guardar" icon="update" @click="saveLocation"/>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/localization/index')"/>
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
          <q-select standout="bg-teal text-white"  :value="localization.status"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'status')" :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-6">
          <label>Localización</label>
          <q-input :value="JSON.stringify(markers)"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'localizacion_sede')" type="text" float-label="Float Label" placeholder="Localización" />
          <q-popup-edit :value="localization.localizacion_sede" buttons>
              <google-map
                :center="center"
                :markers="markers" />
            </q-popup-edit>
        </div>
         <div class="header-cell col-5">
          <label>Dirección</label>
         <q-input :value="localization.address"  @input="(e) => saved(e, this.$route.query.Localization_Id, 'address')" filled type="textarea" placeholder="Dirección"  />
      </div>
      </div>
     </div>
      <div class='filled'></div>
     </q-card>
  </div>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    GoogleMap: require('../../components/GoogleMap.vue').default
  },
  data () {
    return {
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ],
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null
    }
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    localization () {
      return this.localizations[this.$route.query.Localization_Id]
    }
  },
  methods: {
    ...mapActions('localization', ['saveLocation']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveLocation({ value, id, key })
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
</style>
