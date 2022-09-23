<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <div>
    <transition-group
  name="list-complete" tag="div"
 class="row justify-center">
     <ordertable class="col-12 list-complete-item" key="ord0" />

      <div v-if="totalOrders(0) > 0" key="ord1"  :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center col-xs-6 col-sm-6 col-md-4 col-lg-3"  >
      <q-card flat class="notifCard q-cardGlass  q-ma-sm" horizontal>
      <q-card-section class="notifCardSection q-cardtop row justify-center">
        <div class="text-h5 row justify-between col-12">
          <i class="fas fa-tasks col-3" aria-hidden="true"></i>
          <div class="col-3">{{totalOrders(0)}}</div>
        </div>
        <div class="text-subtitle2 self-center text-bold">Por Confirmar </div>
      </q-card-section>
      <q-card-section class="bg-primary q-pa-none">
      <q-card-actions vertical class="q-pt-md">
        <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"

        @click.native="$router.push({ path: '/orders/index', query: { status: 0 } })" />
      </q-card-actions>
      </q-card-section>
        </q-card>
      </div>
      <div v-if="totalOrders(1) > 0" key="ord2" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3" >
      <q-card flat class="notifCard q-cardGlass  q-ma-sm" horizontal>
      <q-card-section  class="notifCardSection q-cardtop row justify-center">
        <div class="text-h5 row justify-between col-12">
          <i class="fas fa-spinner col-3" aria-hidden="true"></i>
          <div class="col-3">{{totalOrders(1)}}</div>
        </div>
        <div class="text-subtitle2 self-center text-bold">En Progreso</div>
      </q-card-section>
      <q-card-section class="bg-primary q-pa-none">
      <q-card-actions  class="q-pt-md" vertical>
        <q-btn color="white" no-caps flat
        icon-right="fa fa-arrow-alt-circle-right"

        @click.native="$router.push({ path: '/orders/index', query: { status: 1 } })" />
      </q-card-actions>
      </q-card-section>
        </q-card>
      </div>
      <div v-if="totalOrders(2) > 0" key="ord3" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3" >
      <q-card flat class="notifCard q-cardGlass  q-ma-sm" horizontal>
      <q-card-section  class="notifCardSection q-cardtop row justify-center">
        <div class="text-h5 row justify-between col-12">
          <q-icon name="delivery_dining" size="md" class="col-3" />
          <!-- <i class="fas fa-spinner col-3"  aria-hidden="true"></i> -->
          <div class="col-3">{{totalOrders(2)}}</div>
        </div>
        <div class="text-subtitle2 self-center text-bold">En vía</div>
      </q-card-section>
      <q-card-section class="bg-primary q-pa-none">
      <q-card-actions  class="q-pt-md" vertical>
        <q-btn color="white" no-caps flat
        icon-right="fa fa-arrow-alt-circle-right"

        @click.native="$router.push({ path: '/orders/index', query: { status: 2 } })" />
      </q-card-actions>
      </q-card-section>
        </q-card>
      </div>
      <div v-if="totalOrders(3) > 0" key="ord4" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(3)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Entregadas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 3} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <div v-if="totalOrders(4) > 0" key="ord5" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(4)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Anuladas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 4} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <div v-if="totalOrders(5) > 0" key="ord6" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(5)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Vencidas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 5} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <div v-if="totalOrders(6) > 0" key="ord7" :class="$q.screen.lt.xs ? 'q-ma-md' : ''" class="list-complete-item text-center header-cell col-xs-6 col-sm-6 col-md-4 col-lg-3">
            <q-card flat  class="notifCard q-cardGlass  q-ma-sm" horizontal>
              <q-card-section  class="notifCardSection q-cardtop row justify-center">
              <div class="text-h5 row justify-between col-12"><i class="fas fa-bell-slash col-3" aria-hidden="true"></i>
              <div class="col-3">{{totalOrders(6)}}</div>
              </div>
              <div class="text-subtitle2 self-center text-bold">Pagadas</div>
             </q-card-section>
           <q-card-section class="bg-primary q-pa-none">
            <q-card-actions class="q-pt-md" vertical>
              <q-btn color="white" no-caps flat icon-right="fa fa-arrow-alt-circle-right"
              @click.native="$router.push({ path: '/orders/index', query: { status: 6} })" />
            </q-card-actions>
           </q-card-section>
          </q-card>
      </div>
      <div class="flex-break" key="ord8"></div>
      <orderVentaT v-show="ordersClient.length" :colors="['#b00', '#666']" key="orderventa" class="list-complete-item graphs col-xs-12 col-sm-12 col-md-12 col-lg-6" />
    <cantidadsemanal v-show="ordersClient.length" key="cantidadsemanal" class="list-complete-item graphs col-xs-12 col-sm-12 col-md-12 col-lg-6" />
    <productos v-show="ordersClient.length" key="productos" class="list-complete-item graphs col-xs-12 col-sm-12 col-md-12 col-lg-12" />
    </transition-group>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    'ordertable': () => import('./orders/index'),
    'orderVentaT': () => import('../components/businessIntelligence/VentasT/index'),
    'productos': () => import('../components/businessIntelligence/productovendidos/index'),
    'cantidadsemanal': () => import('../components/businessIntelligence/semanacantidad/index')
  },
  ...mapActions('order', ['bindOrders']),
  computed: {
    ...mapGetters('order', ['ordersClient']),
    ...mapGetters('client', ['clients'])
  },
  mounted () {
    // this.bindOrders().catch(e => console.error(e))
  },
  methods: {
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
      OrderClient: []

    }
  }
}
</script>
<style lang="stylus">
.graphs
  height: 300px !important
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.totalCard
  width: 30%
.notifCard
  border-radius: 28px
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

</style>
