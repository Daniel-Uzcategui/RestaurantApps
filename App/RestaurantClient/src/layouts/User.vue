<template>
   <q-layout class="main my-font2 bgsetting"
    :style="{ 'background-image': manifest && manifest.bgimage && manifest.bgimage.desktop ? `url(${manifest.bgimage.desktop})` : '', ...pageStyle }"
    :class="{ 'blur-layout': blurLayout, 'default-bg-image': typeof pagecfg === 'undefined' || typeof pagecfg.class === 'undefined' ? true : false, [pagecfg.class]: [pagecfg.class] }"
    view="hhh LpR fFf">
     <q-header elevated
 class="bg-primary" style="z-index: 2" v-if="$q.screen.gt.sm && mobileGreatView == 1">
       <q-toolbar>
          <q-avatar size="80px">
            <img :src="getLogo['128x128']">
          </q-avatar>
          <q-toolbar-title>{{ManiName}}</q-toolbar-title>
          <q-btn v-if="!isChopzi" @click="$router.push({ path: '/cart/index' })" flat icon="fas fa-shopping-cart" >
            <q-badge color="red" floating>{{getCartQ}}</q-badge>
          </q-btn>
          <q-btn flat @click="isAnonymous ? (() => {})() : (() => { setEditUserDialog(true); setBlur() })()" icon="fas fa-user" />
          <q-btn flat @click="isAnonymous ? (() => { $router.push({ path: '/auth/login' }) })() : (() => { loguserout() })()" icon="fas fa-sign-out-alt" />
        </q-toolbar>
      <q-tabs dense shrink stretch>
                <q-tab v-show="nav2[1].length === 1" no-caps v-for="(link, index) in nav2[1]"
               :key="index + 'i'"
                @click="link.click(); link.link ? $router.push({ path: link.link.slice(1) }) : null" :label="link.title" />
                <q-btn-dropdown v-show="nav2[1].length > 1" no-caps auto-close stretch flat label="Catálogos">
                  <q-list>
                  <q-item @click="link.click(); link.link ? $router.push({ path: link.link.slice(1) }) : null" clickable no-caps v-for="(link, index) in nav2[1]"
                    :key="index + 'j'"
                    >
                    <q-item-label>{{link.title}}</q-item-label>
                    <!-- <q-btn no-caps :icon="link.icon" :label="" flat /> -->
                  </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-tab no-caps v-for="(link, index) in nav2[0]"
               :key="index + 'o'"
                @click="link.click(); link.link ? $router.push({ path: link.link.slice(1) }) : null" :label="link.title" />
      </q-tabs>
      <svg class="waves" viewBox="0 0 1920 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path :fill="primary" d="M 0 0 C 78.5 0 78.5 46 157 46 L 157 46 L 157 0 L 0 0 Z" stroke-width="0"></path> <path :fill="primary" d="M 156 46 C 264.5 46 264.5 20 373 20 L 373 20 L 373 0 L 156 0 Z" stroke-width="0"></path> <path :fill="primary" d="M 372 20 C 459.5 20 459.5 37 547 37 L 547 37 L 547 0 L 372 0 Z" stroke-width="0"></path><path :fill="primary" d="M 546 37 C 647 37 647 3 748 3 L 748 3 L 748 0 L 546 0 Z" stroke-width="0"></path><path :fill="primary" d="M 747 3 C 845 3 845 44 943 44 L 943 44 L 943 0 L 747 0 Z" stroke-width="0"></path><path :fill="primary" d="M 942 44 C 1026.5 44 1026.5 20 1111 20 L 1111 20 L 1111 0 L 942 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1110 20 C 1153 20 1153 34 1196 34 L 1196 34 L 1196 0 L 1110 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1195 34 C 1260 34 1260 18 1325 18 L 1325 18 L 1325 0 L 1195 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1324 18 C 1403.5 18 1403.5 42 1483 42 L 1483 42 L 1483 0 L 1324 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1482 42 C 1527.5 42 1527.5 19 1573 19 L 1573 19 L 1573 0 L 1482 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1572 19 C 1640 19 1640 39 1708 39 L 1708 39 L 1708 0 L 1572 0 Z" stroke-width="0"></path><path :fill="primary" d="M 1707 39 C 1813.5 39 1813.5 0 1920 0 L 1920 0 L 1920 0 L 1707 0 Z" stroke-width="0"></path></svg>
     </q-header>
      <Headersearch v-if="mobileGreatView === 2"></Headersearch>
     <Footertoolbar v-if="mobileGreatView" class="mobile-only">

     </Footertoolbar>
         <q-toolbar v-show="!mobileGreatView" class="absolute-top logocont" >
           <div class="relative-position full-width">
                <q-btn flat
                v-if="!leftDrawerOpen"
               dense
               round
               icon='fas fa-bars'
               class="burgericon"
               name="cart"
               @click="leftDrawerOpen = !leftDrawerOpen; $forceUpdate()"
               style="z-index: 99999"
               exact />
               <div class="absolute-right">
                 <q-btn v-if="!isChopzi" to="/cart/index" style="z-index: 99999" class="carticon" flat icon="fas fa-shopping-cart" >
                   <q-badge color="red" floating>{{getCartQ}}</q-badge>
                 </q-btn>
               <q-toggle v-show="false" class="toggleicon" icon="fas fa-sun" keep-color @input="$q.dark.toggle(); toggleColors()" :value="$q.dark.isActive" />
               </div>
            </div>
            <q-dialog v-if="!isAnonymous" v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="blurLayout = false">
                  <user-settings></user-settings>
               </q-dialog>
         </q-toolbar>
         <q-dialog v-if="!isAnonymous" v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="blurLayout = false">
                  <user-settings></user-settings>
               </q-dialog>
      <q-drawer
         style="z-index: 99999;"
         overlay
         on-layout="hide"
         v-model="leftDrawerOpen"
         behavior="mobile"
         >
         <div class="bg-primary">
           <div class="q-pl-xl q-pt-md">
           <q-avatar size="80px">
              <img :src="getLogo['128x128']">
            </q-avatar>
           </div>
         </div>
         <q-list class="q-pl-xl">
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
            <q-item-section v-if="(menucfg && menucfg.iconsactive) || (menucfg === null)"
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
            <component id="bs" :is="themeUser">
         <transition
            appear
            name="transitions"
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
            >
              <router-view @setBlur="setBlur" />
         </transition>
            </component>
      </q-page-container>
      <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
    <q-dialog v-model="promptInstalliOs" class="bg-transparent">
      <q-card class="q-cardGlass" style="max-width: 320px" >
        <q-card-section class="column bg-white items-center">
          <p class="text-h4 text-bold">Instala {{ManiName}}</p>
        </q-card-section>
        <q-card-section>
          <p class="q-pa-lg text-h6 justify-center">
            Añade esta aplicación en su pantalla de inicio para un acceso rápido y fácil
          </p>
        </q-card-section>
        <q-card-actions class="bg-grey-3 column items-center">
          <p>Solo toca <q-img height="1.5rem" width="1.5rem" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/icons%2Fios_share_icon_button_iphone.png?alt=media&token=480b9bc8-273d-43ee-91dd-9f72e40d7051"/> </p>
          <p>luego 'Agregar a la pantalla de inicio'</p>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="promptInstall" class="bg-transparent">
      <q-card class="q-cardGlass" style="max-width: 320px" >
        <q-card-section class="column items-center bg-grey-3">
          <q-img width="128px" height="128px" :src="getLogo['128x128']" />
        </q-card-section>
        <q-card-section class="column bg-white items-center">
          <p class="text-h4 text-bold">Instala {{metamani.title}}</p>
        </q-card-section>
        <q-card-section>
          <p class="q-pa-lg text-h6 justify-center">
            Añade esta aplicación en su pantalla de inicio para un acceso rápido y fácil
          </p>
        </q-card-section>
        <q-card-actions class="bg-grey-3" align="around">
           <q-btn flat color="blue" label="Instalar" @click="installPwa()" />
           <q-btn flat color="grey" label="Cancelar" @click="promptInstall = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
   </q-layout>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import Vue from 'vue'
