<template>
<div>
    <div class="qpage bg-primary absolute-left"></div>
  <div class="flex flex-center q-pt-xl">
    <q-card class="q-cardGlass q-pa-lg menudiv">
      <q-card-section>
        <q-item class="text-h5 text-center">
          <q-item-section>
                <q-item-label class="text-bold">
                  Dashboard
                </q-item-label>
                <p class="text-h6" v-if="!isAnonymous">{{currentUser.nombre}} {{currentUser.apellido}}</p>
                <q-btn v-else label="Iniciar Sesión" to="/auth/login"></q-btn>
            </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section v-if="typeof currentUser.trialDate === 'undefined' && typeof currentUser.awaitingTrial === 'undefined'">
        <div class="full-width column items-center">
          <q-spinner
        color="primary"
        size="3em"
      />
        </div>
      </q-card-section>
      <q-card-section v-if="currentUser.awaitingTrial">
         <div class="text-h6">Periodo de prueba: </div>
         <div class="text-h7">Status:</div>
         <div class="text-h7 text-green text-bold">En espera</div>
         <div class="text-h7">Fecha de solicitud:</div>
         <div>{{currentUser.requestDate.toDate()}}</div>
      </q-card-section>
      <q-card-section v-if="currentUser.trialDate">
         <div class="text-h6">Periodo de prueba: </div>
         <div class="text-h7 text-green text-bold">Fecha de inicio:</div>
         <div>{{currentUser.trialDate.toDate()}}</div>
         <div class="text-h7 text-red text-bold">Fecha de Fin:</div>
         <div>{{addDays(currentUser.trialDate.toDate(), 30)}}</div>
      </q-card-section>
      <q-card-section v-if="currentUser.adminDomain">
         <div>Url Administrativo: (entrar al administrativo primero y crear una cuenta, la primera cuenta será el administrador del sistema) </div>
         <q-btn flat type="a" target="__blank" :href="'https://' + currentUser.adminDomain + '.web.app'" :label="'https:// ' + currentUser.adminDomain + '.web.app'" />
        <div>Url Cliente: (Todos los cambios realizados en el administrativo, se verá reflejado en la página del cliente, este es el url que le enviarás a tus clientes.)</div>
         <q-btn flat type="a" target="__blank" :href="'https://' + currentUser.clientDomain + '.web.app'" :label="'https:// ' + currentUser.clientDomain + '.web.app'" />
      </q-card-section>
      <q-card-section v-if="currentUser.activeService">
          <div class="text-h6">Servicios activos:</div>
          <div class="text-h7 text-green text-bold">Chopzi plan {{currentUser.serviceType}}</div>
         <div class="text-h7">Fecha de inicio:</div>
         <div>{{currentUser.trialDate.toDate()}}</div>
         <div class="text-h7">Fecha de Fin:</div>
         <div>{{addDays(currentUser.trialDate.toDate(), 30)}}</div>
      </q-card-section>
    </q-card>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { QSpinnerGears, QSpinnerRadio } from 'quasar'
export default {
  data () {
    return {
      model1: 3
    }
  },
  name: 'Profile',
  created () {
    this.bindCategorias()
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
  },
  async mounted () {
    const { currentUser } = this
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      console.log(this.currentUser)
      this.$q.loading.hide()
    }
    this.bindPaymentServ().catch(e => console.error(e))
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('menu', ['categorias']),
    ...mapGetters('config', ['paymentServ']),
    ...mapGetters('auth', ['isAnonymous']),
    editUserDialog: {
      get () {
        return this.$store.state.user.editUserDialog
      },
      set (val) {
        this.setEditUserDialog(val)
      }
    }
  },
  methods: {
    ...mapMutations('user', ['setEditUserDialog']),
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('menu', ['bindCategorias']),
    ...mapActions('config', ['bindPaymentServ']),
    addDays (date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 0
    },
    getCategoryName (id) {
      console.log({ ...this.categorias })
      var cat = typeof this.categorias === 'undefined' ? 0 : this.categorias.find(e => e.id === id)
      console.log('getCategoryName')
      console.log({ cat })
      if (typeof cat === 'undefined') { return null }
      return cat.name
    },
    setBlur () {
      this.$emit('setBlur')
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
    }
  }
}
</script>
<style lang="stylus">
  .qpage
    height 100vh
    width 100vw
    filter blur(5px)
    -webkit-filter blur(5px)
    -moz-filter blur(5px)
    -o-filter blur(5px)
    -ms-filter blur(5px)
  .qchipmargin
    margin auto
  .background-photo
    cursor pointer
  .profile-container
    position relative
    text-align center
    background rgba(0,0,0,0)
    top -4.6em
  .user-info
    margin 2em auto
    max-width 24em
    position relative
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
