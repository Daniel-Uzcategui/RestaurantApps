<template>
    <q-page>
    <q-dialog
    persistent
    no-esc-dismiss
    no-backdrop-dismiss
    maximized
    full-width
    full-height
    v-model="diag"
    >
    <div>
      <q-carousel
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        swipeable
        animated
        :control-color="['payserv', 'addsede', 'addcat', 'addprod', 'theme'].includes(slide) ? 'grey' : 'white'"
        arrows
        height="100%"
        class="q-fullscreen-glassMorph  shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center" :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
          <q-img width="128px" src="icons/iconwhite.png" />
          <div class="q-mt-md text-center q-pa-md ">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="themesel" class="q-pa-none  row justify-between">
          <div v-show="photoClick === 1 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img style="max-width: 500px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FClassicLight352387?alt=media&token=3550abec-af61-422b-88e0-8cf0a140bdc8" />
          <q-radio v-model="theme" val="ClassicLight" :size="$q.screen.name" color="white" label="Classic Light" />
          </div>
          <div v-show="photoClick === 0 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FClassicDark337518?alt=media&token=528802bf-c052-4112-b446-4644714bc707" />
          <q-radio v-model="theme" val="ClassicDark" :size="$q.screen.name" color="white" label="Classic Dark" />
          </div>
          <div v-show="photoClick === 2 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img @click="photoClick === 2 ? photoClick = 99 : photoClick = 2" :width="photoClick === 2 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FGlassLight1265199?alt=media&token=7ca4c26f-f9b1-4a0c-8a5b-3576d72b2a07" />
          <q-radio v-model="theme" val="GlassLight" color="white" :size="$q.screen.name" label="Glass Light" />
          </div>
          <div v-show="photoClick === 3 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img @click="photoClick === 3 ? photoClick = 99 : photoClick = 3" :width="photoClick === 3 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FGlassDark986924?alt=media&token=d34fb7d0-3b8c-4e0f-a7ec-edfb22ec653f" />
          <q-radio v-model="theme" val="GlassDark" color="white" :size="$q.screen.name" label="Glass Dark" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="style2" class="column no-wrap flex-center" :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
          <q-img width="128px" src="icons/iconwhite.png" />
          <div class="q-mt-md text-center q-pa-md ">
            {{ lorem2 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="theme" class="q-pa-none  row justify-center">
          <q-select emit-value map-options class="col-xs-12 col-md-6 col-lg-2 q-pa-md q-pb-none" v-model="themeMode" label="Modo" :options="[{value: 0, label: 'Fijo'}, {value: 1, label: 'Dinámico'}]">

          </q-select>
          <div class="flex-break"></div>
          <p class="text-caption text-center q-ma-md q-mt-none">
            Dinámico permite a tu cliente seleccionar el tema que más guste, Fijo solo permite cambiar entre vista de lista en móvil y el tema seleccionado
          </p>
          <div class="q-pa-none col-12  row justify-between">
          <div v-show="photoClick === 1 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img style="max-width: 500px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FHorizontal312833?alt=media&token=dbf36c60-d2fb-439f-848a-922bf6d6390a" />
          <q-radio v-model="displayType" :val="1" :size="$q.screen.name" color="white" label="Horizontal" />
          </div>
          <div v-show="photoClick === 0 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FVertical352387?alt=media&token=1e52290d-df5f-4e11-9cdf-2c7858b56c2a" />
          <q-radio v-model="displayType" :val="0" :size="$q.screen.name" color="white" label="Vertical" />
          </div>
          <div v-show="photoClick === 2 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img @click="photoClick === 2 ? photoClick = 99 : photoClick = 2" :width="photoClick === 2 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FDenso236599?alt=media&token=ed301d10-49a8-4392-adc3-1e6b9b3a5dbe" />
          <q-radio v-model="displayType" :val="2" color="white" :size="$q.screen.name" label="Denso" />
          </div>
          <div v-show="photoClick === 3 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img @click="photoClick === 3 ? photoClick = 99 : photoClick = 3" :width="photoClick === 3 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2FPhotos%2Fbigfoto.png?alt=media&token=c17ccb6a-cd4e-41aa-90fa-8af4bba497f4" />
          <q-radio v-model="displayType" :val="3" color="white" :size="$q.screen.name" label="BigPhoto" />
          </div>
          <div v-show="photoClick === 4 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img @click="photoClick === 4 ? photoClick = 99 : photoClick = 4" :width="photoClick === 4 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2FPhotos%2Fbigfoto2.png?alt=media&token=779dc9f7-8dc9-44ab-adca-2a3361f38140" />
          <q-radio v-model="displayType" :val="4" color="white" :size="$q.screen.name" label="BigPhoto2" />
          </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="style3" class="column no-wrap flex-center" :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
          <q-img width="128px" src="icons/iconwhite.png" />
          <div class="q-mt-md text-center q-pa-md ">
            {{ lorem3 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="themes" class="q-pa-none  row justify-between">
          <div v-show="photoClick === 1 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img style="max-width: 500px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Fcomputer2515215?alt=media&token=5af2a290-beca-4ea8-af1f-03dc8fef5050" />
          <q-img style="max-width: 500px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Fmobile252217?alt=media&token=e3c98a81-79e6-4710-bb0d-d23931756a22" />
          <q-radio v-model="mobile" :val="1" :size="$q.screen.name" color="white" label="Tabular" />
          </div>
          <div v-show="photoClick === 2 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img style="max-width: 500px" @click="photoClick === 2 ? photoClick = 99 : photoClick = 2" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2FPhotos%2Fcomputermin508833.png?alt=media&token=0a20e387-5eaa-43a7-a481-0b2ba43add9a" />
          <q-img style="max-width: 500px" @click="photoClick === 2 ? photoClick = 99 : photoClick = 2" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2FPhotos%2Flocalhost_8081_(Moto%20G4)%20(2)%20(1).png?alt=media&token=55de74a3-e157-4c30-8c5c-54f8901cff36" />
          <q-radio v-model="mobile" :val="2" :size="$q.screen.name" color="white" label="Tabular2" />
          </div>
          <div v-show="photoClick === 0 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
          <q-img @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Fcomputermin508833?alt=media&token=25537c0f-531d-447f-acc5-72fac4167abb" />
          <q-img @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FClassicLight352387?alt=media&token=3550abec-af61-422b-88e0-8cf0a140bdc8" />
          <q-radio v-model="mobile" :val="0" :size="$q.screen.name" color="white" label="Minimalista" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="themes2" class="q-pa-none  row justify-between">
          <div v-show="photoClick === 1 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
            <q-img style="max-width: 200px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FCapture19294?alt=media&token=605a2fb5-5090-4e00-8bd1-956e741b7f30" />
          <q-radio v-model="mobile2" :val="true" :size="$q.screen.name" color="white" label="Con Iconos" />
          </div>
          <div v-show="photoClick === 0 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-2">
            <q-img style="max-width: 200px" @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FCapture27555?alt=media&token=ae998ffd-2970-4271-8719-5a489aeae8e0" />
          <q-radio v-model="mobile2" :val="false" :size="$q.screen.name" color="white" label="Sin Iconos" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="savemani" class="column">
          <changeBackground v-if="slide === 'savemani'" @saved="slide = 'savebanner'"/>
        </q-carousel-slide>
        <q-carousel-slide name="savebanner" class="column">
          <ChangeBanner v-if="slide === 'savebanner'" @saved="slide = 'savepage'"/>
        </q-carousel-slide>
        <q-carousel-slide name="savepage" class="column">
          <change-page-color v-if="slide === 'savepage'" @saved="slide = 'themefin'"/>
        </q-carousel-slide>
        <q-carousel-slide name="themefin" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem4 }}
          </div>
           <q-btn color="white" rounded text-color="black" no-caps @click="diag=false; $router.push({ path: '/home/' })" label="Finalizar" />
        </q-carousel-slide>
      </q-carousel>
    </div>
    </q-dialog>
    </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import changeBackground from '../../components/editor/changeBackground.vue'
import changePageColor from '../../components/editor/changePageColors.vue'
import ChangeBanner from '../../components/editor/changeBanner.vue'
export default {
  components: {
    changeBackground,
    changePageColor,
    ChangeBanner
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs']),
    displayType: {
      get () {
        let men = this.configs.find(e => e.id === 'menu')
        if (men && typeof men.displayType !== 'undefined') {
          return men.displayType
        }
        return 99
      },
      set (e) {
        this.saved3(e, this.displayType, 'menu', 'displayType')
      }
    },
    themeMode: {
      get () {
        let men = this.configs.find(e => e.id === 'menu')
        if (men && typeof men.themeMode !== 'undefined') {
          return men.themeMode
        }
        return 99
      },
      set (e) {
        this.saved3(e, this.themeMode, 'menu', 'themeMode')
      }
    },
    mobile2: {
      get () {
        let men = this.configs.find(e => e.id === 'menu')
        if (men && typeof men.iconsactive !== 'undefined') {
          return men.iconsactive
        }
        return true
      },
      set (e) {
        this.saved3(e, this.mobile2, 'menu', 'iconsactive')
      }
    },
    theme: {
      get () {
        let men = this.configs.find(e => e.id === 'theme')
        if (men && typeof men.current !== 'undefined') {
          return men.current
        }
        return null
      },
      set (e) {
        this.saved3(e, this.displayType, 'theme', 'current')
      }
    },
    mobile: {
      get () {
        let men = this.configs.find(e => e.id === 'theme')
        if (men && typeof men.mobile !== 'undefined') {
          return men.mobile
        }
        return 99
      },
      set (e) {
        this.saved3(e, this.displayType, 'theme', 'mobile')
      }
    }
  },
  mounted () {
    this.bindConfigs()
    this.bindLocalizations()
  },
  methods: {
    ...mapActions('order', ['bindOrders']),
    ...mapActions('client', ['bindClients']),
    ...mapActions('menu', ['setValue2']),
    ...mapActions('config', ['bindConfigs']),
    ...mapActions('localization', ['bindLocalizations']),
    saved3 (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValue2({ payload: { value, id, key }, collection: 'config' })
    }
  },

  data () {
    return {
      photoClick: 99,
      diag: true,
      sedeAdded: false,
      slide: 'style',
      lorem: 'Hola 😊!! Vamos a cambiar los estilos de la app cliente, te voy a mostrar las opciones que tenemos 😋, primero seleccionemos el tema que más te guste',
      lorem2: 'Si quieres cambiar los colores de los cuadros que envuelven al producto puedes hacerlo en la página de categorías, ahora cambiemos como se muestra el menú',
      lorem3: 'Escojamos el estilo de navegación',
      lorem4: 'Ya estamos ready 😎💪'

    }
  }
}
</script>
<style lang="stylus" scoped>
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.totalCard
   width: 30%
</style>
