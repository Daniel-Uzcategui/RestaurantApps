<template>
<q-card @click="click" style="height: 100px" class="my-card row justify-center">

      <q-card-section>
        <q-icon name="edit" size="md" class="absolute-center" />
      </q-card-section>

    </q-card>
</template>
<script>
export default {
  name: 'my-card',
  props: {
    block_index: {
      type: Number,
      required: true
    },

    child_index: {
      type: Number,
      required: true
    }
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
  }
}
</script>

<style lang="stylus" scoped>
    .main_line
      font-size: 75px
      letter-spacing: 5px
      line-height: 60px
      font-weight: 600

    .custom-caption
      text-align: center
      padding: 12px
      color: white

    .animation_1
      -webkit-animation: bounceIn 1s ease-in 800ms both
      animation: bounceIn 1s ease-in 800ms both

    .animation_2
      -webkit-animation: flipInX 2s ease-in-out 800ms both
      animation: flipInX 1s ease-in-out 800ms both

    .animation_3
      -webkit-animation: lightSpeedIn 1s ease-in 800ms both
      animation: lightSpeedIn 1s ease-in 800ms both

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
      box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12) !important

    .my-card
      width: 350px
      max-width: 350px
      margin-top: 10px

    .team-header
      width: 100%
      top: 0
      height: 45px
      color: white
      text-transform: uppercase
      text-align: center
      font-size: 17px
      margin: 60px 0 0 0
      padding: 12px

    .team-text
      width: 100%
      top: 0
      height: 90px
      color: white
      text-align: center
      font-size: 15px
      margin: 100px 0 0 0
      padding: 20px
      line-height: normal
      font-family: Georgia, serif
      font-style: italic

    .quote
      background: url(/statics/images/parallax.jpg)
      background-size: cover
      background-position: center
      background-attachment: fixed
      background-repeat: no-repeat

    .pricing
      background: url(/statics/images/pricing.jpg)
      background-size: cover
      background-position: center
      background-attachment: fixed
      background-repeat: no-repeat

    .contact_us
      background: url(/statics/images/contact_us.jpg)
      background-size: cover
      background-position: center
      background-attachment: fixed
      background-repeat: no-repeat

    .custom_tab
      width: 130px
</style>
