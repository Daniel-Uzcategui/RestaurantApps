<template>
<q-dialog
         v-if="typeof displayVal !== 'undefined' && typeof displayVal.groupComp !== 'undefined'"
         :value="display"
         @input="(e) => $emit('dispchange', e)"
         persistent
         :maximized="!displayVal.easydiag"
         transition-show="slide-up"
         transition-hide="slide-down"
         @hide="quantity = 0; totSum = 0; required = false; itComp = []"
         @show="
              quantity = 1
              itComp = []
              valTime = false
              valTime2 = false
              orderDate = null
              orderDate2 = null
              addload = null
              addId = null
              addId2 = null"
         >
         <diaginput v-if="displayVal.easydiag" :quantity="displayVal.stock[sede]" :available="checkAvail(displayVal.id, displayVal.prodType)[2]" @hide="$emit('dispchange', false)" @Submit="diagSubmit" >
               <q-btn class="absolute-top-right" icon="close" no-caps color="primary" flat v-close-popup />
         </diaginput>
         <q-card
         v-else
          class="q-fullscreen-glassMorph"
          style="width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          >
            <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 2001" dense flat icon="fas fa-chevron-left" @click="$emit('dispchange', false)" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
            <top @up="quantityUp(displayVal)"
              @down="quantityDown(displayVal)"
              :displayVal="displayVal"
              :quantity="quantity"
              :checkMax="checkMax(displayVal)"
              :checkAlert="checkAlert(displayVal)"
              :itComp="itComp"
              :requiredA="requiredA"
              :dgbg="dgbg"
              :totSum="totSum"
              @addtocart="addToCart(displayVal.reward)"
              @copyClip="copyToClip()"
              @showNotif="showNotif()"
              @update-comp="(e) => {required = e}"
              @update-tot="(e) => {totSum = e}"
              />
            <q-card-section class="q-pa-none q-ma-none" v-if="displayVal.disptype == 1">
               <itemcomp
                  :discount="displayVal.discount"
                  :mode="1"
                  class="q-pt-xl"
                  :comp="displayVal.groupComp"
                  :value="itComp"
                  @update-comp="(e) => {required = e}"
                  @update-tot="(e) => {totSum = e}"
                  />
            </q-card-section>
            <q-card-section class="q-pa-none q-pt-xl column items-center" v-if="typeof displayVal.disptype === 'undefined' && !$q.screen.gt.sm ? true : displayVal.disptype == 0 && !$q.screen.gt.sm">
              <div>
                <q-btn size="md" class="q-mr-lg" color="primary" round @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="remove" text-color="white" dense />
                <q-btn size="md"  :class="'q-pl-'+ $q.screen.name + ' q-pr-' + $q.screen.name" color="white" rounded text-color="black" :label="quantity" />
                <q-btn size="md"  class="q-ml-lg" color="primary" round @click="(checkAvail(displayVal.id, displayVal.prodType, rewards)[0] === 1 && checkAvailReward(displayVal)[0]) ? quantity++ : false" icon="add" text-color="white" dense >
                  <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !checkAvailReward(displayVal)[0]" floating>MAX</q-badge>
                  <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                      <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                  </q-badge>
                </q-btn>
              </div>
              <div >
              <q-btn class="q-pl-md q-pr-md q-mt-lg" v-if="requiredA" @click="addToCart(displayVal.reward)" rounded v-close-popup color="primary" no-caps>Agregar al carrito</q-btn>
              <q-btn class="q-pl-md q-pr-md q-mt-lg" v-if="!requiredA" @click="showNotif" rounded color="primary" no-caps>Agregar al carrito</q-btn>
              </div>
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? false : displayVal.disptype == 1">
               <div class="column items-center">
                  <div style="max-width: 300px; min-width: 40vmin; border-radius: 28px; background-color: #FFD63D" class="q-pa-xl">
                     <div class="text-h6 text-center"> Cantidad </div>
                     <div class="q-pt-lg flex flex-center">
                        <q-btn class="q-mr-lg" color="primary" round @click="quantity--; (quantity < 1) ? (quantity = 1) : false" icon="remove" text-color="white" dense />
                        <q-btn :class="'q-pl-'+ $q.screen.name + ' q-pr-' + $q.screen.name" color="white" rounded text-color="black" :label="quantity" />
                        <q-btn  class="q-ml-lg" color="primary" round @click="(checkAvail(displayVal.id, displayVal.prodType, rewards)[0] === 1 && checkAvailReward(displayVal)[0]) ? quantity++ : false" icon="add" text-color="white" dense >
                           <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !checkAvailReward(displayVal)[0]" floating>MAX</q-badge>
                           <q-badge color="red" v-if="checkAvail(displayVal.id, displayVal.prodType)[0] == 2" floating style="left: 10px; right: auto;">
                              <q-icon name="fas fa-exclamation-circle" size="15px" color="white" />
                           </q-badge>
                        </q-btn>
                     </div>
                     <div class="column items-center">
                        <div  class="q-pt-md">
                           <div class="text-h6" v-if="displayVal.discount > 0">
                              Total <span class="text-strike"> {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }} </span> $ {{(((parseFloat(displayVal.price + totSum) * (1 - (displayVal.discount/100)) ) ) * quantity).toFixed(2)}}
                              <q-badge color="green" rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
                           </div>
                           <q-item-label class="text-h6" v-if="!displayVal.discount">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
                        </div>
                        <div class="q-pt-lg" >
                           <q-btn class="q-pl-md q-pr-md" v-if="requiredA" @click="addToCart(displayVal.reward)" rounded v-close-popup color="primary" no-caps>Agregar al carrito</q-btn>
                           <q-btn class="q-pl-md q-pr-md" v-if="!requiredA" @click="showNotif" rounded color="primary" no-caps>Agregar al carrito</q-btn>
                        </div>
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? false : displayVal.disptype == 2">
              <div class="q-pt-md">
                       <div class="row justify-center">
                       <q-card class="q-pa-xl q-ma-md col-6" style="border-radius: 28px; min-width: 320px">
                        <div class="text-h5">¿Para cuando quiere el servicio de pickup?</div>
                         <orderdate v-model="orderDate" @validated="(e) => valTime = e" />
                           <p class="text-center text-red text-bold text-caption" v-if="!valTime">* Campo obligatorio</p>
                       </q-card>
                       <q-card class="q-pa-xl col-6 q-ma-md" style="border-radius: 28px; min-width: 320px">
                         <div class="text-h5">¿Para cuando quiere el servicio de entrega?</div>
                         <orderdate v-model="orderDate2" @validated="(e) => valTime2 = e" />
                           <p class="text-center text-red text-bold text-caption" v-if="!valTime2">* Campo obligatorio</p>
                       </q-card>
                       </div>
                       <div class="row justify-center">
                    <q-card class="q-pa-md q-ma-md" style="border-radius: 28px;">
                      <p class="text-bold text-center">Dirección pickup</p>
                      <addresses @stoploading="addload = true" @invalid-address="(e) => validAddress = e" :noload="addload" class="col-6" style="min-width: 320px" v-model="addId"/>
                      <p class="text-center text-red text-bold text-caption" v-if="!addId">* Campo obligatorio</p>
                      <p class="text-center text-red text-bold text-caption" v-if="(this.addId !== null && this.addId === this.addId2)">* Dirección de pickup no puede ser igual que la de Entrega </p>
                    </q-card>
                    <q-card class="q-pa-md q-ma-md" style="border-radius: 28px;">
                      <p class="text-bold text-center">Dirección de Entrega</p>
                      <addresses @stoploading="addload = true" @invalid-address="(e) => validAddress2 = e" :noload="addload" class="col-6" style="min-width: 320px" v-model="addId2"/>
                      <p class="text-center text-red text-bold text-caption" v-if="!addId2">* Campo obligatorio</p>
                      <p class="text-center text-red text-bold text-caption" v-if="(this.addId !== null && this.addId === this.addId2)">* Dirección de pickup no puede ser igual que la de Entrega </p>
                    </q-card>
                       </div>
                  </div>
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? false : displayVal.disptype == 2">
               <div class="column items-center">
                  <div style="max-width: 300px; min-width: 40vmin; border-radius: 28px; background-color: #FFD63D" class="q-pa-xl">
                     <div class="column items-center">
                        <div  class="q-pt-md">
                           <div class="text-h6" v-if="displayVal.discount > 0">
                              Total <span class="text-strike"> {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }} </span> $ {{(((parseFloat(displayVal.price + totSum) * (1 - (displayVal.discount/100)) ) ) * quantity).toFixed(2)}}
                              <q-badge color="green" rounded v-if="displayVal.discount > 0" >-{{displayVal.discount}}%</q-badge>
                           </div>
                           <q-item-label class="text-h6" v-if="!displayVal.discount">Total $ {{(((parseFloat(displayVal.price) + totSum ) ) * quantity).toFixed(2) }}</q-item-label>
                        </div>
                        <div class="q-pt-lg" vertical >
                           <q-btn class="q-pl-md q-pr-md" v-if="requiredA" @click="addToCart(displayVal.reward)" rounded v-close-popup color="primary" no-caps>Agregar al carrito</q-btn>
                           <q-btn class="q-pl-md q-pr-md" v-if="!requiredA" @click="showNotif" rounded color="primary" no-caps>Agregar al carrito</q-btn>
                        </div>
                     </div>
                  </div>
               </div>
            </q-card-section>
            <q-card-section v-if="typeof displayVal.disptype === 'undefined' ? true : displayVal.disptype == 0">
               <carouselmenu
               @update-dispval="(e) => {displayVal = e; itComp = []; quantity = 1}"
               />
            </q-card-section>
         </q-card>
      </q-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { copyToClipboard } from 'quasar'
