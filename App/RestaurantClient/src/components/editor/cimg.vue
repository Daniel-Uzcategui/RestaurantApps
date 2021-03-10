<template>
<div @click="click" :class="image_container_class" :style="image_container_style" style="margin-bottom: -6px;">
    <q-img :style="img_style + `width: 100%;height: 100vh;object-fit: cover;position: relative;`"
    :class="img_class"
          :src="valImg"
        />
    <div :class="title_container_class" :style="title_container_style + ';' + `background-color: rgba(0,0,0,${bgopacity});`">
      <div v-html="title" :class="title_class" class="text-center" :style="title_style + `; color: ${title_color}; text-shadow: 2px 2px 4px #000000;`"></div>
    </div>
  <q-dialog v-model="dialog">
    <q-card class="q-cardGlass">
      <q-card-section>
        <p class="text-bold text-h5 text-center">Imagen con Título</p>
      <q-editor :fonts="fonts" :definitions="definitions" :toolbar="toolbar" v-model="value.title" label="titulo" />
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
      <uploader :value="value.img0"
        @input="(e) => updateImgs(e)"
        :height=216
        :width=384
        :quality=5
        :background="true"
        more="Resolución de imagen recomendada 1920*1080"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</div>
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
      definitions: {
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
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: 'My first Landing Page'
    },
    bgopacity: {
      type: Number,
      default: 0.25
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

<style lang="sass" scoped>

</style>
