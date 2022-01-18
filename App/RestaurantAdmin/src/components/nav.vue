<template>
  <q-list>
  <q-item
    v-if="!tree.length"
    clickable
    tag="a"
    :href="link"
  >
    <q-item-section
      v-if="icon"
      side
      style="color: inherit"
    >
      <q-icon :name="icon"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item v-else>
    <navtree
      :icon="icon"
      :title="title"
      :tree="tree"
    />
  </q-item>
  <q-separator v-if="separator"/>
   </q-list>
 </template>

<script>
import navtree from './navtree'
export default {
  name: 'EssentialLink',
  components: {
    navtree
  },
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
      default: ''
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
