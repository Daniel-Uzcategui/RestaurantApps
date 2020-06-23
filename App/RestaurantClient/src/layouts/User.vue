<template>
   <q-layout class="main bg-image" :class="{ 'blur-layout': blurLayout }" view="hHh lpR fFf">
      <q-header class="bg-transparent text-white" v-if="currentUser">
         <q-toolbar v-if="false">
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
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
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
         </q-toolbar>
         <q-toolbar v-if="true">
            <q-btn
               flat
               color="grey"
               dense
               round
               icon="menu"
               aria-label="Menu"
               @click="leftDrawerOpen = !leftDrawerOpen"
               />
         </q-toolbar>
      </q-header>
      <q-drawer
         v-model="leftDrawerOpen"
         show-if-above
         bordered
         content-class="bg-grey-1">
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
    <q-footer elevated class="bg-grey-8 text-white">
      <q-tabs
      dense
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="cart" icon="fas fa-shopping-cart" label="Carrito">
          <q-badge color="red" floating>{{getCartQ}}</q-badge>
        </q-tab>
        <q-tab name="alarms" icon="alarm" label="Alarms">
          <q-badge color="red" floating>10+</q-badge>
        </q-tab>
        <q-tab alert name="movies" icon="movie" label="Movies" />
      </q-tabs>
    </q-footer>
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
          title: 'Sedes',
          caption: '',
          icon: 'fa fa-globe',
          link: '#/localization/index'
        },
        {
          title: 'Categorias',
          caption: '',
          icon: 'fa fa-bars',
          link: '#/menu/categorias'
        },
        {
          title: 'Extras',
          caption: '',
          icon: 'fas fa-utensils',
          link: '#/menu/extras'
        },
        {
          title: 'Menus',
          caption: '',
          icon: 'menu_book',
          link: '#/menu/menu'
        },
        {
          title: 'Ordenes',
          caption: '',
          icon: 'room_service',
          link: '/'
        },
        {
          title: 'Pagos',
          caption: '',
          icon: 'fa fa-briefcase',
          link: '/'
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'fa fa-user',
          link: '#/clients/index'
        },
        {
          title: 'Usuarios',
          caption: '',
          icon: 'fa fa-users',
          link: '/'
        }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
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
