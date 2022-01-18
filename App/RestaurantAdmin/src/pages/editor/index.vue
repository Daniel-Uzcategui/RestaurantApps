<template>
   <div @contextmenu.prevent>
      <q-header elevated reveal>
         <q-bar class="bg-blue-grey-3" style="z-index: 999999; color: black" no-parent-event>
                        <q-btn dense flat round icon="lens" size="8.5px" color="red" />
                        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
                        <q-btn dense flat round icon="lens" size="8.5px" color="green" />
                        <div class="cursor-pointer non-selectable text-bold">
                        Proyecto
                        <q-menu>
                        <q-list dense style="min-width: 100px">
                           <q-item clickable v-close-popup>
                              <q-item-section @click="newProject()"><span>Nuevo Projecto</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section @click="download()"><span>Export Project</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section @click="importDialog = true"><span>Import Project</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section @click="SaveReq = true"><span>Guardar Proyecto</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section @click="loadReq = true"><span>Abrir Proyecto</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section>
                                 <q-btn class="q-pa-none q-ma-none" no-caps flat label="Salir" to="/home"/>
                              </q-item-section>
                           </q-item>
                        </q-list>
                        </q-menu>
                        </div>
                        <div class="cursor-pointer non-selectable text-bold">
                        Bloque Padre
                        <q-menu>
                        <q-list dense style="min-width: 100px">
                           <q-item clickable v-close-popup>
                              <q-item-section @click="removeBlock({block: selectedBLock.block_index})"><span>Eliminar Bloque</span></q-item-section>
                           </q-item>
                           <q-item clickable v-close-popup>
                              <q-item-section @click="copyBlock()"><span>Copiar Bloque</span></q-item-section>
                           </q-item>
                           <q-item>
                              <q-item-section @click="addChild({block: selectedBLock.block_index})"><span>Añadir Bloque Hijo</span></q-item-section>
                           </q-item>
                        </q-list>
                        </q-menu>
                        </div>
                        <div v-if="$q.screen.gt.xs" class="col text-center text-weight-bold">
                           Bloque {{selectedBLock.block_index}} Proyecto activo: {{saveSelected === '' ? 'Producción' : saveSelected}}
                        </div>
                     </q-bar>
      </q-header>

      <div :class="{ 'default-bg-image': typeof page.class === 'undefined' ? true : false, [page.class]: [page.class] }" :style="!$q.dark.isActive ? 'background-color: #efefef;' + page.style : '' + page.style" v-if="blocks.length">
         <div class="row" :is="admin ? 'div' : 'div'" v-if="!app_options" :list="blocks" @start="drag=false" @end="drag=false" handle=".handle">
               <q-card :class="block.class" class="bg-primary relative-position" :style="block.style" square flat :id="'block' + index" v-for="(block, index) in blocks" :key="block.id + index">

                        <q-card v-ripple :is="''" v-model="chld.props"
                          @classDelete="(e) => { chld.styles= chld.styles + e ; $forceUpdate()}" class="handle2 full-width full-height absolute-center" :blockQty="blockQty" :isAdmin="true" v-for="(chld, indx) in block.child" :key="indx + '' + index"  @hook:mounted="(e) => childMounted(e)" v-bind="{ ...chld.props, block_index: index, child_index: indx }" @click-edit="(e) => {placeHoldClick(e);}"  />

               </q-card>
         </div>
         <iframe id="iframe1" :src="ifrHtml" style="height: -webkit-fill-available; width: 100%;" v-if="app_options" frameborder="0"></iframe>
      </div>
      <div v-if="!app_options" class="row justify-center q-pa-md">
         <q-btn fab color="blue" @click="addBlockDiag = true" text-color="white" label="+" />
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
    <q-dialog v-model="addBlockDiag">
      <q-card class="q-cardGlass full-width">
        <q-card-section>
          <q-input v-model.number="childsToAdd" type="number" label="Cantidad de columnas (min: 1, max: 12)"></q-input>
          <q-select v-model="childsToAddJustif" :options="['justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly']" label="Justificado de columnas"></q-select>
        </q-card-section>
        <q-card-section class="column items-center">
           <q-btn rounded color="blue" @click="addBlock()" v-close-popup no-caps label="Crear" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="SaveReq" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-select filled v-model="saveSelect" :options="Object.keys(versions)" label="Seleccionar prototipo (Opcional)" />
       <q-input filled v-model="newVerAlias" label="Añadir nuevo alias de Prototipo">
          <template v-slot:append>
            <q-btn @click="saveV()" round dense flat icon="add" />
         </template>
       </q-input>
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" no-caps @click="saveSelect !== '' ? saveB(true) : null" label="Guardar al Prototipo Seleccionado" />
       <q-btn color="secondary" @click="saveB(false);" no-caps label="Guardar a Producción" />
       </q-card-section>
       </q-card>
    </q-dialog>
    <q-dialog v-model="loadReq" transition-hide="scale" transition-show="scale">
       <q-card class="my-card">
       <q-card-section>
       <q-select filled v-model="saveSelect" :options="Object.keys(versions)" label="Selecciona un prototipo (Opcional)" />
       </q-card-section>
       <q-card-section class="row justify-between">
          <q-btn color="primary" @click="loadB(true);" no-caps label="Cargar Prototipo selecionado" />
       <q-btn color="secondary" @click="loadB(false);" no-caps label="Cargar Producción" />
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
       <q-input filled placeholder="name" v-model="app_name" label="name" />
         <q-input filled placeholder="short_name" v-model="app_short_name" label="short_name" />
         <q-input filled placeholder="description" v-model="app_description" label="description" />
         <q-input filled placeholder="display" v-model="app_display" label="display" />
      <q-input filled placeholder="favicon" v-model="appicons.favicon" label="favicon" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'favicon'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input filled placeholder="128x128" v-model="appicons.icon128x128" label="icon128x128" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon128x128'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input filled placeholder="192x192" v-model="appicons.icon192x192" label="icon192x192" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon192x192'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input filled placeholder="256x256" v-model="appicons.icon256x256" label="icon256x256" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon256x256'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input filled placeholder="384x384" v-model="appicons.icon384x384" label="icon384x384" >
         <template v-slot:append>
            <q-btn @click="photoGallery = true; iconmodel = 'icon384x384'" round dense flat icon="add" />
         </template>
       </q-input>
       <q-input filled placeholder="512x512" v-model="appicons.icon512x512" label="icon512x512" >
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
    blockQty () {
      return this.blocks.length
    },
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
    'orderwheel': () => import('./components/orderwheel'),
    'cssmenu': () => import('./components/cssMenu'),
    'menudisplay': () => import('./components/client/pages/Menu/menu'),
    'carouselmenu': () => import('./components/client/components/carouselMenu'),
    'qtabs': () => import('./components/client/components/editor/qTabs'),
    'qbtn': () => import('./components/client/components/editor/qbtn'),
    'my-card': () => import('./components/client/components/editor/mycard'),
    'cmy-card': () => import('./components/client/components/editor/cmycard'),
    'place-holder': () => import('./components/client/components/editor/placeHolder'),
    'qheader': () => import('./components/client/components/editor/qheader'),
    'qfooter': () => import('./components/client/components/editor/qfooter'),
    'qparallax': () => import('./components/client/components/editor/qparallax'),
    'qcarousel': () => import('./components/client/components/editor/qcarousel'),
    'qTextBlock': () => import('./components/client/components/editor/qTextBlock'),
    'customHtml': () => import('./components/client/components/editor/customHtml'),
    'customJS': () => import('./components/client/components/editor/customJS'),
    'findus': () => import('./components/client/components/editor/findus'),
    'qimg': () => import('./components/client/components/editor/qimg'),
    'cimg': () => import('./components/client/components/editor/cimg'),
    'fbq-uploader': () => import('../../components/FBQUploader.vue'),
    PrismEditor
  },
  data () {
    return {
      childsToAddJustif: null,
      addBlockDiag: false,
      childsToAdd: null,
      scssSelect: '',
      newScss: '',
      containerSel: null,
      scopedCss: [],
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
      widgets: [{ label: 'Imagen con Titulo', value: 'cimg' }, { label: 'Imagen con Titulo y Texto', value: 'cmy-card' }],
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
      hover: {},
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
    this.bindEnv()
    this.bindManifest().then(e => {
      console.log({ manifest: e }, 'Manifest')
      if (!(typeof e === 'undefined' || e === null)) {
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
      if (obj && obj.scopedCss) { this.scopedCss = obj.scopedCss }
      if (pageobj) { this.page = JSON.parse(JSON.stringify(pageobj)) }
      if (typeof this.page.knob === 'undefined') { Vue.set(this.page, 'knob', {}) } else {
        Vue.set(this.page, 'knob', this.page.knob)
      }
      if (routes) { this.pagesNode = [JSON.parse(JSON.stringify(routes))] }
      if (obj && obj.addedPages) {
        this.blocks = JSON.parse(JSON.stringify(obj.addedPages['Home']))
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
    newProject () {
      this.blocks = []
    },
    ...mapActions('editor', ['saveBlocks', 'saveBlocks2', 'savePage', 'bindBlocks', 'saveCss', 'saveScCss', 'saveVer', 'saveRoutes']),
    ...mapActions('config', ['bindEnv', 'bindManifest', 'saveManifest']),
    consoleame (e) {
      if (this.containerSel === null) {
        this.containerSel = {
          prev: e.target.style.backgroundColor,
          cont: `.${e.target.parentElement.className.split(' ').join('.')} > .${e.target.className.split(' ').join('.')}`
        }
      } else {
        this.insCss(this.containerSel.cont + ` { background-color: ${this.containerSel.prev === '' ? 'unset' : this.containerSel.prev}; } `)
        this.containerSel = { prev: e.target.style.backgroundColor, cont: `.${e.target.parentElement.className.split(' ').join('.')} > .${e.target.className.split(' ').join('.')}` }
      }
      this.insCss(`.${e.target.parentElement.className.split(' ').join('.')} > .${e.target.className.split(' ').join('.')}` + ' { background-color: rgba(0, 0, 255, 0.3); } ')
      console.log({ e })
    },
    insCss (css) {
      console.log(css)
      var s1 = document.createElement('style'), s0 = document.getElementsByTagName('script')[0]
      s1.innerHTML = css
      s0.parentNode.insertBefore(s1, s0)
      return s1.src
    },
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
      exportFile('ChopziPage.json', JSON.stringify({ addedPages: this.addedPages, scopedCss: this.scopedCss, css: this.insertCss, page: this.page, routes: this.pagesNode[0] }))
    },
    async loadImport () {
      let file = await this.importFile.text()
      let toObject = JSON.parse(file)
      if (toObject && toObject.blocks) { this.blocks = toObject.blocks } else { this.blocks = [] }
      if (toObject && toObject.css) { this.insertCss = toObject.css } else { this.insertCss = '' }
      if (toObject && toObject.scopedCss) { this.scopedCss = toObject.scopedCss } else { this.scopedCss = '' }
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
    saveScss () {
      if (this.newScss !== '') {
        this.scopedCss.push({ route: this.newScss, css: '' })
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
        title: 'Confirmar',
        message: `¿Quiere guardar el proyecto ${e ? preffix : 'Producción'}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.SaveReq = false
        // this.saveBlocks({ payload: this.blocks, doc: preffix })
        this.saveBlocks2({ payload: this.addedPages, doc: preffix })
        this.savePage({ payload: this.page, doc: preffix })
        this.saveRoutes({ payload: this.pagesNode[0], doc: preffix })
        this.saveCss({ payload: this.insertCss, doc: preffix })
        this.saveScCss({ payload: this.scopedCss, doc: preffix })
      })
    },
    loadB (i) {
      let preffix = ''
      if (i) { preffix = this.saveSelect }
      this.$q.dialog({
        title: 'Confirmar',
        message: `¿Quiere cargar el proyecto ${i ? preffix : 'Producción'}? Los cambios no guardados se perderán`,
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
        if (obj && obj.scopedCss) { this.scopedCss = obj.scopedCss } else { this.scopedCss = '' }
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
      // let chld = []
      let amntChildBlocks = this.childsToAdd
      let colsize = parseInt(12 / amntChildBlocks)
      // for (let index = 0; index < amntChildBlocks; index++) {
      //   chld.push({
      //     props: {
      //       is: 'cimg',
      //       classesObj: { widthGroup: `col-${colsize}`, 'min-height': '20vh' },
      //       options: [],
      //       styles: 'min-height: 20vh;',
      //       classes: `col-${colsize}`
      //     }
      //   })
      // }
      for (let index = 0; index < amntChildBlocks; index++) {
        if (index === 0) {
          Vue.set(this.blocks, this.blocks.length, {
            class: `flex-break`,
            id: Math.random().toString(36).substr(2, 9),
            hover: false,
            child: [{
              props: {
                is: 'div',
                classesObj: {},
                options: [],
                styles: '',
                classes: ``
              }
            }]
          })
        }
        Vue.set(this.blocks, this.blocks.length, {
          class: `col-${colsize}`,
          id: Math.random().toString(36).substr(2, 9),
          style: 'min-height: 300px; min-width: 300px',
          hover: false,
          child: [{
            props: {
              is: 'cimg',
              classesObj: {},
              options: [],
              styles: 'min-height: 20vh;',
              classes: `col-${colsize}`
            }
          }]
        })
      }
      console.log(this.blocks)
      // Vue.set(this.blocks, this.blocks.length, {
      //   class: `full-width relative-position q-pb-xs row ${this.childsToAddJustif}`,
      //   id: Math.random().toString(36).substr(2, 9),
      //   style: 'min-height: 10px; overflow: hidden;',
      //   hover: false,
      //   child: chld
      // })
    },
    addChild (e) {
      var indiceChild = this.blocks[e.block].child.length
      Vue.set(this.blocks[e.block].child, indiceChild, {
        id: Math.random().toString(36).substr(2, 9),
        props: {
          is: 'cimg',
          classesObj: {},
          options: [],
          styles: 'min-height: 20vh;',
          classes: `col-3`
        },
        events: {
          'click-edit': (e) => { this.placeHoldClick(e) }
        }
      })
    },
    removeBlock (e) {
      var that = this
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿Desea Eliminar el Bloque?',
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
    copyChild () {
      let blk, chld
      blk = this.selectedBLock.block_index
      chld = this.selectedBLock.child_index
      let childcopy = JSON.parse(JSON.stringify(this.blocks[blk].child[chld]))
      this.blocks[blk].child.push(childcopy)
    },
    copyBlock () {
      let blk
      blk = this.selectedBLock.block_index
      this.blocks.splice(blk, 0, JSON.parse(JSON.stringify(this.blocks[blk])))
    },
    placeHoldClick (e) {
      console.log(e, 'place')
      this.selectedBLock = e.block_info
      if (e.props_info) {
        Vue.set(this, 'selectedBLockProps', e.props_info)
      }
      // console.log({ selectedBLockProps: this.selectedBLockProps, props: e.props_info })
      // console.log({ ...this.blocks })
      if (this.containerSel !== null) {
        this.insCss(this.containerSel.cont + ` { background-color: ${this.containerSel.prev === '' ? 'unset' : this.containerSel.prev}; } `)
        this.containerSel = null
      }
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
  .flex-break
    flex: 1 0 100% !important
  .row
    .flex-break
      height: 0 !important
  .column
    .flex-break
      width: 0 !important
  .handle2 :hover { border:1px dotted #CD1821 }             /* Solid Red */
  //  .handle2 *:hover { border:2px solid #89A81E }                   /* Solid Green */
  //  .handle2 * *:hover { border:2px solid #F34607 }                 /* Solid Orange */
   // .handle2 * * *:hover { border:2px solid #5984C3 }               /* Solid Blue */
   // .handle2 * * * *:hover { border:2px solid #CD1821 }             /* Solid Red */
   // .handle2 * * * * *:hover { border:2px dotted #89A81E }          /* Dotted Green */
   // .handle2 * * * * * *:hover { border:2px dotted #F34607 }        /* Dotted Orange */
   // .handle2 * * * * * * *:hover { border:2px dotted #5984C3 }      /* Dotted Blue */
   // .handle2 * * * * * * * *:hover { border:2px dotted #CD1821 }    /* Dotted Red */
  .default-bg-image {
    background-image: url(https://c1.wallpaperflare.com/preview/510/897/163/close-up-cuisine-delicious-dinner.jpg);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .q-drawer {
     border-top-right-radius: 0px
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
