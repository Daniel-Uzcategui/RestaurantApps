<template>
  <div class="q-pa-md" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <itemcomp
      :Group="Group"
      :value="value"
      :required="req"
    />
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue')
  },
  computed: {
    ...mapGetters('menu', ['item', 'groupComp']),
    Group () {
      var group = []
      this.groupComp.forEach(element => {
        var items = this.item.filter(x => x.group_id.includes(element.group_id))
        group.push({ ...element, items })
      })
      return group.sort((a, b) => a.priority - b.priority)
    }
  },
  data () {
    return {
      value: [],
      req: []
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
