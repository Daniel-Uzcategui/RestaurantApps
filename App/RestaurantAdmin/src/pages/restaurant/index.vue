<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <q-table :rows-per-page-options="[0]" icon-last-page="done" table-colspan="1" grid  :data="ordermesa" row-key="mesa">
        <template v-slot:top>
          <Mesonerotabletop />
        </template>
        <template v-slot:item="props">
        <q-avatar @click="selectedMesa = props.row;$router.push('/restaurant/table')" v-ripple class="q-ma-md cursor-pointer" :size="$q.screen.lt.md ? 'xl' : '100px'" :color="getTableColor(props.row)" text-color="white">{{props.row.mesa}}</q-avatar>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mesonerotabletop from '../../components/restaurant/mesoneroview/mesonerotabletop.vue'

export default {
  components: {
    Mesonerotabletop
  },
  computed: {
    ...mapGetters('order', ['ordersClient', 'selectedmesa', 'ordermesa']),
    selectedMesa: {
      get () {
        return this.selectedmesa
      },
      set (e) {
        this.setOrderMesa(e)
      }
    }
  },
  mounted () {
    // this.bindOrders().catch(e => console.error(e))
  },
  methods: {
    ...mapActions('order', ['bindOrders', 'setOrderMesa']),
    getTableColor (table) {
      if (table.newOrder) {
        return 'red'
      }
      if (table.openTable) {
        return 'green'
      }
      return 'grey'
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="stylus" scoped>
.blink
  animation blink-animation 1s steps(5, start) infinite
  -webkit-animation blink-animation 1s steps(5, start) infinite
@keyframes blink-animation
  to
    visibility hidden

</style>
