<template>
   <q-layout class="main bg-image" :class="{ 'blur-layout': blurLayout }" view="hhh LpR fFf">
         <q-toolbar class="bg-transparent text-white" style="z-index: 100">
                <q-btn fab
                v-if="!leftDrawerOpen"
               color="primary"
               dense
               round
               icon='fas fa-bars'
              name="cart"
               @click="leftDrawerOpen = !leftDrawerOpen"
               exact />
               <q-dialog v-if="!isAnonymous" v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="blurLayout = false">
                  <user-settings></user-settings>
               </q-dialog>
               <div class="absolute-right">
                 <q-btn to="/cart/index" color="white" flat icon="fas fa-shopping-cart" >
                   <q-badge color="red" floating>{{getCartQ}}</q-badge>
                 </q-btn>
               <q-toggle color="primary" icon="fas fa-sun" keep-color @input="$q.dark.toggle(); toggleColors()" :value="$q.dark.isActive" />
               </div>
         </q-toolbar>
      <q-drawer
         on-layout="hide"
         :content-class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'"
         v-model="leftDrawerOpen"
         bordered
         >
         <q-list>
            <Nav
               v-for="(link, index) in nav"
               :key="index"
               v-bind="link"
               />
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
export default {
  name: 'UserLayout',
  components: {
    Nav,
    'user-settings': () => import('../pages/user/profile/UserSettings.vue')
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['config']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['cart']),
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
  created () {
    // Check that our app has access to the user id
    // from Firebase before the page renders
    console.log({ rt: this.$router.currentRoute.fullPath })
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
    const { currentUser } = this
    console.log({ rt: this.$router })
    if (typeof this.$router.currentRoute.meta !== 'undefined') {
      if (Object.keys(this.$router.currentRoute.meta).length === 0) {
        this.$q.loading.hide()
      }
    }
    console.log({ t: this.currentUser })
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      console.log(this.currentUser)
      this.$q.loading.hide()
    }
    this.chatServe(this.config)
    this.navigateFill()
  },
  data () {
    return {
      notifications: 0,
      blurLayout: false,
      leftDrawerOpen: false,
      nav: []
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
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
        title: 'Perfil',
        caption: '',
        icon: 'fas fa-user',
        link: '#',
        click: () => { this.isAnonymous ? (() => {})() : (() => { this.setEditUserDialog(true); this.setBlur() })() }
      },
      {
        title: 'Tus Ordenes',
        caption: '',
        icon: 'room_service',
        link: '#/orders/index'
      },
      {
        title: 'Encuentranos',
        caption: '',
        icon: 'fa fa-globe',
        link: '#/findus'
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
      this.$q.dark.isActive ? colors.setBrand('primary', '#107154') : colors.setBrand('primary', '#43A047')
      this.$q.dark.isActive ? colors.setBrand('secondary', '#0C6247') : colors.setBrand('secondary', '#92CD94')
    },
    async chatServe (config) {
      console.log({ ...config })
      if (config.tawkChat.active) {
        // eslint-disable-next-line
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        window.Tawk_API.onBeforeLoad = function () {
          console.log('Tawk loaded')
          if (this.$q.platform.is.mobile) {
            // wwindow.Tawk_API.hideWidget()
          }
        };
        (async function () {
          var s1 = document.createElement('script'), s0 = document.getElementsByTagName('script')[0]
          s1.async = true
          s1.src = `https://embed.tawk.to/${config.tawkChat.value}/default`
          s1.charset = 'UTF-8'
          s1.setAttribute('crossorigin', '*')
          s0.parentNode.insertBefore(s1, s0)
          return s1.src
        })()
      }
    },
    setBlur () {
      this.blurLayout = !this.blurLayout
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
    },
    Tawk_API () {
      console.log('asdasdasd')
    }
  }
}
</script>
<style lang="stylus" scoped>
  .main
    &.blur-layout
      -webkit-filter: blur(5px);
      -moz-filter: blur(5px);
      -o-filter: blur(5px);
      -ms-filter: blur(5px);
      filter blur(5px)
  .bg-image {
    background-image: url(https://c1.wallpaperflare.com/preview/510/897/163/close-up-cuisine-delicious-dinner.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bluriframe {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  background-color: #ccc;
}
</style>
