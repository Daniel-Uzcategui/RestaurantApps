<template>
  <div id="app">
    <viewer :images="images"
            @inited="inited"
            class="viewer" ref="viewer"
    >
      <template slot-scope="scope">
        <q-avatar style="height: 300px; width: 300px" color="blue" text-color="white" rounded>
        <img  @click="show" style="height: 300px; width: 300px" v-for="src in scope.images" :src="src" :key="src">
        </q-avatar>
      </template>
    </viewer>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'
export default {
  components: {
    Viewer
  },
  props: {
    img: {
      type: String
    }
  },
  data () {
    return {
      images: [this.img]
    }
  },
  methods: {
    inited (viewer) {
      this.$viewer = viewer
    },
    show () {
      this.$viewer.show()
    }
  }
}
</script>
