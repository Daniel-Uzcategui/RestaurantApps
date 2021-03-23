<template>
<div @contextmenu="click" style="margin-bottom: -4px; position: relative; overflow: hidden"
>
    <!-- <VueDragResize :is="resizeChild ? 'VueDragResize' : 'div'" :parentLimitation="false" class="" :isActive="true"
      v-bind="{
        w: viewportToPixels(childDimentions.width),
        h: viewportToPixels(childDimentions.height),
        y: viewportToPixels(childDimentions.top),
        x: viewportToPixels(childDimentions.left),
      }"
      :style="!resizeChild ? ` height: ${childDimentions.height}; width:${childDimentions.width};
        top:${childDimentions.top}; left:${childDimentions.left};
      ` : ''"
      @resizing="resizeChildf" @dragging="resizeChildf"
    > -->
    <VueDragResize :is="resizeChild ? 'VueDragResize' : 'div'" :parentLimitation="false" class="overflow-hidden" :isActive="true"
      v-bind="{
        w: viewportToPixels(childDimentions.width),
        h: viewportToPixels(childDimentions.height),
        y: viewportToPixels(childDimentions.top),
        x: viewportToPixels(childDimentions.left),
      }"
      @resizing="resizeChildf" @dragging="resizeChildf"
    >
    <div class="absolute-full">

            <div class="full-width full-height absolute-full overflow-hidden" v-if="imageActive">
      <q-img v-if="!parallax && !multiPanel" :img-style="{ height: imageHeight + 'vh', width: imageWidth + '%',
      '-webkit-filter': `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`,
      filter: `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`,
      top: imagePositionY + '%',
      left: imagePositionX + '%',
      bottom: 'unset',
      right: 'unset'
      }"
        :src="valImg"
        :class="'full-width full-height relative-position'"
      >
      </q-img>
      <effect :position="{top: imagePositionY + '%',
      left: imagePositionX + '%',
      bottom: 'unset',
      right: 'unset'}" v-if="multiPanel && !parallax" :imageUrl="valImg" :styles="{ height: imageHeight + 'vh',
      '-webkit-filter': `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`,
      filter: `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`,
      }" />
      <q-parallax v-if="parallax" :speed="parallaxSpeed"
      >
        <template v-slot:media>
          <img :src="valImg" :style="{ height: imageHeight + 'vh', width: imageWidth + '%',
      '-webkit-filter': `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`,
      filter: `blur(${imageBlur}px) grayscale(${imageGrayScale}%) brightness(${bgopacity * 100}%)`
      }"
        >
        </template>
      </q-parallax>
    </div>
    </div>
    <!-- <div :class="`absolute-full`" v-if="imageActive" :style="`background-color: rgba(0,0,0,${bgopacity})`"></div> -->
    <div :style="title_container_style + ';' + ` color: ${title_color}; text-shadow: 2px 2px 4px #000000;`" :class="` ${title_class} ${titlePosition} text-center`" v-if="titleActive" v-html="title" ></div>
    <typer-wrapper :class="`${typeWriterPosition} text-center`" v-if="typeWriter && typeWriterActive" v-model="typeWriter" :titleColor="title_color" />
    <qTabs :tabs="blockTabsGen" flat :classes="`bg-transparent ${blockTabPosition}`" v-if="blockTabActive" :block_index="block_index" :child_index="child_index" />
    <findus v-if="findus" :block_index="block_index" :child_index="child_index" />
     <q-btn v-show="btnActive" v-for="(btn, index) in qbtns" :key="index" :color="btn.color" :class="btn.position" :text-color="btn.textColor" :label="btn.label" />
    </VueDragResize>
  <q-dialog transition-show="fade" transition-hide="slide-down" seamless :position="'left'" v-model="dialog" v-if="value">
      <div class="q-cardGlass" v-draggable>
        <!-- <div class="q-cardGlass" v-draggable="{ handle: $refs.handleId }"> -->
      <q-bar ref="handleId">
      <q-btn v-close-popup dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-weight-bold">
        Bloque:{{block_index}} Hijo:{{child_index}}
      </div>
    </q-bar>
    <q-card class="bg-transparent">
      <q-card-section>
        <q-expansion-item
        expand-separator
        icon="title"
        label="Título"
      >
         <q-select :options="positionClasses" v-model="value.titlePosition" label="Posición del titulo" />
         <q-toggle v-model="value.titleActive" label="Activar" />
        <q-editor :content-style="{color: value.title_color, 'text-shadow': '2px 2px 4px #000000'}" :fonts="fonts" :definitions="definitions" :toolbar="toolbar" v-model="titleText" label="titulo" />
        <q-dialog v-model="colorText">
          <q-card class="q-cardGlass">
            <q-card-section>
              <p class="text-bold q-ma-md">Color del texto</p>
              <q-color
              v-model="value.title_color"
              default-view="palette"
              format-model="rgba"
              :palette="[
                '#019A9D', '#D9B801', '#E8045A', '#B2028A',
                '#2A0449', '#019A9D'
              ]"
              class="my-picker"
            />
            </q-card-section>
          </q-card>
        </q-dialog>
        </q-expansion-item>
    <q-expansion-item
        expand-separator
        icon="keyboard"
        label="Efecto de Máquina de escribir"
      >
      <q-toggle v-model="value.typeWriterActive" label="Activar" />
      <q-select :options="positionClasses" v-model="value.typeWriterPosition" label="Posición del Texto" />
     <typing v-model="value.typeWriter" @input="(e) => typerbind = value.typeWriter" />
    </q-expansion-item>
    <q-expansion-item
        expand-separator
        icon="insert_photo"
        label="Opciones de imagen"
      >
      <!-- <q-select :options="positionClasses" v-model="value.imagePosition" label="Posición de la imagen" /> -->
      <q-toggle v-model="value.imageActive" label="Activar imagen"/>
      <p class="text-bold q-ma-md">Brillo de la imagen</p>
      <q-slider color="blue" label v-model="value.bgopacity" :min="0" :max="1" :step="0.05"/>
      <p class="text-bold q-ma-md">Efecto Borroso</p>
      <q-slider color="blue" label v-model="value.imageBlur" :min="0" :max="100" :step="0.05"/>
      <p class="text-bold q-ma-md">Escala de Grises</p>
      <q-slider color="blue" label v-model="value.imageGrayScale" :min="0" :max="100" :step="0.05"/>
      <!-- <q-toggle v-model="value.imageContain" label="Contener imagen"/>
      <q-btn flat color="primary" push @click="$q.notify({ message: containHelp })" icon="help" /> -->
      <p class="text-bold q-ma-md">Altura vertical de la imagen</p>
        <q-slider color="blue" label v-model="value.imageHeight" :min="10" :max="100" :step="1"/>
        <p class="text-bold q-ma-md">Ancho de la imagen</p>
        <q-slider color="blue" label v-model="value.imageWidth" :min="10" :max="100" :step="1"/>
        <p class="text-bold q-ma-md">Posicion X</p>
        <q-slider color="blue" label v-model="value.imagePositionX" :min="0" :max="100" :step="1"/>
        <p class="text-bold q-ma-md">Posicion Y</p>
        <q-slider color="blue" label v-model="value.imagePositionY" :min="0" :max="100" :step="1"/>
      <q-checkbox v-model="value.parallax" label="Parallax" />
      <q-btn flat color="primary" push @click="$q.notify({ message: parallaxHelp })" icon="help" />
      <q-checkbox v-model="value.multiPanel" label="Efecto Multi Panel" />
      <div v-if="value.parallax">
        <p class="text-bold q-ma-md">Velocidad del Parallax</p>
        <q-slider color="blue" label v-model="value.parallaxSpeed" :min="0" :max="1.5" :step="0.05"/>
      </div>
      <uploader :value="value.img0"
        @input="(e) => updateImgs(e)"
        :height=216
        :width=384
        :quality=5
        :heightMobile=411.5
        :widthMobile=205.5
        :qualityMobile=2
        :background="true"
        more=""
        />
    </q-expansion-item>
    <q-expansion-item
        expand-separator
        icon="room"
        label="Widget encuentranos"
      >
    <q-select :options="positionClasses" v-model="value.findusPosition" label="Posición del widget" />
    <q-toggle v-model="value.findus" label="Widget de localizacion"/>
    <q-btn flat color="primary" push @click="$q.notify({ message: locationHelp })" icon="help" />
    </q-expansion-item>
    <q-expansion-item
        expand-separator
        icon="list"
        label="Menú de pestañas"
      >
    <q-toggle v-model="value.blockTabActive" label="Activar"/>
    <div v-if="value.blockTabActive">
      <q-select :options="positionClasses" v-model="value.blockTabPosition" label="Posición del menú" />
      <q-input v-for="(tab, index) in blockTabs" :key="index" :value="tab.label" @input="(e) => updateBlk(e,index,true)">
        <template v-slot:append>
          <q-icon
            :name="tab.visibility ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="(e) => updateBlk(tab.label,index,!tab.visibility)"
          />
        </template>
      </q-input>
    </div>
    </q-expansion-item>
    <q-expansion-item
        expand-separator
        icon="settings"
        label="Ajustes de bloque Hijo"
      >
       <child-flex v-model="value.classesObj"
          @inputClass="(e) => value.classes = e"
          @inputStyle="(e) => value.styles = e">
        </child-flex>
        <p>Ajustar manual del tamaño de Bloque Hijo(Avanzado)</p>
       <q-btn color="blue" rounded :label="resizeChild ? 'Listo' : 'Comenzar'" @click="resizeChild = !resizeChild" />
    </q-expansion-item>
      </q-card-section>
    </q-card>
      </div>
  </q-dialog>
