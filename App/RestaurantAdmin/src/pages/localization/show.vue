<template>
  <q-page class="flex flex-center q-gutter-md q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-primary text-white" >
        <div class="text-h5">Editar Sedes</div>
      </q-card-section>
     <div class="row header-container">
        <div class="header-cell col-6">
          <q-input v-model="text" type="text" float-label="Float Label" placeholder="Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select standout="bg-teal text-white" v-model="model" :options="options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="country" :options="options" label="Pais" />
        </div>
        <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="state" :options="options" label="Estado" />
        </div>
         <div class="header-cell col-3">
         <q-select standout="bg-teal text-white" v-model="city" :options="options" label="Ciudad" />
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
     </q-card>
  </div>
</q-page>
</template>
<script>
export default {
  data () {
    return {
      model: null,
      options: [
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
  </style>
