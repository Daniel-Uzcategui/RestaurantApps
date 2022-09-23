<template>
      <q-btn-dropdown no-caps dense flat content-class="fontsize-13 " dropdown-icon="none" :label="tab.name"
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
import Recursivetablist from './recursivetabcolumnlist.vue'
export default {
  name: 'recursivetabcolumnlist',
  components: { Recursivetablist },
  props: ['tab']
}
</script>
