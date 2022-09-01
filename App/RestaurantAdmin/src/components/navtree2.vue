<template>
<q-card class="text-center bg-transparent q-pa-none q-ma-none" flat v-if="!child">
  <q-card-section>
    <q-icon
    no-caps
    :name="icon"
    :color="color"
    :label="title"
    :size="size"
    >
  </q-icon>
</q-card-section>
<q-card-section class="q-pa-none">
  <q-item-label>{{ title }}</q-item-label>
  <q-item-label caption>
    {{ caption }}
  </q-item-label>
</q-card-section>
<q-menu anchor="center middle">
  <q-list>
    <q-item clickable  v-for="(item, index) in tree" :key="index" @click="item.handler()">
      <q-item-section>
        <q-item-label class="q-pa-none" v-if="typeof item.tree === 'undefined'">{{item.label}}</q-item-label>
        <navtree2
        v-else
        :icon="null"
        :title="item.label"
        :tree="item.tree"
        :child="true"
        :size="size"
        />
    </q-item-section>
  </q-item>
</q-list>
</q-menu>
</q-card>
<q-item-label v-else>
  {{ title }}
  <q-menu  anchor="center middle">
    <q-list>
      <q-item clickable  v-for="(item, index) in tree" :key="index" @click="item.handler()">
        <q-item-section>
          <q-item-label class="q-pa-none" v-if="typeof item.tree === 'undefined'">{{item.label}}</q-item-label>
          <navtree2
          v-else
          :icon="null"
          v-bind="item"
          :child="true"
          :size="size"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</q-item-label>
 </template>

<script>
export default {
  mounted () {
    console.log(this.tree)
  },
  name: 'navtree2',
  props: {
    size: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    child: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'red'
    },
    caption: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    },
    handler: {
      type: Function,
      default: () => {}
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
