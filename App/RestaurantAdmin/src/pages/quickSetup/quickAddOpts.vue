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
        :control-color="['payserv', 'addsede', 'addcat', 'addprod'].includes(slide) ? 'grey' : 'white'"
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
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem2 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers2" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem3 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="layers3" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem4 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="payserv" class="column no-wrap flex-center">
          <AddOpts class="full-width" @done="slide = 'addsedelorem'" :quick="false" style="height: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addsedelorem" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem5 }}
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="addcat" class="column no-wrap flex-center">
          <AddCfgOpts style="height: 100%;"/>
        </q-carousel-slide>
        <q-carousel-slide name="addprodlorem" class="column no-wrap flex-center">
          <div class="q-mt-xl  text-center q-pa-md " :class="$q.screen.lt.sm ? 'fontsize-20' : 'text-h5'">
            {{ lorem6 }}
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
import AddOpts from '../Menu/options'
import AddCfgOpts from '../Menu/optionsConf'
export default {
  components: {
    AddOpts,
    AddCfgOpts
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
      lorem: 'Hola 😉!! si estas aquí te debes estar preguntando, ¿Cómo agrego "Opciones" a mis productos? es facilito, siguiendo esta guía verás que sencillo es 😄.',
      lorem2: 'Primero agreguemos "Opciones", luego crearemos "Grupos de Opciones" 😊, las "Opciones" en Chopzi pueden ser cualquier cosa 😋, por ejemplo el tamaño, salsas, temperatura, lo que tú quieras!',
      lorem3: 'Si una de las "Opciones" que quieres crear es una salsa puedes asociarle un costo, luego en el "Grupo de Opciones" puedes seleccionar si ese grupo es gratis o no 🤔, es decir, no hace falta agregarlo múltiples veces si en un grupo esa opción es gratis 😲, también puedes desactivar alguna opción en cualquier momento no afectando al grupo',
      lorem4: 'Listo ya vamos a la ventana🧐, llenarás los datos de la opción y la agregas a un grupo o grupos, para agregar grupos le das click a el listado grupos escribes el nombre y le das a intro, así de fácil! puedes agregar cuantos quieras 🤩',
      lorem5: 'Buenísimo 😄, ahora a configurar el "Grupo de Opciones" que ya creaste, si es requerido, es gratis, es de selección simple, etc. Si es de Selección Múltiple CheckBox, tienes que agregar el mín y máx. Y si es de Selección Múltiple Inputs o Slider, es necesario el mín, máx y el máximo de unidades',
      lorem6: 'Listo ahora puedes ir al Catálogo y asignarle "Grupos de Opciones" a tus productos 😁'

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
