<template>
<q-btn-dropdown
    flat
    padding="none"
      no-caps
      :icon="icon"
      :label="title"
    >
    <q-list>
        <q-item clickable  v-for="(item, index) in tree" :key="index" @click="item.handler()">
          <q-item-section>
            <q-item-label v-if="typeof item.tree === 'undefined'">{{item.label}}</q-item-label>
            <navtree
            v-else
              :icon="null"
              :title="item.label"
              :tree="item.tree"
            />
          </q-item-section>
        </q-item>
  </q-list>
    </q-btn-dropdown>
 </template>

<script>
export default {
  name: 'navtree',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: null
    },
    separator: {
      default: false
    },
    tree: {
      default: () => []
    }
  }
}
</script>
