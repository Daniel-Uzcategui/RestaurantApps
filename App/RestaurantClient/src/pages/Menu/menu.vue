<template>
  <div>
    <q-input v-if="false" class="q-pa-lg" :bg-color=" $q.dark.isActive ? 'dark' : 'white'" v-model="searchBar" @input="search" rounded outlined label="Buscar en el Menu" >
      <template v-slot:prepend>
        <q-icon name="fas fa-search" />
      </template>
   </q-input>
     <q-card flat class="menu-div2" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section class="q-pt-xl">
          <div class="row header-title">
            <div class="fontsize-18">{{rewards ? 'Recompensas': promo ? 'Promociones' : selectedFilter === '' ? 'Catálogo' : (filters.find( e => e.id === selectedFilter).name)}}</div>
            <q-btn v-if="filters.length" dense round flat @click="nextFilter()" icon="fas fa-chevron-circle-right fa-2x" />
          </div>
         <div>
            <q-list class="bg-dark" style="overflow: hidden; z-index: 10; position: fixed; top: 50%; right: 0; border-top-left-radius: 28px; margin-right: -15px; border-bottom-left-radius: 28px;">
              <q-item v-ripple style="padding-left: 10px;" v-if="pointsCat && Object.keys(pointsCat).length  && !promo">
                <q-btn :ripple='false' round dense flat color="white" icon="fas fa-gift" @click="rewards = !rewards" />
              </q-item>
              <q-item v-ripple :ripple='false' style="padding-left: 10px;" v-if="(promoData.length || promo)  && !rewards">
                <q-btn dense round flat color="white" icon="fab fa-creative-commons-nc" @click="promo = !promo" />
              </q-item>
            </q-list>
         </div>
      </q-card-section>
      <q-card-section class="wrapel q-pa-none q-ma-none" > <!---Seccion catalogo --->
         <div
            v-if="!promo && !rewards"
            class="wrapel "
            >
            <div class="wrapel background-color" content-class="wrapel"  v-for="tabs in filtercat()"
               :key="tabs.id">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">{{tabs.name}}</div>
                <q-card-section v-if="!promo && !rewards">
                  <carousel
                  :loop="true"
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px; z-index: 100;" aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px; z-index: 100;" aria-hidden="true"></i>'
                   :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                      <slide class="row justify-center" v-for="(item, key) in filteredMenuCat(tabs.id)" :key="item.id" >
                        <div v-if="typeof item.not === 'undefined'">
                        <div  style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col relative-position" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
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
                        </div>
                        </slide>
                     </carousel>
                  </q-card-section>
               </div>
               <q-separator vertical class="menuseparator" />
            </div>
         </q-card-section>
         <!--- Fin Seccion catalogo --->
         <q-card-section v-if="!promo && rewards">
           <div class="background-color">
               <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold"></div>
            <carousel
            :loop="true"
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px; z-index: 100;" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px; z-index: 100;" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 1], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="(item, key) in filteredMenu" :key="item.id" v-show="pointsCat && Object.keys(pointsCat).some(r=> item.categoria.includes(r))" >
               <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                  <div @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
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
            navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px; z-index: 100;" aria-hidden="true"></i>'
            navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px; z-index: 100;" aria-hidden="true"></i>'
            :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
            <slide class="row justify-center" :name="key" v-for="item in promoData" :key="item.id" >
               <div style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                  <div @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':'#64CDF5'},{'color': '#292929'}]">
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
                  <div class="diagphcont relative-position q-pt-lg" :class="displayVal.disptype !== 1 ? 'column items-center' : ''" :style="displayVal.disptype == 1 ? 'background-color: unset' : dgbg">
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
                  navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="margin-left: -15px; z-index: 100;" aria-hidden="true"></i>'
                  navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="margin-right: -15px; z-index: 100;" aria-hidden="true"></i>'
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
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos', 'selectedFilter', 'filters']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['configurations']),
    cats () {
      let objs = this.categorias
      return objs.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    },
    menucfg () {
      if (typeof this.configurations === 'undefined' && typeof this.configurations.find(e => e.id === 'menu') === 'undefined') {
        return { menuactive: true, iconsactive: true }
      }
      return this.configurations.find(e => e.id === 'menu')
    },
    filterop () {
      let filter = this.filters.map(x => x.id)
      if (this.menucfg.menuactive) {
        filter = ['', ...filter]
      }
      return filter
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
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'bindPromos', 'bindGroupComp', 'setFilter']),
    filtercat () {
      console.log({ SelectedF: this.selectedFilter })
      if (this.selectedFilter === '') { return this.cats } else if (this.filters && this.selectedFilter && this.cats) {
        console.log(this.filters, this.selectedFilter, this.cats)
        let thfilter = this.filters.find(e => e.id === this.selectedFilter)
        console.log({ thfilter })
        let filtered = this.cats.filter(x => thfilter.cats.includes(x.id))
        console.log({ filtered })
        return filtered
      }
      return []
    },
    nextFilter () {
      console.log('nextfiter')
      let index = this.filterop.findIndex((e) => e === this.selectedFilter)
      console.log({ index })
      console.log({ ff: this.filterop })
      if (typeof this.filterop[index + 1] === 'undefined') {
        console.log({ ff2: this.filterop })
        this.setFilter(this.filterop[0])
      } else {
        console.log({ ff3: this.filterop })
        this.setFilter(this.filterop[index + 1])
      }
    },
    filteredMenuCat (e) {
      console.log({ e, f: this.filteredMenu })
      let filtered = []
      if (Array.isArray(this.filteredMenu)) {
        filtered = this.filteredMenu.filter(x => x.categoria.includes(e))
      } else {
        filtered = [{ id: 'kkfkff', not: true }]
      }
      console.log(JSON.stringify(filtered))
      return filtered
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
  overflow visible !important
  min-width 205.75px
  min-height 186.15px
  width 26.25vmin
  height 23.75vmin
  background-color #ffd63d
  border-radius 30px

.diagphcont2
  overflow visible !important
  margin auto
  min-width 184.52px
  min-height 184.52px
  width 23vmin
  position relative

.diagph
  overflow visible !important
  min-width 184.52px
  min-height 184.52px
  position absolute
  top -50%
  -webkit-filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))

.menuphoto-xs
  overflow visible !important
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width 72px
  height 72px

.menuphoto-md
  overflow visible !important
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

.text-content
  min-width 100px
  position relative
  margin-left 5px

.item-xs
  color #000
  border-radius 20px
  width 90px !important
  height 180px
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
  overflow visible !important
  left 3% !important

.VueCarousel-navigation-next
  overflow visible !important
  right 3% !important

@media (max-width: 991px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 90%
    background-color #e0dada
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)

@media (max-width: 660px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 100%
    background-color #e0dada
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)
</style>
