<template>
      <q-tab
       v-if="tabs.subCat"
        no-caps class="wrapel fontsize-13 q-pa-none q-ma-none " content-class="wrapel  fontsize-13"
        :name="tabs.id"
        >
      <q-btn-dropdown no-caps  flat class="full-height full-width text-bold  fontsize-13" :label="tabs.name"
      >
        <q-list>
          <q-item clickable >
            <q-item-section class="fontsize-13  text-bold" @click="$emit('tabs', tabs)">Todos</q-item-section>
          </q-item>
          <q-item v-for="(tab, index) in Object.keys(tabs.subCat)" :key="index" clickable @click="$emit('tabs', tabs.subCat[tab])">
            <recursivetablist :tab="tabs.subCat[tab]" @tabs="(e) => $emit('tabs', e)" />
          </q-item>
        </q-list>
        </q-btn-dropdown>
      </q-tab>
      <q-tab v-else no-caps class="wrapel fontsize-13" content-class="wrapel  fontsize-13"
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
