<template>
  <q-tabs
               class=""
               dense
               content-class=""
               :value="selectedCat ? selectedCat.id : ''"
               outside-arrows
               mobile-arrows
               :breakpoint="50"
               >
               <classictab v-for="(tabs, index) in filtercat"
                  :key="index"
                  @tabs="(e) => $emit('tabs', e)"
                  :tabs="tabs" />
            </q-tabs>
</template>
<script>
import classictab from './classictab.vue'
export default {
  components: { classictab },
  name: 'classictabs',
  props: ['selectedCat', 'filtercat']
}
</script>
