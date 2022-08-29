<template>
  <div
               dense
               content-class=""
               :value="selectedCat ? selectedCat.id : ''"
               outside-arrows
               mobile-arrows
               class="row justify-around text-start"
               >
               <template v-for="(tabs, index) in filtercat">
                    <classictab
                    :key="'category-' + index"
                    class="self-center col-12 col-md-4 col-xs-12 q-pl-md"
                    @tabs="(e) => $emit('tabs', e)"
                    :tabs="tabs" />
                    <div  v-if="((index + 1) % 3 == 0) && index != 0" :key="'separator-' + index" color="secondary" class="col-12 border_bottom" />
                </template>
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
<style lang="stylus">
.flex-break
  flex: 1 0 100% !important
.row
  .flex-break
    height: 0 !important
.column
  .flex-break
    width: 0 !important
.border_bottom
  border-bottom: 1px solid #ccc!important;
</style>
