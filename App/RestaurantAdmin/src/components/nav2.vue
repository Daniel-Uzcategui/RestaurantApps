<template>
  <q-card
    flat
    v-if="!tree.length"
    clickable
    tag="a"
    :href="link"
    @click="handler()"
    class="text-center bg-transparent"
  >
    <q-card-section
      v-if="icon"
      side
      style="color: inherit"
    >
      <q-icon :size="size" :color="color" v-ripple :name="icon"/>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-card-section>
  </q-card>
    <navtree v-else
      :icon="icon"
      :size="size"
      :title="title"
      :tree="tree"
      :color="color"
    />
 </template>

<script>
import navtree from './navtree2'
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
    size: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    },
    color: {
      type: String,
      default: 'red'
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
