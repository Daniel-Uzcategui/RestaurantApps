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
        no-route-fullscreen-exit
        v-model="slide"
        :navigation="!['payserv', 'addsede', 'addcat', 'addprod', 'theme', 'savemani'].includes(slide)"
        transition-prev="scale"
        transition-next="scale"
        :arrows="!['payserv', 'addcat', 'addprod', 'theme', 'savemani'].includes(slide)"
        :swipeable="!['payserv', 'addsede', 'addcat', 'addprod', 'theme', 'savemani'].includes(slide)"
        animated
        height="100%"
        class="q-fullscreen-glassMorph  shadow-1 rounded-borders"
      >
        <q-carousel-slide @ name="style" class="column no-wrap flex-center" :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
          <q-img width="128px" src="icons/iconwhite.png" />
          <div class="q-mt-md text-center q-pa-md ">
            {{ lorem }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide  name="layers" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem2 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="payserv" class="column no-wrap flex-center">
          <PayServ class="full-width"  @done="slide = 'addsedelorem'" :quick="false" style="height: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addsedelorem" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem3 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="addsede" class="column no-wrap flex-center">
          <div class="col-12">
          <p v-if="localizations.length">
            {{ lorem4 }}
            </p>
          <AddSede @done="slide = 'savemani'; sedeAdded = true" :quick="false"/>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="savemani" class="column">
          <save-manifest v-if="slide === 'savemani'" @saved="slide = 'themefin'"/>
        </q-carousel-slide>
        <q-carousel-slide name="themefin" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
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
import PayServ from '../settings/Services'
import SaveManifest from '../../components/editor/saveManifest'
// import AddCategoria from '../Menu/Categorias'
// import AddProd from '../Menu/menuAdm'
export default {
  components: {
    AddSede,
    PayServ,
    SaveManifest
    // AddCategoria,
    // AddProd
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
      lorem4: 'Ya tienes una sede Agregada, la puedes modificar al finalizar dirigiéndose en el menu a configuración',
      lorem5: 'Excelente!, ya estamos casi listos 😄, ahora crearemos las categorías de los productos, siempre puedes agregar más luego',
      lorem6: 'Ahora vamos con los productos 😁, los productos se comparten entre todas las sedes, pero puedes desactivarlos para alguna en particular',
      lorem7: 'Un pasito más y estamos listos 😉, es para escoger el tema del menú, como tus clientes ven tus productos',
      lorem8: 'Ya estamos ready 😎💪, si necesitas ver esta guía u otras, ve a la sección Asistentes, en el menú'

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
