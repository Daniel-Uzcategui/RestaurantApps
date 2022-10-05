import { mapActions, mapGetters } from 'vuex'
export default {
  data () {

  },
  computed: {
    ...mapGetters('menu', ['filterMenu', 'cart', 'sede']),
    filteredMenu: {
      get () {
        return this.filterMenu
      },
      set (e) {
        this.setFilterMenu(e)
      }
    }
  },
  created () {

  },

  methods: {
    ...mapActions('menu', ['setFilterMenu']),
    checkAvail (id, type, diag) {
      console.time('factorial test2')
      var exists = 0
      if (typeof id === 'undefined' || typeof type === 'undefined') { return false }
      if (type === 0) {
        var counter = diag ? 0 : this.quantity
        var inCart = this.cart.filter(x => x.prodId === id)
        var product = this.filteredMenu.find(x => x.id === id)
        inCart.forEach(element => {
          counter = element.quantity + counter
        })
        this.cart.forEach(y => {
          if (typeof y.prods !== 'undefined') {
            var producto = y.prods.find(j => j.id === product.id)
            if (typeof producto === 'undefined') { producto = { quantity: 0 } }
            counter = producto.quantity * y.quantity + counter
          }
        })
        if (counter) { exists = 1 }
        if (typeof product !== 'undefined' && typeof product.stock !== 'undefined' && typeof product.stock[this.sede] !== 'undefined') {
          if (counter === parseInt(product.stock[this.sede])) {
            console.timeEnd('factorial test2')
            return [0, exists]
          } else if (counter > parseInt(product.stock[this.sede])) {
            console.timeEnd('factorial test2')
            return [2, exists]
          } else {
            console.timeEnd('factorial test2')
            return [1, exists]
          }
        } else {
          console.timeEnd('factorial test2')
          return [0, exists]
        }
      }
    }
  }
}
