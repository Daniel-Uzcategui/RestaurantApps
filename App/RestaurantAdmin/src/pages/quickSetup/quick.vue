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
        class="q-fullscreen-glassMorph text-white shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center" :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
          <q-img width="128px" src="icons/iconwhite.png" />
          <div class="q-mt-md text-center q-pa-md ">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem2 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="payserv" class="column no-wrap flex-center">
          <PayServ class="full-width" @done="slide = 'addsedelorem'" :quick="false" style="height: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addsedelorem" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem3 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="addsede" class="column no-wrap flex-center">
          <!-- <AddSede v-show="!sedeAdded && !localizations.length" @done="slide = 'addcatlorem'; sedeAdded = true" :quick="false" style="height: 100%;"/>
          <div v-if="sedeAdded || localizations.length" class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem4 }}
          </div> -->
          <AddSede v-show="true" @done="slide = 'addcatlorem'; sedeAdded = true" :quick="false" style="height: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addcatlorem" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem5 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="addcat" class="column no-wrap flex-center">
          <AddCategoria style="height: 100%; width: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addprodlorem" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem6 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="addprod" class="column no-wrap flex-center">
          <AddProd :quick="false" style="height: 100%; width: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="skipofin" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem7 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="theme" class="q-pa-none text-white row justify-between">
          <div v-show="photoClick === 1 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img style="max-width: 500px" @click="photoClick === 1 ? photoClick = 99 : photoClick = 1" :width="photoClick === 1 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Flocalhost_8080_(Galaxy%20S5)211775?alt=media&token=43b971ec-33c1-414a-a39b-f89d247dc995" />
          <q-radio v-model="displayType" :val="1" :size="$q.screen.name" color="white" label="Horizontal" />
          </div>
          <div v-show="photoClick === 0 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img @click="photoClick === 0 ? photoClick = 99 : photoClick = 0" :width="photoClick === 0 && $q.screen.lt.sm ? '100vw' : null"  src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Flocalhost_8080_(Galaxy%20S5)%20(1)282300?alt=media&token=af077d39-1cdf-457c-bd46-5ecfc43b3b91" />
          <q-radio v-model="displayType" :val="0" :size="$q.screen.name" color="white" label="Vertical" />
          </div>
          <div v-show="photoClick === 2 || photoClick === 99 || $q.screen.gt.xs" :class="photoClick === 99 || $q.screen.gt.xs ? 'q-pa-md' : ''" class="column items-center col-xs-6 col-sm-4 col-md-3">
          <q-img @click="photoClick === 2 ? photoClick = 99 : photoClick = 2" :width="photoClick === 2 && $q.screen.lt.sm ? '100vw' : null" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Flocalhost_8080_(Galaxy%20S5)%20(2)155297?alt=media&token=bd2ffd6c-b709-412f-8a11-39f02ae33107" />
          <q-radio v-model="displayType" :val="2" color="white" :size="$q.screen.name" label="Lista" />
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="themefin" class="column no-wrap flex-center">
          <div class="q-mt-xl text-white text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem8 }}
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
import AddSede from '../localization/create'
import PayServ from '../settings/paymentServ'
import AddCategoria from '../Menu/Categorias'
import AddProd from '../Menu/menuAdm'
export default {
  components: {
    AddSede,
    PayServ,
    AddCategoria,
    AddProd
  },
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('config', ['configs']),
    displayType: {
      get () {
        let men = this.configs.find(e => e.id === 'menu')
        if (typeof men === 'undefined') {
          return 99
        }
        return men.displayType
      },
      set (e) {
        this.saved3(e, this.displayType, 'menu', 'displayType')
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
      lorem: 'Bienvenido a Chopzi, el Ecommerce diseñado para tí 😉, te guiaremos para que tu negocio pueda disfrutar de nuestra plataforma en pocos minutos ✌️.',
      lorem2: 'Primero seleccionaremos los tipos de servicio que su empresa va a dar a sus clientes, siempre los puedes ajustar más adelante 👍',
      lorem3: 'Ahora agregaremos la info de su empresa, la localización es la que tus clientes usarán para pickup 📍, con nuestra plataforma puedes hacer manejo de múltiples sedes, así que manejaremos el stock de todas ellas 😲',
      lorem4: 'Sede Agregada, la puedes modificar al finalizar',
      lorem5: 'Excelente!, ya estamos casi listos 😄, ahora crearemos las categorías de los productos, siempre puedes agregar más luego',
      lorem6: 'Ahora vamos con los productos 😁, los productos se comparten entre todas las sedes, pero puedes desactivarlos para alguna en particular',
      lorem7: 'Un pasito más y estamos listos 😉, es para escoger el tema del menú, como tus clientes ven tus productos',
      lorem8: 'Ya estamos ready 😎💪, si necesitas ver esta guía u otras ve a la sección guías, ve al menú'

    }
  }
}
</script>
<style lang="sass" scoped>
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
