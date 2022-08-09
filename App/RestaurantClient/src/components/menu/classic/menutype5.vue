<template>
  <div>
    <classictabs
    class="bg-grey-7 text-white text-bold"
    :selectedCat="selectedCat"
    :filtercat="filtercat"
    @tabs="(e) => $emit('tabs', e)"
     />
            <div>
              <q-img src="https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-one-a-day.jpg.webp"
              ></q-img>
               <div class="row justify-around">

                  <q-card flat bordered class="column q-mt-md cardtype4"
                     v-for="item in filteredMenuCat" :key="item.id" :style="!item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : item.checkAvail[1] && !item.checkAvail[0] ? 'opacity: 0.5;' : ''">
                        <!-- <div :style="{'background-color':selectedCat ? selectedCat.color : ''}" > -->
                          <div>
                        <q-img @click="$emit('productSelect', item)" v-ripple class="phototype4" :src="item.photo" />
                        </div>
                                 <q-btn color="red" class="absolute-top-right" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>

                        <q-card-section class="text-start fontsize-12 col row">
                        <div class=" title col-12">{{item.name}}</div>
                        <div class="text-grey title col-12">({{item.stock[sede]}} Disponibles)</div>
                        <div class="text-indigo col-12">{{getCatNames(item)}}</div>
                        <div v-if="item.price !== undefined" class=" q-mt-lg text-center col-12">
                           <div>
                              <div class="col" v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                 <q-item-label :class="item.discount > 0 ? 'text-strike text-caption' : false">{{parseFloat(item.price).toFixed(2)}} $
                                 </q-item-label>
                                 <q-item-label v-if="item.discount > 0">{{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}} $
                                 </q-item-label>
                                  <!-- Prime Static -->
                                 <q-item-label :class="item.discount > 0 ? 'text-strike text-caption' : false" class=" text-indigo"><span class="text-italic text-bold">Prime: </span> {{parseFloat(item.price).toFixed(2)}} $
                                 </q-item-label>
                                 <q-item-label v-if="item.discount > 0" class="text-indigo"><span class="text-italic text-bold">Prime: </span>{{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}} $
                                 </q-item-label>
                              </div>
                              <div v-else class="col">
                                <q-item-label>{{item.pricerange}}
                                </q-item-label>
                              </div>
                           </div>
                        </div>
                        <div class="row justify-center self-end col-12">
                          <q-btn v-if="item.price !== undefined" :size="$q.screen.gt.xs ? 'md' : 'xs'" @click="$emit('productSelect', item)" unelevated class="text-bold no-shadow" label="Agregar" no-caps color="orange"></q-btn>
                        </div>
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
export default {
  components: { classictabs },
  name: 'menutype0',
  props: ['selectedCat', 'filtercat', 'filteredMenuCat', 'checkAvail', 'sede'],
  methods: {
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
  border-radius 15px
  overflow hidden
.phototype4
  width 200px
  height 200px
@media (max-width: 1440px)
  .cardtype4
    width 170px
  .phototype4
    width 170px
    height 170px
@media (max-width: 640px)
  .cardtype4
    width 150px
  .phototype4
    width 150px
    height 150px
@media (max-width: 360px)
  .cardtype4
    width 160px
  .phototype4
    width 160px
    height 160px
@media (max-width: 340px)
  .cardtype4
    width 140px
  .phototype4
    width 140px
    height 140px
</style>
