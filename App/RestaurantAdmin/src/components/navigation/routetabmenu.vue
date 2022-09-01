<template>
    <q-tab @click="navmenuopen = !navmenuopen" icon="menu" label="Menu" no-caps stack/>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('config', ['navMenuOpen']),
    navmenuopen: {
      get () {
        return this.navMenuOpen
      },
      set (e) {
        return this.setNavMenuOpen(e)
      }
    }
  },
  methods: {
    ...mapActions('config', ['setNavMenuOpen'])
  }
}
</script>
