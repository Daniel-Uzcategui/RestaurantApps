<template>
   <q-layout class="main my-font" :class="{ 'blur-layout': blurLayout }" view="Lhh LpR LFf">
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
                  <img alt="chopZI" src="icons/iconwhite.png" height="326px" width="300px">
               </q-avatar>
               <span v-if="$q.screen.name !== 'xs'">{{getUserData('nombre')}} {{getUserData('apellido')}}</span>
            </q-toolbar-title>
            <div>
               <q-btn no-caps class="text-caption" flat v-ripple @click.native="setEditUserDialog(true); setBlur()" label="Perfil" />
               <q-btn no-caps class="text-caption" flat @click="logoutUser()" label="Cerrar Sesión" >  </q-btn>
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
         on-layout="hide"
         v-if="$router.history.current.path !== '/editor/index'"
         v-model="leftDrawerOpen"
         overlay
         behavior="mobile"
         content-class="bg-blue-grey-9">
            <Nav
              class="q-ma-xs"
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
import firebase from 'firebase/app'
import '@firebase/messaging'
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
    // console.log('FIREBASE AUTH USER uid', this.$store.state.auth.uid)
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
  },
  async mounted () {
    this.$q.dark.set(true)
    this.bindEnv().then(e => {
      // console.log({ environment: e })
      let ver = localStorage.getItem('envVer')
      if (ver === null) {
        localStorage.setItem('envVer', e.version)
      } else if (e && ver !== e.version) {
        this.$q.dialog({
          title: 'Nueva Version',
          message: 'Hay una nueva version disponible.\nRefrescar la app para descargar las nuevas actualizaciones?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          localStorage.setItem('envVer', e.version)
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
              for (let registration of registrations) {
                registration.update()
              }
            })
          }
          this.getNewVer()
        })
      }
      if (e && ver === e.version) {
        // console.log('App is in the newer version')
      }
    })
    // console.log({ rt: this.$router })
    const { currentUser } = this
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      // console.log(this.currentUser)
      this.$q.loading.hide()
      if (currentUser.firstAccess) {
        this.$router.push({ path: '/guide/intro' })
        try {
          this.updateUserData({
            ...currentUser,
            firstAccess: false
          })
        } catch (err) {
          console.error(err)
        }
      }
    }
    if (firebase.messaging.isSupported()) {
      if (!firebase.apps.length) {
        fetch('/__/firebase/init.json').then(async response => {
          firebase.initializeApp(await response.json())
          this.setupNotif()
        })
      } else {
        this.setupNotif()
      }
    }
  },
  data () {
    return {
      audio: {
        sources: [
          {
            src: 'https://soundbible.com/grab.php?id=2155&type=mp3',
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
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Asistentes',
          caption: '',
          icon: 'fas fa-question-circle',
          // separator: true,
          tree: [
            {
              children: [
                { label: 'Intro',
                  link: 'intro',
                  handler: (node) => this.onClickGuide(node) },
                { label: 'Agregar opciones a Productos',
                  link: 'addopts',
                  handler: (node) => this.onClickGuide(node) }
              ]
            }]
        },
        {
          title: 'Sedes',
          caption: '',
          icon: 'fa fa-globe',
          link: '#/localization/index',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Categorias',
          caption: '',
          icon: 'fa fa-bars',
          link: '#/menu/categorias',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Catálogos',
          caption: '',
          icon: 'fas fa-utensils',
          link: '#/menu/menu',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Filtros de Productos',
          caption: '',
          icon: 'fas fa-filter',
          link: '#/menu/menufilters',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Opciones',
          caption: '',
          icon: 'fab fa-gulp',
          link: '#/menu/options',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Config Grupos de Opciones',
          caption: '',
          icon: 'menu_book',
          link: '#/menu/optionsconf',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Promociones',
          caption: '',
          icon: 'fas fa-ad',
          link: '#/menu/promo',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Ordenes',
          caption: '',
          icon: 'room_service',
          link: '#/orders/index',
          // separator: true,
          tree: [{ children: [] }]
        },
        /* {
          title: 'Pagos',
          caption: '',
          icon: 'fa fa-briefcase',
          link: '#/payments/index',
          // separator: true,
          tree: [{ children: [] }]
        }, */
        {
          title: 'Pagos',
          caption: '',
          icon: 'fa fa-briefcase',
          // separator: true,
          tree: [
            {
              children: [
                { label: 'Consulta general',
                  link: 'index',
                  handler: (node) => this.onClickPayments(node) },
                { label: 'Transacciones',
                  link: 'transactions',
                  handler: (node) => this.onClickPayments(node) }
              ]
            }]
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'fa fa-user',
          link: '#/clients/index',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Editor Web',
          caption: '',
          icon: 'far fa-object-group',
          link: '#/editor/index',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Usuarios',
          caption: '',
          icon: 'fa fa-users',
          link: '#/users/index',
          // separator: true,
          tree: [{ children: [] }]
        },
        {
          title: 'Widgets',
          caption: '',
          icon: 'fa fa-cube',
          // separator: true,
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
          // separator: true,
          tree: [
            {
              children: [
                { label: 'Horarios',
                  link: 'schedule',
                  handler: (node) => this.onClickOption(node) },
                { label: 'Pagos y Servicios',
                  link: 'paymentServ',
                  handler: (node) => this.onClickOption(node) },
                { label: 'Tasa de cambio',
                  link: 'rate',
                  handler: (node) => this.onClickOption(node) }
              ]
            }]
        } /*,
        /* {
          title: 'Reportes',
          caption: '',
          icon: 'fa fa-print',
          // separator: true,
          tree: [
            {
              children: [
              /*  { label: 'Ventas Generales',
                  link: 'generalSales',
                  handler: (node) => this.onClickReports(node) },
                { label: 'Ventas  x Sedes',
                  link: 'locationSales',
                  handler: (node) => this.onClickReports(node) }
               { label: 'Categorias',
                  link: 'rcategories',
                  handler: (node) => this.onClickReports(node) }
                { label: 'Productos',
                  link: 'rproducts',
                  handler: (node) => this.onClickReports(node) }
              ]
            }]
        } */
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('order', ['bindOrders']),
    ...mapActions('config', ['bindEnv']),
    ...mapActions('menu', ['setValue']),
    ...mapActions('user', ['updateUserData']),
    setupNotif () {
      if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.')
        return
      }
      if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.')
        return
      }
      var that = this
      navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        const messaging = firebase.messaging()
        messaging
          .requestPermission()
          .then(() => {
            console.log('Notif allowed')
            return messaging.getToken()
          })
          .then(token => {
            console.log('Token Is : ' + token)
            if (!that.isAnonymous && that.currentUser && (typeof that.currentUser.fcm === 'string' || typeof that.currentUser.fcm === 'undefined' || !that.currentUser.fcm.includes(token))) {
              that.setValue({ payload: { value: typeof that.currentUser.fcm === 'undefined' || typeof that.currentUser.fcm === 'string' ? [token] : [...that.currentUser.fcm, token], id: that.currentUser.id, key: 'fcm' }, collection: 'users' })
            }
          })
          .catch(err => {
            console.error('No permission to send push', err)
          })
      })
    },
    getNewVer () {
      window.location.reload(true)
    },
    showNotif () {
      // console.log({ ntf: this.$refs['mediapl'] })
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
    onClickGuide (node) {
      this.$router.push({ path: '/guide/' + node.link })
    },
    onClickPayments (node) {
      this.$router.push({ path: '/payments/' + node.link })
    },
    onClickReports (node) {
      this.$router.push({ path: '/reports/' + node.link })
    }
  },
  watch: {
    currentUser (e) {
      this.$q.loading.hide()
      this.setupNotif()
      console.log('User Data available', { e })
      if (e.firstAccess) {
        this.$router.push({ path: '/guide/intro' })
        try {
          this.updateUserData({
            ...e,
            firstAccess: false
          })
        } catch (err) {
          console.error(err)
        }
      }
    },
    orders () {
      if (this.initAudio === 0) {
        if (typeof this.$refs['mediapl'] !== 'undefined') {
          this.$refs['mediapl'].play()
        }
        this.initAudio = 1
      } else {
        if (this.initAudio === 2 && this.orders.length > this.countOrder) {
          this.countOrder = this.orders.length
          this.showNotif()
        }
        this.initAudio = 2
      }
    }
  }
}
</script>
<style lang="stylus">
  .main
    &.blur-layout
      filter blur(5px)
  .q-drawer
    border-top-right-radius 100px
    overflow hidden
  .q-toolbar
    background-repeat no-repeat
    background-size 15vmin
    background-position center
</style>
