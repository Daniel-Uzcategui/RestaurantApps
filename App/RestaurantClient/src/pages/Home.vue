<template>
  <q-page>
    <div>
    <q-card flat class="menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section>
        <div class="text-h5 menuTop">Promociones</div>
      </q-card-section>
    <q-card-section class="q-pa-none">
      <q-carousel
      class="q-pa-none"
        arrows
        animated
        v-model="slide"
        :autoplay="autoplay"
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      >
        <q-carousel-slide v-for="(promo, index) in promos"
        :key="index" :name="index" :img-src="promo.photo">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">{{promo.name}}</div>
            <div class="text-subtitle1">$ {{promo.price}}</div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['promos'])
  },
  created () {
    this.bindPromos()
  },
  methods: {
    ...mapActions('menu', ['bindPromos'])
  },
  data () {
    return {
      slide: '1',
      autoplay: true
    }
  }
}
</script>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 12px
  color: white
  background-color: rgba(0, 0, 0, .3)
.menuTop
  height: 50px
  margin-left: 10%
  padding-top: 20px
.menudiv
  overflow: hidden
  border-top-left-radius: 50px
  border-top-right-radius: 50px
  border-bottom-left-radius: 50px
  border-bottom-right-radius: 50px
</style>
