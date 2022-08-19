<template>
  <div
               dense
               content-class=""
               :value="selectedCat ? selectedCat.id : ''"
               outside-arrows
               mobile-arrows
               class="row justify-around text-start"
               >
               <classictab v-for="(tabs, index) in filtercat"
                  :key="index"
                  class="self-center col-4 q-pl-md"
                  @tabs="(e) => $emit('tabs', e)"
                  :tabs="tabs" />
            </div>
</template>
<script>
import classictab from './classictabcolumn.vue'
export default {
  components: { classictab },
  name: 'classictabscolumn',
  props: ['selectedCat', 'filtercat']
}
</script>
