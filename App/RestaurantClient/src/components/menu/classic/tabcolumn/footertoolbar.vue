<template>
<q-footer class="bg-primary">
      <q-tabs>
        <q-tab flat
              indicator-color="transparent"
               dense
               round
               key="Menu"
               icon='fas fa-bars'
               name="Menu"
               no-caps
               label="Menu"
               @click="leftDrawerOpen = !leftDrawerOpen"
               exact />
        <q-tab flat
              v-if="$route.name === 'Menu'"
              indicator-color="transparent"
               dense
               round
               @click="leftDrawerCatOpen = !leftDrawerCatOpen"
               key="category"
               icon='category'
               name="category"
               label="Categorías"
               no-caps
               exact />
        <q-tab key="cart" no-caps label="Carrito" @click="$router.push({ path: '/cart/index' })" flat icon="fas fa-shopping-cart" >
          <q-badge color="red" floating>{{getCartQ}}</q-badge>
        </q-tab>
      </q-tabs>
     </q-footer>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('config', ['leftDrawerOp', 'leftDrawerCatOp']),
    ...mapGetters('menu', ['cart']),
    leftDrawerCatOpen: {
      get () {
        return this.leftDrawerCatOp
      },
      set (e) {
        this.leftDrawerCatOpCommit(e)
      }
    },
    leftDrawerOpen: {
      get () {
        return this.leftDrawerOp
      },
      set (e) {
        this.leftDrawerOpCommit(e)
      }
    },
    getCartQ () {
      var amt = 0
      var cart = this.cart
      for (const i in cart) {
        amt = cart[i].quantity + amt
      }
      return amt
    }
  },
  methods: {
    ...mapActions('config', ['leftDrawerOpCommit', 'leftDrawerCatOpCommit'])
  },
  name: 'footertoolbar'
}
</script>
