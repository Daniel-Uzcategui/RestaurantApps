<template>
   <div>
      <q-drawer v-if="admin" show-if-above v-model="left" side="left" bordered>
         <q-bar class="bg-primary text-white rounded-borders">
            <div class="cursor-pointer non-selectable">
               Options
               <q-menu>
                  <q-list dense style="min-width: 100px">
                     <q-item clickable v-close-popup>
                        <q-item-section @click="page_options = !page_options"><span>Page Options <q-icon name="fas fa-check" v-if="page_options"/></span>
                        </q-item-section>
                     </q-item>
                     <q-item clickable v-close-popup>
                        <q-item-section @click="app_options = !app_options"><span>{{app_options ? 'Page Builder' : 'App Builder'}}</span></q-item-section>
                     </q-item>
                     <q-item clickable v-close-popup>
                        <q-item-section @click="photoGallery = true"><span>Open image bucket</span></q-item-section>
                     </q-item>
                     <q-item clickable v-close-popup>
                        <q-item-section @click="download()"><span>Export Project</span></q-item-section>
                     </q-item>
                     <q-item clickable v-close-popup>
                        <q-item-section @click="importDialog = true"><span>Import Project</span></q-item-section>
                     </q-item>
                     <q-item clickable v-close-popup>
                        <q-item-section @click="appProperties = true"><span>App Properties</span></q-item-section>
                     </q-item>
                  </q-list>
               </q-menu>
            </div>
            <q-space/>
            <q-btn color="white" text-color="white" icon="fas fa-chevron-left" flat label="Exit" to="/home"/>
         </q-bar>
         <div class="text-h5 q-pa-md">
            {{ app_options ? 'App Builder ' : 'Page Builder '}} <span class="text-caption"> ({{saveSelected === '' ? 'Production' : saveSelected}})</span>
         </div>
         <div v-if="app_options" class="text-h6 q-pa-md">
            Disclaimer: This option is in early stages, Custom css will only be applied to production. You can save and load protype values, but you will only be able to preview the changes by saving to production.
         </div>
         <div class="row justify-between">
            <q-btn color="primary" @click="SaveReq = true" label="Save Project" />
            <q-btn color="primary" @click="loadReq = true" label="Load" />
         </div>
         <q-card v-if="app_options">
            <q-card-section>
                  <q-expansion-item class="text-h6" label="Order Wheel Colors">
                     <q-card-section class="row justify-between">
                        <q-btn
                           filled
                           class="text-white col-6"
                           v-model="page.knob.knob0"
                           label="Por confirmar"
                           :style="typeof page.knob === 'undefined' || typeof page.knob.knob0 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob0};`"
                           >
                           <q-popup-edit v-model="page.knob.knob0">
                              <q-color v-model="page.knob.knob0" />
                           </q-popup-edit>
                        </q-btn>
                        <q-btn
                           filled
                           class="text-white col-6"
                           v-model="page.knob.knob1"
                           label="Preparando su pedido"
                           :style="typeof page.knob === 'undefined' || typeof page.knob.knob1 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob1};`"
                           >
                           <q-popup-edit v-model="page.knob.knob1">
                              <q-color v-model="page.knob.knob1" />
                           </q-popup-edit>
                        </q-btn>
                        <q-btn
                           filled
                           class="text-white col-6"
                           v-model="page.knob.knob2"
                           label="Orden en vía"
                           :style="typeof page.knob === 'undefined' || typeof page.knob.knob2 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob2};`"
                           >
                           <q-popup-edit v-model="page.knob.knob2">
                              <q-color v-model="page.knob.knob2" />
                           </q-popup-edit>
                        </q-btn>
                        <q-btn
                           filled
                           class="text-white col-6"
                           v-model="page.knob.knob3"
                           label="Orden entregada"
                           :style="typeof page.knob === 'undefined' || typeof page.knob.knob3 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob3};`"
                           >
                           <q-popup-edit v-model="page.knob.knob3">
                              <q-color v-model="page.knob.knob3" />
                           </q-popup-edit>
                        </q-btn>
                        <q-btn
                           filled
                           class="text-white col-6"
                           v-model="page.knob.knob4"
                           label="Anulada"
                           :style="typeof page.knob === 'undefined' || typeof page.knob.knob4 === 'undefined' ? `background: #292929` : `background: ${page.knob.knob4};`"
                           >
                           <q-popup-edit v-model="page.knob.knob4">
                              <q-color v-model="page.knob.knob4" />
                           </q-popup-edit>
                        </q-btn>
                     </q-card-section>
                  </q-expansion-item>
               </q-card-section>
            </q-card>
         <div v-if="!app_options">
         <div class="q-pa-md text-h7">
            <div>Selected page:</div>
            <div>{{selectedPage === null ? '/' : selectedPage}}</div>
         </div>
         <!-- <div>
             <q-btn color="primary" @click="savePages" label="Save Page" />
         </div> -->
         <div>
            <q-tree
               :nodes="pagesNode"
               default-expand-all
               :selected.sync="selectedPage"
               node-key="route"
               labelKey="path"
            />
         </div>
         <div class="q-pl-sm q-pr-sm">
            <q-input v-model="newPageName" label="Add child page to selected">
               <template v-slot:append>
                  <q-btn @click="addPage()" round dense flat icon="add" />
               </template>
            </q-input>
         </div>
         </div>
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
                        >
                     <template v-slot:append>
                        <q-icon name="edit">
                           <q-popup-edit persistent buttons v-model="page.style" content-class="text-white">
                              <prism-editor @keyup.enter.stop class="my-editor" v-model="page.style" :highlight="highlighter" line-numbers></prism-editor>
                           </q-popup-edit>
                        </q-icon>
                     </template>
                     </q-input>
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
         <q-input type="textarea" v-if="app_options" v-model="insertCss" label="Global CSS" >
            <template v-slot:append>
                        <q-icon name="edit">
                           <q-popup-edit persistent buttons v-model="insertCss" content-class="text-white">
                              <prism-editor @keyup.enter.stop class="my-editor" v-model="insertCss" :highlight="highlighter" line-numbers></prism-editor>
                           </q-popup-edit>
                        </q-icon>
                     </template>
                     </q-input>
         <q-card v-if="!app_options && selectedBLock.block_index != null && typeof blocks[selectedBLock.block_index] !== 'undefined'" class="my-card">
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
                  <q-input v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop !== 'boolean' && index === 'img'" :placeholder="prop" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index" >
                     <template v-slot:append>
                        <q-btn @click="photoGallery = true; imgsbi = selectedBLock.block_index; imgsbc = selectedBLock.child_index; imgsi = index" round dense flat icon="add" />
                     </template>
                  </q-input>
                  <q-input
                        v-if="index !== 'block_index' && index !== 'child_index' && !Array.isArray(prop) && typeof prop !== 'boolean' && index !== 'img'" :placeholder="prop" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :label="index"
                        >
                     <template v-slot:append>
                        <q-icon name="edit">
                           <q-popup-edit persistent buttons v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" content-class="text-white">
                              <prism-editor @keyup.enter.stop class="my-editor" v-model="blocks[selectedBLock.block_index].child[selectedBLock.child_index].props[index]" :highlight="highlighter" line-numbers></prism-editor>
                           </q-popup-edit>
                        </q-icon>
                     </template>
                     </q-input>
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
         <draggable :is="admin ? 'draggable' : 'div'" v-if="!app_options" :list="blocks" @start="admin ? drag=true : drag=false" @end="drag=false" handle=".handle">
            <transition-group
               appear
               enter-active-class="animated fadeIn"
               leave-active-class="animated fadeOut">
               <div v-for="(block, index) in blocks" :class="block.class" :style="block.style" :key="block.id">
                  <div v-if="block.child.length" @mouseover=" admin ? (hover = true) : false" @mouseleave="admin ? hover = false : false">
                     <q-btn v-if="hover" color="white" icon="fa fa-align-justify" style="height: 50px; position: absolute; z-index:999999"  text-color="black" class="handle float-left"/>
                     <draggable :is="admin ? 'draggable' : 'div'" class="row justify-around reverse-wrap flex-center" group="childs" handle=".handle2" :list="block.child" @start="admin ? drag=true : drag=false" @end="drag=false">
                        <component :is="''" v-ripple="admin" class="handle2" v-for="(chld, indx) in block.child" :key="chld.id"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" @click-edit="(e) => {placeHoldClick(e)}" />
                     </draggable>
                  </div>
               </div>
            </transition-group>
         </draggable>
         <iframe id="iframe1" :src="ifrHtml" style="height: -webkit-fill-available; width: 100%;" v-if="app_options" frameborder="0"></iframe>
      </div>
      <div v-if="!app_options" class="row justify-center q-pa-md">
         <q-btn fab color="blue" @click="addBlock()" text-color="white" label="+" />
      </div>
      <q-dialog @hide="imgsbi=null; imgsbc=null; imgsi=null; iconmodel=null" v-model="photoGallery" transition-hide="scale" transition-show="scale" >
         <q-card class="full-width q-pa-none">
            <q-card-section class="bg-secondary text-white">
                  <div class="text-h5">
                     Photo Picker
                  </div>
                  <p class="text-caption">
                     (Try using small image sizes to ensure quick loading speeds)
                  </p>
            </q-card-section>
            <q-card-section>
               <fbq-uploader
                  class="full-width"
                  label="Photo Uploader"
                  :meta="meta"
                  prefixPath="/Editor/Photos/"
                  myPath="something"
                  @uploaded="uploadComplete"
                  document="editor"
               ></fbq-uploader>
            </q-card-section>
            <q-card-section v-if="Object.keys(gallery).length === 0">
                  <p class="text-center">
                     There are no pictures available, please upload one.
                  </p>
            </q-card-section>
            <q-card-section class="row justify-between">
               <q-img
                  v-ripple
                  @click="imgsbi !== null ? (blocks[imgsbi].child[imgsbc].props[imgsi] = gallery[photo]) : copyToClip(gallery[photo]); iconmodel !== null ? appicons[iconmodel] = gallery[photo] : null; photoGallery = false"
                  :src="gallery[photo]"
                  style="height: 140px; max-width: 150px"
                  v-for="(photo, index) in Object.keys(gallery)"
                  :key="index"
               >
               <div class="absolute-bottom text-subtitle1 text-center">
                  {{photo}}
               </div>
               </q-img>
            </q-card-section>
         </q-card>
      </q-dialog>
      <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">

    </q-dialog>
    <q-dialog v-model="SaveReq" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-select v-model="saveSelect" :options="Object.keys(versions)" label="Select prototype version" />
       <q-input v-model="newVerAlias" label="Add new prototype Version Alias">
          <template v-slot:append>
            <q-btn @click="saveV()" round dense flat icon="add" />
         </template>
       </q-input>
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" @click="saveSelect !== '' ? saveB(true) : null" label="Save to Prototype" />
       <q-btn color="secondary" @click="saveB(false);" label="Save to Production" />
       </q-card-section>
       </q-card>
    </q-dialog>
    <q-dialog v-model="loadReq" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-select v-model="saveSelect" :options="Object.keys(versions)" label="Select prototype version" />
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" @click="loadB(true);" label="Load Prototype" />
       <q-btn color="secondary" @click="loadB(false);" label="Load Production" />
       </q-card-section>
       </q-card>
    </q-dialog>
    <q-dialog v-model="importDialog" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-file
            v-model="importFile"
            label="Pick one file"
            filled
            style="max-width: 300px"
         />
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" @click="loadImport(); importDialog = false;" label="Load Imported file" />
       </q-card-section>
       </q-card>
    </q-dialog>
    <q-dialog v-model="appProperties" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-input placeholder="name" v-model="app_name" label="name" />
         <q-input placeholder="short_name" v-model="app_short_name" label="short_name" />
         <q-input placeholder="description" v-model="app_description" label="description" />
         <q-input placeholder="display" v-model="app_display" label="display" />
      <q-input placeholder="favicon" v-model="appicons.favicon" label="favicon" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'favicon'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input placeholder="128x128" v-model="appicons.icon128x128" label="icon128x128" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon128x128'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input placeholder="192x192" v-model="appicons.icon192x192" label="icon192x192" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon192x192'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input placeholder="256x256" v-model="appicons.icon256x256" label="icon256x256" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon256x256'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input placeholder="384x384" v-model="appicons.icon384x384" label="icon384x384" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon384x384'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input placeholder="512x512" v-model="appicons.icon512x512" label="icon512x512" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon512x512'" round dense flat icon="add" />
         </template>
       </q-input>
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" @click="saveMan(); appProperties = false;" label="Save" />
       </q-card-section>
       </q-card>
    </q-dialog>
   </div>
