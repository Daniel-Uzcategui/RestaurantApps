<template>
  <q-page padding>
    <div class=" q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <div class="text-h5 menuTop">Seleccionar Sede</div>
        <q-card flat class="my-card">
        <q-card-section v-for="i in localizations" :key="i.index">
          <q-btn class="full-width" color="primary" to="/menu/menu" :label="i.name" @click="setSede(i.id)" />
        </q-card-section>
        </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('localization', ['localizations'])
  },
  methods: {
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('menu', ['setSede'])
  },
  created () {
    this.bindLocalizations()
  }
}
</script>

<style lang="stylus">
  .menuTop
    height 50px
    margin-left 10%
    padding-top 20px
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
