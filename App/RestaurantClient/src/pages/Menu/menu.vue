<template>
   <div @click="click()" :class="global_class" class="" :style="global_style">
      <q-input filled v-if="!displayType && !(typeof this.sede === 'undefined' || this.sede === null)" class="q-cardGlass q-pa-lg q-mt-xl q-mr-lg q-ml-lg" v-model="searchBar" @input="search" rounded outlined label="Buscar" >
         <template v-slot:prepend>
            <q-icon name="fas fa-search" />
         </template>
      </q-input>
      <!-- <q-btn label="activar rewards" @click="viewRewards = !viewRewards"></q-btn> -->
      <q-card :class="$q.screen.gt.xs ? 'q-mr-lg q-ml-lg': ''" flat class="menu-div2 q-cardGlass q-mt-xl q-pb-md" >
          <!-- :rewards="rewards" -->
          <!-- {{displayType}} display -->
         <menu-filter
          :promo="promo"
          :selectedFilter="selectedFilter"
          :menucfg="menucfg"
          :sede="sede"
          :filterFindName="filterFindName(selectedFilter)"
          :pointsCat="pointsCat"
          :paymentServ="paymentServ"
          :promoData="promoData"
          @nextDisp="nextDisp()"
          @promos="promo = !promo"
          :filters="filters"
          @nextFilter="nextFilter()"
         />
          <!-- @rewards="rewards = !rewards" -->
         <q-card-section class="row justify-center" v-if="menuLoading">
           <q-spinner
              color="primary"
              size="md"
            />
         </q-card-section>
         <q-card-section class="wrapel q-pa-none q-ma-none" v-if="!promo">
           <div
               v-if="displayType == 1"
               class="wrapel "
               >
               <div class="wrapel" :class="$q.dark.isActive ? 'background-color q-cardGlass' : 'background-color'" content-class="wrapel"  v-for="tabs in filtercat"
                  :key="tabs.id">
                  <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">{{tabs.name}}</div>
                  <q-card-section class="q-pa-none q-ma-none" v-if="!promo">
                     <carousel
                        :loop="true"
                        navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="padding-left: -15px; z-index: 10000;" aria-hidden="true"></i>'
                        navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="padding-right: -15px; z-index: 10000;" aria-hidden="true"></i>'
                        :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                        <slide class="row justify-center" v-for="(item, key) in filteredMenuCat(tabs.id)" :key="item.id" >
                           <div v-if="typeof item.not === 'undefined'">
                              <div  style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col relative-position" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                                 <q-card v-ripple @click="dgbg = {'background-color':tabs.color};checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':tabs.color},{'color': tabs.textcolor}]">
                                    <div class="container-photo">
                                       <q-img style="z-index: 1000" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                                    </div>
                                    <div class="text-caption">
                                       <div class="text-bold relative-position q-pa-sm">
                                          <q-item-label lines="5">{{item.name}} </q-item-label>
                                       </div>
                                    </div>
                                    <div class="price-content" >
                                       <div v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                         <q-btn color="red" class="absolute-top-right" style="margin-right: -20px;margin-top: -20px;" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                          </q-item-label>
                                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                          </q-item-label>
                                       </div>
                                       <div v-else>
                                         <q-item-label>{{item.pricerange}}
                                          </q-item-label>
                                       </div>
                                    </div>
                                    <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                                    <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                                 </q-card>
                              </div>
                           </div>
                        </slide>
                     </carousel>
                  </q-card-section>
               </div>
               <q-separator vertical class="menuseparator" />
            </div>
           <div v-if="displayType == 0">
             <menutype-0
              @tabs="(e) => {selectedCat=e; search()}"
              :selectedCat="selectedCat"
              :checkAvail="checkAvail"
              :sede="sede"
              @hook:mounted="selectedCat=filtercat[0]"
              :filtercat="filtercat"
              :filteredMenuCat="filteredMenuCat(selectedCat ? selectedCat.id : '')"
              @productSelect="(e) => {dgbg = {'background-color':selectedCat.color};checkAvail(e.id, e.prodType)[0] ? (display = true, getMenuItem(e.id, 0)) : false}" />
            </div>
            <div v-if="displayType == 3">
              <menutype-4
              @tabs="(e) => {selectedCat=e; search()}"
              :selectedCat="selectedCat"
              :checkAvail="checkAvail"
              @hook:mounted="selectedCat=filtercat[0]"
              :sede="sede"
              :filtercat="filtercat"
              :filteredMenuCat="filteredMenuCat(selectedCat ? selectedCat.id : '')"
              @productSelect="(e) => {dgbg = {'background-color':selectedCat.color};checkAvail(e.id, e.prodType)[0] ? (display = true, getMenuItem(e.id, 0)) : false}" />
            </div>
            <div v-if="displayType == 2">
            <div class="column items-center">
            <q-select
            clearable
            style="max-width: 480px; min-width: 320px"
            v-if="!(typeof this.sede === 'undefined' || this.sede === null)"
            :options="filtercat"
            rounded
            outlined
            :value="selectedCat !== null ? selectedCat : ''"
            label="Categorías"
            :options-value="(item) => item === null ? null : item"
            :option-label="(item) => item === null ? 'Null value' : item.name"
            @input="(e) => {selectedCat=e; search()}"
            emit-value
            map-options
            />
            <div style="max-width: 600px">
               <q-list v-if="selectedCat !== null"  separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':selectedCat.color};checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false"
                     v-for="item in filteredMenuCat(selectedCat !== null ? selectedCat.id : filtercat ? filtercat[0] ? filtercat[0].id : '' : '')" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
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
               <div v-if="selectedCat === null">
               <div v-for="(tabs, indx) in filtercat" :key="indx" >
                 <p class="text-bold text-grey q-ma-md">{{tabs.name}}</p>
               <q-list separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':tabs.color};checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false"
                     v-for="item in filteredMenuCat(tabs.id)" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
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
            </div>
            </div>
         </q-card-section>
          <!-- Seccion de rewards -->
         <!-- <q-card-section class="wrapel q-pa-none q-ma-none" v-if="!promo && rewards">
            <div class="background-color q-pa-none q-ma-none" v-if="displayType">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
               <carousel
                  :loop="true"
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x"  aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x"  aria-hidden="true"></i>'
                  :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                  <slide class="row justify-center" :name="key" v-for="(item, key) in filteredMenu" :key="item.id" v-show="pointsCat && Object.keys(pointsCat).some(r=> item && item.categoria && item.categoria.includes(r))" >
                     <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-card v-ripple @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
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
                           <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                           <q-tooltip :hide-delay="650" v-if="(checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]) || (!checkAvailReward(item)[1] && checkAvailReward(item)[2])">*Máx en el Carrito*</q-tooltip>
                        </q-card>
                     </div>
                  </slide>
               </carousel>
            </div>
            <div v-else>
              <q-tabs
               class="wrapel"
               content-class="wrapel"
               :value="selectedCat ? selectedCat.id : ''"
               >
               <q-tab no-caps class="wrapel fontsize-13" content-class="wrapel" v-for="(tabs, index) in filtercat"
                  :key="index"
                  @click="selectedCat=tabs; search()"
                  :name="tabs.id"
                  >
                  {{tabs.name}}
               </q-tab>
            </q-tabs>
            <div class="row justify-around" >
               <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
               <q-card v-ripple class="q-ma-md q-pa-md bg-secondary text-white" style="border-radius: 28px;"
                  :style="[{'min-width':$q.screen.gt.xs ? '320px' : '290px'}]"
                  @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false"
                  v-for="(item, key) in filteredMenu" :key="key"
                  v-show="pointsCat && Object.keys(pointsCat).some(r=> item && item.categoria && item.categoria.includes(r))" >
                  <div :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''"  class="menuitemcont">
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
            </div>
         </q-card-section> -->
         <!-- Seccion de promociones -->
         <q-card-section class="wrapel q-pa-none q-ma-none" v-if="promo">
              <div class="background-color" v-if="displayType">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
               <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
               <carousel
                  :loop="true"
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x"  aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x"  aria-hidden="true"></i>'
                  :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                  <slide class="row justify-center" :name="key" v-for="(item, key) in promoData" :key="item.id" >
                     <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-card v-ripple @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
                           <div class="container-photo">
                              <q-img style="z-index: 1000" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                           </div>
                           <div class="text-caption">
                              <div class="text-bold relative-position q-pa-sm">
                                 <q-item-label lines="5">{{item.name}} </q-item-label>
                              </div>
                           </div>
                           <div class="price-content" v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')" >
                              <div>
                                <q-btn color="red" class="absolute-top-right" style="margin-right: -20px;margin-top: -20px;" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                                 <q-item-label :class="item.discount > 0 ? 'text-strike' : false">
                                    $ {{parseFloat(item.price).toFixed(2)}}
                                 </q-item-label>
                                 <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                 </q-item-label>
                              </div>
                           </div>
                           <div class="price-content" v-else>
                              <q-item-label>{{item.pricerange}}
                              </q-item-label>
                            </div>
                           <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                           <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                        </q-card>
                     </div>
                  </slide>
               </carousel>
            </div>
            <div class="row justify-around" v-else>
               <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
               <q-card v-ripple class="q-ma-md q-pa-md" style="border-radius: 28px;"
                  :style="[{'min-width':$q.screen.gt.xs ? '320px' : '290px'},{'background-color':selectedCat ? selectedCat.color : ''},{'color': selectedCat ? selectedCat.textcolor : ''}]"
                  @click="dgbg = {'background-color':selectedCat.color}; checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false"
                  v-for="item in promoData" :key="item.id" >
                  <div :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" class="menuitemcont">
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
                           <div class="price-content" v-else>
                              <q-item-label>{{item.pricerange}}
                              </q-item-label>
                            </div>
                        </div>
                     </div>
                  </div>
                  <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                  <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
               </q-card>
            </div>

         </q-card-section>
      </q-card>
      <q-dialog-menu
      style="z-index: 9999999"
      :display="display"
      :displayVal2="displayVal"
      :dgbg="dgbg"
      @update-dispval="(e) => displayVal = e"
      @dispchange="(e) => display = e"
      />
   </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import menuFilter from '../../components/menu/classic/menuFilter.vue'
