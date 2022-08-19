<template>
      <q-btn-dropdown stretch flat class="full-height full-width" content-class="fontsize-13 capitalize" :label="tab.name"
      v-if="tab.subCat"
      >
        <q-list>
          <q-item content-class="fontsize-13 capitalize" v-for="(tb, index) in Object.keys(tab.subCat)" :key="index" clickable @click="$emit('tabs', tab.subCat[tb])">
            <recursivetablist :tab="tab.subCat[tb]" />
          </q-item>
        </q-list>
        </q-btn-dropdown>
      <q-item-section class="fontsize-13 capitalize" v-else>{{tab.name}}</q-item-section>
</template>
<script>
import Recursivetablist from './recursivetabcolumnlist.vue'
export default {
  name: 'recursivetabcolumnlist',
  components: { Recursivetablist },
  props: ['tab']
}
</script>