</template>
<script>
/* eslint-disable vue/no-unused-components vue/valid-v-on */
/* eslint-disable vue/require-component-is */
import draggable from 'vuedraggable'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { colors, QUploaderBase, copyToClipboard, exportFile } from 'quasar'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
export default {
  computed: {
    ...mapGetters('editor', ['editor']),
    ...mapGetters('config', ['version']),
    meta () {
      return {
        id: '123',
        photoType: this.photoType
      }
    },
    gallery () {
      let gal = this.editor.find(e => e.id === 'photo')
      return gal === null || typeof gal === 'undefined' ? {} : gal
    },
    versions () {
      let obj = this.editor.find(e => e.id === 'versions')
      // console.log({ versions: obj })
      if (typeof obj === 'undefined') { obj = {} }
      // console.log({ versions: obj })
      return obj
    },
    ifrHtml () {
      if (this.version !== null) { return 'https://' + this.version.clientDomain + '.web.app' } else { return null }
    }
  },
  mixins: [ QUploaderBase ],
  components: {
    'my-card': () => import('../../components/editor/mycard'),
    'place-holder': () => import('../../components/editor/placeHolder'),
    'qheader': () => import('../../components/editor/qheader'),
    'qfooter': () => import('../../components/editor/qfooter'),
    'qparallax': () => import('../../components/editor/qparallax'),
    'qcarousel': () => import('../../components/editor/qcarousel'),
    'qTextBlock': () => import('../../components/editor/qTextBlock'),
    'customHtml': () => import('../../components/editor/customHtml'),
    'customJS': () => import('../../components/editor/customJS'),
    'findus': () => import('../../components/editor/findus'),
    'qimg': () => import('../../components/editor/qimg'),
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    PrismEditor,
    draggable
  },
  data () {
    return {
      app_name: '',
      app_short_name: '',
      app_description: '',
      app_display: '',
      appicons: {
        favicon: '',
        icon128x128: '',
        icon192x192: '',
        icon256x256: '',
        icon384x384: '',
        icon512x512: ''
      },
      iconmodel: null,
      colors: colors,
      page: { knob: {} },
      page_options: false,
      app_options: false,
      admin: true,
      left: true,
      Vue: Vue,
      widgets: ['my-card', 'place-holder', 'qheader', 'qcarousel', 'qparallax', 'customHtml', 'customJS', 'qTextBlock', 'qimg', 'qfooter', 'findus'],
      blocks: [],
      insertCss: '',
      selectedBLock: { block_index: null, child_index: null },
      selectedBLockProps: [],
      photoType: '',
      photoUpload: false,
      photoGallery: false,
      galleryModel: {},
      imgsbi: null,
      imgsbc: null,
      imgsi: null,
      verSel: null,
      hover: false,
      SaveReq: false,
      loadReq: false,
      saveSelect: '',
      saveSelected: '',
      newVerAlias: '',
      importDialog: false,
      importFile: null,
      appProperties: false,
      addedPages: {},
      pagesNode: [{
        path: '/',
        route: '/'
      }],
      newPageName: '',
      selectedPage: '/'
    }
  },
  mounted () {
    console.log('Heeelllooo')
    this.bindEnv()
    this.bindManifest().then(e => {
      console.log({ manifest: e }, 'Manifest')
      if (typeof e !== 'undefined') {
        this.app_name = typeof e.name !== 'undefined' ? e.name : ''
        this.app_short_name = typeof e.short_name !== 'undefined' ? e.name : ''
        this.app_description = typeof e.description !== 'undefined' ? e.description : ''
        this.app_display = typeof e.display !== 'undefined' ? e.display : ''
        Vue.set(this.appicons, 'favicon', typeof e.icons && typeof e.icons.favicon !== 'undefined' ? e.icons.favicon : '')
        Vue.set(this.appicons, 'icon128x128', typeof e.icons && typeof e.icons.icon128x128 !== 'undefined' ? e.icons.icon128x128 : '')
        Vue.set(this.appicons, 'icon192x192', typeof e.icons && typeof e.icons.icon192x192 !== 'undefined' ? e.icons.icon192x192 : '')
        Vue.set(this.appicons, 'icon256x256', typeof e.icons && typeof e.icons.icon256x256 !== 'undefined' ? e.icons.icon256x256 : '')
        Vue.set(this.appicons, 'icon384x384', typeof e.icons && typeof e.icons.icon384x384 !== 'undefined' ? e.icons.icon384x384 : '')
        Vue.set(this.appicons, 'icon512x512', typeof e.icons && typeof e.icons.icon512x512 !== 'undefined' ? e.icons.icon512x512 : '')
      }
    })
    this.bindBlocks().then((e) => {
      let obj = e.find(e => e.id === 'blocks')
      let pageobj = e.find(e => e.id === 'page')
      let routes = e.find(e => e.id === 'routes')
      if (obj && obj.css) { this.insertCss = obj.css }
      if (pageobj) { this.page = JSON.parse(JSON.stringify(pageobj)) }
      if (typeof this.page.knob === 'undefined') { Vue.set(this.page, 'knob', {}) } else {
        Vue.set(this.page, 'knob', this.page.knob)
      }
      if (routes) { this.pagesNode = [JSON.parse(JSON.stringify(routes))] }
      if (obj && obj.addedPages) {
        this.blocks = obj.addedPages['Home']
        for (let key of Object.keys(obj.addedPages)) {
          if (key) {
            Vue.set(this.addedPages, key, JSON.parse(JSON.stringify(obj.addedPages[key])))
          }
        }
      }
    })
  },
  watch: {
    blocks (e) {
      let preffix
      if (this.selectedPage === null) { preffix = '' } else {
        preffix = this.selectedPage.replace(/\//g, '')
      }
      if (preffix !== '') {
        this.addedPages[preffix] = this.blocks
      } else {
        this.addedPages['Home'] = this.blocks
      }
    },
    selectedPage (e) {
      let preffix
      console.log('selectedpage', e)
      if (e === null) { preffix = '' } else {
        preffix = e.replace(/\//g, '')
      }
      if (preffix !== '') {
        console.log(preffix)
        console.log(this.addedPages, 'Added pages')
        if (this.addedPages && this.addedPages[preffix]) { this.blocks = this.addedPages[preffix] } else { this.selectedPage = '' }
      } else { this.blocks = this.addedPages['Home'] }
    }
  },
  methods: {
    ...mapActions('editor', ['saveBlocks', 'saveBlocks2', 'savePage', 'bindBlocks', 'saveCss', 'saveVer', 'saveRoutes']),
    ...mapActions('config', ['bindEnv', 'bindManifest', 'saveManifest']),
    addPage () {
      let parent = this.pagesNode[0]
      let route = this.selectedPage === null ? '/' : this.selectedPage
      const stack = []
      let node, ii
      stack.push(parent)
      while (stack.length > 0) {
        node = stack.pop()
        if (node.route === route) {
          console.log(stack, node.path, route)
          if (typeof node.children === 'undefined') {
            Vue.set(node, 'children', [])
          }
          let find = node.children.find(r => r.path === this.newPageName)
          if (typeof find !== 'undefined') {
            return this.$q.notify({
              message: 'Duplicated page name in the same directory',
              color: 'warning'
            })
          }
          if (this.newPageName === '') {
            return this.$q.notify({
              message: 'Page name cannot be empty',
              color: 'warning'
            })
          }
          let leroute = this.selectedPage !== '/' && this.selectedPage !== null ? this.selectedPage + '/' + this.newPageName : '/pg/' + this.newPageName
          Vue.set(this.addedPages, leroute.replace(/\//g, ''), [])
          Vue.set(node.children, node.children.length, {
            path: this.newPageName,
            route: leroute })
          return [node.path] // return whatever you want here!!!
        } else if (node.children && node.children.length) {
          for (ii = 0; ii < node.children.length; ii += 1) {
            stack.push(node.children[ii])
          }
        }
      }
      return null
    },
    saveMan () {
      this.saveManifest({
        'name': this.app_name,
        'short_name': this.app_short_name,
        'description': this.app_description,
        'display': this.app_display,
        'start_url': '.',
        'icons': {
          favicon: this.appicons.favicon,
          icon128x128: this.appicons.icon128x128,
          icon192x192: this.appicons.icon192x192,
          icon256x256: this.appicons.icon256x256,
          icon384x384: this.appicons.icon384x384,
          icon512x512: this.appicons.icon512x512
        },
        'orientation': 'portrait',
        'background_color': '#ffffff',
        'theme_color': '#027be3'
      })
    },
    download () {
      this.selectedPage = ''
      exportFile('ChopziPage.json', JSON.stringify({ addedPages: this.addedPages, css: this.insertCss, page: this.page, routes: this.pagesNode[0] }))
    },
    async loadImport () {
      let file = await this.importFile.text()
      let toObject = JSON.parse(file)
      if (toObject && toObject.blocks) { this.blocks = toObject.blocks } else { this.blocks = [] }
      if (toObject && toObject.css) { this.insertCss = toObject.css } else { this.insertCss = '' }
      if (toObject && toObject.page) { this.page = toObject.page } else { this.page = {} }
      if (toObject && toObject.routes) {
        Vue.set(this.pagesNode, 0, toObject.routes)
      } else {
        this.pagesNode = [{
          path: '/',
          route: '/'
        }]
      }
      if (toObject && toObject.addedPages) { this.selectedPage = ''; this.addedPages = toObject.addedPages; this.blocks = this.addedPages['Home'] } else { this.addedPages = {} }
    },
    saveV () {
      if (this.newVerAlias !== '') {
        this.saveVer(this.newVerAlias)
      }
    },
    savePages () {
      let preffix = this.saveSelected + this.selectedPage.replace(/\//g, '')
      this.saveBlocks({ payload: this.blocks, doc: preffix })
    },
    saveB (e) {
      this.selectedPage = ''
      let preffix = ''
      if (e) { preffix = this.saveSelect }
      this.$q.dialog({
        title: 'Confirm',
        message: `Would you like to save to ${e ? preffix : 'Production'}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.SaveReq = false
        // this.saveBlocks({ payload: this.blocks, doc: preffix })
        this.saveBlocks2({ payload: this.addedPages, doc: preffix })
        this.savePage({ payload: this.page, doc: preffix })
        this.saveRoutes({ payload: this.pagesNode[0], doc: preffix })
        this.saveCss({ payload: this.insertCss, doc: preffix })
      })
    },
    loadB (i) {
      let preffix = ''
      if (i) { preffix = this.saveSelect }
      this.$q.dialog({
        title: 'Confirm',
        message: `Would you like to Load ${i ? preffix : 'Production'}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.saveSelected = this.saveSelect
        this.loadReq = false
        let obj = this.editor.find(e => e.id === 'blocks' + preffix)
        let pageobj = this.editor.find(e => e.id === 'page' + preffix)
        let routes = this.editor.find(e => e.id === 'routes' + preffix)
        this.addedPages = typeof obj.addedPages === 'undefined' ? {} : obj.addedPages
        if (obj.addedPages['Home']) {
          this.selectedPage = ''
          this.blocks = obj.addedPages['Home']
        }
        if (obj && obj.css) { this.insertCss = obj.css } else { this.insertCss = '' }
        if (pageobj) { this.page = JSON.parse(JSON.stringify(pageobj)) } else { this.page = {} }
        if (routes) { Vue.set(this.pagesNode, 0, JSON.parse(JSON.stringify(routes))) } else {
          this.pagesNode = [{
            path: '/',
            route: '/'
          }]
        }
      })
    },
    log (e) {
      // console.log(e)
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
        // console.log('OK')
        that.blocks.splice(e.block, 1)
      })
    },
    removeChild (e) {
      this.blocks[e.block].child.splice(e.child, 1)
    },
    placeHoldClick (e) {
      this.selectedBLock = e.block_info
      Vue.set(this, 'selectedBLockProps', e.props_info)
      // console.log({ selectedBLockProps: this.selectedBLockProps, props: e.props_info })
      // console.log({ ...this.blocks })
    },
    resetPhotoType () {
      this.photoType = ''
    },
    uploadComplete (info) {
      // console.log(this.prefixPath)
      // console.log(this.currentUser)
      let fileNames = []
      info.files.forEach(file => fileNames.push(file))
      this.photoUpload = false
      this.$q.notify({
        message: `Successfully uploaded your photo: ${fileNames}`,
        color: 'positive'
      })
    },
    highlighter (code) {
      return highlight(code, languages.js) // languages.<insert language> to return html with markup
    },
    copyToClip (e) {
      copyToClipboard(e)
        .then(() => {
          this.$q.notify({
            message: `Copied image url to Clipboard`,
            color: 'positive'
          })
        })
        .catch(() => {
          this.$q.notify({
            message: `Error copying url to Clipboard`,
            color: 'positive'
          })
        })
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
  .my-editor {
    background: #2d2d2d;
    color: #ccc;
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
