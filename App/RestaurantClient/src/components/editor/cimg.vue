<template>
<div @click="click" :class="image_container_class" :style="image_container_style" style="margin-bottom: -6px;">
    <q-img :style="img_style"
    :class="img_class"
          :src="valImg"
        />
    <div :class="title_container_class" :style="title_container_style">
      <div v-html="title" :class="title_class" class="text-center" :style="title_style"></div>
    </div>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <p class="text-bold">Título</p>
      <q-editor :toolbar="toolbar" v-model="value.title" label="titulo" />
      <uploader v-model="value.img" :height=200 :width=200 />
      </q-card-section>
    </q-card>
  </q-dialog>
</div>
</template>
<script>
export default {
  name: 'my-card',
  components: {
    'uploader': () => import('./uploader.vue'),
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
    img: {
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
  },
  data () {
    return {
      dialog: false,
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{
          label: this.$q.lang.editor.formatting,
          icon: this.$q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h3', 'h4', 'h5', 'h6', 'code']
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
      const { img, icon } = this
      if (img === '') return 'https://cdn.quasar.dev/img/parallax2.jpg'
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
  }
}
</script>

<style lang="sass" scoped>

</style>
