<template>
  <q-layout class="main bg-green-1" :class="{ 'blur-layout': blurLayout }" view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>Nombre de aplicacion</q-toolbar-title>
        <div>botones y nombre de usuario</div>
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
  </q-layout>
</template>

<script>
import Nav from 'components/nav'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UserLayout',
  components: {
    Nav
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    productName () {
      return window.sessionStorage.productName
    }
  },
  created () {
    // Check that our app has access to the user id
    // from Firebase before the page renders
    console.log('FIREBASE AUTH USER uid', this.$store.state.auth.uid)
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
          icon: 'home',
          link: '/'
        },
        {
          title: 'Sedes',
          caption: '',
          icon: 'location_on',
          link: '/'
        },
        {
          title: 'Categorias',
          caption: '',
          icon: 'list',
          link: '/'
        },
        {
          title: 'Menus',
          caption: '',
          icon: 'menu_book',
          link: '/'
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
          icon: 'card_travel',
          link: '/'
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'people_outline',
          link: '/'
        },
        {
          title: 'Perfil',
          caption: '',
          icon: 'person',
          link: '/'
        },
        {
          title: 'Usuarios',
          caption: '',
          icon: 'people',
          link: '/'
        },
        {
          title: 'Configuración',
          caption: '',
          icon: 'settings',
          link: '/'
        }
      ]
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    setBlur () {
      this.blurLayout = !this.blurLayout
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
</style>
