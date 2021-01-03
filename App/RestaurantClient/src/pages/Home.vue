<template>
<div>
  <div v-if="blocks2.length">
      <div :id="'block' + index" v-for="(block, index) in blocks2" :key="block.id+index">
        <div v-if="block.child.length">
          <div  :class="block.class" :style="block.style">
                <component :is="''" :class="chld.classes" :style="chld.styles" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="indx"  v-bind="{ ...chld.props, block_index: index, child_index: indx }" />
          </div>
        </div>
      </div>
  </div>
  <q-inner-loading :showing="visible">
    <q-spinner size="100px" color="primary" />
  </q-inner-loading>
</div>
</template>
<script>
/* eslint-disable vue/no-unused-components vue/valid-v-on */
/* eslint-disable vue/require-component-is */
/* eslint-disable vue/no-unused-components */
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('editor', ['blocks']),
    blocks2 () {
      let obj = this.blocks
      if (typeof obj !== 'undefined' && obj !== null && obj.addedPages && obj.addedPages['Home']) {
        return JSON.parse(JSON.stringify(obj.addedPages['Home']))
      } else {
        return []
      }
    }
  },
  components: {
    'qtabs': () => import('../components/editor/qTabs'),
    'qbtn': () => import('../components/editor/qbtn'),
    'carouselmenu': () => import('../components/carouselMenu'),
    'menudisplay': () => import('./Menu/menu'),
    'my-card': () => import('../components/editor/mycard'),
    'place-holder': () => import('../components/editor/placeHolder'),
    'qheader': () => import('../components/editor/qheader'),
    'qfooter': () => import('../components/editor/qfooter'),
    'qparallax': () => import('../components/editor/qparallax'),
    'qcarousel': () => import('../components/editor/qcarousel'),
    'qTextBlock': () => import('../components/editor/qTextBlock'),
    'customHtml': () => import('../components/editor/customHtml'),
    'customJS': () => import('../components/editor/customJS'),
    'findus': () => import('../components/editor/findus'),
    'qimg': () => import('../components/editor/qimg'),
    'menucomp': () => import('../pages/Menu/menu')

  },
  data () {
    return {
      visible: true,
      admin: false,
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml', 'customJS', 'qTextBlock', 'qimg', 'qfooter', 'findus'],
      // blocks2: [
      // ],
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: []
    }
  },
  mounted () {
    this.visible = false
    console.log('mounted')
  },
  watch: {
    blocks (e) {
      this.visible = false
      // let obj = e
      // if (typeof obj !== 'undefined' && obj.addedPages && obj.addedPages['Home']) {
      //   this.blocks2 = JSON.parse(JSON.stringify(obj.addedPages['Home']))
      // }
      console.log({ gg2: e })
    }
  },
  methods: {
    ...mapActions('editor', ['bindBlocks'])
  }
}
</script>
