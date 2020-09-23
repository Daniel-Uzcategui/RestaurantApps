<template>
   <q-layout class="main" :class="{ 'blur-layout': blurLayout }" view="Lhh LpR LFf">
      <q-header class="bg-primary text-white" v-if="currentUser && $router.history.current.path !== '/editor/index'" elevated>
         <q-toolbar>
            <q-btn
               flat
               dense
               round
               icon="menu"
               aria-label="Menu"
               @click="leftDrawerOpen = !leftDrawerOpen"
               />
            <q-toolbar-title class="text-caption">
               <q-avatar>
                  <img alt="pfcevolution" src="~assets/logo.png" height="326px" width="300px">
               </q-avatar>
               {{getUserData('nombre')}} {{getUserData('apellido')}}
            </q-toolbar-title>
            <div>
               <q-btn class="text-caption" flat v-ripple @click.native="setEditUserDialog(true); setBlur()" label="Perfil" />
               <q-btn class="text-caption" flat @click="logoutUser()" label="Cerrar Sesión" >  </q-btn>
               <q-dialog v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="setBlur">
                  <user-settings></user-settings>
               </q-dialog>
            </div>
            <q-media-player
            style="display: none"
                ref="mediapl"
                type="audio"
                :sources="audio.sources"
                :auto-play="true"
              >
              </q-media-player>
         </q-toolbar>
      </q-header>
      <q-drawer
         v-if="$router.history.current.path !== '/editor/index'"
         v-model="leftDrawerOpen"
         show-if-above
         bordered
         content-class="bg-blue-grey-9">
            <Nav
               v-for="link in nav"
               :key="link.title"
               v-bind="link"
               />
      </q-drawer>
      <q-page-container>
         <transition
            name="transitions"
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
            mode="out-in">
            <router-view @setBlur="setBlur" />
         </transition>
      </q-page-container>
   </q-layout>
</template>

<script>
import Nav from 'components/nav'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { QSpinnerGears, QSpinnerRadio } from 'quasar'

export default {
  name: 'UserLayout',
  components: {
    Nav,
    'user-settings': () => import('../pages/user/profile/UserSettings.vue')
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('order', ['orders']),
    productName () {
      return window.sessionStorage.productName
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
  created () {
    if (window.sessionStorage.getItem('reloaded') !== 'yes') {
      this.logoutUser()
    }
    window.sessionStorage.setItem('reloaded', 'yes')
    // Check that our app has access to the user id
    // from Firebase before the page renders
    this.bindOrders().then(x => { this.countOrder = this.orders.length })
    console.log('FIREBASE AUTH USER uid', this.$store.state.auth.uid)
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
  },
  async mounted () {
    this.bindEnv().then(e => {
      console.log({ environment: e })
      let ver = localStorage.getItem('envVer')
      if (ver === null) {
        localStorage.setItem('envVer', e.version)
      } else if (ver !== e.version) {
        this.$q.dialog({
          title: 'Nueva Version',
          message: 'Hay una nueva version disponible.\nRefrescar la app para descargar las nuevas acutalizaciones?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          localStorage.setItem('envVer', e.version)
          this.getNewVer()
        })
      }
      if (ver === e.version) {
        console.log('App is in the newer version')
      }
    })
    console.log({ rt: this.$router })
    const { currentUser } = this
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      console.log(this.currentUser)
      this.$q.loading.hide()
    }
  },
  data () {
    return {
      audio: {
        sources: [
          {
            src: 'http://soundbible.com/grab.php?id=2155&type=mp3',
            type: 'audio/mp3'
          }
        ]
      },
      initAudio: 0,
      countOrder: 0,
      notifications: 0,
      blurLayout: false,
      leftDrawerOpen: false,
      nav: [
        {
          title: 'Inicio',
          caption: '',
          icon: 'fa fa-home',
          link: '#/home',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Sedes',
          caption: '',
          icon: 'fa fa-globe',
          link: '#/localization/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Categorias',
          caption: '',
          icon: 'fa fa-bars',
          link: '#/menu/categorias',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Catálogos',
          caption: '',
          icon: 'fas fa-utensils',
          link: '#/menu/menu',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Opciones',
          caption: '',
          icon: 'fab fa-gulp',
          link: '#/menu/options',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Configuración de Opciones',
          caption: '',
          icon: 'menu_book',
          link: '#/menu/optionsconf',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Promociones',
          caption: '',
          icon: 'fas fa-ad',
          link: '#/menu/promo',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Ordenes',
          caption: '',
          icon: 'room_service',
          link: '#/orders/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Pagos',
          caption: '',
          icon: 'fa fa-briefcase',
          link: '#/payments/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'fa fa-user',
          link: '#/clients/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Editor Web',
          caption: '',
          icon: 'far fa-object-group',
          link: '#/editor/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Usuarios',
          caption: '',
          icon: 'fa fa-users',
          link: '#/users/index',
          separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Widgets',
          caption: '',
          icon: 'fa fa-cube',
          separator: true,
          tree: [
            {
              children: [
                { label: 'Chat',
                  link: 'chat',
                  handler: (node) => this.onClickOption(node) }
              ]
            }]
        },
        {
          title: 'Ajustes',
          caption: '',
          icon: 'fa fa-cog',
          separator: true,
          tree: [
            {
              children: [
                { label: 'Horarios',
                  link: 'schedule',
                  handler: (node) => this.onClickOption(node) },
                { label: 'Pagos y Servicios',
                  link: 'paymentServ',
                  handler: (node) => this.onClickOption(node) }
              ]
            }]
        },
        {
          title: 'Reportes',
          caption: '',
          icon: 'fa fa-print',
          separator: true,
          tree: [
            {
              children: [
              /*  { label: 'Ventas Generales',
                  link: 'generalSales',
                  handler: (node) => this.onClickReports(node) }, */
                { label: 'Ventas  x Sedes',
                  link: 'locationSales',
                  handler: (node) => this.onClickReports(node) }
              /*  { label: 'Categorias',
                  link: 'rcategories',
                  handler: (node) => this.onClickReports(node) },
                { label: 'Productos',
                  link: 'rproducts',
                  handler: (node) => this.onClickReports(node) } */
              ]
            }]
        }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('order', ['bindOrders']),
    ...mapActions('config', ['bindEnv']),
    getNewVer () {
      window.location.reload(true)
    },
    showNotif () {
      console.log({ ntf: this.$refs['mediapl'] })
      this.$refs['mediapl'].play()
      this.$q.notify({
        message: `Nueva Orden!`,
        color: 'primary',
        actions: [
          { label: 'Dismiss', color: 'white' }
        ]
      })
    },
    ...mapMutations('user', ['setEditUserDialog']),
    setBlur () {
      this.blurLayout = !this.blurLayout
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    },
    onClickOption (node) {
      this.$router.push({ path: '/settings/' + node.link })
    },
    onClickReports (node) {
      this.$router.push({ path: '/reports/' + node.link })
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
    },
    orders () {
      if (this.initAudio === 0) {
        if (typeof this.$refs['mediapl'] !== 'undefined') {
          this.$refs['mediapl'].play()
        }
        this.initAudio = 1
      } else {
        if (this.orders.length > this.countOrder) {
          this.countOrder = this.orders.length
          this.showNotif()
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .main
    &.blur-layout
      filter blur(5px)
</style>
