<template>
    <div style="max-width: 600px">
               <q-list v-if="selectedCat !== null"  separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':selectedCat.color};checkAvail(item.id, item.prodType)[0] ? (displayPermit(), getMenuItem(item.id, 0)) : false"
                     v-for="item in filteredMenuCat(selectedCat !== null ? selectedCat.id : filtercat ? filtercat[0] ? filtercat[0].id : '' : '')" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && item.price !== undefined && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                          </q-item-label>
                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-btn color="green" rounded v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                        </q-item-section>
                        <q-item-section v-else>
                          <q-item-label>{{item.pricerange}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="fas fa-chevron-right" />
                        </q-item-section>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </q-item>
               </q-list>
               <div v-if="selectedCat === null">
               <div v-show="filteredMenuCat(tabs.id).length" v-for="(tabs, indx) in filtercat" :key="indx" >
                 <p class="text-bold text-grey q-ma-md">{{tabs.name}}</p>
               <q-list separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':tabs.color};checkAvail(item.id, item.prodType)[0] ? (displayPermit(), getMenuItem(item.id, 0)) : false"
                     v-for="item in filteredMenuCat(tabs.id)" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} hhhh </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                          </q-item-label>
                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-btn color="green" rounded v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                        </q-item-section>
                        <q-item-section v-else>
                          <q-item-label>{{item.pricerange}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="fas fa-chevron-right" />
                        </q-item-section>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </q-item>
               </q-list>
               </div>
               </div>
            </div>
</template>
<script>
export default {
  props: ['item', 'filtercat']
}
</script>
