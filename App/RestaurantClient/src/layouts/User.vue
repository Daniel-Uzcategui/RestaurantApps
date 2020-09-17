<template>
   <q-layout class="main my-font2" :class="{ 'blur-layout': blurLayout, 'default-bg-image': typeof page.class === 'undefined' ? true : false, [page.class]: [page.class] }" :style="!$q.dark.isActive ? 'background-color: #efefef;' + page.style : '' + page.style" view="hhh LpR fFf">
         <q-toolbar class="bg-transparent text-white" style="z-index: 100">
                <q-btn flat
                v-if="!leftDrawerOpen"
               color="primary"
               dense
               round
               icon='fas fa-bars'
               class="burgericon"
              name="cart"
               @click="leftDrawerOpen = !leftDrawerOpen"
               exact />
               <q-dialog v-if="!isAnonymous" v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="blurLayout = false">
                  <user-settings></user-settings>
               </q-dialog>
               <div class="absolute-right">
                 <q-btn to="/cart/index" color="white" class="carticon" flat icon="fas fa-shopping-cart" >
                   <q-badge color="red" floating>{{getCartQ}}</q-badge>
                 </q-btn>
               <q-toggle color="primary" class="toggleicon" icon="fas fa-sun" keep-color @input="$q.dark.toggle(); toggleColors()" :value="$q.dark.isActive" />
               </div>
         </q-toolbar>
      <q-drawer
         overlay
         on-layout="hide"
         :content-class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'"
         v-model="leftDrawerOpen"
         behavior="mobile"
         >
         <q-list>
            <Nav
               v-for="(link, index) in nav"
               :key="index"
               v-bind="link"
               />
          <q-item
            v-if="chat && chat.status && chat.key && Tawk_API !== null"
            @click.native="Tawk_API.toggleVisibility()"
            clickable
          >
            <q-item-section
              avatar
            >
              <q-icon name="fas fa-comment" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ 'Toggle Chat' }}</q-item-label>
              <q-item-label caption>
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
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
import Vue from 'vue'
import Nav from 'components/nav'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { QSpinnerGears, QSpinnerRadio, colors } from 'quasar'
import * as firebase from 'firebase/app'
import '@firebase/messaging'
export default {
  name: 'UserLayout',
  components: {
    Nav,
    'user-settings': () => import('../pages/user/profile/UserSettings.vue')
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['configurations']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['cart']),
    ...mapGetters('editor', ['editor']),
    page () {
      var obj = this.editor.find(e => e.id === 'page')
      return typeof obj === 'undefined' ? {} : obj
    },
    paymentServ () {
      return this.configurations.find(obj => {
        return obj.id === 'paymentServ'
      })
    },
    chat () {
      return this.configurations.find(obj => {
        return obj.id === 'chat'
      })
    },
    getCartQ () {
      var amt = 0
      for (const i in this.cart) {
        amt = this.cart[i].quantity + amt
      }
      return amt
    },
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
    this.bindBlocks().then((e) => {
      this.$q.loading.hide()
      this.toggleColors()
      console.log({ bindblock: e })
      var obj = e.find(e => e.id === 'blocks')
      this.insCss(typeof obj === 'undefined' ? '' : typeof obj.css === 'undefined' ? '' : obj.css)
    })
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
    this.bindConfigs().then(() => {
      this.chatServe(this.chat)
      this.PaypalServe(this.paymentServ)
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
    const { currentUser } = this
    if (typeof this.$router.currentRoute.meta !== 'undefined') {
      if (Object.keys(this.$router.currentRoute.meta).length === 0) {
        this.$q.loading.hide()
      }
    }
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      this.$q.loading.hide()
    }
    this.navigateFill()
    this.setupNotif()
  },
  data () {
    return {
      Tawk_API: null,
      notifications: 0,
      blurLayout: false,
      leftDrawerOpen: false,
      nav: []
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
    ...mapActions('user', ['setValue']),
    ...mapActions('config', ['bindConfigs', 'bindEnv']),
    ...mapActions('editor', ['bindBlocks']),
    getNewVer () {
      window.location.reload(true)
    },
    setupNotif () {
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
            if (!that.isAnonymous && that.currentUser && that.currentUser.fcm !== token) {
              that.setValue({ payload: { value: token, id: that.currentUser.id, key: 'fcm' }, collection: 'users' })
            }
          })
          .catch(err => {
            console.error('No permission to send push', err)
          })
      })
    },
    navigateFill () {
      let navig = [{
        title: 'Inicio',
        caption: '',
        icon: 'fa fa-home',
        link: '#/home'
      },
      {
        title: 'Catálogo',
        caption: '',
        icon: 'menu_book',
        link: '#/menu/index'
      },
      {
        title: 'Tus Ordenes',
        caption: '',
        icon: 'room_service',
        link: '#/orders/index'
      },
      {
        title: 'Mis Recompensas',
        caption: '',
        icon: 'fas fa-gift',
        link: '#/user/rewards'
      },
      {
        title: 'Mis Direcciones',
        caption: '',
        icon: 'fas fa-map-marked-alt',
        link: '#/user/address'
      },
      {
        title: 'Encuentranos',
        caption: '',
        icon: 'fa fa-globe',
        link: '#/findus'
      },
      {
        title: 'Perfil',
        caption: '',
        icon: 'fas fa-user',
        link: '#',
        click: () => { this.isAnonymous ? (() => {})() : (() => { this.setEditUserDialog(true); this.setBlur() })() }
      },
      {
        title: this.isAnonymous ? 'Login/Register' : 'Cerrar Sesión',
        caption: '',
        icon: 'fas fa-sign-out-alt',
        link: '#',
        click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.logoutUser() })() }
      }]
      for (let i of navig) {
        Vue.set(this.nav, this.nav.length, i)
        console.log({ i })
      }
    },
    toggleColors () {
      console.log('editor', { ...this.editor })
      this.$q.dark.isActive ? colors.setBrand('primary', '#107154') : colors.setBrand('primary', '#43A047')
      this.$q.dark.isActive ? colors.setBrand('secondary', '#0C6247') : colors.setBrand('secondary', '#92CD94')
      if (this.page) {
        if (!this.$q.dark.isActive) {
          for (let key in this.page) {
            if (key.includes('light')) {
              var colorLabel = (key.replace('light', '')).toLowerCase()
              colors.setBrand(colorLabel, this.page[key])
            }
          }
        } else {
          for (let key in this.page) {
            if (key.includes('dark')) {
              colorLabel = (key.replace('dark', '')).toLowerCase()
              colors.setBrand(colorLabel, this.page[key])
            }
          }
        }
      }
    },
    async chatServe (config) {
      var that = this
      if (config && config.status && config.key) {
        // eslint-disable-next-line
        window.Tawk_API = {}, window.Tawk_LoadStart = new Date();
        window.Tawk_API.onLoad = function () {
          console.log('Tawk loaded')
          Vue.set(that, 'Tawk_API', window.Tawk_API)
          if (that.$q.platform.is.mobile) {
            window.Tawk_API.hideWidget()
          }
        };
        (async function () {
          var s1 = document.createElement('script'), s0 = document.getElementsByTagName('script')[0]
          s1.async = true
          s1.src = `https://embed.tawk.to/${config.key}/default`
          s1.charset = 'UTF-8'
          s1.setAttribute('crossorigin', '*')
          s0.parentNode.insertBefore(s1, s0)
          return s1.src
        })()
      }
    },
    async PaypalServe (config) {
      if (config && config.statusPaypal && config.PaypalApi) {
        (async function () {
          var s1 = document.createElement('script'), s0 = document.getElementsByTagName('script')[0]
          s1.async = true
          s1.src = `https://www.paypal.com/sdk/js?client-id=${config.PaypalApi}`
          s1.charset = 'UTF-8'
          s1.setAttribute('crossorigin', '*')
          s0.parentNode.insertBefore(s1, s0)
          return s1.src
        })()
      }
    },
    insCss (css) {
      var s1 = document.createElement('style'), s0 = document.getElementsByTagName('script')[0]
      s1.innerHTML = css
      s0.parentNode.insertBefore(s1, s0)
      return s1.src
    },
    setBlur () {
      this.blurLayout = !this.blurLayout
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    }
  },
  watch: {
    editor (e) {
      console.log('editor updated')
      var obj = e.find(e => e.id === 'blocks')
      this.insCss(typeof obj === 'undefined' ? '' : typeof obj.css === 'undefined' ? '' : obj.css)
    },
    currentUser () {
      this.$q.loading.hide()
      this.setupNotif()
    },
    Tawk_API () {
      console.log('asdasdasd')
    }
  }
}
</script>
<style lang="stylus" scoped>
  @font-face
    font-family: customfont;
    src: url(https://fonts.googleapis.com/css?family=Karla);
  .my-font
    font-family: 'customfont';
  .main
    &.blur-layout
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -o-filter: blur(5px);
      -ms-filter: blur(5px);
      filter blur(5px)
  .bluriframe {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  background-color: #ccc;
}
</style>
