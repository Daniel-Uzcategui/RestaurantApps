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
                  <q-card flat bordered class="column q-ma-md items-center justify-between cardtype4"
                     v-for="item in filteredMenuCat" :key="item.id" :style="!item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : ''">
                        <div :style="{'background-color':selectedCat ? selectedCat.color : ''}" >
                        <q-img @click="$emit('productSelect', item)" v-ripple class="phototype4" :src="item.photo" />
                        </div>
                                 <q-btn color="red" class="absolute-top-right" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>

                        <q-card-section class="text-center col">
                        <div class="text-h6 text-bold title">{{item.name}}</div>
                        <div v-if="item.price !== undefined" class="text-h5 text-grey text-bold">
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
                        </q-card-section>

                        <q-card-section class="col text-center">
                           <div class="descripcion" v-if="$q.screen.gt.xs" v-html="item.descripcion">

                           </div>
                        </q-card-section>
                        <q-card-section class="col" align="center">
                           <q-btn v-if="item.price !== undefined" :size="$q.screen.gt.xs ? 'md' : 'xs'" @click="$emit('productSelect', item)" unelevated class="text-bold no-shadow" text-color="black" label="Añadir al carrito" color="grey-3" rounded></q-btn>
                        </q-card-section>
                     <q-tooltip :hide-delay="650" v-if="!item.checkAvail[1] && !item.checkAvail[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="item.checkAvail[1] && !item.checkAvail[0]">*Máx en el Carrito*</q-tooltip>
                  </q-card>
                  </div>
               </div>
            </div>
</template>
<script>
import classictabs from './tabs/classictabs.vue'
import { mapGetters } from 'vuex'
export default {
  components: { classictabs },
  computed: {
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates', 'leftDrawerCatOp', 'manifest', 'mobileGreatView', 'bannerMenu'])
  },
  name: 'menutype0',
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail', 'sede']
}
</script>
<style lang="stylus">
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
  width 375px
  border-radius 15px
  overflow hidden
.phototype4
  width 375px
  height 375px
@media (max-width: 1440px)
  .cardtype4
    width 250px
  .phototype4
    width 250px
    height 250px
@media (max-width: 640px)
  .cardtype4
    width 150px
  .phototype4
    width 150px
    height 150px
@media (max-width: 360px)
  .cardtype4
    width 140px
  .phototype4
    width 140px
    height 140px
@media (max-width: 340px)
  .cardtype4
    width 130px
  .phototype4
    width 130px
    height 130px
</style>
