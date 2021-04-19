<template>
  <q-card-section class="q-pa-none q-pt-xl row justify-center" style="overflow: visible !important">
    <div class="column items-center col-4 q-pt-xl"
         style="min-width: 320px; overflow: visible !important"  :style="displayVal.disptype == 1 ? 'height: 45vmin; min-height: 304px;' : ''">
      <diag-photo :displayVal="displayVal" :dgbg="dgbg"/>
      <div>
        <div class="column items-center">
          <div v-if="typeof displayVal.disptype === 'undefined' && $q.screen.gt.sm  ? true : displayVal.disptype == 0 && $q.screen.gt.sm" class="q-pt-lg">
            <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'" class="q-mr-lg" color="primary" round @click="$emit('down')" icon="remove" text-color="white" dense />
            <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'"  :class="'q-pl-'+ $q.screen.name + ' q-pr-' + $q.screen.name" color="white" rounded text-color="black" :label="quantity" />
            <q-btn :size="$q.screen.gt.xs ? 'md': 'xs'"  class="q-ml-lg" color="primary" round @click="$emit('up')" icon="add" text-color="white" dense >
              <q-badge color="red" v-if="checkMax" floating>MAX
              </q-badge>
              <q-badge color="red" v-if="checkAlert" floating style="left: 10px; right: auto;">
                <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
              </q-badge>
            </q-btn>
          </div>
          <q-btn round color="secondary" style="z-index: 999999" :size="$q.screen.gt.xs ? 'md': 'xs'" @click="$emit('copyClip')" text-color="white" icon="fas fa-share-alt" class="q-ma-md"  />
        </div>
      </div>
    </div>
    <div class="q-pa-lg col-8"  style="min-width: 320px">
      <div :class="displayVal.disptype == 1 ? 'text-h3 text-uppercase text-weight-medium' : 'text-h4'">
        {{displayVal.name}}
      </div>
      <div class="q-pt-lg text-left" :style="[displayVal.disptype == 1 ? '' : 'max-width: 50vmax; letter-spacing: 0.094em; line-height: 35px;', {'color': displayVal.descripcioncolor}]" v-html="displayVal.descripcion">
      </div>
      <div class="row justify-between q-pa-none">
        <div v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype != 1" class="q-pt-md text-h6">
          <div v-if="displayVal.discount > 0 && displayVal.groupComp.length">
            Total
            <span class="text-strike"> {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}
            </span> $ {{(((parseFloat(displayVal.price + totSum) * (1 - (displayVal.discount/100)) ) ) * quantity).toFixed(2)}}
            <q-badge color="green" rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%
            </q-badge>
          </div>
          <q-item-label class="text-h6" v-if="!displayVal.discount && displayVal.groupComp.length">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}
          </q-item-label>
          <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length == 0">
            $ {{(((parseFloat(displayVal.price).toFixed(2) * (1 - (displayVal.discount/100))) ) * quantity).toFixed(2)}}
            <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >Descuento {{displayVal.discount}}%
            </q-badge>
          </q-item-label>
          <q-item-label v-if="!displayVal.discount && displayVal.groupComp.length == 0">$ {{((parseFloat(displayVal.price).toFixed(2) ) * quantity).toFixed(2) }}
          </q-item-label>
        </div>
        <q-card-actions v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0" vertical>
          <div >
            <q-btn class="q-pl-md q-pr-md" v-if="requiredA && $q.screen.gt.sm" @click="$emit('addtocart')" rounded v-close-popup color="primary" no-caps>Agregar al carrito
            </q-btn>
            <q-btn class="q-pl-md q-pr-md" v-if="!requiredA && $q.screen.gt.sm" @click="$emit('showNotif')" rounded color="primary" no-caps>Agregar al carrito
            </q-btn>
          </div>
        </q-card-actions>
      </div>
      <item-comp
         :discount="displayVal.discount"
         v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype != 1"
         :mode="typeof displayVal.disptype === 'undefined' ? 0 : parseInt(displayVal.disptype)"
         class="q-pt-xl row justify-start"
         :comp="displayVal.groupComp"
         :value="itComp"
         @update-comp="(e) => emit('update-comp', e)"
         @update-tot="(e) => emit('update-tot', e)"
         />
    </div>
  </q-card-section>
</template>
<script>
import itemComp from '../../itemComp.vue'
import diagPhoto from '../menuphoto.vue'
export default {
  name: 'top',
  components: { itemComp, diagPhoto },
  props: ['displayVal', 'quantity', 'requiredA', 'totSum', 'checkMax', 'checkAlert', 'itComp', 'dgbg'],
  methods: {
    emit (event, payload) {
      this.$emit(event, payload)
      console.log(event, payload)
    }
  }
}
</script>
