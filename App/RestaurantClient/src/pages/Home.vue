<template>
  <q-page>
    <div style="margin-top: -50px" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card flat class="bg-transparent text-white">
      <q-card-section class="q-pa-none">
        <q-parallax :height="300" :speed="0.5">
      <div class="text-thin text-h5" style=" float: left; border-style: ridge; width: min-content;" v-html="'&nbspPOKE&nbsp212&nbsp'"></div>
      <q-tabs
        v-model="tab"
        class="bg-transparent"
      >
        <q-tab name="special" label="ESPECIALIDADES" />
        <q-tab name="aboutus" label="QUIENES SOMOS" />
        <q-tab name="findus" label="ENCUENTRANOS" />
        <q-tab name="events" label="EVENTOS" />
        <q-tab name="contact" label="CONTACTO" />
      </q-tabs>
      <template v-slot:media>
        <img src="https://cms.tripster.com/travelguide/wp-content/uploads/2018/11/Dropbox_ThinkstockPhotos-969507264.jpg">
      </template>
    </q-parallax>
    </q-card-section>
      </q-card>
    <div class="row reverse-wrap flex-center">
      <q-card flat style="max-width: 500px">
      <q-card-section class="text-center">
      <p class="text-h3">Descubre</p>
      <p class="text-h5">Nuestro Restaurante</p>
      </q-card-section>
      <q-card-section class="text-center">
      <p class="text-caption">***</p>
      </q-card-section>
      <q-card-section class="text-center">
      <p class="text-h6 text-weight-thin">Voluptatibus quaerat laboriosam fugit non Ut consequatur animi est molestiae enim a voluptate totam natus modi debitis dicta impedit voluptatum quod sapiente illo saepe explicabo quisquam perferendis labore et illum suscipit</p>
      </q-card-section>
      </q-card>

      <q-img src="https://stuffersdelipoke.com/wp-content/uploads/2018/02/POKE-BOWL-NO-BACKGROUND.png" class="q-pa-md" spinner-color="white" style="min-height: 140px; max-width: 400px" />
    </div>
    <q-carousel
      arrows
      animated
      v-model="slide"
      height="400px"
      autoplay
    >
      <q-carousel-slide name="first" img-src="https://www.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2017/07/27/Interactivity/Images/crop_90FirstBite0712_009.JPG?t=20170517">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">First stop</div>
          <div class="text-subtitle1">Mountains</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" img-src="https://www.hawaiimagazine.com/sites/default/files/field/image/Ahi_tuna_Poke-Wikimedia-creative-commons.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Second stop</div>
          <div class="text-subtitle1">Famous City</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="third" img-src="https://images.ctfassets.net/qu53tdnhexvd/1iQTkAH0NKCCoWOg222EkS/07c3b9a495bb55baa28be56584c13ed6/hawaiian-poke-bowl.jpg?fm=jpg&fl=progressive&q=80&w=1300">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Third stop</div>
          <div class="text-subtitle1">Famous Bridge</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="fourth" img-src="https://www.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2017/07/27/Interactivity/Images/crop_90FirstBite0712_009.JPG?t=20170517">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">First stop</div>
          <div class="text-subtitle1">Mountains</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="fifth" img-src="https://www.hawaiimagazine.com/sites/default/files/field/image/Ahi_tuna_Poke-Wikimedia-creative-commons.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Second stop</div>
          <div class="text-subtitle1">Famous City</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="sixth" img-src="https://images.ctfassets.net/qu53tdnhexvd/1iQTkAH0NKCCoWOg222EkS/07c3b9a495bb55baa28be56584c13ed6/hawaiian-poke-bowl.jpg?fm=jpg&fl=progressive&q=80&w=1300">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Third stop</div>
          <div class="text-subtitle1">Famous Bridge</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="qweqwe" img-src="https://www.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2017/07/27/Interactivity/Images/crop_90FirstBite0712_009.JPG?t=20170517">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">First stop</div>
          <div class="text-subtitle1">Mountains</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="wwww" img-src="https://www.hawaiimagazine.com/sites/default/files/field/image/Ahi_tuna_Poke-Wikimedia-creative-commons.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Second stop</div>
          <div class="text-subtitle1">Famous City</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="thirqwqd" img-src="https://images.ctfassets.net/qu53tdnhexvd/1iQTkAH0NKCCoWOg222EkS/07c3b9a495bb55baa28be56584c13ed6/hawaiian-poke-bowl.jpg?fm=jpg&fl=progressive&q=80&w=1300">
        <div class="absolute-bottom custom-caption">
          <div class="text-h2">Third stop</div>
          <div class="text-subtitle1">Famous Bridge</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      tab: '',
      slide: 'first'
    }
  }

}
</script>
<style lang="sass" scoped>
.sizf
  text-size: 18px
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
