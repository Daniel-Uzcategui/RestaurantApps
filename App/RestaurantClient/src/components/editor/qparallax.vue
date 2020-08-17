<template>
<q-parallax @click="click" :style="valStyle"
      :src="valImg"
    >
      <div class="fontsize-56" :style="title_style">{{title}}</div>
</q-parallax>
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
    img: {
      type: String,
      default: ''
    },
    img_style: {
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
