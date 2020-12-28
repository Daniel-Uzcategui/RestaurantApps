<template>
   <q-layout class="main my-font2" :class="{ 'blur-layout': blurLayout, 'default-bg-image': typeof page.class === 'undefined' ? true : false, [page.class]: [page.class] }" :style="!$q.dark.isActive ? 'background-color: #ffffff;' + page.style : 'background-color: #1d1d1d;' + page.style" view="hhh LpR fFf">
         <q-toolbar class="absolute-top logocont" >
           <div class="relative-position full-width">
                <q-btn flat
                v-if="!leftDrawerOpen"
               dense
               round
               icon='fas fa-bars'
               class="burgericon"
               name="cart"
               @click.passive="leftDrawerOpen = !leftDrawerOpen"
               style="z-index: 99999"
               exact />
               <div class="absolute-right">
                 <q-btn to="/cart/index" style="z-index: 99999" class="carticon" flat icon="fas fa-shopping-cart" >
                   <q-badge color="red" floating>{{getCartQ}}</q-badge>
                 </q-btn>
               <q-toggle v-show="false" class="toggleicon" icon="fas fa-sun" keep-color @input="$q.dark.toggle(); toggleColors()" :value="$q.dark.isActive" />
               </div>
            </div>
            <q-dialog v-if="!isAnonymous" v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="blurLayout = false">
                  <user-settings></user-settings>
               </q-dialog>
         </q-toolbar>
      <q-drawer
         style="z-index: 99999"
         overlay
         on-layout="hide"
         :content-class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'"
         v-model="leftDrawerOpen"
         behavior="mobile"
         >
         <q-list class="q-pa-xl">
            <Nav
               v-ripple
               v-for="(link, index) in nav"
               :key="index"
               v-bind="link"
               />
          <q-item v-ripple
            v-if="chat && chat.status && chat.key && Tawk_API !== null"
            @click.native="Tawk_API.toggleVisibility()"
            clickable
          >
            <q-item-section v-if="this.menucfg && this.menucfg.iconsactive"
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
      <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
   </q-layout>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import Vue from 'vue'
