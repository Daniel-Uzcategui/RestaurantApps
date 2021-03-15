<template>
  <q-card @click="click" v-if="true" :style="valStyle" :class="classes" :dark="dark" :square="square" :flat="flat" :bordered="bordered">
        <q-tabs
        mobile-arrows
        :class="tabs_class" :style="tabs_style"
        v-model="tab"
        inline-label
        class="bg-transparent text-white shadow-2"
      >
        <q-tab no-caps  v-for="(tb, index) in tabs2" :key="index" :name="tb.label" @click="scrollToElement(tb.link)" :label="tb.label" />
      </q-tabs>
  </q-card>
</template>
<script>
/* eslint-disable camelcase */
export default {
  data () {
    return {
      tab: ''
    }
  },
  name: 'my-card',
  props: {
    styles: {
      type: String,
      default: ''
    },
    classes: {
      type: String,
      default: ''
    },
    tabs_style: {
      type: String,
      default: ''
    },
    tabs_class: {
      type: String,
      default: ''
    },
    tabs: {
      type: String,
      default: `[{ label: 'test', link: '/#test' }]`
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
      if (styles === '') return ''
      return styles
    },
    tabs2 () {
      let a
      try {
        a = JSON.parse(this.tabs)
        return a
      } catch (e) {
        return [{ label: 'test', link: '/#test' }]
      }
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
    scrollToElement (id) {
      const el = document.getElementById(id)

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
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
