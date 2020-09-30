<template>
   <div>
      <q-input v-if="false" class="q-pa-lg" :bg-color=" $q.dark.isActive ? 'dark' : 'white'" v-model="searchBar" @input="search" rounded outlined label="Buscar en el Menu" >
         <template v-slot:prepend>
            <q-icon name="fas fa-search" />
         </template>
      </q-input>
      <q-card flat class="menu-div2" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
         <q-card-section class="q-pt-xl">
            <div class="fontsize-18 header-title">{{rewards ? 'Recompensas': promo ? 'Promociones' : 'Catálogo'}}</div>
            <div class="absolute-bottom-right" >
               <q-btn-group push>
                  <q-btn v-if="pointsCat && Object.keys(pointsCat).length  && !promo" color="primary" icon="fas fa-gift" :label="rewards ? 'Volver' : ''" @click="rewards = !rewards" />
                  <q-btn v-if="(promoData.length || promo)  && !rewards" color="secondary" icon="fab fa-creative-commons-nc" :label="promo ? 'Volver' : ''" @click="promo = !promo" />
               </q-btn-group>
            </div>
         </q-card-section>
         <q-card-section class="wrapel flex flex-center" >
            <!---Seccion catalogo --->
            <q-tabs vertical
               v-if="!promo && !rewards"
               class="wrapel "
               content-class="wrapel"
               >
               <div class="wrapel background-color" content-class="wrapel"  v-for="(tabs, index) in categorias"
                  :key="index">
                  <div class="header-tabs text-left text-bold text-h5">{{tabs.name}}</div>
                  <q-card-section v-if="!promo && !rewards">
                     <carousel
                        navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" aria-hidden="true"></i>'
                        navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" aria-hidden="true"></i>'
                        :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[480, 2], [768, 4]]">
                        <slide :name="key"  @click.native="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 0)) : false" v-for="(item, key) in filteredMenu" separator :key="item.id" >
                           <div class="item-content">
                              <div :id="key" class="item row" :style="[{'background-color':tabs.color},{'color': tabs.textcolor},transition]">
                                 <div class="container-photo">
                                    <q-img :src=item.photo width="80px" height="80px" color="primary" text-color="white" class="menuphoto" />
                                 </div>
                                 <div class="text-content">
                                    <div class="text-bold relative-position">
                                       <q-item-label lines="5">{{item.name}} </q-item-label>
                                       <q-item-label lines="3" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                                       <q-item-label lines="3" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-item-label>
                                    </div>
                                 </div>
                                 <div class="price-content" >
                                    <div>
                                       <q-badge color="red" rounded v-if="item.discount > 0" >-{{item.discount}}%</q-badge>
                                       <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                       </q-item-label>
                                       <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                       </q-item-label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </slide>
                     </carousel>
                  </q-card-section>
               </div>
               <q-separator vertical class="menuseparator" />
            </q-tabs>
         </q-card-section>
         <!--- Fin Seccion catalogo --->
         <q-card-section v-if="!promo && rewards">
            <div class="flex justify-around text-h7">
               <q-list @click="checkAvail(item.id, item.prodType)[0] && checkAvailReward(item)[1] ? (display = true, getMenuItem(item.id, 0, 1)) : false" v-for="item in filteredMenu"
                  v-show="pointsCat && Object.keys(pointsCat).some(r=> item.categoria.includes(r))" separator :key="item.id" style="width: 300px;">
                  <q-item v-ripple >
                     <q-item-section avatar top>
                        <q-img :src=item.photo width="80px" height="80px" color="primary" text-color="white" class="rounded-borders" />
                     </q-item-section>
                     <q-item-section  class="text-bold relative-position">
                        <q-item-label lines="5">{{item.name}} </q-item-label>
                        <q-item-label lines="1" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                        <q-item-label lines="1" v-if="(checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]) || (!checkAvailReward(item)[1] && checkAvailReward(item)[2])">*Máx en el Carrito*</q-item-label>
                        <!--
                           <q-item-label overline>
                              <q-icon color="yellow" size="0.8em" name="fas fa-star" />
                              5.0
                           </q-item-label> !-->
                     </q-item-section>
                     <q-item-section side>
                        <q-item-label >$ 0.00
                        </q-item-label>
                     </q-item-section>
                  </q-item>
                  <q-separator />
               </q-list>
            </div>
         </q-card-section>
         <!-- Seccion de promociones -->
         <q-card-section v-if="promo && !rewards">
            <div class="flex justify-around text-h7 background-color promo">
               <p v-if="!promoData.length" class="text-h5">No hay promociones Disponibles en este momento</p>
               <q-list @click="checkAvail(item.id, item.prodType)[0] ? (display = true, getMenuItem(item.id, 1)) : false" v-for="item in promoData" :key="item.id" >
                  <div class="item-content">
                     <div class="item row" :style="[{'background-color':'#ffd538'},{'color': '#000000'}]">
                        <div class="container-photo">
                           <q-img :src=item.photo width="80px" color="primary" text-color="white" class="rounded-borders" />
                        </div>
                        <div class="text-content">
                           <div class="text-bold relative-position">
                              <q-item-label lines="1">{{item.name}} </q-item-label>
                              <q-item-label lines="1" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-item-label>
                              <q-item-label lines="1" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-item-label>
                           </div>
                        </div>
                        <div class="price-content" >
                           <div>
                              <q-item-label :class="item.discount > 0 ? 'text-strike' : false">
                                 $ {{parseFloat(item.price).toFixed(2)}}
                                 <q-badge color="red" floating rounded v-if="item.discount > 0" >Descuento {{item.discount}}%</q-badge>
                              </q-item-label>
                              <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                              </q-item-label>
                           </div>
                        </div>
                     </div>
                  </div>
               </q-list>
            </div>
         </q-card-section>
      </q-card>
      <q-dialog
         v-if="typeof displayVal !== 'undefined' && typeof displayVal.groupComp !== 'undefined'"
         v-model="display"
         persistent
         maximized
         transition-show="slide-up"
         transition-hide="slide-down"
         @hide="quantity = 0; totSum = 0; required = false; itComp = []"
         @show="quantity = 1;"
         >
         <q-card>
            <q-bar class="bg-transparent">
               <q-space />
               <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
            <q-card-section horizontal style="margin-right: 20vmin">
               <q-card-section>
                  <div style="background-color: yellow; border-radius: 30px;">
                     <div class="dialogphoto">
                        <q-img class="menuphoto" :style="$q.screen.gt.xs ? 'min-width: 500px;' : null" style="border-bottom-left-radius: 50px; max-height: 500px;" v-if="displayVal.photo" contain :src=displayVal.photo />
                     </div>
                  </div>
                  <div class="q-pa-lg">
                     <div class="text-h5 flex flex-center">
                        <div>
                           <q-btn class="q-ma-lg" color="dark" round @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="remove" text-color="white" dense />
                           <q-btn class="q-pl-lg q-pr-lg" color="white" rounded text-color="black" :label="quantity" />
                           <q-btn class="q-ma-lg" color="dark" round @click="(checkAvail(displayVal.id, displayVal.prodType, rewards)[0] === 1 && checkAvailReward(displayVal)[0]) ? quantity++ : false" icon="add" text-color="white" dense >
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !checkAvailReward(displayVal)[0]" floating>MAX</q-badge>
                              <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                                 <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                              </q-badge>
                           </q-btn>
                        </div>
                     </div>
                     <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length == 0">
                        $ {{(((parseFloat(displayVal.price).toFixed(2) * (1 - (displayVal.discount/100))) ) * quantity).toFixed(2)}}
                        <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >Descuento {{displayVal.discount}}%</q-badge>
                     </q-item-label>
                     <q-item-label class="text-h5" v-if="!displayVal.discount && displayVal.groupComp.length == 0">$ {{((parseFloat(displayVal.price).toFixed(2) ) * quantity).toFixed(2) }}</q-item-label>
                  </div>
               </q-card-section>
               <q-card-section class="q-pa-lg">
                  <div class="text-h4">
                     {{displayVal.name}}
                  </div>
                  <div class="q-pt-lg text-h5 text-grey" style="letter-spacing: 0.094em; line-height: 35px;" v-html=displayVal.descripcion>
                  </div>
                  <div class="row justify-between q-pa-none">
                     <div class="q-pt-md">
                        <q-item-label v-if="displayVal.discount > 0 && displayVal.groupComp.length">
                           Total $ {{(((parseFloat(displayVal.price) * (1 - (displayVal.discount/100)) + totSum ) ) * quantity).toFixed(2)}}
                           <q-badge color="red" floating rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
                        </q-item-label>
                        <q-item-label class="text-h6" v-if="!displayVal.discount && displayVal.groupComp.length">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
                     </div>
                     <q-card-actions vertical>
                        <q-btn class="q-pl-md q-pr-md" v-if="required" @click="addToCart(rewards)" rounded v-close-popup color="primary" no-caps>Agregar al carrito</q-btn>
                        <q-btn class="q-pl-md q-pr-md" v-if="!required" @click="showNotif" rounded color="primary" no-caps>Agregar al carrito</q-btn>
                     </q-card-actions>
                  </div>
                  <itemcomp
                  class="q-pt-xl"
                  :comp="displayVal.groupComp"
                  :value="itComp"
                  @update-comp="(e) => {required = e}"
                  @update-tot="(e) => {totSum = e}"
                  />
               </q-card-section>
            </q-card-section>
            <q-card-section>
            </q-card-section>
         </q-card>
      </q-dialog>
   </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import { Carousel, Slide } from 'vue-carousel'
