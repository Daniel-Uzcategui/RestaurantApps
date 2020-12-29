<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Usuario</div>
          <div>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/users/index')"/>
          </div>
       </q-card-section>
       <diV class='filled'></diV>
        <div class="row header-container">
          <div class="header-cell col-6" >
            <q-input filled label="Identificación" :value="user.cedula"   @input="(e) => saved(e, this.$route.query.user_Id, 'cedula')"
             type="text" float-label="Float Label" placeholder="Identificación" />
          </div>
          <div class="header-cell col-4" >
          <q-input filled label="Correo Electrónico" :value="user.email"    @input="(e) => saved(e, this.$route.query.user_Id, 'email')"
            type="text" float-label="Float Label" placeholder="Correo Electrónico" />
         </div>
        </div>
       <div class="row header-container">
        <div class="header-cell col-6" >
           <q-input filled label="Nombre" :value="user.nombre"   @input="(e) => saved(e, this.$route.query.user_Id, 'nombre')"
             type="text" float-label="Float Label" placeholder="Nombre" />
          </div>
         <div class="header-cell col-4" >
           <q-input filled label="Apellido" :value="user.apellido" @input="(e) => saved(e, this.$route.query.user_Id, 'apellidos')"
             type="text" float-label="Float Label" placeholder="Apellido" />
          </div>
        </div>
        <div class="row header-container">
          <div class="header-cell col-6" >
           <q-select filled :value="user.rol" @input="(e) => saved(e, this.$route.query.user_Id, 'rol')" standout="bg-teal text-white"
            :options="userRolOptions" label="Rol" />
          </div>
       </div>
       <diV class='filled'></diV>
     </q-card>
  </div>

</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      userRolOptions: [
        { label: 'Administrador', value: 0 },
        { label: 'Usuario', value: 1 }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['users']),
    user () {
      return this.getuserDetail(this.$route.query.user_Id)
    }
  },
  mounted () {
    this.bindusers()
  },
  methods: {
    ...mapActions('user', ['saveuser', 'bindusers']),
    saved (value, id, key) {
      this.saveuser({ value, id, key })
    },
    getuserDetail (value) {
      return this.users.find(obj => {
        return obj.id === value
      })
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
  padding-left: 50px
.header-btn-back
  position: absolute; right:20px !important
.header
 padding-bottom: 50px
</style>
