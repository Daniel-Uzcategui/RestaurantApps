<template>
   <div>
      <q-input class="q-pa-lg" :bg-color=" $q.dark.isActive ? 'dark' : 'white'" v-model="searchBar" @input="search" rounded outlined label="Buscar en el Menu" >
         <template v-slot:prepend>
            <q-icon name="fas fa-search" />
         </template>
      </q-input>
      <q-card flat class="menudiv" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
      <q-card-section>
               <div class="fontsize-18 menuTop">Catálogo</div>
               <div class="absolute-bottom-right q-pa-md" >
                  <q-btn v-if="promoData.length || promo" fab color="secondary" :label="promo ? 'Volver' : 'Promociones'" @click="promo = !promo" />
               </div>
            </q-card-section>
        <q-card-section class="wrapel">
         <q-tabs
            v-if="!promo"
            class="wrapel"
            content-class="wrapel"
            >
            <q-tab class="wrapel fontsize-13" content-class="wrapel" v-for="(tabs, index) in categorias"
               :key="index"
               @click="selectedCat=tabs.id; search()">
               {{tabs.name.toLowerCase()}}
            </q-tab>
         </q-tabs>
        </q-card-section>
         <q-card-section v-if="!promo">
           <div class="flex justify-around fontsize-12">
            <q-list @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false" v-for="item in filteredMenu" separator :key="item.id" style="width: 300px;">
               <q-item v-ripple>
                  <q-item-section avatar top>
                     <q-img :src=item.photo width="80px" height="80px" color="primary" text-color="white" class="rounded-borders" />
                  </q-item-section>
                  <q-item-section >
                     <q-item-label lines="5">{{item.name}} </q-item-label>
                     <q-item-label lines="1" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                     <q-item-label lines="1" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-item-label>
                     <q-item-label overline>
                        <q-icon color="yellow" size="0.8em" name="fas fa-star" />
                        5.0
                     </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                     <q-badge style="margin-top: 15px; margin-right: 20px" color="red" floating rounded v-if="item.discount > 0" >-{{item.discount}}%</q-badge>
                     <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                     </q-item-label>
                     <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                     </q-item-label>
                  </q-item-section>
               </q-item>
               <q-separator />
            </q-list>
           </div>
         </q-card-section>
         <q-card-section v-if="promo">
           <div class="flex justify-around fontsize-10">
             <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
            <q-list @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" v-for="item in promoData" separator :key="item.id" style="width: 300px;">
               <q-item v-ripple>
                  <q-item-section avatar top>
                     <q-img :src=item.photo width="80px" color="primary" text-color="white" class="rounded-borders" />
                  </q-item-section>
                  <q-item-section>
                     <q-item-label lines="1">{{item.name}} </q-item-label>
                     <q-item-label lines="1" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                     <q-item-label lines="1" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-item-label>
                     <q-item-label overline>
                        <q-icon color="yellow" size="0.8em" name="fas fa-star" />
                        5.0
                     </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                     <q-item-label :class="item.discount > 0 ? 'text-strike' : false">
                        $ {{parseFloat(item.price).toFixed(2)}}
                        <q-badge color="red" floating rounded v-if="item.discount > 0" >Descuento {{item.discount}}%</q-badge>
                     </q-item-label>
                     <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                     </q-item-label>
                  </q-item-section>
               </q-item>
            </q-list>
           </div>
         </q-card-section>
    </q-card>
      <q-dialog
         v-if="typeof displayVal !== 'undefined' && typeof displayVal.groupComp !== 'undefined'"
         v-model="display"
         persistent
         :maximized="$q.screen.lt.md"
         transition-show="slide-up"
         transition-hide="slide-down"
         @hide="quantity = 0; totSum = 0; required = false; itComp = []"
         @show="quantity = 1;"
         >
         <q-card class="">
            <q-bar>
               <q-space />
               <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                  <q-tooltip v-if="maximizedToggle" content-class=" text-primary">Minimize</q-tooltip>
               </q-btn>
               <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                  <q-tooltip v-if="!maximizedToggle" content-class=" text-primary">Maximize</q-tooltip>
               </q-btn>
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
            <q-img :style="$q.screen.gt.xs ? 'min-width: 500px;' : null" style="border-bottom-left-radius: 50px; max-height: 500px;" v-if="displayVal.photo" contain :src=displayVal.photo />
            <q-card-section class="q-pa-lg row">
               <div class="text-h5 col">
                  {{displayVal.name}}
                  <q-item-label class="text-h6">
                     <q-icon color="yellow" size="1em" name="fas fa-star" />
                     5.0
                  </q-item-label>
               </div>
               <q-icon name="far fa-heart" color="red" class="text-h6"/>
            </q-card-section>
            <q-card-section class="row q-pa-lg">
               <div class="text-h5 col">
                  <q-btn color="grey" @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="fas fa-minus" text-color="white" dense />
                  {{quantity}}
                  <q-btn color="orange" @click="(checkAvail(displayVal.id, displayVal.prodType)[0] === 1) ? quantity++ : false" icon="fas fa-plus" text-color="white" dense >
                     <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0" floating>MAX</q-badge>
                     <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                        <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                     </q-badge>
                  </q-btn>
               </div>
               <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length == 0">
                  $ {{(((parseFloat(displayVal.price).toFixed(2) * (1 - (displayVal.discount/100))) ) * quantity).toFixed(2)}}
                  <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >Descuento {{displayVal.discount}}%</q-badge>
               </q-item-label>
               <q-item-label class="text-h5" v-if="!displayVal.discount && displayVal.groupComp.length == 0">$ {{((parseFloat(displayVal.price).toFixed(2) ) * quantity).toFixed(2) }}</q-item-label>
            </q-card-section>
            <q-card-section class="q-pt-none q-pa-lg" v-html=displayVal.descripcion>
            </q-card-section>
            <q-card-section>
               <itemcomp
                  :comp="displayVal.groupComp"
                  :value="itComp"
                  @update-comp="(e) => {required = e}"
                  @update-tot="(e) => {totSum = e}"
                  />
            </q-card-section>
            <q-card-section class="text-center">
               <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length">
                  Total $ {{(((parseFloat(displayVal.price) * (1 - (displayVal.discount/100)) + totSum ) ) * quantity).toFixed(2)}}
                  <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
               </q-item-label>
               <q-item-label class="text-h5" v-if="!displayVal.discount && displayVal.groupComp.length">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
            </q-card-section>
            <q-card-actions vertical>
               <q-btn v-if="required" @click="addToCart" v-close-popup color="primary">Añadir</q-btn>
               <q-btn v-if="!required" @click="showNotif" color="primary">Añadir</q-btn>
            </q-card-actions>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue')
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos']),
    ...mapGetters('user', ['currentUser']),
    origMenu () {
      return this.menu.reduce((y, x) => {
        if (x.estatus && x.estatus[this.sede]) {
          y.push({
            categoria: x.categoria,
            estatus: x.estatus,
            descripcion: x.descripcion,
            name: x.name,
            photo: x.photo,
            price: x.price,
            id: x.id,
            stock: x.stock,
            discount: x.discount,
            prodType: 0,
            groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
          })
        }
        return y
      }, [])
    },
    promoData () {
      var prom = []
      this.promos.forEach(e => {
        var y = { prods: [] }
        let guard = 0
        e.prods.forEach(i => {
          if (guard) { return }
          var its = this.menu.find(x => x.id === i.id)
          if (typeof its !== 'undefined' && its.estatus[this.sede]) {
            y.prods.push({ id: its.id, name: its.name, photo: its.photo, stock: its.stock, quantity: i.quantity })
          } else {
            y.prods = []
            guard = 1
          }
        })
        y.name = e.name
        y.id = e.id
        y.price = e.price
        y.estatus = e.estatus
        y.descripcion = e.descripcion
        y.prodType = 1
        y.photo = e.photo
        y.groupComp = typeof e.groupComp === 'undefined' ? [] : e.groupComp
        if (y.prods.length && !guard) {
          prom.push(y)
        }
      })
      return prom
    }
  },
  data () {
    return {
      itComp: [],
      totSum: 0,
      required: false,
      promo: 0,
      searchBar: '',
      maximizedToggle: true,
      display: false,
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      displayVal: {},
      quantity: 0,
      filteredMenu: [],
      selectedCat: ''
    }
  },
  created () {
    this.bindMenu().then(() => {
      this.filteredMenu = this.origMenu
    })
    this.bindCategorias()
    this.bindPromos()
    this.bindGroupComp()
  },
  watch: {
    origMenu () {
      this.filteredMenu = this.origMenu
    }
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'bindPromos', 'bindGroupComp']),
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar los campos obligatorios`,
        color: 'red',
        actions: [
          { label: 'X', color: 'white' }
        ]
      })
    },
    search () {
      if (this.selectedCat !== '') {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
        this.filteredMenu = this.filteredMenu.filter(x => {
          return x.categoria.includes(this.selectedCat)
        })
      } else {
        this.filteredMenu = this.origMenu.filter(x => {
          return x.name.toLowerCase().includes(this.searchBar.toLowerCase())
        })
      }
    },
    addToCart () {
      if (this.displayVal.prodType === 0) {
        this.addCart({
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: typeof this.displayVal.discount !== 'undefined' ? parseFloat((this.displayVal.price * (1 - (this.displayVal.discount / 100))).toFixed(2)) : this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prodType: this.displayVal.prodType,
          rewards: 0
        }).then(() => this.$q.notify({
          message: 'Producto Añadido',
          color: 'secondary',
          position: 'bottom'
        })
        )
      } else {
        this.addCart({
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: typeof this.displayVal.discount !== 'undefined' ? parseFloat((this.displayVal.price * (1 - (this.displayVal.discount / 100))).toFixed(2)) : this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prods: this.displayVal.prods,
          prodType: this.displayVal.prodType
        }).then(() => this.$q.notify({
          message: 'Producto Añadido',
          color: 'secondary',
          position: 'bottom'
        })
        )
      }
    },
    checkAvail (id, type) {
      var exists = 0
      if (typeof id === 'undefined' || typeof type === 'undefined') { return false }
      if (type === 0) {
        var counter = this.quantity
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
            return [0, exists]
          } else if (counter > parseInt(product.stock[this.sede])) {
            return [2, exists]
          } else {
            return [1, exists]
          }
        } else { return [0, exists] }
      } else {
        var promotion = this.promoData.find(e => e.id === id)
        if (typeof promotion !== 'undefined') {
          for (let e in promotion.prods) {
            product = promotion.prods[e]
            counter = this.quantity * product.quantity
            inCart = this.cart.filter(x => x.prodId === promotion.prods[e].id)
            inCart.forEach(element => {
              counter = element.quantity + counter
            })
            this.cart.forEach(y => {
              if (typeof y.prods !== 'undefined') {
                var producto = y.prods.find(j => j.id === promotion.prods[e].id)
                if (typeof producto === 'undefined') { producto = { quantity: 0 } }
                counter = (producto.quantity * y.quantity) + counter
              }
            })
            exists = 0
            if (counter) { exists = 1 }

            if (typeof product !== 'undefined') {
              if (counter > parseInt(product.stock[this.sede])) {
                return [2, exists]
              } else if (counter === parseInt(product.stock[this.sede]) || counter + product.quantity > parseInt(product.stock[this.sede])) {
                return [0, exists]
              }
            }
          }
        }
        return [1, exists]
      }
    },
    getMenuItem (id, type) {
      if (type === 0) {
        this.displayVal = this.filteredMenu.find((e) => {
          return e.id === id
        })
        this.displayVal.id = id
      } else {
        this.displayVal = this.promoData.find((e) => {
          return e.id === id
        })
        this.displayVal = { ...this.displayVal, prodType: 1, id: id }
        console.log({ disp: this.displayVal })
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
  .wrapel .no-wrap
    flex-wrap: wrap !important
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
