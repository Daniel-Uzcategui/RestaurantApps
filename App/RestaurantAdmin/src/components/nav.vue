<template>
  <q-list>
  <q-item
    v-if="!tree.length"
    clickable
    tag="a"
    :href="link"
    @click="handler()"
  >
    <q-item-section
      v-if="icon"
      side
      style="color: inherit"
    >
      <q-icon :color="color" :name="icon"/>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
    <navtree v-else
      :icon="icon"
      :title="title"
      :tree="tree"
      :color="color"
    />
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
    handler: {
      type: Function,
      default: () => {}
    },
    caption: {
      type: String,
      default: ''
    },
    color: {
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
