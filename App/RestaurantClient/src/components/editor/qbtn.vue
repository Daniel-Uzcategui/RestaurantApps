<template>
  <q-card @click="click" v-if="true" :style="valStyle" :class="classes" :dark="dark" :square="square" :flat="flat" :bordered="bordered">
         <q-btn type="a" no-caps :color="btn_color" :href="btn_href" :flat="btn_flat" :rounded="btn_rounded" :text-color="btn_text_color" :style="btn_style" :class="btn_class" :label="btn_label" />
  </q-card>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
  props: {
    styles: {
      type: String,
      default: 'max-width: 350px;'
    },
    classes: {
      type: String,
      default: ''
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
    dark: {
      type: Boolean,
      default: () => false
    },
    square: {
      type: Boolean,
      default: () => false
    },
    flat: {
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
  },
  computed: {
    valStyle () {
      const { styles } = this
      if (styles === '') return 'max-width: 350px;'
      return styles
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