import Menutype0 from '../../components/menu/classic/menutype0.vue'
import Menutype4 from '../../components/menu/classic/menutype4.vue'
// import store from '../../store/index'
import { Carousel, Slide } from '../../components/vue-carousel/dist/vue-carousel.min.js'
export default {
  // store,
  props: {
    global_class: {
      type: String,
      default: 'col'
    },
    global_style: {
      type: String,
      default: ''
    },
    Sede: {
      type: String,
      default: ''
    },
    typeDisplay: {
      type: String,
      default: null
    },
    block_index: {
      type: Number
    },
    child_index: {
      type: Number
    }
  },
  components: {
    'q-dialog-menu': () => import('../../components/Q-diag-menu.vue'),
    Carousel,
    Slide,
    menuFilter,
    Menutype0,
    Menutype4
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'sede', 'promos', 'rewards', 'selectedFilter', 'selectedProduct', 'selectedProdType', 'filters']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['menucfg', 'paymentServ', 'configurations', 'menuDispType']),
    cats () {
      let objs = this.categorias
      return objs.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    },
    filterop () {
      let filter = this.filters.map(x => x.id)
      if (this.menucfg && this.menucfg.menuactive) {
        filter = ['', ...filter]
      }
      return filter
    },
    displayType: {
      get () {
        if (this.menuDispType !== null) {
          return this.menuDispType
        }
        if (this.typeDisplay !== null) {
          return parseInt(this.typeDisplay)
        }
        if (this.menucfg && this.menucfg.displayType) {
          return this.menucfg.displayType
        }
        return 0
      },
      set (e) {
        this.setMenuDispType(e)
      }
    },
    filtercat () {
      const { selectedFilter, cats, filters
      // , viewRewards, origMenu
      } = this
      let elcat = cats
      // if (viewRewards) {
      //   elcat = cats.filter(x => {
      //     for (let i of filteredMenuCat(selectedCat ? selectedCat.id : '')) {
      //       console.log(i)
      //       if (i.categoria.includes(x.id)) {
      //         return true
      //       }
      //     }
      //     return false
      //   })
      //   console.log({ elcat })
      // }
      if (selectedFilter === '') { return elcat }
      if (filters && selectedFilter && elcat) {
        let thfilter = filters.find(e => e.id === selectedFilter)
        let filtered = typeof thfilter !== 'undefined' ? elcat.filter(x => thfilter?.cats.includes(x.id)) : []
        return filtered
      }
      return []
    },
    catWithProd () {
      const { cats, filteredMenu } = this
      return cats.filter(x => {
        for (let i of filteredMenu) {
          let solve = i.categoria.includes(x.id)
          if (solve) {
            return true
          }
          return false
        }
      })
    },
    origMenu () {
      const { menu, viewRewards, sede } = this
      if (menu.length) {
        return menu.reduce((y, x) => {
          if (x.estatus && x.estatus[sede]) {
            let price = { price: x.price }
            if (viewRewards) {
              price = { price: 0, reward: true }
            }
            y.push({
              categoria: x.categoria,
              estatus: x.estatus,
              descripcion: x.descripcion,
              descripcioncolor: x.descripcioncolor,
              name: x.name,
              photo: x.photo,
              pricerange: x.pricerange,
              photomulti: x.photomulti,
              photosmall: x.photosmall,
              ...price,
              id: x.id,
              stock: x.stock,
              discount: x.discount,
              prodType: 0,
              disptype: x.disptype,
              priority: parseInt(x.priority ? x.priority : 1000),
              groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
            })
          }
          return y.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
        }, [])
      } else return []
    },
    pointsCat () {
      var obj = this.currentUser === null || typeof this.currentUser.pointsCat === 'undefined' ? [] : this.currentUser.pointsCat
      var objout = Object.keys(obj).reduce((p, c) => {
        if (obj[c] >= 10) { p[c] = obj[c] }
        return p
      }, {})
      return objout
    },
    promoData () {
      var prom = []
      this.promos.forEach(e => {
        var y = { prods: [] }
        let guard = 0
        e.prods.forEach(i => {
          if (guard) { return }
          var its = this.menu.find(x => x.id === i.id)
          if (typeof its !== 'undefined' && its.estatus[this.sede]) {
            y.prods.push({ id: its.id, name: its.name, photo: its.photo, stock: its.stock, quantity: i.quantity })
          } else {
            y.prods = []
            guard = 1
          }
        })
        y.name = e.name
        y.id = e.id
        y.price = e.price
        y.estatus = e.estatus
        y.descripcion = e.descripcion
        y.descripcioncolor = e.descripcioncolor
        y.prodType = 1
        y.photo = e.photo
        y.groupComp = typeof e.groupComp === 'undefined' ? [] : e.groupComp
        if (y.prods.length && !guard) {
          prom.push(y)
        }
      })
      return prom
    }
  },
  data () {
    return {
      viewRewards: false,
      menuLoading: true,
      loc: window.location.origin,
      dgbg: {},
      // rewards: false,
      itComp: [],
      totSum: 0,
      required: false,
      promo: false,
      searchBar: '',
      maximizedToggle: true,
      display: false,
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      displayVal: {},
      quantity: 0,
      filteredMenu: [],
      selectedCat: null,
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
    }
  },
  created () {
    if (this.Sede !== '') {
      this.setSede(this.Sede)
    }
  },
  watch: {
    Sede (e) {
      this.setSede(e)
    },
    menu () {
      this.menuLoading = false
      this.filteredMenu = this.origMenu
      if (!parseInt(this.selectedProdType)) {
        this.productSelected()
      }
    },
    promos () {
      if (parseInt(this.selectedProdType)) {
        this.productSelected()
      }
    },
    categorias () {
      if (!this.displayType) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria.includes(this.filtercat[0]['id'])) : []
        this.selectedCat = this.filtercat[0]
      }
    },
    origMenu () {
      this.filteredMenu = this.origMenu
    },
    filtercat () {
      if (this.displayType === 0 || this.displayType === 3) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria.includes(this.filtercat[0]['id'])) : []
        this.selectedCat = this.filtercat[0]
      }
    },
    display (e) {
      if (!e) {
        this.displayVal = {}
      }
    }
  },
  mounted () {
    this.afterbinding()
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...this._props
      }
    })
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'bindItem', 'addCart', 'bindCategorias', 'setSede', 'bindPromos', 'bindRewards', 'bindGroupComp', 'setFilter', 'setProduct', 'setProdType']),
    ...mapActions('config', ['setMenuDispType']),
    filterFindName (x) {
      let found = this.filters.find(e => e.id === x)
      return typeof found === 'undefined' ? 'Catálogo' : found.name
    },
    afterbinding () {
      // menu
      this.menuLoading = false
      this.filteredMenu = this.origMenu
      if (!parseInt(this.selectedProdType)) {
        this.productSelected()
      }
      // cat
      if (!this.displayType) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria.includes(this.filtercat[0]['id'])) : []
        this.selectedCat = this.filtercat[0]
      }
      // promo
      if (parseInt(this.selectedProdType)) {
        this.productSelected()
      }
      this.bindRewards().catch(e => {
        console.error('error fetching data firebase', { e })
      })
    },
    click () {
      this.$emit('click-edit', {
        block_info: {
          block_index: this.block_index, child_index: this.child_index
        },
        props_info: {
          ...this._props
        }
      })
    },
    nextDisp () {
      if (this.displayType === 3) {
        this.displayType = 0
        this.selectedCat = this.filtercat[0]
      } else {
        if (!this.$q.platform.is.mobile && this.displayType === 1) {
          this.displayType = this.displayType + 2
        } else {
          this.displayType = this.displayType + 1
        }
        this.selectedCat = this.filtercat[0]
      }
      if (this.displayType === 1) {
        this.selectedCat = null
        this.search()
      }
    },
    productSelected () {
      if (this.selectedProduct && this.selectedProduct !== '') {
        try {
          this.getMenuItem(this.selectedProduct, parseInt(this.selectedProdType))
          this.display = true
        } catch (e) {
          console.error(e)
          this.$q.notify({
            message: `Disculpe, el producto no se encuentra disponible en este momento`,
            color: 'red',
            actions: [
              { label: 'X', color: 'white' }
            ]
          })
          this.setProduct('')
          this.setProdType('')
        }
        this.setProduct('')
        this.setProdType('')
      }
    },
    nextFilter () {
      let index = this.filterop.findIndex((e) => e === this.selectedFilter)
      if (typeof this.filterop[index + 1] === 'undefined') {
        this.setFilter(this.filterop[0])
        if (!this.displayType) {
          this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria.includes(this.filtercat[0]['id'])) : []
          this.selectedCat = this.filtercat[0]
        }
      } else {
        this.setFilter(this.filterop[index + 1])
        if (!this.displayType) {
          this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria.includes(this.filtercat[0]['id'])) : []
          this.selectedCat = this.filtercat[0]
        }
      }
    },
    filteredMenuCat (e) {
      let filtered = []
      const { viewRewards, rewards } = this
      function filter (x) {
        if (viewRewards) {
          return x && x.categoria && x.categoria.includes(e) && rewards[0].products.includes(x.id)
        }
        return x && x.categoria && x.categoria.includes(e)
      }
      if (Array.isArray(this.filteredMenu)) {
        filtered = this.filteredMenu.filter(x => filter(x))
        for (let item of filtered) {
          item.checkAvail = this.checkAvail(item.id, item.prodType)
        }
      } else {
        filtered = [{ id: 'kkfkff', not: true }]
      }
      return filtered
    },
    search () {
      if (this.selectedCat !== null) {
        this.filteredMenu = this.origMenu.filter(x => {
          return x && x.name && x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
        this.filteredMenu = this.filteredMenu.filter(x => {
          return x && x.categoria && x.categoria.includes(this.selectedCat.id)
        })
      } else {
        this.filteredMenu = this.origMenu.filter(x => {
          return x && x.name && x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
      }
    },
    // checkAvailReward (item) {
    //   if (!this.rewards) { return [true, true] }
    //   var available = 0
    //   var available2 = 0
    //   var quant = this.quantity ? this.quantity + 1 : 2
    //   var counter = 1
    //   var exists = 0
    //   var inCart = this.cart.filter(x => x.prodId === item.id && x.reward)
    //   inCart.forEach(element => {
    //     counter = element.quantity + counter
    //   })
    //   if (counter > 1) { exists = 1 }
    //   quant = quant + counter - 1
    //   var categories = item.categoria
    //   var rewardCategories = typeof this.pointsCat === 'undefined' ? [] : Object.keys(this.pointsCat)
    //   var intersection = categories ? categories.filter(x => rewardCategories && rewardCategories.includes(x)) : []
    //   for (var cat of intersection) {
    //     var points = this.pointsCat[cat]
    //     if ((points - (quant * 10)) >= 0) {
    //       available++
    //     }
    //     if ((points - (counter * 10)) >= 0) {
    //       available2++
    //     }
    //   }
    //   return [available, available2, exists]
    // },
    checkAvail (id, type, diag) {
      var exists = 0
      if (typeof id === 'undefined' || typeof type === 'undefined') { return false }
      if (type === 0) {
        var counter = diag ? 0 : this.quantity
        var inCart = this.cart.filter(x => x.prodId === id)
        var product = this.filteredMenu.find(x => x.id === id)
        inCart.forEach(element => {
          counter = element.quantity + counter
        })
        this.cart.forEach(y => {
          if (typeof y.prods !== 'undefined') {
            var producto = y.prods.find(j => j.id === product.id)
            if (typeof producto === 'undefined') { producto = { quantity: 0 } }
            counter = producto.quantity * y.quantity + counter
          }
        })
        if (counter) { exists = 1 }
        if (typeof product !== 'undefined' && typeof product.stock !== 'undefined' && typeof product.stock[this.sede] !== 'undefined') {
          if (counter === parseInt(product.stock[this.sede])) {
            return [0, exists]
          } else if (counter > parseInt(product.stock[this.sede])) {
            return [2, exists]
          } else {
            return [1, exists]
          }
        } else { return [0, exists] }
      } else {
        var promotion = this.promoData.find(e => e.id === id)
        if (typeof promotion !== 'undefined') {
          for (let e in promotion.prods) {
            product = promotion.prods[e]
            counter = (diag ? 0 : this.quantity) * product.quantity
            inCart = this.cart.filter(x => x.prodId === promotion.prods[e].id)
            inCart.forEach(element => {
              counter = element.quantity + counter
            })
            this.cart.forEach(y => {
              if (typeof y.prods !== 'undefined') {
                var producto = y.prods.find(j => j.id === promotion.prods[e].id)
                if (typeof producto === 'undefined') { producto = { quantity: 0 } }
                counter = (producto.quantity * y.quantity) + counter
              }
            })
            exists = 0
            if (counter) { exists = 1 }

            if (typeof product !== 'undefined') {
              if (counter > parseInt(product.stock[this.sede])) {
                return [2, exists]
              } else if (counter === parseInt(product.stock[this.sede]) || counter + product.quantity > parseInt(product.stock[this.sede])) {
                return [0, exists]
              }
            }
          }
        }
        return [1, exists]
      }
    },
    getMenuItem (id, type, reward) {
      reward = typeof reward === 'undefined' ? 0 : reward
      if (type === 0) {
        this.displayVal = JSON.parse(JSON.stringify(this.filteredMenu.find((e) => {
          return e.id === id
        })))
        console.log({ dv: this.displayVal, id })
        this.displayVal.id = id
        if (reward) {
          this.displayVal.price = 0
          this.displayVal.reward = 1
        }
      } else {
        this.displayVal = JSON.parse(JSON.stringify(this.promoData.find((e) => {
          return e.id === id
        })))
        this.displayVal = { ...this.displayVal, prodType: 1, id: id }
      }
    }
  }
}
</script>

<style lang="stylus" >
.q-img__content
  overflow visible !important

.menuphoto-xs
  overflow visible !important
  filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width 72px
  height 72px

.menuphoto-md
  overflow visible !important
  filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width 95px
  height 95px

.burgericon
  color #000

.carticon
  color #000

.toggleicon
  color #000

.wrapel
  .no-wrap
    -ms-flex-wrap wrap !important
    flex-wrap wrap !important

.menu-div
  border-top-left-radius 50px
  border-top-right-radius 50px
  border-bottom-left-radius 50px
  border-bottom-right-radius 50px
.item-xs
  color #000
  border-radius 20px
  width 90px !important
  height 200px
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.item-md
  color #000
  border-radius 20px
  width 124px !important
  height 250px
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.item-content-md
  margin-left 20%
  width 166px
  height 300px
  text-align center

.item-content-xs
  margin-left 20%
  width 130px
  height 230px
  text-align center

.price-content
  display -webkit-box
  display -ms-flexbox
  display flex
  -webkit-box-pack center
  -ms-flex-pack center
  justify-content center
  -webkit-box-align center
  -ms-flex-align center
  align-items center
  text-align center !important
  width 100%

.header-title
  height 5%
  margin-left 5%
  margin-right 5%
  padding-top 5%

.background-color
  margin 40px auto
  border-radius 20px
  width 90% !important
  height 60%
  background-color #e0dada
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.header-tabs
  padding-top 30px
  padding-bottom 20px

.container-photo
  width 100%
  padding-left 45%
  padding-top 25%

.prbut
  z-index 10
  position fixed
  top 50%
  right 0
  -webkit-transform rotate(-90deg)
  -ms-transform rotate(-90deg)
  transform rotate(-90deg)
  margin-right -40px

.promo
  padding-top 3%

.list-complete-item
  -webkit-transition all 1s
  -o-transition all 1s
  transition all 1s

.list-complete-enter
  opacity 0
  -webkit-transform translateY(30px)
  -ms-transform translateY(30px)
  transform translateY(30px)

.list-complete-leave-to
  -webkit-transition all 0s
  -o-transition all 0s
  transition all 0s
  opacity 0

.list-complete-leave-active
  position absolute
.VueCarousel-navigation-prev
  left 30px !important
  padding unset !important
  margin-right unset !important
.VueCarousel
  padding-top 20px
  overflow hidden
.VueCarousel-navigation-next
  right 30px !important
  padding unset !important
  margin-left unset !important
.VueCarousel-wrapper
  overflow visible
@media (max-width: 991px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 90%
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)

@media (max-width: 660px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 100%
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)
</style>
