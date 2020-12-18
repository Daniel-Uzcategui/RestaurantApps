<template>
<div>
  <div v-if="blocks2.length">
      <div v-for="(block, index) in blocks2" :class="block.class" :style="block.style" :key="block.id">
        <div v-if="block.child.length">
          <div  class="row justify-around reverse-wrap flex-center">
                <component :is="''" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="chld.id"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" />
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
    fullPath () {
      return this.$route.fullPath
    }
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
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml'],
      blocks2: [
      ],
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: []
    }
  },
  mounted () {
    // console.log({ pagerouter: this.$route })
    let full = this.fullPath
    this.visible = false
    let obj = this.blocks
    if (typeof obj !== 'undefined') {
      this.blocks2 = JSON.parse(JSON.stringify(obj.addedPages[full.replace(/\//g, '')]))
    }
  },
  watch: {
    fullPath (e) {
      // console.log({ pagerouter: this.$router })
      let full = this.fullPath
      // console.log(this.fullPath)
      this.visible = false
      let obj = this.blocks
      if (typeof obj !== 'undefined') {
        this.blocks2 = JSON.parse(JSON.stringify(obj.addedPages[full.replace(/\//g, '')]))
      }
    },
    blocks (e) {
      this.visible = false
      let obj = e
      if (typeof obj !== 'undefined') {
        this.blocks2 = JSON.parse(JSON.stringify(obj.blocks))
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