import carouselmenu from './carouselMenu.vue'
import itemcomp from './itemComp'
import addresses from './addresses'
import orderdate from './orderDate'
import Top from './menu/classic/qdiagtop.vue'
import diaginput from './menu/list/input.vue'
export default {
  name: 'q-dialog-menu',
  props: {
    dgbg: {
      type: Object,
      default: () => {}
    },
    display: {
      type: Boolean,
      default: () => false
    },
    displayVal2: {
      type: Object,
      default: () => {}
    },
    global_class: {
      type: String,
      default: 'col'
    },
    global_style: {
      type: String,
      default: ''
    },
    Sede: {
      type: String,
      default: ''
    },
    typeDisplay: {
      type: String,
      default: null
    },
    block_index: {
      type: Number
    },

    child_index: {
      type: Number
    }
  },
  components: {
    carouselmenu,
    itemcomp,
    addresses,
    orderdate,
    Top,
    diaginput
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos', 'selectedFilter', 'selectedProduct', 'selectedProdType', 'filters']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['menucfg', 'paymentServ', 'configurations']),
    requiredA () {
      if (typeof this.displayVal.disptype === 'undefined' || parseInt(this.displayVal.disptype) !== 2) {
        return this.required
      } else {
        return this.required && this.valTime && this.valTime2 && this.addId && this.addId2 && (this.addId !== this.addId2) && this.validAddress && this.validAddress2
      }
    },
    configDates () {
      let cfg = this.configurations.find(e => e.id === 'sede' + this.sede)
      return cfg
    },
    filtercat () {
      if (this.selectedFilter === '') { return this.cats } else if (this.filters && this.selectedFilter && this.cats) {
        let thfilter = this.filters.find(e => e.id === this.selectedFilter)
        let filtered = this.cats.filter(x => thfilter.cats.includes(x.id))
        if (typeof filtered !== 'undefined') {
          return filtered
        }
        return []
      }
      return []
    },
    displayVal: {
      get () {
        return this.displayVal2
      },
      set (e) {
        this.$emit('update-dispval', e)
      }
    },
    cats () {
      let objs = this.categorias
      return objs.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    },
    displayType () {
      if (this.typeDisplay !== null) {
        return parseInt(this.typeDisplay)
      }
      if (this.menucfg && this.menucfg.displayType) {
        return this.menucfg.displayType
      }
      return 0
    },
    filteredMenu () {
      return this.menu.reduce((y, x) => {
        if (x.estatus && x.estatus[this.sede]) {
          y.push({
            categoria: x.categoria,
            estatus: x.estatus,
            descripcion: x.descripcion,
            descripcioncolor: x.descripcioncolor,
            name: x.name,
            photo: x.photo,
            photomulti: x.photomulti,
            price: x.price,
            id: x.id,
            stock: x.stock,
            discount: x.discount,
            prodType: 0,
            disptype: x.disptype,
            groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
          })
        }
        return y
      }, [])
    },
    pointsCat () {
      var obj = this.currentUser === null || typeof this.currentUser.pointsCat === 'undefined' ? [] : this.currentUser.pointsCat
      var objout = Object.keys(obj).reduce((p, c) => {
        if (obj[c] >= 10) { p[c] = obj[c] }
        return p
      }, {})
      return objout
    }
  },
  data () {
    return {
      validAddress: true,
      validAddress2: true,
      valTime: false,
      valTime2: false,
      orderDate: null,
      orderDate2: null,
      addload: null,
      addId: null,
      addId2: null,
      loc: window.location.origin,
      rewards: false,
      itComp: [],
      dispupdate: {},
      totSum: 0,
      required: false,
      promo: false,
      maximizedToggle: true,
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      quantity: 0,
      // filteredMenu: [],
      selectedCat: null,
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
    }
  },
  // watch: {
  //   origMenu () {
  //     this.filteredMenu = this.origMenu
  //   }
  // },
  created () {
    console.log('created diag')
  },
  mounted () {
    this.displayVal = this.displayVal2
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...this._props
      }
    })
    if (this.Sede !== '') {
      this.setSede(this.Sede)
    }
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'addCart', 'bindCategorias', 'setSede', 'bindPromos', 'bindGroupComp', 'setFilter', 'setProduct', 'setProdType']),
    diagSubmit (qty) {
      this.quantity = qty
      this.addToCart(this.displayVal.reward)
      this.$emit('dispchange', false)
    },
    checkMax (displayVal) {
      return this.checkAvail(displayVal.id, displayVal.prodType)[0] === 0 || !this.checkAvailReward(displayVal)[0]
    },
    checkAlert (displayVal) {
      return this.checkAvail(displayVal.id, displayVal.prodType)[0] === 2
    },
    quantityUp (displayVal) {
      if (this.checkAvail(displayVal.id, displayVal.prodType, this.rewards)[0] === 1 && this.checkAvailReward(displayVal)[0]) {
        this.quantity++
      }
    },
    quantityDown () {
      this.quantity--
      if (this.quantity < 1) {
        this.quantity = 1
      }
    },
    click () {
      this.$emit('click-edit', {
        block_info: {
          block_index: this.block_index, child_index: this.child_index
        },
        props_info: {
          ...this._props
        }
      })
    },
    copyToClip () {
      let toClip = this.loc + '/#/menu/index?j=' + this.displayVal.prodType + '&t=' + this.displayVal.id + (this.selectedFilter !== '' ? '&q=' + this.selectedFilter : '')
      copyToClipboard(toClip)
        .then(() => {
          this.$q.notify({
            message: `URL Copiado al Clipboard`,
            color: 'positive'
          })
        })
        .catch(() => {
          this.$q.notify({
            message: `Error copiando url al Clipboard`,
            color: 'positive'
          })
        })
    },
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar los campos obligatorios`,
        color: 'red',
        actions: [
          { label: 'X', color: 'white' }
        ]
      })
    },
    addToCart (rew) {
      if (this.displayVal.prodType === 0) {
        var toCart = {
          photo: this.displayVal.photosmall || this.displayVal.photo,
          prodId: this.displayVal.id,
          name: this.displayVal.name,
          prodPrice: this.displayVal.price,
          quantity: this.quantity,
          items: this.itComp,
          prodType: this.displayVal.prodType,
          category: this.displayVal.categoria
        }
        if (rew) { toCart = { ...toCart, reward: rew } }
        if (parseInt(this.displayVal.disptype) === 2) {
          toCart = {
            ...toCart,
            datePickup: this.orderDate,
            dateShipping: this.orderDate2,
            addressPickup: this.addId,
            addressShipping: this.addId2,
            dispType: 2
          }
        }
        this.addCart(toCart).then(() => {
          this.$q.notify({
            message: 'Producto Añadido',
            color: 'secondary',
            position: 'bottom'
          })
          this.$forceUpdate()
        }
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
        }).then(() => {
          this.$q.notify({
            message: 'Producto Añadido',
            color: 'secondary',
            position: 'bottom'
          })
          this.$forceUpdate()
        }
        )
      }
      console.log({ cart: this.cart })
    },
    checkAvailReward (item) {
      if (!this.rewards) { return [true, true] }
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
        if ((points - (quant * 10)) >= 0) {
          available++
        }
        if ((points - (counter * 10)) >= 0) {
          available2++
        }
      }
      return [available, available2, exists]
    },
    checkAvail (id, type, diag) {
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
        // console.log({ product, filter: this.filteredMenu, id })
        if (typeof product !== 'undefined' && typeof product.stock !== 'undefined' && typeof product.stock[this.sede] !== 'undefined') {
          // console.log(counter, parseInt(product.stock[this.sede]))
          if (counter === parseInt(product.stock[this.sede])) {
            return [0, exists, 0]
          } else if (counter > parseInt(product.stock[this.sede])) {
            return [2, exists, 0]
          } else {
            let disp = parseInt(product.stock[this.sede]) - counter
            return [1, exists, disp]
          }
        } else { return [0, exists] }
      }
    }
  }
}
</script>
<style lang="stylus">
.fullscreen
  z-index 2000
.q-img__content
  overflow visible !important
.diagphcont
  z-index 999
  overflow visible !important
  min-width 205.75px
  min-height 186.15px
  width 26.25vmin
  height 23.75vmin
  background-color #ffd63d
  border-radius 30px

.diagphcont2
  z-index 999
  overflow visible !important
  margin auto
  min-width 184.52px
  min-height 184.52px
  width 23vmin
  position relative

.diagph
  z-index 999
  overflow visible !important
  min-width 184.52px
  min-height 184.52px
  width 100%
  position absolute
  top -50%
  filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(0px 35px 20px rgba(0,0,0,0.5))

.background-color
  margin 40px auto
  border-radius 20px
  width 90% !important
  height 60%
  background-color #e0dada
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.promo
  padding-top 3%
@media (max-width: 991px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 90%
    background-color #e0dada
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)

@media (max-width: 660px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 100%
    background-color #e0dada
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)
</style>
