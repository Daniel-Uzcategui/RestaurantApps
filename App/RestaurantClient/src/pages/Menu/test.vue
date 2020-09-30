<template>
   <div>
<q-list v-for="(item, index) in cart" :key="index" class="full-width">
            <q-item class="row justify-between">
              <q-item-section class="col">
                <div class="row">
                <div>
                <div class="q-ma-md position-relative">
                  <div class="bg-primary" style="border-radius: 15px">
                  <q-img :src="getProdValById(item.prodId, 'photo', item.prodType)" width="80px" color="primary" text-color="white" class="q-ma-md rounded-borders" />
                  </div>
                </div>
                </div>
                </div>
               </q-item-section>
               <q-item-section :style="$q.screen.lt.sm ? 'margin-left: 62px;' : ''" :class="$q.screen.lt.md ? 'col column items-end' : ''">
                 <div>
                   <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
                  <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">$ {{item.prodPrice}}</q-item-label>
                 </div>
               </q-item-section>
               <q-item-section :class="$q.screen.lt.md ? 'col column items-end' : ''">
                <q-item-label class="text-h6 row">
                  <div class="text-weight-thin">{{item.quantity}}</div>
                  <q-btn-group  style="transform: rotateZ(90deg); border-radius: 0.5em">
                    <q-btn size="0.3em" class="q-pl-xs" color="white" icon="fas fa-chevron-left" text-color="dark" dense >
                      <q-badge color="red" v-if="item.avail === 0" floating style="left: 10px; right: auto;">max</q-badge>
                      <q-badge color="red" v-if="item.avail == 2" floating style="left: 10px; right: auto;"><q-icon name="fas fa-exclamation-circle" size="15px" color="white" /></q-badge>
                    </q-btn>
                     <q-btn size="0.3em" color="white" text-color="black" label="│" dense/>
                    <q-btn size="0.3em" class="q-pr-xs" color="white" icon="fas fa-chevron-right" text-color="dark" dense />
                  </q-btn-group>
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item >
              <q-item-section>
                  <itemcomp
                  :value="item.items"
                  :readOnly="true"
                  />
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-h6 text-right">
                  <q-item-label v-if="totalItComp (item.items)">
                    SubTotal:        {{(item.prodPrice * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label v-if="totalItComp (item.items)">
                    Extras:     + <u> {{ ((totalItComp (item.items)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    Total:      $ {{((parseFloat(item.prodPrice) + totalItComp (item.items)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
         </q-list>

         <q-list :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'" v-for="(item, index) in carrito" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name', item.prodType)}}</q-item-label>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h7 text-bold">
                    Cantidad: {{item.quantity}}
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item >
              <q-item-section>
                  <itemcomp
                  :value="item.items"
                  :readOnly="true"
                  />
               </q-item-section>
            </q-item>
            <q-item v-if="carrito.length > 1">
              <q-item-section class="text-h6 text-right">
                  <q-item-label v-if="totalItComp (item.items)">
                    SubTotal:        {{(item.prodPrice * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label v-if="totalItComp (item.items)">
                    Extras:     + <u> {{ ((totalItComp (item.items)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    Total:      $ {{((parseFloat(item.prodPrice) + totalItComp (item.items)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
   </div>
</template>
