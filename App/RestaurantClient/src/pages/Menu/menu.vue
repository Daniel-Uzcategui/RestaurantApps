<template>
   <div @click="click()" :class="global_class" :style="global_style">
      <!-- <q-btn label="activar rewards" @click="viewRewards = !viewRewards"></q-btn> -->

      <q-card flat :class="mobileGreatView !== 2 ? 'menu-div2 q-cardGlass q-mt-xl q-pb-md' : ''" >
      <q-card-section
      class="column items-center"
          v-if="!(typeof this.sede === 'undefined' || this.sede === null) && mobileGreatView !== 2"
      >
        <q-input filled
          v-model="searchBar" debounce="1000" rounded outlined label="Buscar" >
          <template v-slot:prepend>
              <q-icon name="fas fa-search" />
          </template>
        </q-input>
      </q-card-section>
          <!-- :rewards="rewards" -->
         <menu-filter
          v-if="mobileGreatView !== 2"
          :selectedFilter="selectedFilter"
          :menucfg="menucfg"
          :sede="sede"
          :filterFindName="filterFindName(selectedFilter)"
          :pointsCat="pointsCat"
          :paymentServ="paymentServ"
          @nextDisp="nextDisp()"
          :filters="filters"
          @nextFilter="nextFilter()"
         />
          <!-- @rewards="rewards = !rewards" -->
         <q-card-section class="row justify-center" v-if="menuLoading">
           <q-spinner
              color="primary"
              size="md"
            />
         </q-card-section>
         <q-card-section class="wrapel q-pa-none q-ma-none">
           <div v-if="displayType == 1"
               class="wrapel "
               >
              <q-img :height="$q.platform.mobile ? '150px' : 'auto'" :src="bannerMenu.desktopbanner"
              />
               <div class="wrapel" v-show="filteredMenuCat(tabs.id).length" :class="$q.dark.isActive ? 'background-color q-cardGlass' : 'background-color'" content-class="wrapel"  v-for="tabs in filtercat"
                  :key="tabs.id">
                  <div :class="$q.screen.gt.sm ? 'text-left text-h5 q-pl-xl' : 'text-center'" class="header-tabs text-bold">{{tabs.name}}</div>
                  <q-card-section class="q-pa-none q-ma-none" v-if="!promo">
                     <carousel
                        :loop="true"
                        navigationNextLabel='<i class="fas fa-chevron-circle-right fa-2x" style="padding-left: -15px; z-index: 10000;" aria-hidden="true"></i>'
                        navigationPrevLabel='<i class="fas fa-chevron-circle-left fa-2x" style="padding-right: -15px; z-index: 10000;" aria-hidden="true"></i>'
                        :paginationEnabled="false" :navigationEnabled="true" :perPageCustom="[[320, 2], [375, 2], [830, 3], [1080, 4]]" >
                        <slide class="row justify-center" v-for="(item, key) in filteredMenuCat(tabs.id)" :key="item.id" >
                           <div v-if="typeof item.not === 'undefined'">
                              <div  style="z-index: 1" :class="$q.screen.gt.xs ? 'item-content-md' : 'item-content-xs'" class="col relative-position" :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                                 <q-card v-ripple @click="dgbg = {'background-color':tabs.color};checkAvail(item.id, item.prodType)[0] ? (displayPermit(), getMenuItem(item.id, 0)) : false" :id="key" :class="$q.screen.gt.xs ? 'item-md' : 'item-xs'" class="row justify-center" :style="[{'background-color':tabs.color},{'color': tabs.textcolor}]">
                                    <div class="container-photo">
                                       <q-img style="z-index: 1000" :class="$q.screen.gt.xs ? 'menuphoto-md' : 'menuphoto-xs'" :src="item.photo" color="primary"  text-color="white"/>
                                    </div>
                                    <div class="text-caption">
                                       <div class="text-bold relative-position q-pa-sm">
                                          <q-item-label lines="5">{{item.name}} </q-item-label>
                                       </div>
                                    </div>
                                    <div v-if="item.price !== undefined" class="price-content" >
                                       <div v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                                         <q-btn color="red" class="absolute-top-right" style="margin-right: -20px;margin-top: -20px;" round v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                                          </q-item-label>
                                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                                          </q-item-label>
                                       </div>
                                       <div v-else>
                                         <q-item-label>{{item.pricerange}}
                                          </q-item-label>
                                       </div>
                                    </div>
                                    <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                                    <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                                 </q-card>
                              </div>
                           </div>
                        </slide>
                     </carousel>
                  </q-card-section>
               </div>
               <q-separator vertical class="menuseparator" />
            </div>
           <div v-if="displayType == 0">
             <menutype-0
              @tabs="(e) => {selectedCat=e; search(); searchBarCommit('')}"
              :selectedCat="selectedCat"
              :checkAvail="checkAvail"
              :sede="sede"
              @hook:mounted="selectedCat=filtercat[0]"
              :filtercat="filtercat"
              :filteredMenuCat="filteredMenuCat(selectedCat ? selectedCat.id : '')"
              @productSelect="(e) => {dgbg = {'background-color':selectedCat.color};checkAvail(e.id, e.prodType)[0] ? (displayPermit(), getMenuItem(e.id, 0)) : false}" />
            </div>
            <div v-if="displayType == 3">
              <menutype-4
              @tabs="(e) => {selectedCat=e; search(); searchBarCommit('')}"
              :selectedCat="selectedCat"
              :checkAvail="checkAvail"
              @hook:mounted="selectedCat=filtercat[0]"
              :sede="sede"
              :filtercat="filtercat"
              :filteredMenuCat="filteredMenuCat(selectedCat ? selectedCat.id : '')"
              @productSelect="(e) => {dgbg = {'background-color':selectedCat.color};checkAvail(e.id, e.prodType)[0] ? (displayPermit(), getMenuItem(e.id, 0)) : false}" />
            </div>
            <div v-if="displayType == 2">
            <div class="column items-center">
            <q-select
            clearable
            style="max-width: 480px; min-width: 320px"
            v-if="!(typeof this.sede === 'undefined' || this.sede === null)"
            :options="filtercat"
            rounded
            outlined
            :value="selectedCat !== null ? selectedCat : ''"
            label="Categorías"
            :options-value="(item) => item === null ? null : item"
            :option-label="(item) => item === null ? 'Null value' : item.name"
            @input="(e) => {selectedCat=e; search(); searchBarCommit('')}"
            emit-value
            map-options
            />
            <div style="max-width: 600px">
               <q-list v-if="selectedCat !== null"  separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':selectedCat.color};checkAvail(item.id, item.prodType)[0] ? (displayPermit(), getMenuItem(item.id, 0, undefined, true)) : false"
                     v-for="item in filteredMenuCat(selectedCat !== null ? selectedCat.id : filtercat ? filtercat[0] ? filtercat[0].id : '' : '')" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && item.price !== undefined && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                          </q-item-label>
                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-btn color="green" rounded v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                        </q-item-section>
                        <q-item-section v-else>
                          <q-item-label>{{item.pricerange}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="fas fa-chevron-right" />
                        </q-item-section>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </q-item>
               </q-list>
               <div v-if="selectedCat === null">
               <div v-show="filteredMenuCat(tabs.id).length" v-for="(tabs, indx) in filtercat" :key="indx" >
                 <p class="text-bold text-grey q-ma-md">{{tabs.name}}</p>
               <q-list separator>
                  <q-item v-ripple
                     @click.native="dgbg = {'background-color':tabs.color};checkAvail(item.id, item.prodType)[0] ? (displayPermit(), getMenuItem(item.id, 0, undefined, true)) : false"
                     v-for="item in filteredMenuCat(tabs.id)" :key="item.id"
                     style="min-height: 70px"
                     :style="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0] ? 'opacity: 0.5;' : ''" >
                        <q-item-section>
                          <q-item-label class="text-bold" lines="5">{{item.name}} </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-item-label :class="item.discount > 0 ? 'text-strike' : false">$ {{parseFloat(item.price).toFixed(2)}}
                          </q-item-label>
                          <q-item-label v-if="item.discount > 0">$ {{(parseFloat(item.price).toFixed(2) * (1 - (item.discount/100))).toFixed(2)}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-if="item && (typeof item.pricerange === 'undefined' || item.pricerange === '')">
                          <q-btn color="green" rounded v-if="item.discount > 0">-{{item.discount}}%</q-btn>
                        </q-item-section>
                        <q-item-section v-else>
                          <q-item-label>{{item.pricerange}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="fas fa-chevron-right" />
                        </q-item-section>
                     <q-tooltip :hide-delay="650" v-if="!checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*No Disponible*</q-tooltip>
                     <q-tooltip :hide-delay="650" v-if="checkAvail(item.id, item.prodType)[1] && !checkAvail(item.id, item.prodType)[0]">*Máx en el Carrito*</q-tooltip>
                  </q-item>
               </q-list>
               </div>
               </div>
            </div>
            </div>
            </div>
            <div v-if="displayType == 4">
            <menutype-5
              :display="display"
              @tabs="(e) => {selectedCat=e; search(); searchBarCommit('')}"
              :selectedCat="selectedCat"
              :checkAvail="checkAvail"
              @hook:mounted="selectedCat=filtercat[0]"
              :sede="sede"
              :filtercat="filtercat"
              :filteredMenuCat="filteredMenuCat(selectedCat ? selectedCat.id : '')"
              @productSelect="(e) => {dgbg = {'background-color':selectedCat.color};checkAvail(e.id, e.prodType)[0] ? (displayPermit(), getMenuItem(e.id, 0)) : false}" />
            </div>
         </q-card-section>
         <!-- Seccion de promociones -->
      </q-card>
      <q-dialog-menu
      style="z-index: 9999999"
      :display="display"
      :displayVal2="displayVal"
      :dgbg="dgbg"
      @update-dispval="(e) => displayVal = e"
      @dispchange="(e) => display = e"
      />
   </div>
</template>
<script>
import Fuse from 'fuse.js'
import { mapActions, mapGetters } from 'vuex'
import menuFilter from '../../components/menu/classic/menuFilter.vue'
import Menutype0 from '../../components/menu/classic/menutype0.vue'
import Menutype4 from '../../components/menu/classic/menutype4.vue'
import Menutype5 from '../../components/menu/classic/menutype5.vue'
import menumix from '../../mixins/menu'
// import store from '../../store/index'
import { Carousel, Slide } from '../../components/vue-carousel/dist/vue-carousel.min.js'
import { debounce } from 'quasar'
export default {
  // store,
  mixins: [menumix],
  props: {
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
    'q-dialog-menu': () => import('../../components/Q-diag-menu.vue'),
    Carousel,
    Slide,
    menuFilter,
    Menutype0,
    Menutype4,
    Menutype5
  },
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'rewards', 'selectedFilter', 'selectedProduct', 'selCat', 'selectedProdType', 'filters']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['menucfg', 'paymentServ', 'configurations', 'menuDispType', 'searchBarState', 'mobileGreatView', 'bannerMenu']),
    searchBar: {
      get () {
        return this.searchBarState
      },
      set (e) {
        this.searchBarCommit(e)
      }
    },
    cats () {
      return this.categorias
    },
    filterop () {
      let filter = this.filters.map(x => x.id)
      if (this.menucfg && this.menucfg.menuactive) {
        filter = ['', ...filter]
      }
      return filter
    },
    displayType: {
      get () {
        if (this.menuDispType !== null) {
          return this.menuDispType
        }
        if (this.typeDisplay !== null) {
          return parseInt(this.typeDisplay)
        }
        if (this.menucfg && this.menucfg.displayType) {
          return this.menucfg.displayType
        }
        return 0
      },
      set (e) {
        this.setMenuDispType(e)
      }
    },
    themeMode: {
      get () {
        // if (this.menucfg && this.menucfg.themeMode === 0) {
        //   return this.menucfg.themeMode
        // }
        return 1
      }
    },
    filtercat () {
      const { selectedFilter, cats, filters
      // , viewRewards, origMenu
      } = this
      let elcat = cats
      // if (viewRewards) {
      //   elcat = cats.filter(x => {
      //     for (let i of filteredMenuCat(selectedCat ? selectedCat.id : '')) {
      //       console.log(i)
      //       if (i.categoria.includes(x.id)) {
      //         return true
      //       }
      //     }
      //     return false
      //   })
      //   console.log({ elcat })
      // }
      if (selectedFilter === '') { return elcat }
      if (filters && selectedFilter && elcat) {
        let thfilter = filters.find(e => e.id === selectedFilter)
        let filtered = typeof thfilter !== 'undefined' ? elcat.filter(x => thfilter?.cats.includes(x.id)) : []
        return filtered
      }
      return []
    },
    catWithProd () {
      const { cats, filteredMenu } = this
      return cats.filter(x => {
        for (let i of filteredMenu) {
          let solve = i.categoria[x.id]
          if (solve) {
            return true
          }
          return false
        }
      })
    },
    origMenu () {
      const { menu, viewRewards, sede } = this
      if (menu.length) {
        return menu.reduce((y, x) => {
          if (x.estatus && x.estatus[sede]) {
            let price = { price: x.price }
            if (viewRewards) {
              price = { price: 0, reward: true }
            }
            y.push({
              categoria: x.categoria,
              estatus: x.estatus,
              descripcion: x.descripcion,
              descripcioncolor: x.descripcioncolor,
              name: x.name,
              photo: x.photo,
              pricerange: x.pricerange,
              photomulti: x.photomulti,
              photosmall: x.photosmall,
              ...price,
              id: x.id,
              stock: x.stock,
              discount: x.discount,
              prodType: 0,
              disptype: x.disptype,
              priority: parseInt(x.priority ? x.priority : 1000),
              groupComp: typeof x.groupComp === 'undefined' ? [] : x.groupComp
            })
          }
          return y.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
        }, [])
      } else return []
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
      viewRewards: false,
      menuLoading: true,
      loc: window.location.origin,
      dgbg: {},
      // rewards: false,
      itComp: [],
      totSum: 0,
      required: false,
      promo: false,
      maximizedToggle: true,
      display: false,
      displayVal: {},
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      quantity: 0,
      selectedCat: null,
      current: 0,
      numProducts: 7,
      displayProducts: true,
      slide: 1
    }
  },
  created () {
    if (this.Sede !== '') {
      this.setSede(this.Sede)
    }
    if (this.sede === null) {
      this.$router.push('/')
    }
  },
  watch: {
    searchBar () {
      this.search()
    },
    Sede (e) {
      this.setSede(e)
    },
    menu () {
      this.menuLoading = false
      this.filteredMenu = this.origMenu
      if (!parseInt(this.selectedProdType)) {
        this.productSelected()
      }
    },
    categorias () {
      if (!this.displayType) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria[this.filtercat[0]['id']]) : []
        this.selectedCat = this.filtercat[0]
      }
    },
    origMenu () {
      this.filteredMenu = this.origMenu
    },
    filtercat () {
      if (this.displayType === 0 || this.displayType === 3) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria[this.filtercat[0]['id']]) : []
        this.selectedCat = this.filtercat[0]
      }
    },
    display (e) {
      if (!e) {
        this.displayVal = {}
      }
    }
  },
  mounted () {
    this.afterbinding()
    this.$emit('click-edit', {
      block_info: {
        block_index: this.block_index, child_index: this.child_index
      },
      props_info: {
        ...this._props
      }
    })
  },
  methods: {
    ...mapActions('menu', ['bindMenu', 'bindItem', 'addCart', 'bindCategorias', 'setSede', 'bindRewards', 'bindGroupComp', 'setFilter', 'setProduct', 'setProdType']),
    ...mapActions('config', ['setMenuDispType', 'searchBarCommit']),
    filterFindName (x) {
      let found = this.filters.find(e => e.id === x)
      return typeof found === 'undefined' ? 'Catálogo' : found.name
    },
    afterbinding () {
      // menu
      this.menuLoading = false
      this.filteredMenu = this.origMenu
      if (!parseInt(this.selectedProdType)) {
        this.productSelected()
      }
      // cat
      if (!this.displayType) {
        this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria[this.filtercat[0]['id']]) : []
        this.selectedCat = this.filtercat[0]
      }
      if (this.selCat !== '') {
        let selected = this.filtercat.find(x => x.id === this.selCat)
        this.selectedCat = selected
        console.log({ selected })
      }
      // promo
      if (parseInt(this.selectedProdType)) {
        this.productSelected()
      }
      this.bindRewards().catch(e => {
        console.error('error fetching data firebase', { e })
      })
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
    nextDisp () {
      console.log(this.themeMode, this.menucfg, this.displayType)
      if (this.themeMode === 0) {
        if (this.displayType === this.menucfg.displayType && this.$q.platform.is.mobile) {
          this.displayType = 2
        } else {
          this.displayType = this.menucfg.displayType
          if (this.displayType === 1) {
            this.selectedCat = null
            this.search()
          }
        }
        return
      }
      if (this.displayType === 4) {
        this.displayType = 0
        this.selectedCat = this.filtercat[0]
      } else {
        if (!this.$q.platform.is.mobile && this.displayType === 1) {
          this.displayType = this.displayType + 2
        } else {
          this.displayType = this.displayType + 1
        }
        this.selectedCat = this.filtercat[0]
      }
      if (this.displayType === 1) {
        this.selectedCat = null
        this.search()
      }
    },
    productSelected () {
      if (this.selectedProduct && this.selectedProduct !== '') {
        try {
          this.getMenuItem(this.selectedProduct, parseInt(this.selectedProdType))
          this.displayPermit()
        } catch (e) {
          console.error(e)
          this.$q.notify({
            message: `Disculpe, el producto no se encuentra disponible en este momento`,
            color: 'red',
            actions: [
              { label: 'X', color: 'white' }
            ]
          })
          this.setProduct('')
          this.setProdType('')
        }
        this.setProduct('')
        this.setProdType('')
      }
    },
    nextFilter () {
      let index = this.filterop.findIndex((e) => e === this.selectedFilter)
      if (typeof this.filterop[index + 1] === 'undefined') {
        this.setFilter(this.filterop[0])
        if (!this.displayType) {
          this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria[this.filtercat[0]['id']]) : []
          this.selectedCat = this.filtercat[0]
        }
      } else {
        this.setFilter(this.filterop[index + 1])
        if (!this.displayType) {
          this.filteredMenu = this.origMenu ? this.origMenu.filter((e) => e && e.categoria && e.categoria[this.filtercat[0]['id']]) : []
          this.selectedCat = this.filtercat[0]
        }
      }
    },
    filteredMenuCat (e) {
      console.time('start')
      let canShowPrice = this.displayPermitValue()
      let filtered = []
      const { viewRewards, rewards } = this
      let searchBar = this.searchBar
      function filter (x) {
        if (searchBar !== '') {
          return true
        }
        if (viewRewards) {
          return x && x.categoria && x.categoria[e] && rewards[0].products.includes(x.id)
        }
        return x && x.categoria && x.categoria[e]
      }
      if (Array.isArray(this.filteredMenu)) {
        filtered = this.filteredMenu.filter(x => filter(x))
        for (let item of filtered) {
          // item.checkAvail = this.checkAvail(item.id, item.prodType)
          if (!canShowPrice) {
            delete item.price
          }
        }
      } else {
        filtered = [{ id: 'kkfkff', not: true }]
      }
      console.timeEnd('start')
      return filtered
    },
    search () {
      debounce(this.debouncedSearch(), 1000, true)
    },
    debouncedSearch () {
      const options = {
        includeScore: true,
        keys: [{ name: 'name', weight: 1 }],
        threshold: 0.4
      }
      let fuse = new Fuse(this.origMenu, options)
      this.filteredMenu = this.origMenu
      if (this.selectedCat !== null) {
        fuse = new Fuse(this.filteredMenu, options)
      }
      if (this.searchBar.length) {
        this.filteredMenu = fuse.search(this.searchBar).map(x => { return { ...x.item } })
      }
      console.log(this.filteredMenu)
    },
    displayPermitValue () {
      let permit = this.menucfg?.priceActive ?? true
      if (permit) {
        return permit
      }
      if (this.currentUser?.rol?.includes('Vendedor')) {
        return true
      }
      return false
    },
    displayPermit () {
      let permit = this.displayPermitValue()
      this.display = permit
    },
    getMenuItem (id, type, reward, easydiag) {
      reward = typeof reward === 'undefined' ? 0 : reward
      if (type === 0) {
        this.displayVal = JSON.parse(JSON.stringify(this.filteredMenu.find((e) => {
          return e.id === id
        })))
        console.log({ dv: this.displayVal, id })
        this.displayVal.id = id
        this.displayVal.easydiag = easydiag
        if (reward) {
          this.displayVal.price = 0
          this.displayVal.reward = 1
        }
      }
    }
  }
}
</script>

<style lang="stylus" >
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
  margin-right 5%
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
  padding unset !important
  margin-right unset !important
.VueCarousel
  padding-top 20px
  overflow hidden
.VueCarousel-navigation-next
  right 30px !important
  padding unset !important
  margin-left unset !important
.VueCarousel-wrapper
  overflow visible
@media (max-width: 991px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 90%
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)

@media (max-width: 660px)
  .background-color
    margin 40px auto
    border-radius 20px
    width 90% !important
    height 100%
    -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
    box-shadow -4px 8px 18px rgba(0,0,0,0.1)
</style>