import Nav from 'components/nav'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { QSpinnerGears, QSpinnerRadio, colors } from 'quasar'
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
    ...mapGetters('config', ['configurations', 'paymentServ', 'chat', 'menucfg']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['cart', 'filters']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('editor', ['blocks', 'page', 'routes']),
    nav () {
      // return this.navigateFill()
      var mapping = []
      var mapping2 = []
      var filtro = this.filters.filter(x => x.show === true)
      if (filtro.length) {
        mapping = filtro.map(x => {
          return {
            title: x.name,
            caption: x.descripcion,
            icon: x.icon,
            // link: '#/menu/index',
            click: () => {
              this.setFilter(x.id)
              this.leftDrawerOpen = false
              if (this.localizations.length === 1) {
                this.setSede(this.localizations[0].id)
                this.$router.push({ path: '/menu/menu' })
              } else {
                this.$router.push({ path: '/menu/index' })
              }
            }
          }
        })
        console.log({ mapping })
      }
      if (this.menucfg && this.menucfg.menuactive) {
        if (this.menucfg && this.menucfg.dispName) {
          mapping2 = [{
            title: this.menucfg.dispName,
            caption: '',
            icon: 'menu_book',
            // link: '#/menu/index',
            click: () => {
              this.setFilter('')
              this.leftDrawerOpen = false
              if (this.localizations.length === 1) {
                this.setSede(this.localizations[0].id)
                this.$router.push({ path: '/menu/menu' })
              } else {
                this.$router.push({ path: '/menu/index' })
              }
            }
          }]
        } else {
          mapping2 = [{
            title: 'Catálogo',
            caption: '',
            icon: 'menu_book',
            // link: '#/menu/index',
            click: () => {
              this.setFilter('')
              this.leftDrawerOpen = false
              if (this.localizations.length === 1) {
                this.setSede(this.localizations[0].id)
                this.$router.push({ path: '/menu/menu' })
              } else {
                this.$router.push({ path: '/menu/index' })
              }
            }
          }]
        }
      }
      mapping = [...mapping2, ...mapping]
      if (this.paymentServ && this.paymentServ.statusRewards) {
        mapping = [...mapping,
          {
            title: 'Mis Recompensas',
            caption: '',
            icon: 'fas fa-gift',
            link: '#/user/rewards',
            click: () => {
              this.leftDrawerOpen = false
            }
          }
        ]
      }
      let navig = [{
        title: 'Inicio',
        caption: '',
        icon: 'fa fa-home',
        link: '#/home',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      ...mapping,
      {
        title: 'Tus Ordenes',
        caption: '',
        icon: 'room_service',
        link: '#/orders/index',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      {
        title: 'Mis Direcciones',
        caption: '',
        icon: 'fas fa-map-marked-alt',
        link: '#/user/address',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      {
        title: 'Encuentranos',
        caption: '',
        icon: 'fa fa-globe',
        link: '#/findus',
        click: () => {
          this.leftDrawerOpen = false
        }
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
        click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.logoutUser(); localStorage.removeItem('ott-token') })() }
      }]
      console.log({ men: this.menucfg })
      if (this.menucfg && !this.menucfg.iconsactive) {
        navig = navig.map(x => { return { ...x, icon: '' } })
      }
      return navig
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
  async mounted () {
    // if (this.blocks && (this.blocks.css || this.blocks.scopedCss)) {
    //   this.$q.loading.hide()
    //   // console.log({ bindblock: e })
    //   var obj = this.blocks
    //   this.insCss(typeof obj === 'undefined' ? '' : typeof obj.css === 'undefined' ? '' : obj.css)
    //   var css
    //   let scopedCss = typeof obj === 'undefined' ? '' : typeof obj.scopedCss === 'undefined' ? '' : obj.scopedCss
    //   if (scopedCss !== '') {
    //     css = scopedCss.find(e => e.route === this.fullPath)
    //     if (typeof css !== 'undefined' && css !== '') {
    //       this.insCss(css.css)
    //     }
    //   }
    // }
    this.bindBlocks().then((e) => {
      this.$q.loading.hide()
      // console.log({ bindblock: e })
      var obj = e
      this.insCss(typeof obj === 'undefined' ? '' : typeof obj.css === 'undefined' ? '' : obj.css)
      var css
      let scopedCss = typeof obj === 'undefined' ? '' : typeof obj.scopedCss === 'undefined' ? '' : obj.scopedCss
      if (scopedCss !== '') {
        css = scopedCss.find(e => e.route === this.fullPath)
        if (typeof css !== 'undefined' && css !== '') {
          this.insCss(css.css)
        }
      }
    }).catch(e => {
      console.error('error fetching data firebase', { e })
    })
    this.bindRoutes().then(() => this.addRoutes()).catch(e => console.error('error fetching data firebase', { e }))
    this.bindPage().then(() => this.toggleColors()).catch(e => {
      console.error('error fetching data firebase', { e })
      this.toggleColors()
    })
    this.bindFilters().catch(e => console.error('error fetching data firebase', { e }))
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
    this.bindMenuCfg()
    this.bindPaymentServ().then(() => {
      this.PaypalServe(this.paymentServ)
    }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindChat().then(() => {
      this.chatServe(this.chat)
    }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindManif().then(e => {
      if (e.icons && e.icons.favicon) {
        const favicon = document.getElementById('favicon')
        favicon.setAttribute('href', e.icons.favicon)
      }
      if (e.name) {
        const title = document.getElementById('apptitle')
        title.innerText = e.name
      }
    }).catch(e => {
      console.error('error fetching data firebase', { e })
      if (e.icons && e.icons.favicon) {
        const favicon = document.getElementById('favicon')
        favicon.setAttribute('href', e.icons.favicon)
      }
      if (e.name) {
        const title = document.getElementById('apptitle')
        title.innerText = e.name
      }
    }

    )
    this.bindEnv()
    // .then(e => {
    //   // console.log({ environment: e })
    //   let ver = localStorage.getItem('envVer')
    //   if (ver === null) {
    //     localStorage.setItem('envVer', e.version)
    //   } else if (ver !== e.version) {
    //     this.$q.dialog({
    //       title: 'Nueva Version',
    //       message: 'Hay una nueva version disponible.\nRefrescar la app para descargar las nuevas actualizaciones?',
    //       cancel: true,
    //       persistent: true
    //     }).onOk(() => {
    //       localStorage.setItem('envVer', e.version)
    //       if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker.getRegistrations().then(function (registrations) {
    //           for (let registration of registrations) {
    //             registration.update()
    //           }
    //         })
    //       }
    //       this.getNewVer()
    //     })
    //   }
    //   if (ver === e.version) {
    //     // console.log('App is in the newer version')
    //   }
    // }).catch(e => console.error('error fetching data firebase', { e }))
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
    function iOS () {
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform) ||
  // iPad on iOS 13 detection
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    }
    // eslint-disable-next-line no-undef
    let messaging = typeof firebase.messaging === 'undefined' ? firebase.default.messaging : firebase.messaging
    let fb = typeof firebase.default === 'undefined' ? firebase : firebase.default
    if (messaging.isSupported() && !iOS()) {
      if (!fb.apps.length) {
        fetch('/__/firebase/init.json').then(async response => {
          fb.initializeApp(await response.json())
          this.setupNotif()
        }).catch(e => console.error('error fetching cfg firebase', { e }))
      } else {
        this.setupNotif()
      }
    }
    this.bindLocalizations().catch(e => console.error('error fetching data firebase', { e }))
    this.bindMenu().catch(e => console.error('error fetching data firebase', { e }))
    this.bindCategorias().catch(e => console.error('error fetching data firebase', { e }))
    this.bindPromos().catch(e => console.error('error fetching data firebase', { e }))
    this.bindGroupComp().catch(e => console.error('error fetching data firebase', { e }))
    this.bindItem().catch(e => console.error('error fetching data firebase', { e }))
  },
  updated () {
    this.fullPath = this.$router.history.current.fullPath
  },
  data () {
    return {
      fullPath: '',
      Tawk_API: null,
      notifications: 0,
      blurLayout: false,
      leftDrawerOpen: false
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
    ...mapActions('user', ['setValue']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindPaymentServ', 'bindChat', 'bindEnv', 'bindManif', 'bindMenuCfg']),
    ...mapActions('editor', ['bindBlocks', 'bindRoutes', 'bindPage']),
    ...mapActions('menu', ['bindFilters', 'setFilter', 'bindMenu', 'bindItem', 'bindCategorias', 'bindPromos', 'bindGroupComp', 'setSede']),
    addRoutes () {
      let { routes } = this.$router.options
      let routerAdd = this.routes
      if (typeof routerAdd !== 'undefined') {
        let routeData = routes.find(r => r.path === '/pg')
        let node, ii
        let stack = []
        let parent = routerAdd
        stack.push(parent)
        while (stack.length > 0) {
          node = stack.pop()
          if (typeof node.children !== 'undefined') {
            for (ii = 0; ii < node.children.length; ii += 1) {
              node.children[ii].component = () => import('pages/pgs.vue')
              stack.push(node.children[ii])
            }
          }
        }
        routeData.children = routerAdd.children
        this.$router.addRoutes([routeData])
        console.log({ routes }, 'Routes2')
      }
    },
    getNewVer () {
      window.location.reload(true)
    },
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
        const messaging = typeof firebase.messaging === 'undefined' ? firebase.default.messaging() : firebase.messaging()
        messaging
          .requestPermission()
          .then(() => {
            // console.log('Notif allowed')
            return messaging.getToken()
          })
          .then(token => {
            // console.log('Token Is : ' + token)
            if (!that.isAnonymous && that.currentUser && (typeof that.currentUser.fcm === 'string' || typeof that.currentUser.fcm === 'undefined' || !that.currentUser.fcm.includes(token))) {
              that.setValue({ payload: { value: typeof that.currentUser.fcm === 'undefined' || typeof that.currentUser.fcm === 'string' ? [token] : [...that.currentUser.fcm, token], id: that.currentUser.id, key: 'fcm' }, collection: 'users' })
            }
          })
          .catch(err => {
            console.error('No permission to send push', err)
          })
      })
    },
    navigateFill () {
      var mapping = []
      var mapping2 = []
      var filtro = this.filters.filter(x => x.show === true)
      if (filtro.length) {
        mapping = filtro.map(x => {
          return {
            title: x.name,
            caption: x.descripcion,
            icon: x.icon,
            link: '#/menu/index',
            click: () => {
              this.setFilter(x.id)
              this.leftDrawerOpen = false
            }
          }
        })
        console.log({ mapping })
      }
      if (this.menucfg && this.menucfg.menuactive) {
        if (this.menucfg && this.menucfg.dispName) {
          mapping2 = [{
            title: this.menucfg.dispName,
            caption: '',
            icon: 'menu_book',
            link: '#/menu/index',
            click: () => {
              this.setFilter('')
              this.leftDrawerOpen = false
            }
          }]
        } else {
          mapping2 = [{
            title: 'Catálogo',
            caption: '',
            icon: 'menu_book',
            link: '#/menu/index',
            click: () => {
              this.setFilter('')
              this.leftDrawerOpen = false
            }
          }]
        }
      }
      mapping = [...mapping2, ...mapping]
      if (this.paymentServ && this.paymentServ.statusRewards) {
        mapping = [...mapping,
          {
            title: 'Mis Recompensas',
            caption: '',
            icon: 'fas fa-gift',
            link: '#/user/rewards',
            click: () => {
              this.leftDrawerOpen = false
            }
          }
        ]
      }
      let navig = [{
        title: 'Inicio',
        caption: '',
        icon: 'fa fa-home',
        link: '#/home',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      ...mapping,
      {
        title: 'Tus Ordenes',
        caption: '',
        icon: 'room_service',
        link: '#/orders/index',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      {
        title: 'Mis Direcciones',
        caption: '',
        icon: 'fas fa-map-marked-alt',
        link: '#/user/address',
        click: () => {
          this.leftDrawerOpen = false
        }
      },
      {
        title: 'Encuentranos',
        caption: '',
        icon: 'fa fa-globe',
        link: '#/findus',
        click: () => {
          this.leftDrawerOpen = false
        }
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
        click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.logoutUser(); localStorage.removeItem('ott-token') })() }
      }]
      console.log({ men: this.menucfg })
      if (this.menucfg && !this.menucfg.iconsactive) {
        navig = navig.map(x => { return { ...x, icon: '' } })
      }
      return navig
    },
    toggleColors () {
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
          // console.log('Tawk loaded')
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
    blocks (e) {
      // console.log('editor updated')
      var obj = e
      this.insCss(typeof obj === 'undefined' ? '' : typeof obj.css === 'undefined' ? '' : obj.css)
    },
    currentUser () {
      this.$q.loading.hide()
      this.setupNotif()
    },
    Tawk_API () {
      // console.log('asdasdasd')
    },
    fullPath (d) {
      var css
      let obj = this.blocks
      let scopedCss = typeof obj === 'undefined' ? '' : typeof obj.scopedCss === 'undefined' ? '' : obj.scopedCss
      if (scopedCss !== '') {
        css = scopedCss.find(e => e.route === d)
        if (typeof css !== 'undefined' && css !== '') {
          this.insCss(css.css)
        }
      }
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