export default {
  components: {
    'itemcomp': () => import('../../components/itemComp.vue'),
    Carousel,
    Slide
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
    pointsCat () {
      console.log({ User: this.currentUser })
      var obj = this.currentUser === null || typeof this.currentUser.pointsCat === 'undefined' ? [] : this.currentUser.pointsCat
      var objout = Object.keys(obj).reduce((p, c) => {
        if (obj[c] >= 10) { p[c] = obj[c] }
        return p
      }, {})
      console.log({ objout })
      return objout
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
      rewards: false,
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
      selectedCat: '',
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
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
    addToCart (rew) {
      if (this.displayVal.prodType === 0) {
        var toCart = {
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: typeof this.displayVal.discount !== 'undefined' ? parseFloat((this.displayVal.price * (1 - (this.displayVal.discount / 100))).toFixed(2)) : this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prodType: this.displayVal.prodType,
          category: this.displayVal.categoria
        }
        if (rew) { toCart = { ...toCart, reward: rew } }
        this.addCart(toCart).then(() => this.$q.notify({
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
    checkAvailReward (item) {
      if (!this.rewards) { return [true, true] }
      console.log({ item })
      var available = 0
      var available2 = 0
      var quant = this.quantity ? this.quantity + 1 : 2
      var counter = 1
      var exists = 0
      var inCart = this.cart.filter(x => x.prodId === item.id && x.reward)
      inCart.forEach(element => {
        counter = element.quantity + counter
      })
      if (counter > 1) { exists = 1 }
      quant = quant + counter - 1
      var categories = item.categoria
      var rewardCategories = typeof this.pointsCat === 'undefined' ? [] : Object.keys(this.pointsCat)
      var intersection = categories.filter(x => rewardCategories.includes(x))
      for (var cat of intersection) {
        var points = this.pointsCat[cat]
        console.log({ points })
        if ((points - (quant * 10)) >= 0) {
          console.log({ points, quant })
          available++
        }
        if ((points - (counter * 10)) >= 0) {
          console.log({ points, quant })
          available2++
        }
      }
      console.log({ available, available2 })
      return [available, available2, exists]
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
    getMenuItem (id, type, reward) {
      reward = typeof reward === 'undefined' ? 0 : reward
      if (type === 0) {
        this.displayVal = this.filteredMenu.find((e) => {
          return e.id === id
        })
        this.displayVal.id = id
        if (reward) {
          this.displayVal.price = 0
          this.displayVal.reward = 1
        }
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
    },
    leftArrow () {
      if (this.current > 0) {
        this.current = this.current - 1
      } else {
        this.current = this.numProducts - 3
      }
      console.log(this.current)
      // $(".carrusel").animate({"left": -($('#product_'+current).position().left)}, 600);
    },
    rightArrow () {
      console.log(this.numProducts)
      console.log(this.current)
      if (this.numProducts > this.current + 3) {
        this.current = this.current + 1
        console.log(this.current)
      } else {
        this.current = 0
      }
      // $(".carrusel").animate({"left": -($('#product_'+current).position().left)}, 600);
      console.log(this.current)
    },
    transition (key) {
      return {
        transform: 'translate(212px)'
      }
    }
  }
}
</script>

<style lang="stylus">
  .menuphoto
    -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  .burgericon
    color: black !important
  .carticon
    color: black !important
  .toggleicon
    color: black !important
  .wrapel .no-wrap
    flex-wrap: wrap !important
  .menu-div
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
  .text-content
    min-width 100px
    position relative
    margin-left 5px
 .item
    color: black
    border-radius: 20px
    width: 124px !important
    height: 250px
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
 .item-content
    width: 166px
    height: 300px
    text-align: center
.price-content
    display: flex
    justify-content: center
    align-items: center
    text-align: center !important
    width: 100%
.header-title
    height 5%
    margin-left 5%
    padding-top 5%
.background-color
    margin:10px auto;
    border-radius: 20px
    width: 90% !important
    height: 60%
    background-color: #e0dada
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
.header-tabs
    padding-left: 20px
    padding-top: 20px
.container-photo
    width: 100%
    padding-left: 45%
    padding-top: 25%
.promo
    padding-top: 3%
.left-arrow
    position:absolute;
    left:10px;
    z-index:1;
    top:50%;
    margin-top:-9px;
.right-arrow
    position:absolute;
    right:10px;
    z-index:1;
    top:50%;
    margin-top:-9px;
 /* ------------------------Tablets & Mobiles ---------------------------*/
@media (max-width: 991px)
 .background-color
    margin:40px auto;
    border-radius: 20px
    width: 90% !important
    height: 90%
    background-color: #e0dada
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
@media (max-width: 660px)
  .background-color
    margin:40px auto;
    border-radius: 20px
    width: 90% !important
    height: 100%
    background-color: #e0dada
    box-shadow: -4px 8px 18px rgba(0,0,0,.1)
</style>
