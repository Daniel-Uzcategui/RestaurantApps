<template>
<div
  class="diagphcont relative-position q-pt-lg"
   style="overflow: visible !important"
  :class="containerClass"
  :style="containerStyle">
      <img
        v-if="displayVal && displayVal.disptype == 1"
        style="position: absolute;
        width: 300%;
        top: -109%;
        left: -135%;"
        src="https://firebasestorage.googleapis.com/v0/b/pokeujz3w.appspot.com/o/Editor%2FPhotos%2FUnion%2016611559523208?alt=media&token=dde13ab5-c671-4ca2-8eb6-2c9a838a6236" alt="fondo">
      <div class="diagphcont2" style="overflow: visible !important" v-if="displayVal && displayVal.photo && !photoArray">
        <img alt="producto" style="overflow: visible !important" class="diagph" :style="photoStyle" contain :src="displayVal.photo" >
      </div>
          <q-carousel
            v-model="slide"
            v-if="displayVal && displayVal.photo && photoArray && !$q.platform.is.ios"
            arrows
            control-color="secondary"
            navigation
            infinite
            class="bg-transparent diagphcarousel absolute-center"
            style="overflow: visible !important;"
          >
            <q-carousel-slide style="overflow: visible !important" v-for="(photo, index) in displayVal.photomulti" :key="index" :name="index">
              <img alt="producto"  style="overflow: visible !important;" class="absolute-center imagecarousel" :style="photoStyle" contain :src="photo" >
            </q-carousel-slide>
          </q-carousel>
          <q-carousel
            v-model="slide"
            v-if="displayVal && displayVal.photo && photoArray  && $q.platform.is.ios"
            arrows
            control-color="secondary"
            navigation
            padding
            infinite
            class="bg-transparent diagphcarousel absolute-center"
          >
            <q-carousel-slide v-for="(photo, index) in displayVal.photomulti" :key="index" :name="index">
              <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
              <q-img alt="producto"  style="overflow: visible !important;" class="rounded-borders col-12 full-heigh" :style="photoStyle" contain :src="photo" />
        </div>
            </q-carousel-slide>
          </q-carousel>
  </div>
</template>
<script>
export default {
  props: ['dgbg', 'displayVal'],
  data () {
    return {
      slide: 0
    }
  },
  mounted () {
    console.log({ this: this.displayVal })
  },
  computed: {
    photoArray () {
      return Array.isArray(this.displayVal?.photomulti) && this.displayVal?.photomulti?.length
    },
    containerClass () {
      return this.displayVal?.disptype !== 1 && !this.photoArray ? 'column items-center' : ''
    },
    containerStyle () {
      return this.displayVal?.disptype === 1 ? 'background-color: unset' : this.dgbg
    },
    photoStyle () {
      return typeof this.displayVal?.disptype === 'undefined' ? 'overflow: visible !important;' : this.displayVal?.disptype === 1 && !this.photoArray ? 'overflow: visible !important; min-width: 250px; min-height: 250px; top: -81%;' : 'overflow: visible !important;'
    }
  }
}
</script>
<style scoped lang="stylus">
.diagphcont
  z-index 999
  overflow visible !important
  min-width 205.75px
  min-height 186.15px
  width 26.25vmin
  height 23.75vmin
  background-color #ffd63d
  border-radius 30px

.diagphcont2
  z-index 999
  overflow visible !important
  margin auto
  min-width 184.52px
  min-height 184.52px
  width 23vmin
  position absolute
.diagphcarousel
  z-index 999
  overflow visible !important
  min-width 184.52px
  min-height 184.52px
  max-width 400px
  max-height 250px
  width 160%
.imagecarousel
  overflow visible !important
  min-width 184.52px
  min-height 184.52px
  max-width 250px
  max-height 250px
  top 10%
  filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))
</style>
