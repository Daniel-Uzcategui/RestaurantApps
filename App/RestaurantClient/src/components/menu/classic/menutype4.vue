<template>
  <div>
    <classictabs
    :selectedCat="selectedCat"
    :filtercat="filtercat"
    @tabs="(e) => $emit('tabs', e)"
     />
            <div>
               <div class="row justify-around">
                <!-- <q-img :height="$q.platform.mobile ? '150px' : 'auto'" :src="bannerMenu.desktopbanner"
                              /> -->
                  <q-card flat bordered class="column q-ma-md justify-between cardtype4"
                     v-for="item in filteredMenuCat" :key="item.id" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''">
                        <div class="phototype4" :style="{'background-color':selectedCat ? selectedCat.color : ''}" >
                        <q-img @click="$emit('productSelect', item)" v-ripple contain :src="item.photo" />
                        </div>
                                 <q-btn color="red" class="absolute-top-right" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                        <div class="text-h7 text-bold q-pa-md title">{{item.name}}</div>
                        <div v-if="item.price !== undefined" class="text-h5 text-grey text-center text-bold">
                           <div>
                              <div class="col" v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                 <q-item-label :class="item.discount > 0 ? 'text-strike text-caption' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                 </q-item-label>
                                 <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                 </q-item-label>
                              </div>
                              <div v-else class="col">
                                <q-item-label>{{item.pricerange}}
                                </q-item-label>
                              </div>
                           </div>
                        </div>
                           <div class="descripcion col-2 hidden" v-if="$q.screen.gt.xs" v-html="item.descripcion">

                           </div>
                           <q-btn v-if="item.price !== undefined" :size="$q.screen.gt.xs ? 'xs' : 'xs'" @click="$emit('productSelect', item)" unelevated class="text-bold no-shadow q-ma-md" text-color="black" label="Añadir al carrito" color="grey-3" rounded></q-btn>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </q-card>
                  </div>
               </div>
            </div>
</template>
<script>
import classictabs from './tabs/classictabs.vue'
import { mapGetters } from 'vuex'
import menumix from '../../../mixins/menu'
export default {
  mixins: [menumix],
  components: { classictabs },
  computed: {
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates', 'leftDrawerCatOp', 'manifest', 'mobileGreatView', 'bannerMenu'])
  },
  name: 'menutype0',
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail']
}
</script>
<style lang="stylus" scoped>
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
  height 400px
  border-radius 15px
  overflow hidden
.phototype4
  width 200px
  height 200px
.noprice
  height 320px
@media (max-width: 1440px)
  .cardtype4
    height 370px
    width 170px
  .phototype4
    width 170px
    height 170px
  .noprice
    height 290px
@media (max-width: 640px)
  .cardtype4
    height 355px
    width 150px
  .phototype4
    width 150px
    height 150px
  .noprice
    height 270px
@media (max-width: 360px)
  .cardtype4
    height 335px
    width 160px
  .phototype4
    width 160px
    height 160px
  .noprice
    height 270px
@media (max-width: 340px)
  .cardtype4
    width 140px
    height 335px
  .phototype4
    width 140px
    height 140px
  .noprice
    height 250px
</style>
