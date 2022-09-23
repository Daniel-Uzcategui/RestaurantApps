<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Agregar Clientes</div>
          <div>
            <q-btn class="header-btn" flat push label="Agregar" icon="add" @click="create" />
            <q-btn class="header-btn-back" flat push  icon="arrow_back" @click="$router.replace('/clients/index')"/>
          </div>
       </q-card-section>
        <div class="row header-container">
         <div class="header-cell col-4">
          <q-input filled  type="text" float-label="Float Label" placeholder="Identificación" />
        </div>
        <div class="header-cell col-4">
          <q-input filled  type="text" float-label="Float Label" placeholder="Nombre" />
        </div>
        <div class="header-cell col-4">
          <q-input filled  type="text" float-label="Float Label" placeholder="Apellido" />
        </div>
        <div class="flex-break q-py-md "></div>
        <div class="header-cell col-3">
           <q-input filled  type="text" float-label="Float Label" placeholder="Correo Electrónico" />
        </div>
        <div class="header-cell col-3">
            <q-input filled  type="text" float-label="Float Label" placeholder="Telefono" />
        </div>
         <div class="header-cell col-4">
            <q-input filled type="textarea" placeholder="Dirección"  />
      </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
  </div>

</q-page>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ]
    }
  },
  methods: {
    ...mapActions('client', ['saveClient']),
    create (value, id, key) {
      console.log('create')
      console.log(this)
    }
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute
  right: 10px !important
.filled
  padding-top: 50px
.header-cell
  padding-left: 30px
.header-btn-back
  position: absolute
  right: 120px !important
.header
 padding-bottom: 50px
</style>
