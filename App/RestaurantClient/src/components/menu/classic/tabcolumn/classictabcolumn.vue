<template>
      <div
       v-if="tabs.subCat"
        class="full-height"
        >
      <q-btn-dropdown auto-close color="secondary" content-class="q-pa-none q-ma-none" padding="4px 0px 4px 16px" dropdown-icon="expand_more" align="between" no-caps stretch flat :class="$q.screen.lt.md ? 'fontsize-18' : 'fontsize-12'" class=" text-bold capitalize full-width full-height "
      >
      <template v-slot:label>
        <div  class="text-black full-height text-bold capitalize text-start">
          {{tabs.name}}
        </div>
      </template>
        <q-list>
          <q-item clickable >
            <q-item-section class="capitalize text-bold" @click="$emit('tabs', tabs)">Todos</q-item-section>
          </q-item>
          <q-item v-for="(tab, index) in Object.keys(tabs.subCat)" :key="index" clickable @click="$emit('tabs', tabs.subCat[tab])">
            <recursivetablist :tab="tabs.subCat[tab]" @tabs="(e) => $emit('tabs', e)" />
          </q-item>
        </q-list>
        </q-btn-dropdown>
      </div>
      <q-btn :class="$q.screen.lt.md ? 'fontsize-18' : 'fontsize-12'" padding="4px 16px" flat align="left" v-else no-caps class="capitalize text-black text-bold"
        :name="tabs.id"
        @click="$emit('tabs', tabs)"
        >
        {{tabs.name}}
          <q-icon color="secondary" class="absolute-right full-height" name="expand_more"></q-icon>
      </q-btn>
</template>
<script>
import Recursivetablist from './recursivetabcolumnlist.vue'
export default {
  components: { Recursivetablist },
  name: 'classictabcolumn',
  props: {
    tabs: {
      type: Object, default: () => { return {} }
    }
  }
}
</script>
<style lang="stylus">
.border_bottom
  border-bottom: 1px solid #ccc!important;
.q-btn-dropdown__arrow
  height: 100% !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
</style>
