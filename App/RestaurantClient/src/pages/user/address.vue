<template>
  <q-page padding>
    <div class=" q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <div class="text-h5 menuTop">Direcciones</div>
    <addresses v-model='address'/>
    </div>
  </q-page>
</template>

<script>
export default {
  components: {
    'addresses': () => import('../../components/addresses.vue')
  },
  data () {
    return {
      address: ''
    }
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