import Nav from 'components/nav'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { QSpinnerGears, QSpinnerRadio, colors } from 'quasar'
import firebase from 'firebase/compat/app'
import '@firebase/messaging'
import Footertoolbar from '../components/menu/classic/tabcolumn/footertoolbar.vue'
import Headersearch from '../components/navigation/headersearch.vue'
// import Axios from 'axios'
export default {
  name: 'UserLayout',
  meta () {
    return {
      ...this.meta
    }
  },
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
    'ClassicLight': () => import('./themes/ClassicLight'),
    Footertoolbar,
    Headersearch
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['configurations', 'paymentServ', 'chat', 'menucfg', 'themecfg', 'manifest', 'leftDrawerOp', 'metamani', 'mobileGreatView', 'getLogo']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['cart', 'filters']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('editor', ['blocks', 'page', 'routes']),
    leftDrawerOpen: {
      get () {
        return this.leftDrawerOp
      },
      set (e) {
        this.leftDrawerOpCommit(e)
      }
    },
    pageStyle () {
      if (this.page && this.page.style) {
        let style = this.pagecfg.style
        return this.cssToObj(style)
      } else {
        return {}
      }
    },
    meta () {
      return {
        ...this.metamani
      }
    },
    pagecfg () {
      if (this.page) {
        return this.page
      } else {
        return {}
      }
    },
    themeUser () {
      if (this.themecfg && this.themecfg.current) {
        return this.themecfg.current
      } else {
        return 'ClassicLight'
      }
    },
    ManiName () {
      return document.title
      // return window.browser.runtime.getManifest()
    },
    nav2 () {
      // return this.navigateFill()
      var mapping = []
      var mapping2 = []
      var filtro = this.filters.filter(x => x.show === true)
      var menu = []
      if (filtro.length) {
        menu = filtro.map(x => {
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
        console.log(menu)
      }
      if ((this.menucfg && this.menucfg.menuactive) || (typeof this.menucfg === 'undefined' || this.menucfg === null ||
      (this.menucfg && typeof this.menucfg.menuactive === 'undefined'))) {
        console.log('Menu ACCCC')
        if (this.menucfg && this.menucfg.dispName) {
          let inter = [{
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
          menu = [ ...menu, ...inter ]
        } else {
          let inter = [{
            title: 'Todos nuestros productos',
            caption: '',
            icon: '',
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
          menu = [ ...menu, ...inter ]
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
      if (!(this.blocks === null || typeof this.blocks === 'undefined' || (typeof this.blocks !== 'undefined' && this.blocks.length === 0))) {
        mapping = [{
          title: 'Inicio',
          caption: '',
          icon: 'fa fa-home',
          link: '#/home',
          click: () => {
            this.leftDrawerOpen = false
          }
        }, ...mapping]
      }
      let navig = [
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
        }
      ]
      console.log({ men: this.menucfg })
      if (this.menucfg && !this.menucfg.iconsactive) {
        navig = navig.map(x => { return { ...x, icon: '' } })
      }
      console.log({ menu })
      return [navig, menu]
    },
    nav () {
      // return this.navigateFill()
      if (this.isChopzi) {
        let nvv = [
          {
            title: 'Inicio',
            caption: '',
            icon: 'fa fa-home',
            link: '#/home',
            click: () => {
              this.leftDrawerOpen = false
            }
          },
          {
            title: 'Servicios Activos',
            caption: '',
            icon: 'fa fa-home',
            link: '#/dashboard',
            click: () => {
              this.leftDrawerOpen = false
            }
          },
          // {
          //   title: 'Catálogo',
          //   caption: '',
          //   icon: 'menu_book',
          //   // link: '#/menu/index',
          //   click: () => {
          //     this.setFilter('')
          //     this.leftDrawerOpen = false
          //     if (this.localizations.length === 1) {
          //       this.setSede(this.localizations[0].id)
          //       this.$router.push({ path: '/menu/menu' })
          //     } else {
          //       this.$router.push({ path: '/menu/index' })
          //     }
          //   }
          // },
          // {
          //   title: 'Tus Ordenes',
          //   caption: '',
          //   icon: 'room_service',
          //   link: '#/orders/index',
          //   click: () => {
          //     this.leftDrawerOpen = false
          //   }
          // },
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
            click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.loguserout() })() }
          }]
        if (this.menucfg && !this.menucfg.iconsactive) {
          nvv = nvv.map(x => { return { ...x, icon: '' } })
        }
        return nvv
      }
      var mapping = []
      var mapping2 = []
      var filtro = this.filters.filter(x => x.show === true)
      if (this.filters.length) {
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
      if ((this.menucfg && this.menucfg.menuactive) || (typeof this.menucfg === 'undefined' || this.menucfg === null ||
      (this.menucfg && typeof this.menucfg.menuactive === 'undefined'))) {
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
      if (!(this.blocks === null || typeof this.blocks === 'undefined' || (typeof this.blocks !== 'undefined' && this.blocks.length === 0))) {
        mapping = [{
          title: 'Inicio',
          caption: '',
          icon: 'fa fa-home',
          link: '#/home',
          click: () => {
            this.leftDrawerOpen = false
          }
        }, ...mapping]
      }
      let navig = [
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
        // {
        //   title: 'Mi Billetera',
        //   caption: '',
        //   icon: 'fas fa-map-marked-alt',
        //   link: '#/user/wallet',
        //   click: () => {
        //     this.leftDrawerOpen = false
        //   }
        // },
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
          click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.loguserout() })() }
        }]
      console.log({ men: this.menucfg })
      if (this.menucfg && !this.menucfg.iconsactive) {
        navig = navig.map(x => { return { ...x, icon: '' } })
      }
      return navig
    },
    getCartQ () {
      var amt = 0
      var cart = this.cart
      for (const i in cart) {
        amt = cart[i].quantity + amt
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
    console.log({ quasar: this.$q })
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
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('👍', 'beforeinstallprompt', event)
      // Stash the event so it can be triggered later.
      let needsPrompt = this.needsToSeePrompt()
      if (needsPrompt) {
        window.deferredPrompt = event
        // Remove the 'hidden' class from the install button container
        this.promptInstall = true
      }
    })
    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event)
      // Clear the deferredPrompt so it can be garbage collected
      window.deferredPrompt = null
    })
    if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
      let needsPrompt = this.needsToSeePrompt()
      if (needsPrompt) {
        this.promptInstalliOs = true
      }
    }
    this.bindBlocks().then((e) => {
      this.$q.loading.hide()
      // console.log({ bindblock: e })
      var obj = e
      this.insCss(typeof obj !== 'undefined' && obj !== null && typeof obj.css !== 'undefined' && obj.length ? obj.css : '')
      var css
      let scopedCss = typeof obj !== 'undefined' && obj !== null && typeof obj.scopedCss === 'undefined' ? obj.scopedCss : ''
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
    this.bindThemeCfg()
    this.bindPaymentServ().then(() => {
      this.PaypalServe(this.paymentServ)
    }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindChat().then(() => {
      this.chatServe(this.chat)
    }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindEnv()
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
    if (firebase && firebase.messaging && firebase.messaging.isSupported()) {
      if (!(firebase && firebase.apps & firebase.apps.length)) {
        const config = process.env.environments.FIREBASE_CONFIG
        try {
          firebase.initializeApp(config)
        } catch (error) {
          console.log(error)
        } finally {
          this.setupNotif()
        }
      } else {
        this.setupNotif()
      }
    }
    try {
      this.$q.loading.show()
      await this.bindLocalizations()
      await this.bindMenu()
      await this.bindCategorias()
      await this.bindGroupComp()
    } catch (error) {
      console.error('error fetching data firebase', { error })
    } finally {
      this.$q.loading.hide()
    }

    // this.bindPromos().catch(e => console.error('error fetching data firebase', { e }))
    this.bindManif().then(e => {
      // if (e && e.icons && e.icons.favicon) {
      //   const favicon = document.getElementById('favicon')
      //   favicon.setAttribute('href', e.icons.favicon)
      // }
      // console.log({ e }, 'MANIFESTO')
      // if (e && e.name) {
      //   console.log({ e }, 'MANIFESTO')
      //   this.metamani = {
      //     title: e.name,
      //     meta: {
      //       title: { name: 'title', content: e.name },
      //       description: { name: 'description', content: e.description },
      //       keywords: { name: 'keywords', content: e.keywords },
      //       robots: { name: 'robots', content: 'index, follow' },
      //       language: { name: 'language', content: 'Spanish' },
      //       equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      //     },
      //     link: {
      //       favicon: { rel: 'shortcut icon', type: 'image/ico', href: e.icons.favicon },
      //       '128x128': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon128x128 },
      //       '192x192': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon192x192 },
      //       '256x256': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon256x256 },
      //       '512x512': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon512x512 }
      //     }
      //   }
      // }
    }).catch(e => console.error('error fetching data firebase', { e }))
    this.bindItem().finally(() => {
      if ((this.blocks === null || typeof this.blocks === 'undefined' || (typeof this.blocks !== 'undefined' && this.blocks.length === 0)) && (window.location.hash === '#/home' || window.location.hash === '#/')) {
        if (this.localizations.length === 1) {
          this.setSede(this.localizations[0].id)
          this.$router.push({ path: '/menu/menu' })
        } else {
          this.$router.push({ path: '/menu/index' })
        }
      }
    }).catch(e => console.error('error fetching data firebase', { e }))
  },
  updated () {
    this.fullPath = this.$router.history.current.fullPath
  },
  data () {
    return {
      primary: colors.getBrand('primary'),
      promptInstall: false,
      promptInstalliOs: false,
      isChopzi: window.location.hostname === 'chopzi.com',
      fullPath: '',
      Tawk_API: null,
      notifications: 0,
      blurLayout: false
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
    ...mapActions('user', ['setValue']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('config', ['bindPaymentServ', 'bindChat', 'bindEnv', 'bindManif', 'bindMenuCfg', 'bindThemeCfg', 'leftDrawerOpCommit']),
    ...mapActions('editor', ['bindBlocks', 'bindRoutes', 'bindPage']),
    ...mapActions('menu', ['bindFilters', 'setFilter', 'bindMenu', 'bindItem', 'bindCategorias', 'bindPromos', 'bindGroupComp', 'setSede']),
    loguserout () {
      this.logoutUser(); localStorage.removeItem('ott-token')
    },
    async installPwa () {
      console.log('👍', 'butInstall-clicked')
      const promptEvent = window.deferredPrompt
      if (!promptEvent) {
        // The deferred prompt isn't available.
        return
      }
      // Show the install prompt.
      promptEvent.prompt()
      // Log the result
      const result = await promptEvent.userChoice
      console.log('👍', 'userChoice', result)
      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
      window.deferredPrompt = null
      // Hide the install button.
      this.promptInstall = true
    },
    needsToSeePrompt () {
      if (navigator.standalone) {
        return false
      }
      let today = new Date()
      today = today.getTime()
      let lastPrompt = localStorage.getItem('lastPrompt')
      if (lastPrompt === null) {
        // this.promptInstall = true
        localStorage.setItem('lastPrompt', today)
        return true
      }
      var DifferenceTime = today - lastPrompt
      var DifferenceDays = DifferenceTime / (1000 * 3600 * 24)
      // let isApple = ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)
      if (isNaN(DifferenceDays) > 14) {
        // this.promptInstall = true
        localStorage.setItem('lastPrompt', today)
        return true
      }
    },
    appendFile () {
      let file = document.createElement('link')
      file.rel = 'stylesheet'
      file.href = 'myfile.css'
      document.head.appendChild(file)
    },
    cssToObj (css) {
      var obj = {}, s = css.toLowerCase().replace(/-(.)/g, function (m, g) {
        return g.toUpperCase()
      }).replace(/;\s?$/g, '').split(/:|;/g)
      for (var i = 0; i < s.length; i += 2) { obj[s[i].replace(/\s/g, '')] = s[i + 1].replace(/^\s+|\s+$/g, '') }
      return obj
    },
    addRoutes () {
      let { routes } = this.$router.options
      let routerAdd = this.routes
      if (typeof routerAdd !== 'undefined' && routerAdd !== null) {
        let routeData = routes.find(r => r.path === '/pg')
        let node, ii
        let stack = []
        let parent = routerAdd
        stack.push(parent)
        while (stack.length > 0) {
          node = stack.pop()
          console.log('nodeeeeeeeee', { node })
          if (node !== null && typeof node.children !== 'undefined') {
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
        click: () => { this.isAnonymous ? (() => { this.$router.push({ path: '/auth/login' }) })() : (() => { this.loguserout() })() }
      }]
      console.log({ men: this.menucfg })
      if (this.menucfg && !this.menucfg.iconsactive) {
        navig = navig.map(x => { return { ...x, icon: '' } })
      }
      return navig
    },
    toggleColors () {
      console.log('Seteando colores', this.page)
      this.$q.dark.isActive ? colors.setBrand('primary', '#107154') : colors.setBrand('primary', '#43A047')
      this.$q.dark.isActive ? colors.setBrand('secondary', '#0C6247') : colors.setBrand('secondary', '#92CD94')
      if (this.page) {
        for (let key in this.page) {
          if (key.includes('light')) {
            console.log('Seteando colores')
            var colorLabel = (key.replace('light', '')).toLowerCase()
            colors.setBrand(colorLabel, this.page[key])
          }
        }
      }
      this.primary = colors.getBrand('primary')
    },
    async chatServe (config) {
      var that = this
      if (config && config.status && config.key) {
        // eslint-disable-next-line
        window.Tawk_API = {}, window.Tawk_LoadStart = new Date();
        window.Tawk_API.onLoad = function () {
          // console.log('Tawk loaded')
          Vue.set(that, 'Tawk_API', window.Tawk_API)
          if (that.$q.screen.lt.md) {
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
      this.insCss(typeof obj !== 'undefined' && obj !== null && typeof obj.css !== 'undefined' && obj.length ? obj.css : '')
    },
    currentUser () {
      // this.$q.loading.hide()
      this.setupNotif()
    },
    Tawk_API () {
      // console.log('asdasdasd')
    },
    // getCartQ (e) {
    //   console.log(e, 'Getcart')
    // },
    fullPath (d) {
      var css
      let obj = this.blocks
      let scopedCss = typeof obj !== 'undefined' && obj !== null && typeof obj.scopedCss !== 'undefined' ? obj.scopedCss : ''
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
  .waves
    position absolute
    z-index 1
  .waves2
    @extend .waves
    transform rotate(180deg)
    margin-top -2.4%
  @font-face
    font-family: customfont;
    src: url(https://fonts.googleapis.com/css?family=Karla);
  .q-page-container {
    overflow: hidden;
  }
  .my-font
    font-family: 'customfont';
  .bgsetting
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
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
