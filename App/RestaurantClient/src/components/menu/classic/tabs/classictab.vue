<template>
      <q-tab
       v-if="tabs.subCat"
        no-caps class="wrapel fontsize-13 q-pa-none q-ma-none" content-class="wrapel"
        :name="tabs.id"
        @click="$emit('tabs', tabs)"
        >
      <q-btn-dropdown stretch flat class="full-height full-width" :label="tabs.name"
      >
        <q-list>
          <q-item v-for="(tab, index) in Object.keys(tabs.subCat)" :key="index" clickable @click="$emit('tabs', tabs.subCat[tab])">
            <recursivetablist :tab="tabs.subCat[tab]" @tabs="(e) => $emit('tabs', e)" />
          </q-item>
        </q-list>
        </q-btn-dropdown>
      </q-tab>
      <q-tab v-else no-caps class="wrapel fontsize-13" content-class="wrapel"
        :name="tabs.id"
        @click="$emit('tabs', tabs)"
        >
        {{tabs.name}}
      </q-tab>
</template>
<script>
import Recursivetablist from './recursivetablist.vue'
export default {
  components: { Recursivetablist },
  name: 'classictabs',
  props: { tabs: {
    type: Object, default: () => { return {} } } }
}
</script>
