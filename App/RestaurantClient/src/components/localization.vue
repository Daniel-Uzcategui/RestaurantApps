<template>
 <div class="row header-container">
        <div class="header-cell col-6">
          <label>Sede</label>
          <q-input filled :value="localization.name"  type="text" float-label="Float Label" placeholder="Nombre de la Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select filled standout="bg-teal text-white"  :value="localization.status" :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-3">
          <label>Localización</label>
          <q-input filled :value="localization.localizacion_sede" type="text" float-label="Float Label" placeholder="Localización" />
        </div>
         <div class="header-cell col-8">
          <label>Dirección</label>
         <q-input filled :value="localization.address" type="textarea" placeholder="Dirección"  />
      </div>
     </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: [ 'localization', 'id' ],
  data () {
    return {
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ]
    }
  },
  methods: {
    ...mapActions('localization', ['saveLocationAc'])
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.header-container
   box-shadow: inset 0 0 0 1px $grey-6
   background: rgba(255,255,255,.9)
   padding-bottom: 24px
.btn-right
   box-shadow: inset 0 0 0 2px $grey-6
.header-cell
  padding-left: 30px
 </style>
