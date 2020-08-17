<template>
  <q-card style="background: unset" @click="click" v-if="true" :style="valStyle" :class="classes" :dark="dark" :square="square" :flat="flat" :bordered="bordered">
        <q-img v-if="!no_image && valImg !== '' && icon === '' && !parallax" :src="valImg" :style="valImgStyle"/>
        <q-parallax
          v-if="!no_image && valImg !== '' && icon === '' && parallax"
          :src="valImg"
          :style="valImgStyle"
        />
        <div class="row justify-center" v-if="!no_image && icon !== '' && valImg == ''">
          <q-icon class="text-center col q-pa-md" size="lg" :name="icon" />
        </div>
        <q-card-section v-if="text !== '' && caption !== ''">
          <div v-if="title !== ''" class="text-h6" :class="title_class" :style="title_style">{{title}}</div>
          <div v-if="caption !== ''" class="text-subtitle2" :class="caption_class" :style="caption_style">{{caption}}</div>
        </q-card-section>

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
    caption: {
      type: String,
      default: 'by John Doe'
    },
    caption_style: {
      type: String,
      default: ''
    },
    caption_class: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    img_style: {
      type: String,
      default: 'height: 200px; width: 100%;'
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
  },
  computed: {
    valStyle () {
      const { styles } = this
      if (styles === '') return 'max-width: 350px;'
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
