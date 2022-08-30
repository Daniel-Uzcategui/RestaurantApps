<template>
  <div>
   <classictabs
    v-if="!(typeof sede === 'undefined' || sede === null)"
    :selectedCat="selectedCat"
    :filtercat="filtercat"
    @tabs="(e) => $emit('tabs', e)"
     /><q-img :height="$q.platform.mobile ? '150px' : 'auto'" :src="bannerMenu.desktopbanner"
              />
            <div>
               <div class="row justify-around">
                  <q-card v-ripple class="q-ma-md q-pa-md" style="border-radius: 28px;"
                     :style="[{'width':$q.screen.gt.xs ? '370px' : '290px'},{'background-color':selectedCat ? selectedCat.color : ''},{'color': selectedCat ? selectedCat.textcolor : ''}]" @click="$emit('productSelect', item)"
                     v-for="item in filteredMenuCat" :key="item.id" >
                     <div :style="!item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : ''" class="menuitemcont">
                        <div class="menuitem row">
                           <div class="menuphotocont col">
                              <q-img :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photosmall ? item.photosmall : item.photo" color="primary" text-color="white" class="rounded-borders" />
                           </div>
                           <div class="menutext col column justify-center">
                              <div class="col-auto">
                                 <q-item-label class="text-bold title" lines="5">{{item.name}} </q-item-label>
                              </div>
                           </div>
                           <div v-if="item.price !== undefined">
                              <div class="menuprice col" v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                 <q-btn color="red" class="absolute-top-right" style="margin-right: -20px;margin-top: -20px;" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                                 <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                 </q-item-label>
                                 <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                 </q-item-label>
                              </div>
                              <div v-else class="menuprice col">
                                <q-item-label>{{item.pricerange}}
                                </q-item-label>
                              </div>
                           </div>
                        </div>
                     </div>
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
  name: 'menutype0',
  components: { classictabs },
  computed: {
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates', 'leftDrawerCatOp', 'manifest', 'mobileGreatView', 'bannerMenu'])
  },
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail', 'sede']
}
</script>
<style lang="stylus">
.title
  overflow hidden
  text-overflow ellipsis
  -webkit-line-clamp 4
  display -webkit-box
  -webkit-box-orient vertical
</style>
