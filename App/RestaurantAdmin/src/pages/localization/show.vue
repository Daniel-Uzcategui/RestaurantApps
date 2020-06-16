<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Sedes</div>
          <div> <q-btn class="header-btn" flat color="white" push label="Guardar" icon="update"/>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/localization/index')"/>
          </div>
       </q-card-section>
        <cp_localization
        :localization=localizations[this.$route.query.Localization_Id]>
        </cp_localization>
     </q-card>
  </div>

</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: [ 'localization', 'id' ],
  computed: {
    ...mapGetters('localization', ['localizations'])
  },
  components: {
    cp_localization: require('components/localization.vue').default
  },
  methods: {
    ...mapActions('localization', ['saveLocationAc'])
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
</style>
