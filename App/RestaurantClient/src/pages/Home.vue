<template>
<div>
        <div v-if="blocks.length">
         <draggable :is="admin ? 'draggable' : 'div'" :list="blocks" @start="admin ? drag=true : drag=false" @end="drag=false" handle=".handle">
           <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut">
            <div v-for="(block, index) in blocks" :class="block.class" :style="block.style" :key="block.id">
              <div v-if="block.child.length" @mouseover=" admin ? (block.hover = true, selectedBLock = index) : false" @mouseleave="admin ? block.hover = false : false">
                <draggable :is="admin ? 'draggable' : 'div'" class="row justify-around reverse-wrap flex-center" group="childs" handle=".handle2" :list="block.child" @start="admin ? drag=true : drag=false" @end="drag=false">
                      <component :is="''" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="chld.id"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" @click-edit="(e) => {placeHoldClick(e)}" />
                </draggable>
              </div>
            </div>
          </transition-group>
        </draggable>
        </div>
</div>
</template>

<script>
/* eslint-disable vue/no-unused-components vue/valid-v-on */
/* eslint-disable vue/require-component-is */
import draggable from 'vuedraggable'
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('editor', ['editor'])
  },
  components: {
    'my-card': () => import('../components/editor/mycard'),
    'place-holder': () => import('../components/editor/placeHolder'),
    'qheader': () => import('../components/editor/qheader'),
    'qparallax': () => import('../components/editor/qparallax'),
    'qcarousel': () => import('../components/editor/qcarousel'),
    'customHtml': () => import('../components/editor/customHtml'),
    draggable
  },
  data () {
    return {
      admin: false,
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml'],
      blocks: [
      ],
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: []
    }
  },
  created () {
    this.bindBlocks().then((e) => {
      let obj = e.find(e => e.id === 'blocks')
      this.blocks = JSON.parse(JSON.stringify(obj.blocks))
    })
  },
  watch: {
    editor (e) {
      let obj = e.find(e => e.id === 'blocks')
      this.blocks = JSON.parse(JSON.stringify(obj.blocks))
    }
  },
  methods: {
    ...mapActions('editor', ['saveBlocks', 'bindBlocks']),
    log (e) {
      console.log(e)
    },
    childMounted (e) {
      // console.log(this, 'Child Mounted')
    },
    placeHoldClick (e) {
      this.selectedBLock = e.block_info
      this.selectedBLockProps = e.props_info
      console.log({ ...this.blocks })
    }
  }
}
</script>
