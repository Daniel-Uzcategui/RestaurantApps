<template>
  <div>
    <q-input v-if="false" class="q-pa-lg" :bg-color=" $q.dark.isActive ? 'dark' : 'white'" v-model="searchBar" @input="search" rounded outlined label="Buscar en el Menu" >
      <template v-slot:prepend>
        <q-icon name="fas fa-search" />
      </template>
   </q-input>
     <q-card flat class="menu-div2" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section class="q-pt-xl">
         <div class="fontsize-18 header-title">{{rewards ? 'Recompensas': promo ? 'Promociones' : 'Catálogo'}}</div>
         <div>
            <q-btn-group style="z-index: 10; position: fixed; top: 50%; right: 0; transform: rotate(-90deg); margin-right: -40px"  push>
               <q-btn v-if="pointsCat && Object.keys(pointsCat).length  && !promo" color="primary" icon="fas fa-gift fa-rotate-90" :label="rewards ? 'Volver' : ''" @click="rewards = !rewards" />
               <q-btn v-if="(promoData.length || promo)  && !rewards" color="secondary" icon="fab fa-creative-commons-nc fa-rotate-90" :label="promo ? 'Volver' : ''" @click="promo = !promo" />
            </q-btn-group>
         </div>
      </q-card-section>
      <q-card-section class="wrapel q-pa-none q-ma-none" > <!---Seccion catalogo --->
         <q-tabs vertical
            v-if="!promo && !rewards"
            class="wrapel "
            content-class="wrapel"
            >
            <div class="wrapel background-color" content-class="wrapel"  v-for="(tabs, index) in cats"
               :key="index">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">{{tabs.name}}</div>
                <q-card-section v-if="!promo && !rewards">
                  <carousel
                  :loop="true"
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px" aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px" aria-hidden="true"></i>'
                   :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                      <slide class="row justify-center" :name="key" v-for="(item, key) in filteredMenuCat(tabs.id)" :key="item.id" >
                        <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col position-relative" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                            <div @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false; dgbg = {'background-color':tabs.color}" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':tabs.color},{'color': tabs.textcolor}]">
                              <div class="container-photo">
                                  <q-img style="z-index: 1000" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                              </div>
                              <div class="text-caption">
                                    <div class="text-bold relative-position">
                                       <q-item-label lines="5">{{item.name}} </q-item-label>
                                    </div>
                                 </div>
                                 <div class="price-content" >
                                    <div>
                                       <q-badge color="red" rounded v-if="item.discount > 0" >-{{item.discount}}%</q-badge>
                                       <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                       </q-item-label>
                                       <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                       </q-item-label>
                                    </div>
                                 </div>
                                 <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                                 <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                           </div>
                          </div>
                        </slide>
                     </carousel>
                  </q-card-section>
               </div>
               <q-separator vertical class="menuseparator" />
            </q-tabs>
         </q-card-section>
         <!--- Fin Seccion catalogo --->
         <q-card-section v-if="!promo && rewards">
           <div class="background-color">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
            <carousel
            :loop="true"
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 1], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="(item, key) in filteredMenu" :key="item.id" v-show="pointsCat && Object.keys(pointsCat).some(r=> item.categoria.includes(r))" >
               <div :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                  <div @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
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
                           <q-item-label >$ 0.00
                            </q-item-label>
                        </div>
                     </div>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="(checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]) || (!checkAvailReward(item)[1] && checkAvailReward(item)[2])">*Máx en el Carrito*</q-tooltip>
                  </div>
               </div>
            </slide>
         </carousel>
           </div>
         </q-card-section>
         <!-- Seccion de promociones -->
         <q-card-section v-if="promo && !rewards">
           <div class="background-color">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
            <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
         <carousel
            :loop="true"
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="item in promoData" :key="item.id" >
               <div :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                  <div @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
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
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </div>
               </div>
            </slide>
         </carousel>
           </div>
         </q-card-section>
      </q-card>
      <q-dialog
         v-if="typeof displayVal !== 'undefined' && typeof displayVal.groupComp !== 'undefined'"
         v-model="display"
         persistent
         maximized
         transition-show="slide-up"
         transition-hide="slide-down"
         @hide="quantity = 0; totSum = 0; required = false; itComp = []"
         @show="quantity = 1;"
         >
         <q-card>
            <q-bar class="bg-transparent">
               <q-space />
               <q-btn style="z-index: 9999" dense flat icon="close" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section class="q-pa-none q-pt-xl row justify-center">
               <div class="column items-center col-4 q-pt-xl"
                 style="min-width: 320px"  :style="displayVal.disptype == 1 ? 'height: 45vmin; min-height: 304px;' : ''">
                  <div class="diagphcont relative-position q-pt-lg" :style="displayVal.disptype == 1 ? 'background-color: unset' : dgbg">
                    <img
                      v-if="displayVal.disptype == 1"
                      style="position: absolute;
                      width: 300%;
                      top: -109%;
                      left: -135%;" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FUnion%20166115595?alt=media&token=9618c4b1-6e55-4b1c-895d-e506d6436855" alt="">
                     <div class="diagphcont2" style="position: absolute">
                        <q-img class="diagph" :style="typeof displayVal.disptype === 'undefined' ? false : displayVal.disptype == 1 ? 'min-width: 250px; min-height: 250px; top: -81%;' : ''" v-if="displayVal.photo" contain :src=displayVal.photo />
                     </div>
                  </div>
                  <div>
                     <div class="column items-center">
                        <div v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0" class="q-pt-lg">
                           <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'" class="q-mr-lg" color="dark" round @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="remove" text-color="white" dense />
                           <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'"  :class="'q-pl-'+ $q.screen.name + ' q-pr-' + $q.screen.name" color="white" rounded text-color="black" :label="quantity" />
                           <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'"  class="q-ml-lg" color="dark" round @click="(checkAvail(displayVal.id, displayVal.prodType, rewards)[0] === 1 && checkAvailReward(displayVal)[0]) ? quantity++ : false" icon="add" text-color="white" dense >
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !checkAvailReward(displayVal)[0]" floating>MAX</q-badge>
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                                 <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                              </q-badge>
                           </q-btn>
                        </div>
                        <div v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0">
                        <q-btn class="q-pl-md q-pr-md q-mt-lg" v-if="required && !$q.screen.gt.sm" @click="addToCart(rewards)" rounded v-close-popup color="dark" no-caps>Agregar al carrito</q-btn>
                        <q-btn class="q-pl-md q-pr-md q-mt-lg" v-if="!required && !$q.screen.gt.sm" @click="showNotif" rounded color="dark" no-caps>Agregar al carrito</q-btn>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="q-pa-lg col-8"  style="min-width: 320px">
                  <div :class="displayVal.disptype == 1 ? 'text-center text-h3 text-uppercase text-weight-medium' : 'text-h4'">
                     {{displayVal.name}}
                  </div>
                  <div :class="displayVal.disptype == 1 ? 'text-center text-h6' : ' text-h5 text-grey'" class="q-pt-lg" :style="displayVal.disptype == 1 ? '' : 'max-width: 50vmax; letter-spacing: 0.094em; line-height: 35px;'" v-html=displayVal.descripcion>
                  </div>
                  <div class="row justify-between q-pa-none">
                     <div v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0" class="q-pt-md text-h6">
                        <div v-if="displayVal.discount > 0 && displayVal.groupComp.length">
                           Total <span class="text-strike"> {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }} </span> $ {{(((parseFloat(displayVal.price) * (1 - (displayVal.discount/100)) + totSum ) ) * quantity).toFixed(2)}}
                           <q-badge color="green" rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
                        </div>
                        <q-item-label class="text-h6" v-if="!displayVal.discount && displayVal.groupComp.length">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
                        <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length == 0">
                        $ {{(((parseFloat(displayVal.price).toFixed(2) * (1 - (displayVal.discount/100))) ) * quantity).toFixed(2)}}
                        <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >Descuento {{displayVal.discount}}%</q-badge>
                     </q-item-label>
                     <q-item-label v-if="!displayVal.discount && displayVal.groupComp.length == 0">$ {{((parseFloat(displayVal.price).toFixed(2) ) * quantity).toFixed(2) }}</q-item-label>
                     </div>
                     <q-card-actions v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0" vertical>
                        <q-btn class="q-pl-md q-pr-md" v-if="required && $q.screen.gt.sm" @click="addToCart(rewards)" rounded v-close-popup color="dark" no-caps>Agregar al carrito</q-btn>
                        <q-btn class="q-pl-md q-pr-md" v-if="!required && $q.screen.gt.sm" @click="showNotif" rounded color="dark" no-caps>Agregar al carrito</q-btn>
                     </q-card-actions>
                  </div>
                  <itemcomp
                  v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0"
                  :mode="typeof displayVal.disptype === 'undefined' ? 0 : displayVal.disptype"
                  class="q-pt-xl row justify-start"
                  :comp="displayVal.groupComp"
                  :value="itComp"
                  @update-comp="(e) => {required = e}"
                  @update-tot="(e) => {totSum = e}"
                  />
               </div>
            </q-card-section>
            <q-card-section class="q-pa-none q-ma-none" v-if="displayVal.disptype == 1">
              <itemcomp
                  :mode="1"
                  class="q-pt-xl"
                  :comp="displayVal.groupComp"
                  :value="itComp"
                  @update-comp="(e) => {required = e}"
                  @update-tot="(e) => {totSum = e}"
                  />
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? false : displayVal.disptype == 1">
              <div class="column items-center">
                <div style="max-width: 300px; min-width: 40vmin; border-radius: 28px; background-color: #FFD63D" class="q-pa-xl">
                  <div class="text-h6 text-center"> Cantidad </div>
                <div class="q-pt-lg flex flex-center">
                           <q-btn class="q-mr-lg" color="dark" round @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="remove" text-color="white" dense />
                           <q-btn :class="'q-pl-'+ $q.screen.name + ' q-pr-' + $q.screen.name" color="white" rounded text-color="black" :label="quantity" />
                           <q-btn  class="q-ml-lg" color="dark" round @click="(checkAvail(displayVal.id, displayVal.prodType, rewards)[0] === 1 && checkAvailReward(displayVal)[0]) ? quantity++ : false" icon="add" text-color="white" dense >
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !checkAvailReward(displayVal)[0]" floating>MAX</q-badge>
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                                 <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                              </q-badge>
                           </q-btn>
                        </div>
              <div class="column items-center">
                     <div  class="q-pt-md">
                        <div class="text-h6" v-if="displayVal.discount > 0 && displayVal.groupComp.length">
                           Total <span class="text-strike"> {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }} </span> $ {{(((parseFloat(displayVal.price) * (1 - (displayVal.discount/100)) + totSum ) ) * quantity).toFixed(2)}}
                           <q-badge color="green" rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
                        </div>
                        <q-item-label class="text-h6" v-if="!displayVal.discount && displayVal.groupComp.length">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
                     </div>
                     <div class="q-pt-lg" vertical>
                        <q-btn class="q-pl-md q-pr-md" v-if="required" @click="addToCart(rewards)" rounded v-close-popup color="dark" no-caps>Agregar al carrito</q-btn>
                        <q-btn class="q-pl-md q-pr-md" v-if="!required" @click="showNotif" rounded color="dark" no-caps>Agregar al carrito</q-btn>
                     </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0">
              <div class="background-color">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">Más productos</div>
             <carousel
                  :loop="true"
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px" aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px" aria-hidden="true"></i>'
                   :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                      <slide class="row justify-center" :name="key+'diag'" v-for="(item, key) in filteredMenu" :key="item.id+'diag'" >
                        <div :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0] ? 'opacity: 0.5;' : ''" >
                            <div @click="checkAvail(item.id, item.prodType, true)[0] ? (display = true, getMenuItem(item.id, 0), dgbg = {'background-color':'#393939'}) : false;" :id="key+'diag'" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#393939'},{'color': '#FFFFFF'}]">
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
                                       <q-badge color="red" rounded v-if="item.discount > 0" >-{{item.discount}}%</q-badge>
                                       <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                       </q-item-label>
                                       <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                       </q-item-label>
                                    </div>
                                 </div>
                                 <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0]">*No Disponible*</q-tooltip>
                                 <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0]">*Máx en el Carrito*</q-tooltip>
                           </div>
                          </div>
                        </slide>
                     </carousel>
              </div>
           </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import { Carousel, Slide } from 'vue-carousel'
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue'),
    Carousel,
    Slide
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos']),
    ...mapGetters('user', ['currentUser']),
    cats () {
      let objs = this.categorias
      return objs.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    },
    origMenu () {
      return this.menu.reduce((y, x) => {
        if (x.estatus && x.estatus[this.sede]) {
          y.push({
            categoria: x.categoria,
            estatus: x.estatus,
            descripcion: x.descripcion,
            name: x.name,
            photo: x.photo,
            price: x.price,
            id: x.id,
            stock: x.stock,
            discount: x.discount,
            prodType: 0,
            disptype: x.disptype,
            groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
          })
        }
        return y
      }, [])
    },
    pointsCat () {
      console.log({ User: this.currentUser })
      var obj = this.currentUser === null || typeof this.currentUser.pointsCat === 'undefined' ? [] : this.currentUser.pointsCat
      var objout = Object.keys(obj).reduce((p, c) => {
        if (obj[c] >= 10) { p[c] = obj[c] }
        return p
      }, {})
      console.log({ objout })
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
      dgbg: 'inherit',
      rewards: false,
      itComp: [],
      totSum: 0,
      required: false,
      promo: 0,
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
      selectedCat: '',
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
    }
  },
  mounted () {
    var el = document.querySelector('.burgericon')
    el.style.color = 'black'
    var el2 = document.querySelector('.carticon')
    el2.style.color = 'black'
    var el3 = document.querySelector('.toggleicon')
    el3.style.color = 'black'
    var el4 = document.querySelector('.q-toolbar')
    el4.style.backgroundImage = `url('data:image/svg+xml;utf8,%3Csvg%20version%3D%221.0%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%0A%20width%3D%221038.000000pt%22%20height%3D%22133.000000pt%22%20viewBox%3D%220%200%201038.000000%20133.000000%22%0A%20preserveAspectRatio%3D%22xMidYMid%20meet%22%3E%0A%0A%3Cg%20transform%3D%22translate(0.000000%2C133.000000)%20scale(0.100000%2C-0.100000)%22%0Afill%3D%22%23000000%22%20stroke%3D%22none%22%3E%0A%3Cpath%20d%3D%22M6900%201326%20c0%20-6%20-140%20-597%20-146%20-618%20-4%20-13%20-14%20-16%20-47%20-13%20-23%203%0A-175%207%20-337%2011%20-395%209%20-443%202%20-702%20-104%20-126%20-52%20-188%20-82%20-188%20-92%200%20-23%2078%0A-100%2095%20-94%208%204%2026%20-11%2045%20-38%2043%20-60%20183%20-182%20256%20-223%20149%20-85%20300%20-127%20505%0A-141%20238%20-15%20439%2042%20680%20196%20151%2096%20192%20131%20260%20223%2055%2076%2088%20158%2076%20191%20-5%0A14%20-121%2030%20-309%2042%20-54%204%20-98%208%20-98%2010%200%201%2054%20113%20119%20248%2066%20135%20122%20254%20126%0A265%204%2014%20-2%2021%20-25%2031%20-17%207%20-32%2011%20-34%209%20-2%20-2%20-59%20-127%20-127%20-278%20l-123%0A-273%20-54%205%20c-30%203%20-56%208%20-58%2010%20-3%202%2031%20144%2076%20314%2044%20171%2080%20313%2080%20317%200%203%0A-16%206%20-35%206%20-19%200%20-35%20-2%20-35%20-4z%20m-602%20-652%20c-4%20-3%20-59%20-12%20-124%20-20%20-177%0A-22%20-485%20-119%20-593%20-185%20-17%20-11%20-22%20-10%20-39%2011%20l-20%2025%2037%2020%20c46%2027%20232%20100%0A291%20116%2078%2020%20463%2049%20448%2033z%20m442%20-30%20c0%20-3%20-9%20-40%20-19%20-82%20-10%20-43%20-21%20-89%0A-25%20-103%20l-6%20-26%20-227%20-12%20c-179%20-10%20-268%20-11%20-413%20-2%20-177%2011%20-311%2025%20-375%0A38%20l-29%205%2039%2021%20c141%2072%20445%20141%20690%20156%20152%2010%20365%2013%20365%205z%20m160%20-14%20c0%20-7%0A-68%20-169%20-74%20-177%20-1%20-1%20-20%20-5%20-43%20-9%20l-41%20-6%2027%20101%2026%20101%2053%200%20c28%200%2052%0A-4%2052%20-10z%20m190%20-47%20c41%20-13%2086%20-29%2099%20-37%2023%20-13%2022%20-14%20-40%20-34%20-62%20-21%0A-249%20-55%20-256%20-48%20-2%202%2013%2038%2034%2080%2042%2086%2028%2082%20163%2039z%20m158%2010%20c28%20-8%2052%0A-18%2052%20-23%200%20-17%20-33%20-19%20-63%20-3%20-18%209%20-57%2024%20-87%2034%20l-55%2018%2050%20-5%20c28%20-3%2074%0A-13%20103%20-21z%20m106%20-45%20c-13%20-44%20-95%20-146%20-147%20-185%20-84%20-63%20-85%20-61%20-7%2033%2073%0A88%20151%20174%20158%20174%202%200%200%20-10%20-4%20-22z%20m-149%20-67%20c-6%20-5%20-65%20-28%20-133%20-50%20-205%0A-69%20-472%20-95%20-752%20-72%20l-85%207%2060%206%20c33%204%20119%2010%20190%2014%20182%208%20512%2050%20625%2078%0A52%2013%2097%2024%20100%2025%202%201%200%20-3%20-5%20-8z%20m-89%20-138%20c-30%20-43%20-62%20-85%20-72%20-94%20-50%0A-42%20-178%20-110%20-260%20-138%20-174%20-59%20-448%20-66%20-630%20-16%20-156%2043%20-174%2054%20-228%20138%0A-20%2031%20-50%2073%20-67%2092%20-20%2022%20-26%2035%20-17%2035%208%200%2092%20-7%20188%20-15%20400%20-33%20486%20-37%0A646%20-25%20129%2010%20180%2018%20312%2055%2086%2024%20162%2044%20169%2044%207%201%20-12%20-34%20-41%20-76z%0Am-1393%2038%20c80%20-38%2084%20-42%20146%20-134%20l53%20-79%20-42%2024%20c-85%2047%20-266%20218%20-231%20218%0A6%200%2039%20-13%2074%20-29z%20m190%2012%20c-13%20-2%20-35%20-2%20-50%200%20-16%202%20-5%204%2022%204%2028%200%2040%20-2%0A28%20-4z%20m100%20-10%20c-13%20-2%20-33%20-2%20-45%200%20-13%202%20-3%204%2022%204%2025%200%2035%20-2%2023%20-4z%20m155%0A-10%20c-16%20-2%20-40%20-2%20-55%200%20-16%202%20-3%204%2027%204%2030%200%2043%20-2%2028%20-4z%22%2F%3E%0A%3Cpath%20d%3D%22M1828%201281%20c-206%20-29%20-386%20-152%20-473%20-323%20-49%20-99%20-69%20-199%20-62%20-322%0A8%20-164%2069%20-299%20180%20-402%2074%20-68%20140%20-107%20242%20-141%20112%20-37%20284%20-39%20395%20-4%20113%0A35%20187%2078%20266%20156%20124%20124%20181%20278%20171%20464%20-16%20322%20-252%20553%20-587%20574%20-41%203%0A-101%202%20-132%20-2z%20m266%20-140%20c334%20-117%20437%20-552%20191%20-810%20-153%20-160%20-413%20-198%0A-617%20-89%20-107%2057%20-210%20191%20-237%20309%20-15%2062%20-13%20195%203%20254%2049%20184%20195%20319%20386%0A355%2070%2014%20207%204%20274%20-19z%22%2F%3E%0A%3Cpath%20d%3D%22M8065%201279%20c-109%20-16%20-211%20-61%20-284%20-126%20l-44%20-39%2046%20-38%2047%20-38%2037%0A32%20c137%20121%20400%20133%20510%2024%2072%20-72%2078%20-174%2017%20-297%20-20%20-40%20-93%20-119%20-320%0A-342%20l-294%20-290%200%20-47%200%20-48%20420%200%20420%200%200%2060%200%2060%20-324%200%20-324%200%20257%20257%0Ac223%20223%20263%20267%20290%20323%2057%20118%2062%20236%2016%20334%20-41%2086%20-155%20158%20-280%20176%20-80%0A11%20-107%2011%20-190%20-1z%22%2F%3E%0A%3Cpath%20d%3D%22M9795%201279%20c-120%20-18%20-234%20-70%20-298%20-137%20l-28%20-29%2041%20-36%20c22%20-21%2044%0A-37%2048%20-37%205%200%2019%2012%2033%2026%2087%2094%20316%20132%20446%2074%2091%20-40%20123%20-92%20123%20-198%200%0A-57%20-5%20-80%20-32%20-133%20-27%20-55%20-71%20-103%20-330%20-358%20l-299%20-295%203%20-40%203%20-41%20423%0A-3%20422%20-2%200%2060%200%2060%20-327%200%20-328%200%20247%20243%20c135%20133%20260%20263%20278%20290%2073%20111%0A95%20263%2051%20363%20-46%20103%20-150%20174%20-287%20194%20-79%2011%20-106%2011%20-189%20-1z%22%2F%3E%0A%3Cpath%20d%3D%22M100%20676%20l0%20-607%2063%203%2062%203%203%20186%202%20187%20228%204%20c288%206%20356%2025%20464%20126%0A59%2055%2092%20115%20108%20200%2036%20180%20-39%20351%20-188%20430%20-109%2058%20-149%2064%20-459%2069%20l-283%0A5%200%20-606z%20m631%20456%20c133%20-53%20200%20-186%20169%20-335%20-18%20-88%20-62%20-145%20-144%20-187%0Al-69%20-35%20-228%20-3%20-229%20-4%200%20297%200%20297%20223%20-4%20c201%20-4%20227%20-6%20278%20-26z%22%2F%3E%0A%3Cpath%20d%3D%22M2900%20675%20l0%20-605%2065%200%2065%200%200%20158%200%20158%20116%20122%20c64%2067%20119%20122%20124%0A122%204%200%20118%20-126%20251%20-280%20l243%20-280%2074%200%20c41%200%2072%204%2070%209%20-1%205%20-123%20152%20-270%0A325%20-148%20174%20-268%20321%20-268%20326%200%206%20113%20128%20250%20272%20138%20143%20250%20265%20250%20269%0A0%205%20-30%209%20-68%209%20l-67%200%20-350%20-361%20-350%20-362%20-3%20362%20-2%20361%20-65%200%20-65%200%200%20-605z%22%2F%3E%0A%3Cpath%20d%3D%22M4190%20675%20l0%20-605%20425%200%20426%200%20-3%2058%20-3%2057%20-357%203%20-358%202%200%20220%200%0A220%20311%200%20310%200%20-3%2053%20-3%2052%20-307%203%20-308%202%200%20210%200%20210%20345%200%20345%200%200%2060%200%2060%0A-410%200%20-410%200%200%20-605z%22%2F%3E%0A%3Cpath%20d%3D%22M8770%201220%20l0%20-60%20140%200%20140%200%200%20-545%200%20-546%2063%203%2062%203%200%20600%200%20600%0A-202%203%20-203%202%200%20-60z%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A')`
  },
  created () {
    this.bindMenu().then(() => {
      this.filteredMenu = this.origMenu
    })
    this.bindCategorias()
    this.bindPromos()
    this.bindGroupComp()
  },
  watch: {
    origMenu () {
      this.filteredMenu = this.origMenu
    }
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'bindPromos', 'bindGroupComp']),
    filteredMenuCat (e) {
      console.log({ filter: this.filteredMenu })
      return this.filteredMenu.filter(x => x.categoria.includes(e))
    },
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar los campos obligatorios`,
        color: 'red',
        actions: [
          { label: 'X', color: 'white' }
        ]
      })
    },
    search () {
      if (this.selectedCat !== '') {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
        this.filteredMenu = this.filteredMenu.filter(x => {
          return x.categoria.includes(this.selectedCat)
        })
      } else {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
      }
    },
    addToCart (rew) {
      if (this.displayVal.prodType === 0) {
        var toCart = {
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: typeof this.displayVal.discount !== 'undefined' ? parseFloat((this.displayVal.price * (1 - (this.displayVal.discount / 100))).toFixed(2)) : this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prodType: this.displayVal.prodType,
          category: this.displayVal.categoria
        }
        if (rew) { toCart = { ...toCart, reward: rew } }
        this.addCart(toCart).then(() => this.$q.notify({
          message: 'Producto Añadido',
          color: 'secondary',
          position: 'bottom'
        })
        )
      } else {
        this.addCart({
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: typeof this.displayVal.discount !== 'undefined' ? parseFloat((this.displayVal.price * (1 - (this.displayVal.discount / 100))).toFixed(2)) : this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prods: this.displayVal.prods,
          prodType: this.displayVal.prodType
        }).then(() => this.$q.notify({
          message: 'Producto Añadido',
          color: 'secondary',
          position: 'bottom'
        })
        )
      }
    },
    checkAvailReward (item) {
      if (!this.rewards) { return [true, true] }
      console.log({ item })
      var available = 0
      var available2 = 0
      var quant = this.quantity ? this.quantity + 1 : 2
      var counter = 1
      var exists = 0
      var inCart = this.cart.filter(x => x.prodId === item.id && x.reward)
      inCart.forEach(element => {
        counter = element.quantity + counter
      })
      if (counter > 1) { exists = 1 }
      quant = quant + counter - 1
      var categories = item.categoria
      var rewardCategories = typeof this.pointsCat === 'undefined' ? [] : Object.keys(this.pointsCat)
      var intersection = categories.filter(x => rewardCategories.includes(x))
      for (var cat of intersection) {
        var points = this.pointsCat[cat]
        console.log({ points })
        if ((points - (quant * 10)) >= 0) {
          console.log({ points, quant })
          available++
        }
        if ((points - (counter * 10)) >= 0) {
          console.log({ points, quant })
          available2++
        }
      }
      console.log({ available, available2 })
      return [available, available2, exists]
    },
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
        this.displayVal = this.filteredMenu.find((e) => {
          return e.id === id
        })
        this.displayVal.id = id
        if (reward) {
          this.displayVal.price = 0
          this.displayVal.reward = 1
        }
      } else {
        this.displayVal = this.promoData.find((e) => {
          return e.id === id
        })
        this.displayVal = { ...this.displayVal, prodType: 1, id: id }
        console.log({ disp: this.displayVal })
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.listextras
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.listextras.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    }
  }
}
</script>

<style lang="stylus" >
.diagphcont
  min-width 205.75px
  min-height 186.15px
  width 26.25vmin
  height 23.75vmin
  background-color #FFD63D
  border-radius 30px
.diagphcont2
  margin auto
  min-width 184.52px
  min-height 184.52px
  width 23vmin
  position relative
.diagph
  min-width 184.52px
  min-height 184.52px
  position absolute
  top -50%
  -webkit-filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))
.menuphoto-xs
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width: 72px
  height: 72px
.menuphoto-md
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width: 95px
  height: 95px
.burgericon
  color: black
.carticon
  color: black
.toggleicon
  color: black
.wrapel .no-wrap
  flex-wrap: wrap !important
.menu-div
  border-top-left-radius 50px
  border-top-right-radius 50px
  border-bottom-left-radius 50px
  border-bottom-right-radius 50px
.text-content
  min-width 100px
  position relative
  margin-left 5px
.item-xs
  color: black
  border-radius: 20px
  width: 90px !important
  height: 180px
  box-shadow: -4px 8px 18px rgba(0,0,0,.1)
.item-md
  color: black
  border-radius: 20px
  width: 124px !important
  height: 250px
  box-shadow: -4px 8px 18px rgba(0,0,0,.1)
.item-content-md
  margin-left 20%
  width: 166px
  height: 300px
  text-align: center
.item-content-xs
  margin-left 20%
  width: 130px
  height: 230px
  text-align: center
.price-content
  display: flex
  justify-content: center
  align-items: center
  text-align: center !important
  width: 100%
.header-title
    height 5%
    margin-left 5%
    padding-top 5%
.background-color
  margin:40px auto;
  border-radius: 20px
  width: 90% !important
  height: 60%
  background-color: #e0dada
  box-shadow: -4px 8px 18px rgba(0,0,0,.1)
.header-tabs
    padding-top: 30px
    padding-bottom: 20px
.container-photo
    width: 100%
    padding-left: 45%
    padding-top: 25%
.promo
    padding-top: 3%
.VueCarousel-navigation-prev
      left: 3% !important;
.VueCarousel-navigation-next
     right: 3% !important;
 /* ------------------------Tablets & Mobiles ---------------------------*/
@media (max-width: 991px)
 .background-color
    margin:40px auto;
    border-radius: 20px
    width: 90% !important
    height: 90%
    background-color: #e0dada
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
@media (max-width: 660px)
  .background-color
    margin:40px auto;
    border-radius: 20px
    width: 90% !important
    height: 100%
    background-color: #e0dada
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
</style>
