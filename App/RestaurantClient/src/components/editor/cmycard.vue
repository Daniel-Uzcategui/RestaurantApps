<template>
   <q-card @click="click" v-if="true"
   :style="`background-image:linear-gradient(rgba(0, 0, 0, ${bgopacity}),rgba(0, 0, 0, ${bgopacity})),url('${imagen}');
    background-repeat: no-repeat;
    background-size: cover;
    height: 70vmin;
    background-position: 50%;
    min-width:320px; height: 70vmin;`"
    :class="classes" :dark="dark" :square="square" :flat="flat" :bordered="bordered">
     <!-- <div :class="image_container_class" :style="image_container_style">
       <img
        v-if="!no_image && valImg !== '' && icon === '' && !parallax"
        :src="valImg"
        :class="img_class"
        :style="valImgStyle"
        />
      </div>
      <q-parallax
         v-if="!no_image && valImg !== '' && icon === '' && parallax"
         :src="valImg"
         :style="valImgStyle"
         />
      <div class="row justify-center" v-if="!no_image && icon !== '' && valImg == ''">
         <q-icon class="text-center col q-pa-md" size="lg" :name="icon" />
      </div> -->
      <q-card-section :class="title_container_class" :style="title_container_style" v-if="title !== '' || caption !== ''">
         <div v-if="title !== ''" class="text-h6" :class="title_class" :style="title_style + `color: ${title_color};`" v-html="title"></div>
         <div v-if="caption !== ''" class="text-subtitle2" :class="caption_class" :style="caption_style + `color: ${title_color};`" v-html="caption"></div>
      </q-card-section>
      <q-card-section v-if="text !== ''" class="q-pt-none" :class="text_class" :style="text_style + `color: ${title_color};`" v-html="text">
      </q-card-section>
      <!-- <q-card-section v-if="button" class="row justify-center" :style="btn_container_style" :class="btn_container_class">
        <q-btn v-html="btn_label" type="a" no-caps :color="btn_color" :flat="btn_flat" :href="btn_href" :rounded="btn_rounded" :text-color="btn_text_color" :style="btn_style" :class="btn_class" >
        </q-btn>
      </q-card-section>
      <q-card-section v-if="textbtn !== ''" class="q-pt-none" :class="textbtn_class" :style="textbtn_style" v-html="textbtn">
      </q-card-section> -->
  <q-dialog v-model="dialog">
    <q-card class="q-cardGlass">
      <q-card-section>
        <p class="text-bold text-h5 text-center">Imagen con Texto y Título</p>
      <p class="text-bold text-h6">Título</p>
      <q-editor :fonts="fonts" :definitions="definitions" :toolbar="toolbar" v-model="value.title" label="titulo" />
      <p class="text-bold text-h6">Subtitulo</p>
      <q-editor :fonts="fonts" :definitions="definitions" :toolbar="toolbar" v-model="value.caption" label="titulo" />
      <p class="text-bold text-h6">Texto</p>
      <q-editor :fonts="fonts" :definitions="definitions" :toolbar="toolbar" v-model="value.text" label="titulo" />

      <p class="text-bold q-ma-md">Color del texto</p>
      <q-color
      v-model="value.title_color"
      default-view="palette"
      :palette="[
        '#019A9D', '#D9B801', '#E8045A', '#B2028A',
        '#2A0449', '#019A9D'
      ]"
      class="my-picker"
    />
      <p class="text-bold q-ma-md">Brillo de la imagen</p>
      <q-slider color="blue" label v-model="value.bgopacity" :min="0" :max="1" :step="0.05"/>
      <uploader v-model="value.imagen"
        :height=250
        :width=250
        :quality=2
        more="Resolución de imagen recomendada 500*500"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
   </q-card>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
   components: {
    'uploader': () => import('./uploader.vue')
  },
  data () {
    return {
      dialog: false,
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
        ['bold', 'italic', 'underline'],
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
    valStyle () {
      const { styles } = this
      if (styles === '') return ''
      return styles
    },
    valImgStyle () {
      const { img_style } = this
      if (img_style === '') return 'height: 200px; width: 100%;'
      return img_style
    },
    valImg () {
      const { img, icon } = this
      if (img === '' && icon === '') return 'https://cdn.quasar.dev/img/parallax1.jpg'
      return img
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
    props: {
    isAdmin: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: Object,
      default: () => {}
    },
    styles: {
      type: String,
      default: 'max-width: 350px;'
    },
    classes: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Our Changing Planet'
    },
    title_style: {
      type: String,
      default: ''
    },
    title_class: {
      type: String,
      default: ''
    },
    title_container_style: {
      type: String,
      default: ''
    },
    title_container_class: {
      type: String,
      default: ''
    },
    title_color: {
      type: String,
      default: '#ffffff'
    },
    caption: {
      type: String,
      default: 'by John Doe'
    },
    bgopacity: {
      type: Number,
      default: 0.25
    },
    caption_style: {
      type: String,
      default: ''
    },
    caption_class: {
      type: String,
      default: ''
    },
    imagen: {
      type: String,
      default: ''
    },
    img_style: {
      type: String,
      default: 'height: 200px; width: 100%;'
    },
    img_class: {
      type: String,
      default: ''
    },
    image_container_class: {
      type: String,
      default: ''
    },
    image_container_style: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
    },
    text_style: {
      type: String,
      default: ''
    },
    text_class: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    button: {
      type: Boolean,
      default: () => false
    },
    btn_color: {
      type: String,
      default: ''
    },
    btn_text_color: {
      type: String,
      default: ''
    },
    btn_label: {
      type: String,
      default: ''
    },
    btn_href: {
      type: String,
      default: ''
    },
    btn_rounded: {
      type: Boolean,
      default: () => false
    },
    btn_flat: {
      type: Boolean,
      default: () => false
    },
    btn_style: {
      type: String,
      default: ''
    },
    btn_class: {
      type: String,
      default: ''
    },
    btn_container_style: {
      type: String,
      default: ''
    },
    btn_container_class: {
      type: String,
      default: ''
    },
    textbtn: {
      type: String,
      default: ``
    },
    textbtn_style: {
      type: String,
      default: ''
    },
    textbtn_class: {
      type: String,
      default: ''
    },
    dark: {
      type: Boolean,
      default: () => false
    },
    square: {
      type: Boolean,
      default: () => false
    },
    parallax: {
      type: Boolean,
      default: () => false
    },
    flat: {
      type: Boolean,
      default: () => false
    },
    no_image: {
      type: Boolean,
      default: () => false
    },
    bordered: {
      type: Boolean,
      default: () => false
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

<style lang="sass" scoped>

</style>
