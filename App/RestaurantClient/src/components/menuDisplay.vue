<template>
<div>
<div class="row justify-around">
  <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
  <q-card v-ripple class="q-ma-md q-pa-md" style="border-radius: 28px;"
  :style="[{'min-width':$q.screen.gt.xs ? '320px' : '290px'},{'background-color':selectedCat ? selectedCat.color : ''},{'color': selectedCat ? selectedCat.textcolor : ''}]"
  @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false"
  v-for="(item, key) in filteredMenu" :key="key"
  v-show="pointsCat && Object.keys(pointsCat).some(r=> item.categoria.includes(r))" >
      <div :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''"  class="menuitemcont">
        <div class="menuitem row">
            <div class="menuphotocont col">
              <q-img :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src=item.photo color="primary" text-color="white" class="rounded-borders" />
            </div>
              <div class="menutext col column justify-center">
                  <div class="col-auto">
                    <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
                  </div>
              </div>
            <div>
              <div class="menuprice col">
                <q-item-label >$ 0.00
                            </q-item-label>
              </div>
            </div>
        </div>
      </div>
      <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="(checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]) || (!checkAvailReward(item)[1] && checkAvailReward(item)[2])">*Máx en el Carrito*</q-tooltip>
  </q-card>
</div>
<q-card-section v-if="!promo && rewards">
           <div class="background-color">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
            <carousel
            :loop="true"
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="padding-left: -15px; z-index: 100;" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="padding-right: -15px; z-index: 100;" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 1], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="(item, key) in filteredMenu" :key="item.id"  >
               <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" >
                  <q-card v-ripple  :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
                     <div class="container-photo">
                        <q-img style="z-index: 1000" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                     </div>
                     <div class="text-caption">
                        <div class="text-bold relative-position q-pa-sm">
                           <q-item-label lines="5">{{item.name}} </q-item-label>
                        </div>
                     </div>
                     <div class="price-content" >
                        <div>
                           <q-item-label >$ 0.00
                            </q-item-label>
                        </div>
                     </div>

                  </q-card>
               </div>
            </slide>
         </carousel>
           </div>
         </q-card-section>
</div>
</template>
<script>
export default {
  props: [ 'localization', 'id' ],
  data () {
    return {
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.header-container
   box-shadow: inset 0 0 0 1px $grey-6
   background: rgba(255,255,255,.9)
   padding-bottom: 24px
.btn-right
   box-shadow: inset 0 0 0 2px $grey-6
.header-cell
  padding-left: 30px
 </style>
