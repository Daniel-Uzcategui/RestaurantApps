<template>
   <div>
      <q-card-section v-if="!promo && !rewards">
        <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
         <carousel
            :loop="true"
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 1], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="item in promoData" :key="item.id" >
               <div :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                  <div @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':tabs.color},{'color': tabs.textcolor}]">
                     <div class="container-photo">
                        <q-img :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                     </div>
                     <div class="text-caption">
                        <div class="text-bold relative-position">
                           <q-item-label lines="5">{{item.name}} </q-item-label>
                        </div>
                     </div>
                     <div class="price-content" >
                        <div>
                           <q-item-label :class="item.discount > 0 ? 'text-strike' : false">
                              $ {{parseFloat(item.price).toFixed(2)}}
                              <q-badge color="red" floating rounded v-if="item.discount > 0" >Descuento {{item.discount}}%</q-badge>
                           </q-item-label>
                           <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                           </q-item-label>
                        </div>
                     </div>
                     <q-tooltip v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </div>
               </div>
            </slide>
         </carousel>
      </q-card-section>
      <!-- Seccion de promociones -->
      <q-card-section v-if="promo && !rewards">
         <div class="flex justify-around text-h7 background-color promo">
            <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
            <q-list @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" v-for="item in promoData" :key="item.id" >
               <div class="item-content">
                  <div class="item row" :style="[{'background-color':'#ffd538'},{'color': '#000000'}]">
                     <div class="container-photo">
                        <q-img :src=item.photo width="80px" color="primary" text-color="white" class="rounded-borders" />
                     </div>
                     <div class="text-content">
                        <div class="text-bold relative-position">
                           <q-item-label lines="1">{{item.name}} </q-item-label>
                           <q-item-label lines="1" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                           <q-item-label lines="1" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-item-label>
                        </div>
                     </div>
                     <div class="price-content" >
                        <div>
                           <q-item-label :class="item.discount > 0 ? 'text-strike' : false">
                              $ {{parseFloat(item.price).toFixed(2)}}
                              <q-badge color="red" floating rounded v-if="item.discount > 0" >Descuento {{item.discount}}%</q-badge>
                           </q-item-label>
                           <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                           </q-item-label>
                        </div>
                     </div>
                  </div>
               </div>
            </q-list>
         </div>
      </q-card-section>
   </div>
</template>
