<template>
  <div @click="click" v-if="!hide" v-html="JS"></div>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
  props: {
    JS: {
      type: String,
      default: 'Hello world!'
    },
    hide: {
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
  mounted () {
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...this._props
      }
    })
    this.runFunc()
  },
  methods: {
    runFunc () {
      let js = this.JS
      function somefunc () {
        // eslint-disable-next-line no-eval
        eval(js)
      }
      somefunc()
    },
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
