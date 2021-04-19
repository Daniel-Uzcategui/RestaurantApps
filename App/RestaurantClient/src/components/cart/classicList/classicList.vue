<template>
<div>
  <q-item class="row justify-between">
              <q-item-section class="col">
                <div class="row">
                <q-btn v-if="$q.screen.gt.sm && !orders" color="primary" class="q-ma-md q-mr-lg" style="height: 25px; width: 25px;" size="xs" round @click="$emit('delcart')" icon="clear"></q-btn>
                <div>
                  <div class="q-ma-md position-relative">
                    <q-btn v-if="$q.screen.lt.md && !orders" color="black" class="q-ma-md q-ml-lg absolute-top-left" style="height: 25px; width: 25px;" size="xs" round @click="$emit('delcart')" icon="clear"></q-btn>
                    <div class="bg-primary" style="border-radius: 15px">
                    <q-img :src="photo" width="80px" height="80px" color="primary" text-color="white" class="q-ma-md rounded-borders" />
                    </div>
                  </div>
                </div>
                </div>
               </q-item-section>
               <q-item-section :style="$q.screen.lt.sm ? 'margin-left: 62px;' : ''" :class="$q.screen.lt.md ? 'col column items-end' : ''">
                 <div>
                   <q-item-label :class="$q.screen.lt.md ? 'text-caption' : ''">
                     {{name}}
                   </q-item-label>
                    <q-item-label v-html="priceDisplay">
                    </q-item-label>
                 </div>
               </q-item-section>
               <q-item-section :class="$q.screen.lt.md ? 'col column items-end' : ''">
                <q-item-label class="text-h6 row">
                  <div class="text-weight-thin">{{item.quantity}}</div>
                  <div class="relative-position">
                  <q-btn-group v-if="!item.reward"  style="transform: rotateZ(90deg); height: 20px ; border-radius: 0.5em">
                    <q-btn size="0.3em" class="q-pl-xs" color="primary"
                      @click="$emit('up')"
                      icon="fas fa-chevron-left" text-color="white" dense >
                    </q-btn>
                     <q-btn size="0.3em" color="primary" text-color="black" label="│" dense/>
                    <q-btn size="0.3em" class="q-pr-xs" color="primary"
                      @click="$emit('down')"
                      icon="fas fa-chevron-right" text-color="white" dense
                    />
                  </q-btn-group>
                  <div style="top: -200%; position: absolute">
                    <q-badge color="red"
                        v-if="item.avail === 0"
                      style="">max</q-badge>
                      <q-badge color="red"
                        v-if="item.avail == 2"
                      style=""><q-icon name="fas fa-exclamation-circle" size="15px" color="white" />Hay más de lo disponible</q-badge>
                  </div>
                </div>
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item >
              <q-item-section>
                  <item-comp
                  :quantity="item.quantity"
                  :discount="discount"
                  :value="item.items"
                  :readOnly="true"
                  />
               </q-item-section>
            </q-item>
            <q-item v-if="item.addressPickup && item.addressShipping">
              <q-item-section>
                <addresses
                :readOnly="true"
                :addressPickup="item.addressPickup"
                :addressShipping="item.addressShipping" />
              </q-item-section>
            </q-item>
      <q-item>
        <q-item-section v-if="cart.length > 1" class="text-h6 text-right">
          <div v-if="totalItComp">
            <q-item-label>
              Subtotal: $ {{subTotalItem}}
            </q-item-label>
            <q-item-label>
              Extras:     + <u> {{extrasTotalItem}} </u>
            </q-item-label>
            <q-item-label >
              Total:      $ {{Total}}
            </q-item-label>
          </div>
            <q-item-label v-else>
              Total:      $ {{subTotalItem}}
            </q-item-label>
          </q-item-section>
      </q-item>
</div>
</template>
<script>
import Addresses from '../../addresses.vue'
import itemComp from '../../itemComp.vue'
export default {
  components: { itemComp, Addresses },
  props: ['photo', 'name', 'priceDisplay', 'item', 'cart', 'discount', 'totalItComp', 'subTotalItem', 'extrasTotalItem', 'Total', 'orders']
}
</script>