</div>
</template>
<script>
/* eslint-disable camelcase */
import TyperWrapper from './typer/typerWrapper.vue'
import { Draggable } from 'draggable-vue-directive'
import Findus from './findus'
import qTabs from './qTabs'
import VueDragResize from 'vue-drag-resize'
import childFlex from './Flex/FlexChild'
import effect from './ImageEffects/FelxibleMultiPanel'
export default {
  name: 'my-card',
  directives: {
    Draggable
  },
  components: {
    'uploader': () => import('./uploader.vue'),
    'typing': () => import('./typer/Demo'),
    childFlex,
    TyperWrapper,
    Findus,
    qTabs,
    VueDragResize,
    effect
  },
  data () {
    return {
      colorText: false,
      resizeChild: false,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      width2: 0,
      height2: 0,
      top2: 0,
      left2: 0,
      positionClasses: [
        'default',
        'absolute-top-right',
        'absolute-center',
        'absolute-top-left',
        'absolute-bottom-left',
        'absolute-bottom-right',
        'absolute-top',
        'absolute-right',
        'absolute-bottom',
        'absolute-left',
        'fixed-bottom-right',
        'fixed-top-right',
        'fixed-bottom-left',
        'fixed-top',
        'fixed-right',
        'fixed-bottom',
        'fixed-left',
        'fixed-top-left',
        'fixed-full',
        'fixed',
        'fixed-center',
        'fullscreen',
        'absolute-full'
      ],
      locationHelp: 'Este widget muestra la localización colocada para sus sedes en el administrativo, este widget no puede ir acompañado de título ni imagen, si están activos no se mostrará',
      containHelp: 'La imagen que se muestra estará completamente contenida, independientemente de si se necesite espacio en blanco adicional',
      parallaxHelp: 'La imagen se mueve con el scroll de la página',
      typerbind: {},
      dialog: false,
      definitions: {
        color: {
          tip: 'Cambiar color de fuente',
          icon: 'palette',
          label: 'Color',
          handler: () => { this.colorText = true }
        },
        'tamaño': { cmd: 'color', param: 'red', icon: this.$q.iconSet.editor.size1 || this.$q.iconSet.editor.size, tip: this.$q.lang.editor.size1, htmlTip: `<font class="fontsize-42">${this.$q.lang.editor.size1}</font>` }
      },
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'color'],
        [{
          label: this.$q.lang.editor.fontSize,
          icon: this.$q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7'
          ]
        },
        {
          label: this.$q.lang.editor.defaultFont,
          icon: this.$q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'default_font',
            'arial',
            'arial_black',
            'comic_sans',
            'courier_new',
            'impact',
            'lucida_grande',
            'times_new_roman',
            'verdana'
          ]
        }]
      ]
    }
  },
  computed: {
    blockTabs () {
      let qty = this.blockQty
      let bltab = {}
      console.log(qty, this.blockTab, 'BLOCKTABS')
      if (qty !== null) {
        for (let index = 0; index < qty; index++) {
          bltab['block' + index] = { label: 'block' + index, link: 'block' + index, visibility: true }
        }
      }
      if (this.blockTab) {
        bltab = { ...bltab, ...this.blockTab }
      }
      return bltab
    },
    blockTabsGen () {
      try {
        let blk = Object.values(this.blockTabs)
        blk = blk.filter(x => x.visibility)
        return JSON.stringify(Object.values(blk))
      } catch (error) {
        return ''
      }
    },
    titleColor: {
      get () {
        return typeof this.value.title_color !== 'undefined' ? this.value.title_color : '#ffffff'
      },
      set (e) {
        this.$emit('input', { ...this.value, title_color: e })
      }
    },
    titleText: {
      get () {
        return typeof this.value.title !== 'undefined' ? this.value.title : '<p>Bloque</p>'
      },
      set (e) {
        this.$emit('input', { ...this.value, title: e })
      }
    },
    valStyle () {
      const { global_styles } = this
      if (global_styles === '') return ''
      return global_styles
    },
    valImg () {
      // eslint-disable-next-line no-unused-vars
      let { img0, img1 } = this
      if (img0 === '') return 'https://cdn.quasar.dev/img/parallax2.jpg'
      if (this.$q.screen.gt.xs) {
        return img0
      } else {
        return img1
      }
    }
  },
  mounted () {
    let props = this._props
    delete props.isAdmin
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...props
      }
    })
  },
  methods: {
    resize (newRect) {
      console.log('Resizing')
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    },
    resizeChildf (newRect) {
      console.log(newRect)
      // this.width2 = newRect.width
      // this.height2 = newRect.height
      // this.top2 = newRect.top
      // this.left2 = newRect.left
      this.width2 = newRect.width ? this.pxTOvw(newRect.width) + 'vw' : '0vw'
      this.height2 = newRect.height ? this.pxTOvh(newRect.height) + 'vh' : '20vh'
      this.top2 = newRect.top ? this.pxTOvh(newRect.top) + 'vh' : '0vh'
      this.left2 = newRect.left ? this.pxTOvw(newRect.left) + 'vw' : '0vw'
      console.log(this.width2, this.height2, this.top2, this.left2)
    },
    updateBlk (block, index, visibility) {
      this.$emit('input', { ...this.value, blockTab: { ...this.blockTabs, [index]: { label: block, link: index, visibility } } })
    },
    viewportToPixels (value) {
      // eslint-disable-next-line no-useless-escape
      var parts = value.match(/([0-9\.]+)(vh|vw)/)
      var q = Number(parts[1])
      var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
      return side * (q / 100)
    },
    pxTOvw (value) {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth
      var result = (100 * value) / x
      return result.toFixed(2)
    },
    pxTOvh (value) {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight || e.clientHeight || g.clientHeight

      var result = (100 * value) / y
      return result.toFixed(2)
    },
    updateImgs (e) {
      let imgs = {}
      for (let i of e) {
        if (i.file.startsWith('small_')) {
          imgs.img1 = i.link
        } else {
          imgs.img0 = i.link
        }
      }
      this.$emit('input', { ...this.value, ...imgs })
    },
    consol (e) {
      console.log(e)
    },
    click () {
      if (this.isAdmin) {
        console.log('Aloha')
        this.dialog = true
      }
      let props = this._props
      delete props.isAdmin
      this.$emit('click-edit', {
        block_info: {
          block_index: this.block_index, child_index: this.child_index
        },
        props_info: {
          ...props
        }
      })
    }
  },
  watch: {
    resizeChild (e) {
      if (!e) {
        this.$emit('input', {
          ...this.value,
          childDimentions: {
            width: this.width2 ? this.width2 : '0vw',
            height: this.height2 ? this.height2 : '20vh',
            top: this.top2 ? this.top2 : '0vh',
            left: this.left2 ? this.left2 : '0vw'
          }
        })
        this.$emit('classDelete',
          `height: ${this.height2 ? this.height2 : '20vh'}; ${this.width2 ? 'width: ' + this.width2 + ';' : '0vw;'}
          ${this.top2 ? 'top: ' + this.top2 + ';' : '0vh;'} ${this.left2 ? this.left2 + ';' : '0vw;'}
          `
        )
      }
    }
  },
  props: {
    childDimentions: {
      type: Object,
      default: () => {
        return {
          width: '30vw',
          height: '30vh',
          top: '0vh',
          left: '0vw'
        }
      }
    },
    findus: {
      type: Boolean,
      default: () => false
    },
    findusPosition: {
      type: String,
      default: 'default'
    },
    typeWriter: {
      type: Object,
      default: () => {
        return { 'text': [
          'E-commerce hecho Fácil',
          'Atractivo para tus clientes',
          'Simplifica tu Trabajo',
          'Progressive WebApp'
        ],
        'shuffle': false,
        'initial-action': 'typing',
        'pre-type-delay': 70,
        'type-delay': 70,
        'pre-erase-delay': 2000,
        'erase-delay': 250,
        'erase-style': 'select-all',
        'erase-on-complete': false,
        'caret-animation': 'blink',
        'customText': {
          'fontSize': 12,
          'fontColor': 'white',
          'fontFamily': ''
        } }
      }
    },
    typeWriterActive: {
      type: Boolean,
      default: () => false
    },
    typeWriterPosition: {
      type: String,
      default: 'absolute-bottom'
    },
    titleActive: {
      type: Boolean,
      default: () => true
    },
    blockQty: {
      type: Number,
      default: null
    },
    blockTabActive: {
      type: Boolean,
      default: () => false
    },
    classes: {
      type: String,
      default: () => ''
    },
    styles: {
      type: String,
      default: () => ''
    },
    blockTabPosition: {
      type: String,
      default: () => 'absolute-top-right'
    },
    blockTab: {
      type: Object,
      default: () => {
        return {
          block0: {
            label: 'block0',
            link: 'block0',
            visibility: true
          }
        }
      }
    },
    value: {
      type: Object
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    },
    parallax: {
      type: Boolean,
      default: false
    },
    multiPanel: {
      type: Boolean,
      default: false
    },
    imageHeight: {
      type: Number,
      default: 100
    },
    imageWidth: {
      type: Number,
      default: 100
    },
    imageBlur: {
      type: Number,
      default: 0
    },
    imageGrayScale: {
      type: Number,
      default: 0
    },
    imagePositionX: {
      type: Number,
      default: 0
    },
    imageActive: {
      type: Boolean,
      default: () => false
    },
    imageContain: {
      type: Boolean,
      default: () => false
    },
    imagePositionY: {
      type: Number,
      default: 0
    },
    parallaxSpeed: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: '<p>Bloque</p>'
    },
    bgopacity: {
      type: Number,
      default: 1
    },
    title_style: {
      type: String,
      default: ''
    },
    title_color: {
      type: String,
      default: '#ffffff'
    },
    title_class: {
      type: String,
      default: ''
    },
    titlePosition: {
      type: String,
      default: 'absolute-center'
    },
    title_container_style: {
      type: String,
      default: ''
    },
    title_container_class: {
      type: String,
      default: ''
    },
    img0: {
      type: String,
      default: ''
    },
    img1: {
      type: String,
      default: ''
    },
    img_style: {
      type: String,
      default: ''
    },
    img_class: {
      type: String,
      default: ''
    },
    image_container_style: {
      type: String,
      default: ''
    },
    image_container_class: {
      type: String,
      default: ''
    },
    imagePosition: {
      type: String,
      default: 'default'
    },
    global_styles: {
      type: String,
      default: ''
    },
    block_index: {
      type: Number,
      required: true
    },

    child_index: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="css" >

</style>
