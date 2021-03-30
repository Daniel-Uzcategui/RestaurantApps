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
         <div>{{currentUser && currentUser.requestDate ? new Date(currentUser.requestDate * 1000) : ''}}</div>
      </q-card-section>
      <q-card-section v-if="currentUser.trialDate">
         <div class="text-h6">Periodo de prueba: </div>
         <div class="text-h7 text-green text-bold">Fecha de inicio:</div>
         <div>{{currentUser && currentUser.trialDate ? new Date(currentUser.trialDate.seconds * 1000) : ''}}</div>
         <div class="text-h7 text-red text-bold">Fecha de Fin:</div>
         <div>{{addDays(new Date(currentUser.trialDate.seconds * 1000), 30)}}</div>
      </q-card-section>
      <q-card-section v-if="currentUser.adminDomain">
         <div>Url Administrativo: (Iniciar con su mismo usuario, este es el administrador, si necesitas más de un usuario administrativo, creelos desde el mismo registro de esa pagina y asigne su rol) </div>
         <q-btn flat type="a" target="__blank" :href="'https://' + currentUser.adminDomain + '.chopzi.com'" :label="'https:// ' + currentUser.adminDomain + '.chopzi.com'" />
        <div>Url Cliente: (Todos los cambios realizados en el administrativo, se verá reflejado en la página del cliente, este es el url que le enviarás a tus clientes.)</div>
         <q-btn flat type="a" target="__blank" :href="'https://' + currentUser.clientDomain + '.chopzi.com'" :label="'https:// ' + currentUser.clientDomain + '.chopzi.com'" />
         <div v-if="activeU === false">Solicitar un subdominio gratuito para su página de cliente ( Esto es para cambiar la direccion web que le das a tus clientes, adicionalmente le podrás dar la dirección solicitada, si ya tienes un dominio contáctanos )
         <q-input v-model="urlSolicit" label="url" :rules="[isValidCharacter]" suffix=".chopzi.com"/>
          <q-btn color="primary" no-caps label="Solicitar" @click="subscribeUrl()" />
         </div>
         <div v-else>
         <div class="text-h6">
           Solicitudes de subdominio para cliente
         </div>
         <p class="text-bold">
          URL: {{activeU.subdomain}} <q-btn color="red" flat label="Eliminar URL" @click="delUrl({id: activeU.id, status: 2})" icon="cancel"></q-btn>
          </p>
          <p class="text-bold">
         Estatus: <span class="text-green"> {{statusUrl[activeU.status]}} </span>
          </p>
          <p class="text-bold">
         Fecha de solicitud: <span class="text-green"> {{new Date(activeU.DateIn.seconds * 1000)}} </span>
          </p>
         </div>
      </q-card-section>
      <q-card-section v-if="currentUser.activeService">
          <div class="text-h6">Servicios activos:</div>
          <div class="text-h7 text-green text-bold">Chopzi plan {{currentUser.serviceType}}</div>
         <div class="text-h7">Fecha de inicio:</div>
         <div>{{new Date(currentUser.trialDate.seconds * 1000)}}</div>
         <div class="text-h7">Fecha de Fin:</div>
         <div>{{addDays(new Date(currentUser.trialDate.seconds * 1000), 30)}}</div>
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
      urlSolicit: null,
      model1: 3,
      activeUrl: false,
      statusUrl: ['En Proceso, le avisaremos en lo que activemos', 'Activo', 'Eliminado']
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
    let ww = this.getAvailableUrls('hh')
    console.log(ww)
    const { currentUser } = this
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      this.activeUrl = await this.getActiveU()
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
    activeU () {
      let active = this.activeUrl
      if (this.activeUrl) {
        return active
      } else {
        return false
      }
    },
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
    ...mapActions('config', ['bindPaymentServ', 'getAvailableUrls', 'setUrlSub', 'getActiveUrl', 'delUrlSub']),
    async delUrl (payload) {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Estas seguro que quieres eliminar la URL?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.$q.loading.show()
        try {
          let ff = await this.delUrlSub(payload)
          if (ff) {
            this.activeUrl = await this.getActiveU()
            this.$q.loading.hide()
          }
        } catch (e) {
          this.$q.loading.hide()
        }
      })
    },
    async isValidCharacter (title) {
      var regExp = /^\s*([0-9a-zA-Z]+)\s*$/
      if (!regExp.test(title)) {
        return 'El campo solo admite números o letras'
      } else {
        let validate = await this.getAvailableUrls(title + '.chopzi.com')
        switch (true) {
          case validate[0] && validate[1]:
            return true
          case !validate[0] && validate[1]:
            return 'Nombre no disponible'
          case !validate[0] && !validate[1]:
            return true
          default:
            return 'Error de conexión, intente más tarde si el error persiste contacte a soporte'
        }
      }
    },
    async getActiveU () {
      if (this.currentUser.id) {
        let active = await this.getActiveUrl(this.currentUser.id)
        console.log(active, 'active')
        return active
      } else {
        return false
      }
    },
    async subscribeUrl () {
      try {
        let validate = await this.isValidCharacter(this.urlSolicit)
        if (typeof validate === 'boolean' && validate && this.urlSolicit !== null) {
          this.$q.dialog({
            title: 'Confirmar',
            message: 'Estas seguro que quieres solicitar el subdominio ' + this.urlSolicit + '.chopzi.com ?',
            cancel: true,
            persistent: true
          }).onOk(async () => {
            this.$q.loading.show()
            // console.log('>>>> OK')
            let confirm = await this.setUrlSub({ userId: this.currentUser.id, subdomain: this.urlSolicit + '.chopzi.com', status: 0, clientDomain: this.currentUser.clientDomain })
            if (confirm) {
              this.$q.notify({ message: 'Url suscrito' })
              this.activeUrl = await this.getActiveU()
              this.$q.loading.hide()
            } else {
              if (typeof validate === 'string') {
                this.$q.notify({ message: validate, color: 'red' })
              } else {
                this.$q.notify({ message: 'Error, intente más tarde, si persiste el problema contacte a soporte', color: 'red' })
              }
            }
          })
        } else {
          this.$q.loading.hide()
        }
      } catch (error) {
        this.$q.loading.hide()
        this.$q.notify({ message: 'Error, intente más tarde, si persiste el problema contacte a soporte', color: 'red' })
      }
    },
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
    async currentUser () {
      this.$q.loading.hide()
      this.activeUrl = await this.getActiveU()
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
