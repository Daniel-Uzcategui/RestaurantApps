<template>
<div @click="click" :class="image_container_class" :style="image_container_style" style="margin-bottom: -6px;">
    <q-img :style="img_style"
    :class="img_class"
          :src="valImg"
        />
    <div :class="title_container_class" :style="title_container_style">
      <div v-html="title" :class="title_class" :style="title_style"></div>
    </div>
</div>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
  props: {
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
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...this._props
      }
    })
  },
  methods: {
    click () {
      this.$emit('click-edit', {
        block_info: {
          block_index: this.block_index, child_index: this.child_index
        },
        props_info: {
          ...this._props
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
