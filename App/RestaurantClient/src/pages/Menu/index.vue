<template>
  <q-page v-on:scroll.passive="onScroll" padding>
    <div class=" q-pa-md menudiv sedecontainer">
      <div class="sedechildcontainer q-cardGlass">
      <div class="text-h5 menuTop sedetitle">Seleccionar Sede</div>
        <q-card flat class="my-card sedebuttons">
          <q-card-section class="row justify-center">
          <!-- <q-spinner class="col" v-if="loading" size="lg" color="primary" /> -->
      <!-- <p v-if="localizations.length === 0 && !loading" class="text-h4 col text-center">No existen Sedes activas</p> -->
      </q-card-section>
        <q-card-section v-for="i in localizations" :key="i.index">
          <q-btn class="full-width" rounded color="primary" :label="i.name" @click="i.id === sede || sede === null ? (setSede(i.id), $router.push({ path: '/menu/menu' })) : (dialog = true, sedeIn = i)" />
        </q-card-section>
        <q-card-section v-if="!localizations.length">
          <p>Datos de sede no encontrados</p>
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
    <!-- <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    /> -->
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      barval: 0,
      sedeIn: null,
      loading: true
    }
  },
  props: {
    query: {
      type: String,
      default: null
    },
    queryprod: {
      type: String,
      default: null
    },
    querycat: {
      type: String,
      default: null
    },
    qprodtype: {
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
    ...mapActions('menu', ['bindMenu', 'bindItem', 'bindCategorias', 'bindPromos', 'bindGroupComp', 'setSede', 'setFilter', 'setCat', 'setProduct', 'setProdType']),
    ...mapMutations('menu', ['delCart']),
    // async init () {
    //   // try {
    //   // const bar = this.$refs.bar

    //   // bar.start()
    //   // let a = await Promise.all([
    //   //   this.bindLocalizations(),
    //   //   this.bindMenu(),
    //   //   this.bindCategorias(),
    //   //   this.bindPromos(),
    //   //   this.bindGroupComp()
    //   //   // this.testQuery('item'),
    //   //   // this.testQuery('menu'),
    //   //   // this.testQuery('categorias'),
    //   //   // this.testQuery('promos'),
    //   //   // this.testQuery('groupcomp')
    //   // ])
    //   // var a = await this.bindLocalizations()
    //   // var b = await this.bindMenu()
    //   // var c = await this.bindCategorias()
    //   // var d = await this.bindPromos()
    //   // var e = await this.bindGroupComp()
    //   // var f = await this.bindItem()
    //   // if (a) {
    //   //   bar.increment(1)
    //   // }
    //   // if (b) {
    //   //   bar.increment(30)
    //   // }
    //   // if (c) {
    //   //   bar.increment(5)
    //   // }
    //   // if (d) {
    //   //   bar.increment(5)
    //   // }
    //   // if (e) {
    //   //   bar.increment(15)
    //   // }
    //   // if (f) {
    //   //   bar.stop()
    //   // }
    //   //   if (a) {
    //   //     bar.stop()
    //   //     this.loading = false
    //   //     return 1
    //   //   }
    //   // } catch (e) {
    //   //   console.error(e)
    //   //   this.loading = false
    //   //   return 1
    //   // }
    // },
    getLocById (id) {
      try {
        if (id === null || this.cart.length === 0) {
          this.setSede(this.sedeIn.id)
          this.$router.push({ path: '/menu/menu' })
          return
        }
        var name = this.localizations.find(x => x.id === id)
        return name.name
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted () {
    if (this.query !== null) {
      this.setFilter(this.query)
    }
    if (this.querycat !== null) {
      this.setCat(this.querycat)
    }
    if (this.queryprod !== null) {
      this.setProduct(this.queryprod)
    }
    if (this.qprodtype !== null) {
      this.setProdType(this.qprodtype)
    }
    // this.init()
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
  .sedecontainer
    border-top-left-radius 0px !important
    border-top-right-radius 0px !important
    border-bottom-left-radius 0px !important
    border-bottom-right-radius 0px !important
    position absolute
    top -50px
    left 0
    right 0
    bottom 0
    background-color transparent
    background-repeat no-repeat !important
    background-size cover !important

  .sedebuttons
    background-color transparent
    width 27%
    margin auto
    min-width 51vmin

  .sedetitle
    font-size 7vmin
    margin-left 0 !important
    padding-top 0 !important
    text-align center
    line-height unset
    height auto !important

  .sedechildcontainer
    position absolute
    right 0
    bottom 0
    top 65%
    left 50%
    transform translate(-50%, -50%)
    width -webkit-fill-available

</style>
