<template>
  <q-tabs
               class="wrapel"
               content-class="wrapel"
               :value="selectedCat ? selectedCat.id : ''"
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
