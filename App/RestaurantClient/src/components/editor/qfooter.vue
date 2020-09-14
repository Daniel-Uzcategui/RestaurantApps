<template>
<q-footer reveal class="cyan darken-3" @click="click" :class="global_class" :style="valStyle">

  <!-- Footer Elements -->
  <div class="q-pa-md text-center row justify-center">

    <!-- Grid row-->
    <div class="row col-6 text-white">
          <a class="col" v-if="facebook !== ''" :href="facebook">
            <q-icon name="fab fa-facebook-f" color="white"/>
          </a>
          <!-- Twitter -->
          <a class="col" v-if="twitter !== ''" :href="twitter">
            <q-icon name="fab fa-twitter fa-lg white-text mr-md-5 mr-3 fa-2x" color="white"/>
          </a>
          <!-- Google +-->
          <a class="col" v-if="Google !== ''" :href="Google">
            <q-icon name="fab fa-google-plus-g fa-lg white-text mr-md-5 mr-3 fa-2x" color="white"/>
          </a>
          <!--Linkedin -->
          <a class="col" v-if="Linkedin !== ''" :href="Linkedin">
            <q-icon name="fab fa-linkedin-in fa-lg white-text mr-md-5 mr-3 fa-2x" color="white"/>
          </a>
          <!--Instagram-->
          <a class="col" v-if="Instagram !== ''" :href="Instagram">
            <q-icon name="fab fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x" color="white"/>
          </a>
          <!--Pinterest-->
          <a class="col" v-if="Pinterest !== ''" :href="Pinterest">
            <q-icon name="fab fa-pinterest fa-lg white-text fa-2x" color="white"/>
          </a>
    </div>
    <!-- Grid row-->

  </div>
  <!-- Footer Elements -->

  <!-- Copyright -->
  <div class="q-pa-xs text-center text-caption">© 2020 Copyright:
    <a href="https://chopzi.com/" class="text-white"> ChopZi.com</a>
  </div>
  <!-- Copyright -->

</q-footer>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
  props: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    Google: {
      type: String,
      default: ''
    },
    Linkedin: {
      type: String,
      default: ''
    },
    Instagram: {
      type: String,
      default: ''
    },
    Pinterest: {
      type: String,
      default: ''
    },
    global_styles: {
      type: String,
      default: ''
    },
    global_class: {
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

<style lang="sass" scoped>

</style>
