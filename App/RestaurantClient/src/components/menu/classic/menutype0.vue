<template>
  <div>
            <q-tabs
               v-if="!(typeof sede === 'undefined' || sede === null)"
               class="wrapel"
               content-class="wrapel"
               :value="selectedCat ? selectedCat.id : ''"
               >
               <q-tab no-caps class="wrapel fontsize-13" content-class="wrapel" v-for="(tabs, index) in filtercat"
                  :key="index"
                  @click="$emit('tabs', tabs)"
                  :name="tabs.id"
                  >
                  {{tabs.name}}
               </q-tab>
            </q-tabs>
            <div>
               <div class="row justify-around">
                  <q-card v-ripple class="q-ma-md q-pa-md" style="border-radius: 28px;"
                     :style="[{'min-width':$q.screen.gt.xs ? '320px' : '290px'},{'background-color':selectedCat ? selectedCat.color : ''},{'color': selectedCat ? selectedCat.textcolor : ''}]" @click="$emit('productSelect', item)"
                     v-for="item in filteredMenuCat" :key="item.id" >
                     <div :style="!item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : ''" class="menuitemcont">
                        <div class="menuitem row">
                           <div class="menuphotocont col">
                              <q-img :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photosmall ? item.photosmall : item.photo" color="primary" text-color="white" class="rounded-borders" />
                           </div>
                           <div class="menutext col column justify-center">
                              <div class="col-auto">
                                 <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
                              </div>
                           </div>
                           <div>
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
export default {
  name: 'menutype0',
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail', 'sede']
}
</script>
