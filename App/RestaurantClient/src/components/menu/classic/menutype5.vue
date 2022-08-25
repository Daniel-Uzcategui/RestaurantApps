<template>
  <div class="capitalize">
    <q-separator />
    <classictabs
    class=" text-bold desktop-only"
    :selectedCat="selectedCat"
    :filtercat="filtercat"
    @tabs="(e) => $emit('tabs', e)"
     />
     <q-drawer
         style="z-index: 99999"
         overlay
         on-layout="hide"
         v-model="leftDrawerCatOpen"
         behavior="mobile"
         class="mobile-only"
         >
         <div class="q-ml-xl q-mt-md">
         <q-avatar size="80px">
            <img :src="this.metamani && this.metamani.link && this.metamani.link['256x256'] ? this.metamani.link['256x256'].href : 'favicon.ico'">
          </q-avatar>
         </div>
         <classictabs
          class="text-bold"
          :selectedCat="selectedCat"
          :filtercat="filtercat"
          @tabs="(e) => {$emit('tabs', e); leftDrawerCatOpen = !leftDrawerCatOpen}"
          />
     </q-drawer>
            <div>
              <q-img :height="$q.platform.mobile ? '150px' : 'auto'" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2Fmarketdecamino%2FSerCAZa.jpg?alt=media&token=730e872d-3596-4243-96d9-dcfe281c2678"
              />
               <div class="row justify-around">
                  <q-intersection
                  transition="scale"
                  class="cardtype4"
                     v-for="item in filteredMenuCat" :key="item.id">
                     <q-card  bordered class="column cardtype4"                   style="transform: scale(0.99)" :style="!item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : ''">
                        <!-- <div :style="{'background-color':selectedCat ? selectedCat.color : ''}" > -->
                          <q-img contain @click="$emit('productSelect', item)" v-ripple class="" :src="item.photo" />
                                 <q-btn color="red" class="absolute-top-right" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>

                        <q-card-section class="text-start fontsize-12 col q-pa-none">
                          <q-list>
                          <q-item>
                            <q-item-section>
                              <q-item-label lines="3"  class="col fontsize-12">{{item.name}}</q-item-label >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label  class="text-grey col">({{item.stock[sede]}} Disponibles)</q-item-label >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <q-item-label  class="text-indigo col">{{getCatNames(item)}}</q-item-label >
                            </q-item-section>
                          </q-item>
                          <q-item>
                            <q-item-section>
                              <div v-if="item.price !== undefined" class=" text-center col">
                                 <div>
                                    <div class="col" v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                       <q-item-label :class="item.discount > 0 ? 'text-strike text-caption' : false">{{parseFloat(item.price).toFixed(2)}} $
                                       </q-item-label>
                                       <q-item-label v-if="item.discount > 0">{{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}} $
                                       </q-item-label>
                                        <!-- Prime Static -->
                                       <q-item-label :class="item.discount > 0 ? 'text-strike text-caption' : false" class=" text-indigo"><span class="text-italic text-bold"></span> {{parseFloat(getRates(item.price)).toFixed(2)}} Bs
                                       </q-item-label>
                                       <q-item-label v-if="item.discount > 0" class="text-indigo"><span class="text-italic text-bold"></span>{{getRates(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}} Bs
                                       </q-item-label>
                                    </div>
                                    <div v-else class="col">
                                      <q-item-label>{{item.pricerange}}
                                      </q-item-label>
                                    </div>
                                 </div>
                              </div>
                            </q-item-section>
                          </q-item>
                          </q-list>
                        </q-card-section>
                        <q-card-actions vertical>
                          <q-btn v-if="item.price !== undefined" :size="$q.screen.gt.xs ? 'md' : 'xs'" @click="$emit('productSelect', item)" unelevated class="text-bold no-shadow " label="Agregar" no-caps color="secondary"></q-btn>
                        </q-card-actions>
                     <q-tooltip :hide-delay="650" v-if="!item.checkAvail[1] && !item.checkAvail[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="item.checkAvail[1] && !item.checkAvail[0]">*Máx en el Carrito*</q-tooltip>
                     </q-card>
                  </q-intersection>
                  </div>
               </div>
            </div>
</template>
<script>
import classictabs from './tabcolumn/classictabscolumn.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: { classictabs },
  name: 'menutype0',
  computed: {
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates', 'leftDrawerCatOp', 'manifest']),
    metamani () {
      let e = this.manifest
      return {
        title: e?.name,
        meta: {
          title: { name: 'title', content: e?.name },
          description: { name: 'description', content: e?.description },
          keywords: { name: 'keywords', content: e?.keywords },
          robots: { name: 'robots', content: 'index, follow' },
          language: { name: 'language', content: 'Spanish' },
          equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
        },
        link: {
          favicon: { rel: 'shortcut icon', type: 'image/ico', href: e?.icons?.favicon },
          '128x128': { rel: 'shortcut icon', type: 'image/png', href: e?.icons?.icon128x128 },
          '192x192': { rel: 'shortcut icon', type: 'image/png', href: e?.icons?.icon192x192 },
          '256x256': { rel: 'shortcut icon', type: 'image/png', href: e?.icons?.icon256x256 },
          '512x512': { rel: 'shortcut icon', type: 'image/png', href: e?.icons?.icon512x512 }
        }
      }
    },
    leftDrawerCatOpen: {
      get () {
        return this.leftDrawerCatOp
      },
      set (e) {
        this.leftDrawerCatOpCommit(e)
      }
    },
    ratesComp () {
      if (this.rates.length) {
        return this.rates
      }
      return this.rateDefault
    }
  },
  async mounted () {
    await this.bindRates().then(async e => {
      console.log(e, 'BINDRATES')
      if (!e.length) {
        await this.$axios.get('https://s3.amazonaws.com/dolartoday/data.json')
          .then(e => { this.rateDefault = [{ rateValue: e?.data?.USD?.promedio, currency: 'Bs' }] }).catch(e => console.error('error fetching data ratesApi', { e }))
      }
    }).catch(e => console.error('error fetching data firebase', { e }))
  },
  data () {
    return {
      rateDefault: []
    }
  },
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail', 'sede'],
  methods: {
    ...mapActions('config', ['bindRates', 'leftDrawerCatOpCommit']),
    getRates (mto) {
      let mtoTotal = 0
      let rate
      if (typeof this.ratesComp !== 'undefined' && this.ratesComp.length) {
        rate = this.ratesComp.find(obj => {
          return obj.currency === 'Bs'
        })
      }
      if (typeof mto !== 'undefined' && rate && rate.rateValue) {
        mtoTotal = rate.rateValue * mto
      }
      return mtoTotal
    },
    getCatNames (item) {
      let flatten = Object.keys(item.categoria)
      let categorias = ''
      for (let i of flatten) {
        categorias = categorias + ' ' + item.categoria[i]['name']
      }
      return categorias
    }
  }
}
</script>
<style lang="stylus">
.capitalize
  text-transform capitalize
.descripcion
  overflow hidden
  text-overflow ellipsis
  -webkit-line-clamp 3
  display -webkit-box
  -webkit-box-orient vertical
.title
  overflow hidden
  text-overflow ellipsis
  -webkit-line-clamp 2
  display -webkit-box
  -webkit-box-orient vertical
.cardtype4
  width 200px
  height 530px
  border-radius 15px
  overflow hidden
.phototype4
  width 200px
  height 200px
@media (max-width: 1440px)
  .cardtype4
    height 490px
    width 170px
  .phototype4
    width 170px
    height 170px
@media (max-width: 640px)
  .cardtype4
    height 370px
    width 150px
  .phototype4
    width 150px
    height 150px
@media (max-width: 360px)
  .cardtype4
    height 355px
    width 160px
  .phototype4
    width 160px
    height 160px
@media (max-width: 340px)
  .cardtype4
    width 140px
    height 335px
  .phototype4
    width 140px
    height 140px
</style>
