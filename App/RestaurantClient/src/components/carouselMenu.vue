<template>
<div  ref="div1" :class="global_class" :style="global_style" @click="click()" class="background-color">
  <div  ref="div2" :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">{{title}}</div>
  <carousel
      ref="carousel"
      :loop="true"
      navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x text-primary" aria-hidden="true"></i>'
      navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x text-primary" aria-hidden="true"></i>'
      :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
      <slide ref="slide" class="row justify-center" :name="key+'diag'" v-for="(item, key) in filteredMenu" :key="item.id+'diag'" >
        <div  ref="div3" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col" :style="!checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0] ? 'opacity: 0.5;' : ''" >
            <q-card ref="qcardslide" v-ripple @click="checkAvail(item.id, item.prodType, true)[0] ? (display = true, getMenuItem(item.id, 0), dgbg = {'background-color':'#393939'}) : false;" :id="key+'diag'" :class="($q.screen.gt.xs ? 'item-md' : 'item-xs') + ' ' + card_class" class="row justify-center" :style=" card_style || `background-color: #393939;color:#FFFFFF`">
              <div  ref="div4" class="container-photo">
                  <q-img img-class="clasedeimagen" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
              </div>
              <div  ref="div5" class="text-caption">
                  <div  ref="div6" class="text-bold relative-position q-pa-sm">
                    <q-item-label lines="5">{{item.name}} </q-item-label>
                  </div>
              </div>
              <div  ref="div7" class="price-content" >
                  <div  ref="div8">
                    <q-btn color="red" class="absolute-top-right" style="margin-right: -20px;margin-top: -20px;" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                    <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                    </q-item-label>
                    <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                    </q-item-label>
                  </div>
              </div>
              <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0]">*No Disponible*</q-tooltip>
              <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType, true)[1] && !checkAvail(item.id, item.prodType, true)[0]">*Máx en el Carrito*</q-tooltip>
            </q-card>
        </div>
      </slide>
  </carousel>
  <Qdiag
      v-if="dialog"
      :display="display"
      :displayVal2="displayVal"
      :dgbg="dgbg"
      @update-dispval="(e) => displayVal = e"
      @dispchange="(e) => display = e"
      />
</div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import { Carousel, Slide } from './vue-carousel/dist/vue-carousel.min.js'
import Qdiag from './Q-diag-menu.vue'
export default {
  props: {
    title: {
      type: String,
      default: 'Más productos'
    },
    global_class: {
      type: String,
      default: ''
    },
    card_style: {
      type: String,
      default: ''
    },
    card_class: {
      type: String,
      default: ''
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
    dialog: {
      type: Boolean,
      default: () => false
    },
    block_index: {
      type: Number
    },

    child_index: {
      type: Number
    }
  },
  components: {
    Carousel,
    Slide,
    Qdiag
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'sede', 'promos', 'selectedFilter', 'selectedProduct', 'selectedProdType', 'filters']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['menucfg', 'paymentServ']),
    cats () {
      let objs = this.categorias
      return objs.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
    },
    filterop () {
      let filter = this.filters.map(x => x.id)
      if (this.menucfg && this.menucfg.menuactive) {
        filter = ['', ...filter]
      }
      return filter
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
    origMenu () {
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
      loc: window.location.origin,
      dgbg: {},
      rewards: false,
      itComp: [],
      totSum: 0,
      required: false,
      promo: false,
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
      selectedCat: null,
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
    }
  },
  created () {
    // this.bindMenu().then(() => {
    //   console.log('Habemusbind')
    //   this.filteredMenu = this.origMenu
    // }).catch(e => console.error('error fetching data firebase', { e }))
    // this.bindCategorias().then(() => {
    //   console.log({ menudi: this.displayType })
    //   if (!this.displayType) {
    //     this.filteredMenu = this.origMenu.filter((e) => e.categoria.includes(this.filtercat()[0]['id']))
    //     this.selectedCat = this.filtercat()[0]
    //   }
    // })
    // this.bindPromos().then(() => {
    // }).catch(e => console.error('error fetching data firebase', { e }))
    // this.bindGroupComp().catch(e => console.error('error fetching data firebase', { e }))
    this.filteredMenu = this.origMenu
    if (!this.displayType) {
      this.filteredMenu = this.origMenu.filter((e) => e.categoria[this.filtercat()[0]['id']])
      this.selectedCat = this.filtercat()[0]
    }
  },
  watch: {
    origMenu () {
      this.filteredMenu = this.origMenu
    },
    displayVal (e) {
      this.$emit('update-dispval', e)
    }
  },
  mounted () {
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
    filtercat () {
      if (this.selectedFilter === '') { return this.cats } else if (this.filters && this.selectedFilter && this.cats) {
        let thfilter = this.filters.find(e => e.id === this.selectedFilter)
        let filtered = this.cats.filter(x => thfilter.cats.includes(x.id))
        return filtered
      }
      return []
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
            counter = (diag ? 0 : this.quantity) * product.quantity
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
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.q-img__content
  overflow visible !important

.menuphoto-xs
  overflow visible !important
  filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width 72px
  height 72px

.menuphoto-md
  overflow visible !important
  filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  -webkit-filter drop-shadow(-5px 6px 4px rgba(0,0,0,0.5))
  width 95px
  height 95px

.burgericon
  color #000

.carticon
  color #000

.toggleicon
  color #000

.wrapel
  .no-wrap
    -ms-flex-wrap wrap !important
    flex-wrap wrap !important

.menu-div
  border-top-left-radius 50px
  border-top-right-radius 50px
  border-bottom-left-radius 50px
  border-bottom-right-radius 50px

.text-content
  min-width 100px
  position relative
  margin-left 5px

.item-xs
  color #000
  border-radius 20px
  width 90px !important
  height 200px
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.item-md
  color #000
  border-radius 20px
  width 124px !important
  height 250px
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.item-content-md
  margin-left 20%
  width 166px
  height 300px
  text-align center

.item-content-xs
  margin-left 20%
  width 130px
  height 230px
  text-align center

.price-content
  display -webkit-box
  display -ms-flexbox
  display flex
  -webkit-box-pack center
  -ms-flex-pack center
  justify-content center
  -webkit-box-align center
  -ms-flex-align center
  align-items center
  text-align center !important
  width 100%

.header-title
  height 5%
  margin-left 5%
  padding-top 5%

.background-color
  margin 40px auto
  border-radius 20px
  width 90% !important
  height 60%
  background-color #e0dada
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)

.header-tabs
  padding-top 30px
  padding-bottom 20px

.container-photo
  width 100%
  padding-left 45%
  padding-top 25%

.prbut
  z-index 10
  position fixed
  top 50%
  right 0
  -webkit-transform rotate(-90deg)
  -ms-transform rotate(-90deg)
  transform rotate(-90deg)
  margin-right -40px

.promo
  padding-top 3%

.list-complete-item
  -webkit-transition all 1s
  -o-transition all 1s
  transition all 1s

.list-complete-enter
  opacity 0
  -webkit-transform translateY(30px)
  -ms-transform translateY(30px)
  transform translateY(30px)

.list-complete-leave-to
  -webkit-transition all 0s
  -o-transition all 0s
  transition all 0s
  opacity 0

.list-complete-leave-active
  position absolute

.VueCarousel-navigation-prev
  left 30px !important
.VueCarousel
  padding-top 20px
  overflow hidden
.VueCarousel-navigation-next
  right 30px !important
.VueCarousel-wrapper
  overflow visible
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
