<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
          <div class="text-h5">Crear Sedes
            <q-btn class="header-btn" flat color="white" push label="Agregar" icon="fas fa-plus"/>
          </div>
       </q-card-section>
        <cp_localization></cp_localization>
     </q-card>
  </div>
</q-page>
</template>
<script>
export default {
  components: {
    cp_localization: require('components/localization.vue').default
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
</style>
