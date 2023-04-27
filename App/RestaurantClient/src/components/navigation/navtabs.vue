<template>
    <q-tabs inline-label class="bg-grey-8 text-white " content-class="text-bold" no-caps >
                <q-route-tab label="Nuestros Productos" to="/menu/index"  />
                <q-route-tab label="Tus Ordenes" to="/orders/index" />
                <q-route-tab v-if="loc !== 'diga.chopzi.com'" label="Dirección de Entrega" to="/user/address" />
                <q-route-tab label="Encuentranos" to="/findus"  />
                <q-route-tab label="Carrito" to="/cart/index" icon="fas fa-shopping-cart" >
                <q-badge color="red">{{getCartQ}}</q-badge>
                </q-route-tab>
      </q-tabs>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loc: window.location.hostname
    }
  },
  computed: {
    ...mapGetters('menu', ['cart']),
    getCartQ () {
      var amt = 0
      var cart = this.cart
      for (const i in cart) {
        amt = cart[i].quantity + amt
      }
      return amt
    }
  }
}
</script>
