<template>
  <q-page padding>
    <div class=" q-pa-md menudiv sedecontainer" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <div class="sedechildcontainer">
      <div class="text-h5 menuTop sedetitle">Seleccionar Sede</div>
        <q-card flat class="my-card sedebuttons">
          <q-card-section class="row justify-center">
          <q-spinner-cube class="col" v-if="loading" size="lg" color="primary" />
      <p v-if="localizations.length === 0 && !loading" class="text-h4 col text-center">No existen Sedes activas</p>
      </q-card-section>
        <q-card-section v-for="i in localizations" :key="i.index">
          <q-btn class="full-width" rounded color="primary" :label="i.name" @click="i.id === sede ? (setSede(i.id), $router.push({ path: '/menu/menu' })) : (dialog = true, sedeIn = i)" />
        </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-if="sedeIn" v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="fas fa-exclamation-triangle" color="primary" text-color="white" />
          <span class="q-ml-sm">Usted posee un carrito con productos para la sede {{getLocById(sede)}}</span>
          <span class="q-ml-sm">¿Quiere continuar a la sede {{sedeIn.name}}?</span>
          <span class="q-ml-sm">Al hacer esto el carrito actual se borrará</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" v-close-popup @click="delCart(); setSede(sedeIn.id)" to='/menu/menu'/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      sedeIn: null,
      loading: true
    }
  },
  props: {
    query: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('menu', ['sede', 'cart'])
  },
  methods: {
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('menu', ['setSede', 'setFilter']),
    ...mapMutations('menu', ['delCart']),
    getLocById (id) {
      try {
        console.log(this.localizations)
        console.log(id)
        if (id === null || this.cart.length === 0) {
          this.setSede(this.sedeIn.id)
          this.$router.push({ path: '/menu/menu' })
          return
        }
        var name = this.localizations.find(x => x.id === id)
        return name.name
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    if (this.query !== null) {
      this.setFilter(this.query)
    }
  },
  created () {
    this.bindLocalizations().then(() => {
      this.loading = false
      if (this.localizations.length === 1) {
        this.setSede(this.localizations[0]['id'])
        this.$router.push({ path: '/menu/menu' })
      }
    })
  }
}
</script>

<style lang="stylus">
  .menuTop
    height 50px
    margin-left 10%
    padding-top 20px
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
