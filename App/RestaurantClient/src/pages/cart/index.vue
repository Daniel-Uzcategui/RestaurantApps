<template>
  <q-page padding>
        <div class="q-pa-md menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <div class="text-h5 menuTop">Carrito</div>

         <q-list v-for="(item, index) in cart" :key="index" style="width: 100%">
            <q-item>
              <q-item-section>
                  <q-img :src="getProdValById(item.prodId, 'photo')" width="80px" color="primary" text-color="white" class="rounded-borders" />
               </q-item-section>
               <q-item-section>
                  <q-item-label >{{getProdValById(item.prodId, 'name')}}</q-item-label>
                  <q-btn style="width: 50px" size="xs" color="primary" @click="delCartItem(index)" dense>Eliminar</q-btn>
               </q-item-section>
               <q-item-section>
                <q-item-label class="text-h6">
                    <q-btn size="0.5em" color="grey" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)-1)}); (item.quantity < 1) ? modCartVal({id: index, key: 'quantity', value: 1}) : false" icon="fas fa-minus" text-color="white" dense />
                    {{item.quantity}}
                    <q-btn size="0.5em" color="orange" @click=" modCartVal({id: index, key: 'quantity', value: (parseInt(item.quantity)+1)})" icon="fas fa-plus" text-color="white" dense />
                </q-item-label>
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                  <q-select
                    class="full-width"
                    dense
                    label="Extras"
                    filled
                    :value="item.extras"
                    @input="(e) => modCartVal({id: index, key: 'extras', value: e})"
                    use-chips
                    multiple
                    input-debounce="0"
                    @new-value="createValue"
                    :options="listextras"
                    @filter="filterFn"
                    style="width: 250px"
                    map-options
                    emit-value
                    stack-label
                  />
               </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-h6 text-right">
                  <q-item-label>
                    Platos:        {{(parseFloat(getProdValById(item.prodId, 'price')) * item.quantity).toFixed(2)}}
                  </q-item-label>
                  <q-item-label>
                    Extras:     + <u> {{ ((getExtrasTot (item.extras)) * item.quantity).toFixed(2) }} </u>
                  </q-item-label>
                  <q-item-label>
                    SubTotal:      $ {{(parseFloat(getProdValById(item.prodId, 'price') + getExtrasTot (item.extras)) * item.quantity).toFixed(2)}}
                  </q-item-label>
               </q-item-section>
            </q-item>
            <q-separator />
         </q-list>
         <q-list>
          <q-item>
            <q-item-section class="text-h5 text-right">
              <q-item-label>
                        Total Platos: {{getTotalCarrito()[0].toFixed(2)}}
              </q-item-label>
              <q-item-label>
                        Total Extras:  + <u> {{getTotalCarrito()[1].toFixed(2)}} </u>
              </q-item-label>
              <q-item-label>
                        Total: $ {{getTotalCarrito()[2].toFixed(2)}}
              </q-item-label>
            </q-item-section>
          </q-item>
         </q-list>
      </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'modCartVal', 'delCartItem']),
    getExtrasTot (e) {
      var sum = 0
      e.forEach((element) => {
        var extra = this.plainExtras.find(e => e.id === element)
        if (typeof extra === 'undefined') { extra = { price: 0 } }
        sum = parseFloat(extra.price) + sum
      })
      return sum
    },
    getTotalCarrito () {
      var sumProd = 0
      var sumExtra = 0
      this.cart.forEach(e => {
        var prod = this.menu.find(element => element.id === e.prodId)
        if (typeof prod === 'undefined') { prod = { price: 0 } }
        sumProd = (parseFloat(prod.price) * e.quantity) + sumProd

        e.extras.forEach((element) => {
          var extra = this.plainExtras.find(i => i.id === element)
          if (typeof extra === 'undefined') { extra = { price: 0 } }
          sumExtra = (parseFloat(extra.price) * e.quantity) + sumExtra
        })
      })
      return [sumProd, sumExtra, sumProd + sumExtra]
    },
    getProdValById (id, val) {
      var obj = this.menu.find(e => { return e.id === id })
      return obj[val]
    },
    createValue (val, done) {
      if (val.length > 0) {
        if (!this.listextras.includes(val)) {
          this.listextras.push(val)
        }
        done(val, 'toggle')
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.listextras
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.listextras.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
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
