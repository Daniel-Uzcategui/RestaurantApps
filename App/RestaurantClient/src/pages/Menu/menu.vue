<template>
      <div>
         <q-input class="q-pa-lg" v-model="searchBar" @input="search" rounded outlined label="Buscar en el Menu" >
           <template v-slot:prepend>
          <q-icon name="fas fa-search" />
        </template>
        </q-input>
        <div class="bg-white q-pa-md menudiv">
            <div class="text-h6 menuTop">Menu</div>
        <q-tabs
          dense
          class="bg-white"
        >
          <q-tab v-for="(tabs, index) in categorias"
          :key="index"
          @click="selectedCat=tabs.id; search()">
          {{tabs.name.toLowerCase()}}
          </q-tab>
        </q-tabs>
         <q-list v-for="item in filteredMenu" class="bg-white" :key="item.id" style="width: 100%">
              <q-item>
                <q-item-section avatar top>
                  <q-img :src=item.photo width="80px" color="primary" text-color="white" class="rounded-borders" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{item.name}} </q-item-label>
                  <q-item-label overline><q-icon color="yellow" size="0.8em" name="fas fa-star" /> 5.0</q-item-label>
                  <q-btn style="width: 50px" size="xs" color="primary" @click="display = true; getMenuItem(item.id)" dense>Añadir</q-btn>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>$ {{parseInt(item.price).toFixed(2)}}</q-item-label>
                </q-item-section>
              </q-item>
         </q-list>
         </div>
         <q-dialog
            v-model="display"
            persistent
            :maximized="maximizedToggle"
            transition-show="slide-up"
            transition-hide="slide-down"
            @hide="quantity = 1; disExtras = []"
          >
          <q-card class="bg-white">
            <q-bar>
              <q-space />

              <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </q-bar>
            <img style="border-bottom-left-radius: 50px;" :src=displayVal.photo>
            <q-card-section class="q-pa-lg row">
              <div class="text-h5 col">{{displayVal.name}}
              <q-item-label class="text-h6"><q-icon color="yellow" size="1em" name="fas fa-star" /> 5.0</q-item-label></div>
              <q-icon name="far fa-heart" color="red" class="text-h6"/>
            </q-card-section>
            <q-card-section class="row q-pa-lg">
              <div class="text-h5 col">
              <q-btn color="grey" @click="quantity--; (quantity < 0) ? (quantity = 0) : false" icon="fas fa-minus" text-color="white" dense />
              {{quantity}}
              <q-btn color="orange" @click="quantity++" icon="fas fa-plus" text-color="white" dense />
              </div>
              <q-item-label class="text-h5">$ {{parseInt(displayVal.price).toFixed(2)}}</q-item-label>
            </q-card-section>
            <q-card-section>
              <q-select
                label="Extras"
                filled
                v-model="disExtras"
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
            </q-card-section>
            <q-card-section class="q-pt-none q-pa-lg" v-html=displayVal.descripcion>
            </q-card-section>
            <q-card-actions vertical>
              <q-btn @click="addToCart" color="primary">Añadir</q-btn>
            </q-card-actions>
          </q-card>
    </q-dialog>
      </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
    ...mapGetters('user', ['currentUser'])
  },
  data () {
    return {
      searchBar: '',
      maximizedToggle: true,
      display: false,
      disExtras: [],
      selected: [],
      popupEditData: '',
      photoType: '',
      photoUpload: false,
      displayVal: {},
      quantity: 1,
      filteredMenu: [],
      origMenu: [],
      selectedCat: ''
    }
  },
  mounted () {
    this.bindMenu().then(() => {
      this.origMenu = this.filteredMenu = this.menu.map(x => {
        return {
          categoria: x.categoria,
          estatus: x.estatus,
          name: x.name,
          photo: x.photo,
          price: x.price,
          id: x.id
        }
      })
    })
  },
  methods: {
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
      console.log(this.displayVal, 'diiiiiissss')
      this.addCart({
        prodId: this.displayVal.id,
        quantity: this.quantity,
        extras: this.disExtras
      }).then(() => this.$q.notify({
        message: 'Producto Añadido',
        color: 'secondary'
      })
      )
    },
    getMenuItem (id) {
      console.log(id, 'iiiiiddd')
      this.displayVal = this.filteredMenu.find((e) => {
        return e.id === id
      })
      this.displayVal.id = id
    },
    ...mapActions('menu', ['bindMenu', 'addCart']),
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
