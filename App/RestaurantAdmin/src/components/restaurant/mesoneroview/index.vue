<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <q-table :rows-per-page-options="[0]" icon-last-page="done" table-colspan="1" grid  :data="ordermesa" row-key="mesa">
        <template v-slot:top>
          <Mesonerotabletop />
        </template>
        <template v-slot:item="props">
        <q-avatar @click="selectedMesa = props.row;$router.push('/restaurant/table')" class="q-ma-md" :size="$q.screen.lt.md ? 'xl' : '100px'" :color="getTableColor(props.row)" text-color="white">{{props.row.mesa}}</q-avatar>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mesonerotabletop from './mesonerotabletop.vue'

export default {
  components: {
    Mesonerotabletop
  },
  ...mapActions('order', 'bindOrders', 'setOrderMesa'),
  computed: {
    ...mapGetters('order', ['ordersClient', 'selectedmesa', 'ordermesa']),
    ...mapGetters('client', ['clients']),
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
    getTableColor (table) {
      if (table.newOrder) {
        return 'red'
      }
      if (table.openTable) {
        return 'green'
      }
      return 'grey'
    },
    totalOrders (value) {
      console.log(this.ordersClient, 'ordsd')
      var totalOrder = this.ordersClient.filter(obj => {
        return obj.status === value
      })
      return totalOrder.length
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
