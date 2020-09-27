<template>
<div>
  <div v-if="blocks.length">
      <div v-for="(block, index) in blocks" :class="block.class" :style="block.style" :key="block.id">
        <div v-if="block.child.length">
          <div  class="row justify-around reverse-wrap flex-center">
                <component :is="''" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="chld.id"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" />
          </div>
        </div>
      </div>
  </div>
  <q-inner-loading :showing="visible">
    <q-spinner-cube size="100px" color="primary" />
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
    ...mapGetters('editor', ['editor'])
  },
  components: {
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
    'qimg': () => import('../components/editor/qimg')

  },
  data () {
    return {
      visible: true,
      admin: false,
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml', 'customJS', 'qTextBlock', 'qimg', 'qfooter', 'findus'],
      blocks: [
      ],
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: []
    }
  },
  mounted () {
    if (this.editor.length) {
      this.visible = false
      let obj = this.editor.find(e => e.id === 'blocks')
      if (typeof obj !== 'undefined' && obj.addedPages && obj.addedPages['Home']) {
        this.blocks = JSON.parse(JSON.stringify(obj.addedPages['Home']))
      }
    }
  },
  watch: {
    editor (e) {
      this.visible = false
      let obj = e.find(e => e.id === 'blocks')
      if (typeof obj !== 'undefined' && obj.addedPages && obj.addedPages['Home']) {
        this.blocks = JSON.parse(JSON.stringify(obj.addedPages['Home']))
      }
    }
  },
  methods: {
    ...mapActions('editor', ['bindBlocks']),
    log (e) {
      // console.log(e)
    },
    childMounted (e) {
      // console.log({ e }, 'Child Mounted')
    },
    placeHoldClick (e) {
      this.selectedBLock = e.block_info
      this.selectedBLockProps = e.props_info
      // console.log({ ...this.blocks })
    }
  }
}
</script>
