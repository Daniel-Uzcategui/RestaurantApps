<template>
<div>
<q-card>
  <q-card-section>
        <q-expansion-item class="text-h6" label="Order Wheel Colors">
            <q-card-section class="row justify-between">
              <q-btn
                  filled
                  class="text-white col-6"
                  v-model="page.knob.knob0"
                  label="Por confirmar"
                  :style="typeof page.knob === 'undefined' || typeof page.knob.knob0 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob0};`"
                  >
                  <q-popup-edit v-model="page.knob.knob0">
                    <q-color v-model="page.knob.knob0" />
                  </q-popup-edit>
              </q-btn>
              <q-btn
                  filled
                  class="text-white col-6"
                  v-model="page.knob.knob1"
                  label="Preparando su pedido"
                  :style="typeof page.knob === 'undefined' || typeof page.knob.knob1 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob1};`"
                  >
                  <q-popup-edit v-model="page.knob.knob1">
                    <q-color v-model="page.knob.knob1" />
                  </q-popup-edit>
              </q-btn>
              <q-btn
                  filled
                  class="text-white col-6"
                  v-model="page.knob.knob2"
                  label="Orden en vía"
                  :style="typeof page.knob === 'undefined' || typeof page.knob.knob2 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob2};`"
                  >
                  <q-popup-edit v-model="page.knob.knob2">
                    <q-color v-model="page.knob.knob2" />
                  </q-popup-edit>
              </q-btn>
              <q-btn
                  filled
                  class="text-white col-6"
                  v-model="page.knob.knob3"
                  label="Orden entregada"
                  :style="typeof page.knob === 'undefined' || typeof page.knob.knob3 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob3};`"
                  >
                  <q-popup-edit v-model="page.knob.knob3">
                    <q-color v-model="page.knob.knob3" />
                  </q-popup-edit>
              </q-btn>
              <q-btn
                  filled
                  class="text-white col-6"
                  v-model="page.knob.knob4"
                  label="Anulada"
                  :style="typeof page.knob === 'undefined' || typeof page.knob.knob4 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob4};`"
                  >
                  <q-popup-edit v-model="page.knob.knob4">
                    <q-color v-model="page.knob.knob4" />
                  </q-popup-edit>
              </q-btn>
            </q-card-section>
        </q-expansion-item>
      </q-card-section>
  </q-card>
</div>
</template>
<script>
export default {
  props: [ 'value' ],
  computed: {
    page: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', {
          page: this.page
        })
      }
    }
  },
  created () {
    console.log({ pg: this.page })
  }
}
</script>
