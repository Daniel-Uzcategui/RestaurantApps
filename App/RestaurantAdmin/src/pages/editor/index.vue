<template>
<div>
  <q-drawer v-if="admin" show-if-above v-model="left" side="left" bordered>
     <q-btn color="white" text-color="black" icon="fas fa-chevron-left" flat label="Exit" to="/home"/>
      <div class="text-h5 q-pa-md">
          Page Builder
        </div>
       <q-btn color="primary" @click="saveB" label="Save" />
      <q-card v-if="selectedBLock.block_index != null && typeof blocks[selectedBLock.block_index] !== 'undefined'" class="my-card">
        <q-card-section>
          <q-input readonly filled v-model="selectedBLock.block_index" label="Selected Block" />
          <q-input readonly filled v-model="selectedBLock.child_index" label="Selected Child" />
        </q-card-section>
        <q-card-section v-if="selectedBLock.block_index != null && typeof blocks[selectedBLock.block_index] !== 'undefined'">
          Block Options
          <q-input filled v-model="blocks[selectedBLock.block_index].class" label="Class" />
          <q-input filled v-model="blocks[selectedBLock.block_index].style" label="Style" />
          <div class="row justify-center">
           <q-btn class="col" color="primary" label="Add Child" @click="addChild({block: selectedBLock.block_index})"/>
           <q-btn class="col" color="primary" label="Delete Block" @click="removeBlock({block: selectedBLock.block_index})"/>
          </div>
        </q-card-section>
        <q-card-section v-if="selectedBLock.block_index != null && typeof blocks[selectedBLock.block_index].child[selectedBLock.child_index] !== 'undefined'">
          Child Options
          <q-select filled :options="widgets" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props.is" label="Widget" />
          <q-btn color="primary" label="Remove Child" @click="removeChild({block: selectedBLock.block_index, child: selectedBLock.child_index})"/>
        </q-card-section>
        <q-card-section v-if="selectedBLock.block_index != null && typeof blocks[selectedBLock.block_index].child[selectedBLock.child_index] !== 'undefined'">
          <div v-for="(prop, index) in selectedBLockProps" :key="index">
            <q-input autogrow v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop !== 'boolean'" type="tex" :placeholder="prop" filled v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index" />
            <q-toggle v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop === 'boolean'" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index" />
            <div v-if="index !== 'block_index' && index !== 'child_index' && Array.isArray(prop)">
              <div class="text-center" v-for="(prp, idx) in prop" :key="idx">
                Slide # {{idx}}
                <div v-for="(prp1, idx1) in prp" :key="idx1">
                <q-input
                  :value="typeof blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx] !== 'undefined' ? typeof blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx][idx1] === 'undefined'? prp1 : blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx][idx1]  : prp1"
                  @input="(e) => {typeof blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx] === 'undefined' ?
                  (Vue.set(blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index], 0 ,{
                      text_1: 'WELCOME TO',
                      text_2: 'ChopZi',
                      text_3: 'The Web as I envisaged it, we have not seen it yet. The future',
                      text_4: 'is still so much bigger than the past.',
                      button_label: 'READ MORE',
                      img: '/statics/images/image_1.jpg'
                    }),
                  blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx][idx1] = e) :
                  blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx][idx1] = e}"
                  :placeholder="prp1" filled :label="idx1" />
                </div>
              </div>
              <q-btn color="primary" label="Add Slide"
                  @click="Vue.set(blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index], blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index].length ,{
                      text_1: 'WELCOME TO',
                      text_2: 'ChopZi',
                      text_3: 'The Web as I envisaged it, we have not seen it yet. The future',
                      text_4: 'is still so much bigger than the past.',
                      button_label: 'READ MORE',
                      img: '/statics/images/image_1.jpg'
                    });
                    prop.push({
                      text_1: 'WELCOME TO',
                      text_2: 'ChopZi',
                      text_3: 'The Web as I envisaged it, we have not seen it yet. The future',
                      text_4: 'is still so much bigger than the past.',
                      button_label: 'READ MORE',
                      img: '/statics/images/image_1.jpg'
                    })" />
            </div>
          </div>
        </q-card-section>
      </q-card>
  </q-drawer>
        <div v-if="blocks.length">
         <draggable :is="admin ? 'draggable' : 'div'" :list="blocks" @start="admin ? drag=true : drag=false" @end="drag=false" handle=".handle">
           <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut">
            <div v-for="(block, index) in blocks" :class="block.class" :style="block.style" :key="block.id">
              <div v-if="block.child.length" @mouseover=" admin ? (block.hover = true) : false" @mouseleave="admin ? block.hover = false : false">
                <q-btn v-if="block.hover" color="white" icon="fa fa-align-justify" style="height: 50px; position: absolute; z-index:99999"  text-color="black" class="handle float-left"/>
                <draggable :is="admin ? 'draggable' : 'div'" class="row justify-around reverse-wrap flex-center" group="childs" handle=".handle2" :list="block.child" @start="admin ? drag=true : drag=false" @end="drag=false">
                      <component :is="''" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="chld.id"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" @click-edit="(e) => {placeHoldClick(e)}" />
                </draggable>
              </div>
            </div>
          </transition-group>
        </draggable>
        </div>
        <div v-if="true" class="row justify-center q-pa-md">
         <q-btn fab color="blue" @click="addBlock()" text-color="white" label="+" />
        </div>
</div>
</template>

<script>
/* eslint-disable vue/no-unused-components vue/valid-v-on */
/* eslint-disable vue/require-component-is */
import draggable from 'vuedraggable'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('editor', ['editor'])
  },
  components: {
    'my-card': () => import('../../components/editor/mycard'),
    'place-holder': () => import('../../components/editor/placeHolder'),
    'qheader': () => import('../../components/editor/qheader'),
    'qparallax': () => import('../../components/editor/qparallax'),
    'qcarousel': () => import('../../components/editor/qcarousel'),
    'customHtml': () => import('../../components/editor/customHtml'),
    draggable
  },
  data () {
    return {
      admin: true,
      left: true,
      Vue: Vue,
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
  methods: {
    ...mapActions('editor', ['saveBlocks', 'bindBlocks']),
    saveB () {
      this.saveBlocks(this.blocks)
    },
    log (e) {
      console.log(e)
    },
    childMounted (e) {
      // console.log(this, 'Child Mounted')
    },
    addBlock () {
      Vue.set(this.blocks, this.blocks.length, {
        class: 'full-width',
        id: Math.random().toString(36).substr(2, 9),
        style: 'min-height: 0px;',
        hover: false,
        child: [{
          props: {
            is: 'place-holder',
            options: []
          }
        }]
      })
    },
    addChild (e) {
      var indiceChild = this.blocks[e.block].child.length
      Vue.set(this.blocks[e.block].child, indiceChild, {
        id: Math.random().toString(36).substr(2, 9),
        props: {
          is: 'place-holder',
          options: []
        },
        events: {
          'click-edit': (e) => { this.placeHoldClick(e) }
        }
      })
    },
    removeBlock (e) {
      var that = this
      this.$q.dialog({
        title: 'Confirm',
        message: 'Confirm to delete BLOCK',
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('OK')
        that.blocks.splice(e.block, 1)
      })
    },
    removeChild (e) {
      this.blocks[e.block].child.splice(e.child, 1)
    },
    placeHoldClick (e) {
      this.selectedBLock = e.block_info
      this.selectedBLockProps = e.props_info
      console.log({ ...this.blocks })
    }
  }
}
</script>
