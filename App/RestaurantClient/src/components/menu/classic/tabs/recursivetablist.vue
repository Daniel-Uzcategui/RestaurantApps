<template>
      <q-btn-dropdown stretch flat class="full-height full-width" content-class="fontsize-13 " :label="tab.name"
      v-if="tab.subCat"
      >
        <q-list>
          <q-item content-class="fontsize-13 " v-for="(tb, index) in Object.keys(tab.subCat)" :key="index" clickable @click="$emit('tabs', tab.subCat[tb])">
            <recursivetablist :tab="tab.subCat[tb]" />
          </q-item>
        </q-list>
        </q-btn-dropdown>
      <q-item-section class="fontsize-13 " v-else>{{tab.name}}</q-item-section>
</template>
<script>
import Recursivetablist from './recursivetablist.vue'
export default {
  name: 'recursivetablist',
  components: { Recursivetablist },
  props: ['tab']
}
</script>
