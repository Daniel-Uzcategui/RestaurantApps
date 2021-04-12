<template>
   <q-layout class="main my-font backgroundImage" :class="{ 'blur-layout': blurLayout }" view="Lhh LpR LFf">
      <q-header class="bg-primary" v-if="currentUser && $router.history.current.path !== '/editor/index'" elevated>
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
               <q-btn icon="fas fa-user" no-caps class="text-caption" flat v-ripple @click.native="setEditUserDialog(true); setBlur()" />
               <q-btn no-caps class="text-caption" icon="fas fa-sign-out-alt" flat @click="logoutUser()" >  </q-btn>
               <q-dialog v-model="editUserDialog" persistent="persistent" @before-hide="setBlur">
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
         style="border-top-right-radius 100px"
         on-layout="hide"
         v-if="$router.history.current.path !== '/editor/index'"
         v-model="leftDrawerOpen"
         overlay
         behavior="mobile"
         >
            <Nav
              class="q-ma-xs"
               v-for="link in nav"
               :key="link.title"
               v-bind="link"
               />
      </q-drawer>
      <q-page-container>
        <component :is="themeUser">
         <transition
            name="transitions"
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
            mode="out-in">
            <router-view @setBlur="setBlur" />
         </transition>
          </component>
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
    'user-settings': () => import('../pages/user/profile/UserSettings.vue'),
    // eslint-disable-next-line vue/no-unused-components
    'GlassDark': () => import('./themes/GlassDark'),
    // eslint-disable-next-line vue/no-unused-components
    'GlassLight': () => import('./themes/GlassLight'),
    // eslint-disable-next-line vue/no-unused-components
    'ClassicDark': () => import('./themes/ClassicDark'),
    // eslint-disable-next-line vue/no-unused-components
    'ClassicLight': () => import('./yyythemes/ClassicLight')
  },
  computed: {
    themeUser () { return this.$route.fullPath === '/editor/index' ? 'GlassLight' : 'GlassDark' },
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
  async created () {
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
    })
    const { currentUser } = this
    console.log(currentUser, 'currentUser')
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      // console.log(this.currentUser)
      this.$q.loading.hide()
      if (currentUser && currentUser.firstAccess) {
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
    if (firebase && firebase.messaging && firebase.messaging.isSupported()) {
      if (!(firebase && firebase.apps && firebase.apps.length) && window.location.origin !== 'http://localhost:8080') {
        try {
          fetch('/__/firebase/init.json').then(async response => {
            try {
              firebase.initializeApp(await response.json())
            } catch (e) {
              console.log(e)
            }
            this.setupNotif()
          })
        } catch (error) {
          console.error(error)
        }
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
          title: 'Dashboard',
          caption: '',
          icon: 'dashboard',
          link: '#/home'
          // separator: true,

        },
        {
          title: 'Asistentes',
          caption: '',
          icon: 'assistant',
          // separator: true,
          tree:
             [
               { label: 'Intro',
                 link: 'intro',
                 handler: (node) => this.onClickGuide('intro') },
               //  { label: 'Agregar opciones a Productos',
               //    link: 'addopts',
               //    handler: (node) => this.onClickGuide('addopts') },
               { label: 'Cambiar Tema de Cliente',
                 link: 'quicktheme',
                 handler: (node) => this.onClickGuide('quicktheme') }
             ]

        },
        {
          title: 'Catálogo',
          caption: '',
          icon: 'menu_book',
          // separator: true,
          tree: [

            {
              label: 'Categorías',
              caption: '',
              icon: 'fa fa-bars',
              handler: () => this.$router.push({ path: '/menu/categorias' })
              // separator: true,

            },
            {
              label: 'Productos',
              caption: '',
              icon: 'fas fa-utensils',
              handler: () => this.$router.push({ path: '/menu/menu' })
              // separator: true,

            },
            {
              label: 'Multi Catálogo',
              caption: '',
              icon: 'fas fa-filter',
              handler: () => this.$router.push({ path: '/menu/menufilters' })
              // separator: true,

            },
            {
              label: 'Opciones',
              caption: '',
              icon: 'fab fa-gulp',
              handler: () => this.$router.push({ path: '/menu/options' })
              // separator: true,

            },
            {
              label: 'Grupos de Opciones',
              caption: '',
              icon: 'menu_book',
              handler: () => this.$router.push({ path: '/menu/GroupOptions' })
              // separator: true,

            },
            // {
            //   label: 'Config Grupos de Opciones',
            //   caption: '',
            //   icon: 'menu_book',
            //   handler: () => this.$router.push({ path: '/menu/optionsconf' })
            //   // separator: true,

            // },
            {
              label: 'Promociones',
              caption: '',
              icon: 'fas fa-ad',
              handler: () => this.$router.push({ path: '/menu/promo' })
              // separator: true,

            }

          ]
        },
        {
          title: 'Ordenes',
          caption: '',
          icon: 'room_service',
          link: '#/orders/index'
          // separator: true,

        },
        /* {
          title: 'Pagos',
          caption: '',
          icon: 'fa fa-briefcase',
          link: '#/payments/index',
          // separator: true,

        }, */
        {
          title: 'Pagos',
          caption: '',
          icon: 'request_quote',
          // separator: true,
          tree: [

            { label: 'Consulta general',
              link: 'index',
              handler: (node) => this.onClickPayments('index') },
            { label: 'Transacciones',
              link: 'transactions',
              handler: (node) => this.onClickPayments('transactions') }

          ]
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'fa fa-user',
          link: '#/clients/index'
          // separator: true,

        },
        {
          title: 'Configuración',
          caption: '',
          icon: 'fa fa-cog',
          // separator: true,
          tree: [
            {
              label: 'General',
              link: 'general',
              handler: (node) => this.onClickOption('general')
            },
            {
              label: 'Sedes',
              handler: () => this.$router.push({ path: '/localization/index' })
            },
            { label: 'Horarios',
              link: 'schedule',
              handler: (node) => this.onClickOption('schedule') },
            { label: 'Servicios de Pago',
              link: 'paymentServ',
              handler: (node) => this.onClickOption('paymentServ') },
            { label: 'Servicios y Rewards',
              link: 'services',
              handler: (node) => this.onClickOption('services') },
            { label: 'Tasa de cambio',
              link: 'rate',
              handler: (node) => this.onClickOption('rate') },
            {
              label: 'Usuarios',
              handler: () => this.$router.push({ path: '/users/index' })

            },
            {
              label: 'Widgets',
              // separator: true,
              tree: [
                { label: 'Chat',
                  link: 'chat',
                  handler: (node) => this.onClickOption('chat') }
              ]
            }
            // {
            //   label: 'Editor Web',
            //   link: () => this.$router.push({ path: '/editor/index' })
            // }
          ]
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
      if (Notification && Notification.permission === 'denied') {
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
      window.location.reload()
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
      // this.blurLayout = !this.blurLayout
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    },
    onClickOption (node) {
      this.$router.push({ path: '/settings/' + node })
    },
    onClickGuide (node) {
      this.$router.push({ path: '/guide/' + node })
    },
    onClickPayments (node) {
      this.$router.push({ path: '/payments/' + node })
    },
    onClickReports (node) {
      this.$router.push({ path: '/reports/' + node })
    }
  },
  watch: {
    currentUser (e) {
      this.$q.loading.hide()
      this.setupNotif()
      console.log('User Data available', { e })
      if (!(e && e.rol)) {
        this.$router.push({ path: '/auth/login' })
      }
      if (e && e.firstAccess) {
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
    }
    // orders (e) {
    //   if (e.length === 0) {
    //     return
    //   }
    //   if (this.initAudio === 0) {
    //     if (typeof this.$refs['mediapl'] !== 'undefined') {
    //       this.$refs['mediapl'].play()
    //     }
    //     // console.log(this.orders.length, this.countOrder, 'COUNT2', e.length)
    //     this.initAudio = 1
    //   } else {
    //     // console.log(this.orders.length, this.countOrder, 'COUNT')
    //     if (this.initAudio === 2 && this.orders.length > this.countOrder) {
    //       this.countOrder = this.orders.length
    //       this.showNotif()
    //     }
    //     this.initAudio = 2
    //   }
    // }
  }
}
</script>
<style lang="stylus">
  .main
    &.blur-layout
      filter blur(5px)
  .q-drawer
    overflow hidden
  .q-toolbar
    background-repeat no-repeat
    background-size 15vmin
    background-position center
  .q-popup-edit
    min-width: unset !important
  .q-popup-edit__buttons > .q-btn
    color: white !important
</style>
