<template>
   <q-carousel
      @click="click"
      :style="valStyle"
      :class="classes"
      animated
      v-model="slide"
      :arrows="!$q.platform.is.mobile"
      swipeable
      navigation
      infinite
      autoplay
      control-color="white"
      transition-prev="slide-right"
      transition-next="slide-left"
      height="639px"
      >
      <q-carousel-slide v-for="(opt,index) in valOptions" :key="index" class="q-pa-none" :name="index" :img-src="opt.img">
         <div class="full-height full-width flex flex-center" style="background-color: rgba(0, 0, 0, 0.68) !important;">
            <div class="custom-caption">
               <div class="fontsize-56 main_line animation_2">{{opt.text_1 + ' '}}<span class="text-primary">{{opt.text_2}}</span></div>
               <br><br><br>
               <div class="fontsize-24 animation_1">{{opt.text_3}}<br> {{opt.text_4}}</div>
               <br><br><br>
               <div class="animation_2">
                  <q-btn size="md" class="bg-primary" :label="opt.button_label"/>
               </div>
            </div>
         </div>
      </q-carousel-slide>
   </q-carousel>
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'my-card',
  props: {
    options: {
      type: Array
    },
    styles: {
      type: String,
      default: ''
    },
    classes: {
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
      const { styles } = this
      if (styles === '') return 'width: 100%;'
      return styles
    },
    valOptions () {
      const { options } = this
      if (options.length === 0) {
        return [{
          text_1: 'WELCOME TO',
          text_2: 'ChopZi',
          text_3: 'The Web as I envisaged it, we have not seen it yet. The future',
          text_4: 'is still so much bigger than the past.',
          button_label: 'READ MORE',
          img: 'https://www.freepik.com/blog/app/uploads/2020/07/Pruebla-Blog-1.jpg'
        }]
      }
      var a = []
      for (let i of options) {
        var obj = {}
        if (typeof i.text_1 === 'undefined') { obj.text_1 = 'WELCOME TO' } else { obj.text_1 = i.text_1 }
        if (typeof i.text_2 === 'undefined') { obj.text_2 = 'ChopZi' } else { obj.text_2 = i.text_2 }
        if (typeof i.text_3 === 'undefined') { obj.text_3 = 'The Web as I envisaged it, we have not seen it yet. The future' } else { obj.text_3 = i.text_3 }
        if (typeof i.text_4 === 'undefined') { obj.text_4 = 'is still so much bigger than the past.' } else { obj.text_4 = i.text_4 }
        if (typeof i.button_label === 'undefined') { obj.button_label = 'READ MORE' } else { obj.button_label = i.button_label }
        if (typeof i.img === 'undefined') { obj.img = 'https://www.freepik.com/blog/app/uploads/2020/07/Pruebla-Blog-1.jpg' } else { obj.img = i.img }
        a.push(obj)
      }
      return a
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
      props_info: this.options.length !== 0 ? { ...this._props } : { ...this._props, options: this.valOptions }
    })
  },
  data () {
    return {
      slide: 0
    }
  },
  methods: {
    click () {
      this.$emit('click-edit', {
        block_info: {
          block_index: this.block_index, child_index: this.child_index
        },
        props_info: this.options.length !== 0 ? { ...this._props } : { ...this._props, options: this.valOptions }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
    .main_line
      font-size: 75px;
      letter-spacing: 5px;
      line-height: 60px;
      font-weight: 600;

    .custom-caption
      text-align: center;
      padding: 12px;
      color: white;

    .animation_1
      -webkit-animation: bounceIn 1s ease-in 800ms both;
      animation: bounceIn 1s ease-in 800ms both;

    .animation_2
      -webkit-animation: flipInX 2s ease-in-out 800ms both;
      animation: flipInX 1s ease-in-out 800ms both;

    .animation_3
      -webkit-animation: lightSpeedIn 1s ease-in 800ms both;
      animation: lightSpeedIn 1s ease-in 800ms both;

    .description
      padding: 10px
      background-color: black
      color: white
      box-shadow: 1px 1px 2px #e6e6e6

    .my-header
      width: 200px
      top: 0
      height: 45px
      color: black
      background-color: rgba(255,255,255, 0.8)
      text-transform: uppercase
      text-align: center
      font-size: 17px
      margin: 20px 0 0 68px
      padding: 25px

    .my-text
      width: 100%
      top: 0
      height: 90px
      color: white
      text-align: center
      font-size: 15px
      margin: 79px 0 0 0
      padding: 20px
      line-height: normal
      font-family: Georgia, serif
      font-style: italic

    .my-button-container
      width: 100%

    .my-button
      text-decoration: none
      text-transform: uppercase
      margin: 0 0 20px 0
      text-align: center
      padding: 7px 14px
      background-color: #000
      color: #fff
      text-transform: uppercase
      box-shadow: 0 0 1px #000
      transition-delay: 0.2s

    .my-button:hover
      box-shadow: 0 0 5px #000

    .box-shadow:hover
      box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12) !important;

    .my-card
      width: 350px
      max-width: 350px
      margin-top: 10px
</style>
