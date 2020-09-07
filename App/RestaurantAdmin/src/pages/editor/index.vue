<template>
   <div>
      <q-drawer v-if="admin" show-if-above v-model="left" side="left" bordered>
         <q-bar class="bg-primary text-white rounded-borders">
            <div class="cursor-pointer non-selectable">
               Options
               <q-menu>
                  <q-list dense style="min-width: 100px">
                     <q-item clickable v-close-popup>
                        <q-item-section @click="page_options = !page_options">Page Options</q-item-section>
                     </q-item>
                  </q-list>
               </q-menu>
            </div>
            <q-space />
            <q-btn color="white" text-color="white" icon="fas fa-chevron-left" flat label="Exit" to="/home"/>
         </q-bar>
         <div class="text-h5 q-pa-md">
            Page Builder
         </div>
         <q-btn color="primary" @click="saveB" label="Save" />
         <q-card v-if="page_options" class="my-card">
            <q-card-section>
               <div class="text-h5">
                  Page Options
               </div>
            </q-card-section>
            <q-card-section>
               <q-expansion-item class="text-h6" label="Page Global styles">
                  <q-card-section class="">
                    <div class="row">
                      <q-input filled  v-model="page.class" placeholder="default-bg-image" label="Page Class"  class="col"/>
                     </div>
                     <q-input
                        v-model="page.style"
                        filled
                        type="textarea"
                        label="Page Style"
                        />
                  </q-card-section>
               </q-expansion-item>
            </q-card-section>
            <q-card-section>
               <q-expansion-item class="text-h6" label="Light-Theme Colors">
                  <q-card-section class="row justify-between">
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightPrimary"
                        label="primary"
                        :style="typeof page.lightPrimary === 'undefined' ? `background: ${colors.getBrand('primary')}` : `background: ${page.lightPrimary};`"
                        >
                        <q-popup-edit v-model="page.lightPrimary">
                           <q-color v-model="page.lightPrimary" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightSecondary"
                        label="secondary"
                        :style="typeof page.lightSecondary === 'undefined' ? `background: ${colors.getBrand('secondary')}` : `background: ${page.lightSecondary};`"
                        >
                        <q-popup-edit v-model="page.lightSecondary">
                           <q-color v-model="page.lightSecondary" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightaccent"
                        label="accent"
                        :style="typeof page.lightaccent === 'undefined' ? `background: ${colors.getBrand('accent')}` : `background: ${page.lightaccent};`"
                        >
                        <q-popup-edit v-model="page.lightaccent">
                           <q-color v-model="page.lightaccent" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightdark"
                        label="dark"
                        :style="typeof page.lightdark === 'undefined' ? `background: ${colors.getBrand('dark')}` : `background: ${page.lightdark};`"
                        >
                        <q-popup-edit v-model="page.lightdark">
                           <q-color v-model="page.lightdark" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightpositive"
                        label="positive"
                        :style="typeof page.lightpositive === 'undefined' ? `background: ${colors.getBrand('positive')}` : `background: ${page.lightpositive};`"
                        >
                        <q-popup-edit v-model="page.lightpositive">
                           <q-color v-model="page.lightpositive" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightnegative"
                        label="negative"
                        :style="typeof page.lightnegative === 'undefined' ? `background: ${colors.getBrand('negative')}` : `background: ${page.lightnegative};`"
                        >
                        <q-popup-edit v-model="page.lightnegative">
                           <q-color v-model="page.lightnegative" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightinfo"
                        label="info"
                        :style="typeof page.lightinfo === 'undefined' ? `background: ${colors.getBrand('info')}` : `background: ${page.lightinfo};`"
                        >
                        <q-popup-edit v-model="page.lightinfo">
                           <q-color v-model="page.lightinfo" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.lightwarning"
                        label="warning"
                        :style="typeof page.lightwarning === 'undefined' ? `background: ${colors.getBrand('warning')}` : `background: ${page.lightwarning};`"
                        >
                        <q-popup-edit v-model="page.lightwarning">
                           <q-color v-model="page.lightwarning" />
                        </q-popup-edit>
                     </q-btn>
                  </q-card-section>
               </q-expansion-item>
            </q-card-section>
            <q-card-section>
               <q-expansion-item class="text-h6" label="Dark-Theme Colors">
                  <q-card-section class="row justify-between">
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkPrimary"
                        label="primary"
                        :style="typeof page.darkPrimary === 'undefined' ? `background: ${colors.getBrand('primary')}` : `background: ${page.darkPrimary};`"
                        >
                        <q-popup-edit v-model="page.darkPrimary">
                           <q-color v-model="page.darkPrimary" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkSecondary"
                        label="secondary"
                        :style="typeof page.darkSecondary === 'undefined' ? `background: ${colors.getBrand('secondary')}` : `background: ${page.darkSecondary};`"
                        >
                        <q-popup-edit v-model="page.darkSecondary">
                           <q-color v-model="page.darkSecondary" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkaccent"
                        label="accent"
                        :style="typeof page.darkaccent === 'undefined' ? `background: ${colors.getBrand('accent')}` : `background: ${page.darkaccent};`"
                        >
                        <q-popup-edit v-model="page.darkaccent">
                           <q-color v-model="page.darkaccent" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkdark"
                        label="dark"
                        :style="typeof page.darkdark === 'undefined' ? `background: ${colors.getBrand('dark')}` : `background: ${page.darkdark};`"
                        >
                        <q-popup-edit v-model="page.darkdark">
                           <q-color v-model="page.darkdark" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkpositive"
                        label="positive"
                        :style="typeof page.darkpositive === 'undefined' ? `background: ${colors.getBrand('positive')}` : `background: ${page.darkpositive};`"
                        >
                        <q-popup-edit v-model="page.darkpositive">
                           <q-color v-model="page.darkpositive" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darknegative"
                        label="negative"
                        :style="typeof page.darknegative === 'undefined' ? `background: ${colors.getBrand('negative')}` : `background: ${page.darknegative};`"
                        >
                        <q-popup-edit v-model="page.darknegative">
                           <q-color v-model="page.darknegative" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkinfo"
                        label="info"
                        :style="typeof page.darkinfo === 'undefined' ? `background: ${colors.getBrand('info')}` : `background: ${page.darkinfo};`"
                        >
                        <q-popup-edit v-model="page.darkinfo">
                           <q-color v-model="page.darkinfo" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                        filled
                        class="text-white col-6"
                        v-model="page.darkwarning"
                        label="warning"
                        :style="typeof page.darkwarning === 'undefined' ? `background: ${colors.getBrand('warning')}` : `background: ${page.darkwarning};`"
                        >
                        <q-popup-edit v-model="page.darkwarning">
                           <q-color v-model="page.darkwarning" />
                        </q-popup-edit>
                     </q-btn>
                  </q-card-section>
               </q-expansion-item>
            </q-card-section>
         </q-card>
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
                  <q-input autogrow v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop !== 'boolean'" :placeholder="prop" filled v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index" />
                  <q-toggle v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop === 'boolean'" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index" />
                  <div v-if="index !== 'block_index' && index !== 'child_index' && Array.isArray(prop)">
                     <div class="text-center" v-for="(prp, idx) in prop" :key="idx">
                        Slide # {{idx}}
                        <div v-for="(prp1, idx1) in prp" :key="idx1">
                           <q-input
                              v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index][idx][idx1]"
                              :placeholder="prp1" filled :label="idx1" />
                        </div>
                     </div>
                     <q-btn color="primary" label="Add Slide"
                        @click="Vue.set(blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index], blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index].length ,{});
                        prop.push({
                        text_1: 'WELCOME TO',
                        text_2: 'ChopZi',
                        text_3: 'The Web as I envisaged it, we have not seen it yet. The future',
                        text_4: 'is still so much bigger than the past.',
                        button_label: 'READ MORE',
                        button_link: '#',
                        slide_style: '',
                        img: 'https://www.freepik.com/blog/app/uploads/2020/07/Pruebla-Blog-1.jpg'
                        })" />
                  </div>
               </div>
            </q-card-section>
         </q-card>
      </q-drawer>
      <div :class="{ 'default-bg-image': typeof page.class === 'undefined' ? true : false, [page.class]: [page.class] }" :style="!$q.dark.isActive ? 'background-color: #efefef;' + page.style : '' + page.style" v-if="blocks.length">
         <draggable :is="admin ? 'draggable' : 'div'" :list="blocks" @start="admin ? drag=true : drag=false" @end="drag=false" handle=".handle">
            <transition-group
               appear
               enter-active-class="animated fadeIn"
               leave-active-class="animated fadeOut">
               <div v-for="(block, index) in blocks" :class="block.class" :style="block.style" :key="block.id">
                  <div v-if="block.child.length" @mouseover=" admin ? (block.hover = true) : false" @mouseleave="admin ? block.hover = false : false">
                     <q-btn v-if="block.hover" color="white" icon="fa fa-align-justify" style="height: 50px; position: absolute; z-index:999999"  text-color="black" class="handle float-left"/>
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
// eslint-disable-next-line no-unused-vars
import { colors } from 'quasar'
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
    'qTextBlock': () => import('../../components/editor/qTextBlock'),
    draggable
  },
  data () {
    return {
      colors: colors,
      page: {},
      page_options: false,
      admin: true,
      left: true,
      Vue: Vue,
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml', 'qTextBlock'],
      blocks: [],
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: []
    }
  },
  created () {
    this.bindBlocks().then((e) => {
      let obj = e.find(e => e.id === 'blocks')
      let pageobj = e.find(e => e.id === 'page')
      if (obj.blocks) { this.blocks = JSON.parse(JSON.stringify(obj.blocks)) }
      if (pageobj) { this.page = JSON.parse(JSON.stringify(pageobj)) }
    })
  },
  methods: {
    ...mapActions('editor', ['saveBlocks', 'savePage', 'bindBlocks']),
    saveB () {
      this.saveBlocks(this.blocks)
      this.savePage(this.page)
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
      Vue.set(this, 'selectedBLockProps', e.props_info)
      console.log({ selectedBLockProps: this.selectedBLockProps, props: e.props_info })
      console.log({ ...this.blocks })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .default-bg-image {
    background-image: url(https://c1.wallpaperflare.com/preview/510/897/163/close-up-cuisine-delicious-dinner.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
