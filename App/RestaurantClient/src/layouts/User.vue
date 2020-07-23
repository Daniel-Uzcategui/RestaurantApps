<template>
   <q-layout class="main bg-image" :class="{ 'blur-layout': blurLayout }" view="hHh lpR fFf">
      <q-header class="bg-transparent text-white" v-if="currentUser">
         <q-toolbar>
            <q-btn
               flat
               color="grey"
               dense
               round
               icon="menu"
               aria-label="Menu"
               @click="leftDrawerOpen = !leftDrawerOpen"
               />
               <q-btn class="text-caption" flat v-ripple @click.native="setEditUserDialog(true); setBlur()" label="Perfil" />
               <q-dialog v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="setBlur">
                  <user-settings></user-settings>
               </q-dialog>
                <q-btn flat name="cart" icon="fas fa-shopping-cart" to="/cart/index" exact >
                  <q-badge color="red" floating>{{getCartQ}}</q-badge>
                </q-btn>
               <q-toggle class="fixed-top-right" color="primary" icon="fas fa-sun" keep-color @input="$q.dark.toggle(); toggleColors()" :value="$q.dark.isActive" />
         </q-toolbar>
      </q-header>
      <q-drawer
         :content-class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'"
         v-model="leftDrawerOpen"
         show-if-above
         bordered
         >
         <q-list>
            <Nav
               v-for="link in nav"
               :key="link.title"
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
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      console.log(this.currentUser)
      this.$q.loading.hide()
    }
  },
  data () {
    return {
      notifications: 0,
      blurLayout: false,
      leftDrawerOpen: false,
      nav: [
        {
          title: 'Inicio',
          caption: '',
          icon: 'fa fa-home',
          link: '#/home'
        },
        {
          title: 'Menus',
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
          title: 'Encuentranos',
          caption: '',
          icon: 'fa fa-globe',
          link: '#/findus'
        },
        {
          title: 'Mis Direcciones',
          caption: '',
          icon: 'fas fa-map-marked-alt',
          link: '#/user/address'
        },
        {
          title: 'Cerrar Sesión',
          caption: '',
          icon: 'fas fa-sign-out-alt',
          link: '#',
          click: this.logoutUser
        }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
    toggleColors () {
      this.$q.dark.isActive ? colors.setBrand('primary', '#107154') : colors.setBrand('primary', '#43A047')
      this.$q.dark.isActive ? colors.setBrand('secondary', '#0C6247') : colors.setBrand('secondary', '#92CD94')
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
    }
  }
}
</script>
<style lang="stylus" scoped>
  .main
    &.blur-layout
      filter blur(5px)
  .bg-image {
    background-image: url(https://c1.wallpaperflare.com/preview/510/897/163/close-up-cuisine-delicious-dinner.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
