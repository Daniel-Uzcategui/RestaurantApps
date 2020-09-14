<template>
  <q-card @click="click" v-if="true" :style="valStyle" :class="classes" :dark="dark" :square="square" :flat="flat" :bordered="bordered">
        <q-card-section v-if="text !== ''" class="q-pt-none" :class="text_class" :style="text_style">
          {{ text }}
        </q-card-section>
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

<style lang="sass" scoped>

</style>
