<template>
<q-header @click="click" :style="valStyle">
        <q-toolbar>
          <q-avatar>
            <img :src="valImg" :style="valImgStyle">
          </q-avatar>

          <q-toolbar-title :style="title_style">{{title}}</q-toolbar-title>
        </q-toolbar>
      </q-header>
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
    logo: {
      type: String,
      default: ''
    },
    logo_style: {
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
    valImgStyle () {
      const { logo_style } = this
      if (logo_style === '') return ''
      return logo_style
    },
    valImg () {
      // eslint-disable-next-line no-unused-vars
      const { logo, icon } = this
      if (logo === '') return 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg'
      return logo
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

<style lang="stylus" scoped>

</style>
