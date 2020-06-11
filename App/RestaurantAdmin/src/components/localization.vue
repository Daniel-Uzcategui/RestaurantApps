<template>
 <div class="row header-container">
       <div class="header-cell col-12">
         <q-btn
          color="secondary"
          icon="fas fa-save"
          label="Guardar"
          no-caps
        />
       </div>
        <div class="header-cell col-6">
          <q-input v-model="text" type="text" float-label="Float Label" placeholder="Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select standout="bg-teal text-white" v-model="estatus" :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="country" label="Pais" />
        </div>
        <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="state"  label="Estado" />
        </div>
         <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="city"  label="Ciudad" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-3">
          <q-input v-model="text" type="text" float-label="Float Label" placeholder="Localización" />
        </div>
         <div class="header-cell col-8">
         <q-input
          v-model="text"
          filled
          type="textarea"
          placeholder="Dirección"
        />
      </div>
     </div>
</template>
<script>
export default {
  data () {
    return {
      estatus: null,
      estatus_options: [
        'Activo', 'Inactivo', 'Fuera de Servicio'
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
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
 </style>
