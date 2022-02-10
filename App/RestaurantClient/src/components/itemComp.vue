<template>
  <div >
    <div v-if="readOnly">
        <q-list dense v-for="(items, indice) in value" :key="indice">
          <q-item v-if="indice === 0" v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption text-bold">Descripción </div>
            </q-item-section>
            <q-item-section class="text-caption text-center text-bold">
              <q-item-label lines="3">Opción</q-item-label>
            </q-item-section>
            <q-item-section class="text-caption text-right text-bold">
              <q-item-label>Precio</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="indice === 0" />
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">{{getComponent(items.component, 'name')}} </div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{items.quantity > 1 ? items.quantity + ' x ' : null}} {{getItem(items.item, 'name')}}</q-item-label>
            </q-item-section>
            <q-item-section class="text-right">
              <q-item-label v-if="!getComponent(items.component, 'free')" caption>+ $ {{roundNumber(readOnlyPrice(items) * quantity)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>
    <div class="row justify-center" v-if="!readOnly">
      <q-spinner
        v-if="!groupComp.length && comp.length"
        :size="$q.screen.name"
        color="primary"
      />
    <div :class="mode == 1 ? 'q-cardGlass itemcompback q-ma-md q-pa-lg col-5' : ''" style="min-width: 300px" v-for="(component, index) in Group" :key="index">
      <div v-if="component.type === 1">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list dense :dark="mode == 1" class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio :dark="mode == 1" :value="value.length ? JSON.stringify(value.find(x => x['component'] === component.id)) : ''" @input="(x) => {radioInput(x)}" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id, component_name: component.name, name: items.name }) : JSON.stringify({ item: items.id, price: 0, component: component.id, component_name: component.name, name: items.name })" color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>+ $ {{roundNumber(readOnlyPrice(items))}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="component.type === 0">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <div class="text-caption" v-if="component.min > 0">Mínimo {{component.min}}</div>
        <div class="text-caption" v-if="component.max">Máximo en Total {{component.max}}</div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list dense :dark="mode == 1" class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox dense
                :dark="mode == 1"
                checked-icon="fas fa-dot-circle"
                unchecked-icon="fas fa-circle"
                icon="fas fa-circle"
                @input="(x,e)=> checkBoxInput({ component: component.id, component_name: component.name, item: items.id, price: items.price, name: items.name }, e, x)"
                :value="value.length ? (typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined') ? true : false : false"
                :disable="value.findIndex(el => el.item === items.id && el.component === component.id)===(-1) && value.filter(x => x['component'] === component.id).length >= component.max"
                color="secondary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>+ $ {{roundNumber(readOnlyPrice(items))}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="component.type === 2">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <div class="text-caption" v-if="component.min > 0">Mínimo {{component.min}}</div>
        <div class="text-caption" v-if="component.max">Máximo en Total {{component.max}}</div>
        <div class="text-caption" v-if="component.max > component.maxUnit">Máximo por Elemento {{component.maxUnit}}</div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list dense :dark="mode == 1" v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section style="min-width: 100px">
              <q-slider
                :color="mode == 1 ? 'positive' : 'primary'"
                :dark="mode == 1"
                @input="(x)=> qSliderInput({ component: component.id, component_name: component.name, item: items.id, price: items.price, name: items.name }, x)"
                :value="getValueInput(value, component, items)"
                label-always
                :min="0"
                :max="qSliderMax(component, items)"
                :step="1"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section v-if="!component.free" >
              <q-item-label caption>+ $ {{roundNumber(readOnlyPrice(items))}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="component.type === 3">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div>
        <div class="text-caption" v-if="component.min > 0">Mínimo {{component.min}}</div>
        <div class="text-caption" v-if="component.max > component.maxUnit">Máximo Total {{component.max}}</div>
        <div class="text-caption" v-if="component.max > component.maxUnit">Máximo por Elemento {{component.maxUnit}}</div>
         </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list class="q-mt-md" dense :dark="mode == 1" v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section style="min-width: 100px">

              <q-item-section :class="$q.screen.lt.md ? 'col column' : ''">
                <q-item-label class="text-h6 row justify-between">
                  <div class="text-weight-thin col-6">{{getValueInput(value, component, items)}}</div>
                  <div class="relative-position col-6">
                  <q-btn-group v-if="!item.reward"  style="transform: rotateZ(90deg); height: 20px ; border-radius: 0.5em">
                    <q-btn @click="sumValueInput(value, component, items, 1)" size="0.4em" class="q-pl-xs" color="secondary" icon="fas fa-chevron-left" text-color="white" dense >
                    </q-btn>
                     <div size="0.3em" color="primary" text-color="black" label="│" dense/>
                    <q-btn @click="sumValueInput(value, component, items, -1)" size="0.4em" class="q-pr-xs" color="secondary" icon="fas fa-chevron-right" text-color="white" dense />
                  </q-btn-group>
                  <div style="top: -200%; position: absolute">
                    <q-badge color="red" v-if="item.avail === 0" style="">max</q-badge>
                      <q-badge color="red" v-if="item.avail == 2" style=""><q-icon name="fas fa-exclamation-circle" size="15px" color="red" /></q-badge>
                  </div>
                </div>
                </q-item-label>
               </q-item-section>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section v-if="!component.free" >
              <q-item-label caption>+ $ {{roundNumber(readOnlyPrice(items))}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
  </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    mode: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      default: 1
    },
    discount: {
      type: Number,
      default: 0
    },
    comp: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters('menu', ['item', 'groupComp']),
    Group () {
      var group = []
      var comp = Array.from(this.comp)
      var groupComp = Array.from(this.groupComp)
      if (!comp.length) {
        return []
      }
      comp.forEach(element => {
        var grp = groupComp.find(x => x.id === element)
        if (typeof groupComp !== 'undefined' && typeof grp !== 'undefined') {
          var items = this.item.filter(x => x && x.group_id && x.group_id.includes(grp.group_id))
          items = items.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
          group.push({ ...grp, id: element, items })
        }
      })
      return group.sort((a, b) => a.priority - b.priority)
    },
    checkReqAll () {
      if (typeof this.value !== 'undefined' && this.comp.length) {
        for (let e of this.Group) {
          // console.log(e, 'checking')
          var items = this.value.filter(x => e.id === x.component)
          switch (true) {
            case (e.type === 0):
              if ((e.required && items.length < e.min) || (!e.required && items.length > 0 && items.length < e.min)) {
                return [false, this.Group]
              }
              break
            case (e.type === 1):
              if (e.required && !items.length) {
                return [false, this.Group]
              }
              break
            case (e.type === 2 || e.type === 3):
              // console.log(this.qSliderMinCheck(e), 'slodercheck')
              if ((e.required && this.qSliderMinCheck(e) < 0) || (!e.required && this.qSliderMinCheck(e) !== e.min && this.qSliderMinCheck(e) < 0)) {
                return [false, this.Group]
              }
          }
        }
      } else {
        return [true, this.Group]
      }
      return [true, this.Group]
    },
    totalItComp () {
      var sum = 0
      Object.keys(this.value).forEach(x => {
        let y = this.value[x]
        var free = this.getComponent(y.component, 'free')
        if (!free) {
          if (typeof y.quantity === 'undefined') {
            sum = sum + y.price
          } else {
            sum = sum + (y.price * y.quantity)
          }
        } else {
          y.price = 0
        }
      })
      return sum
    }
  },
  watch: {
    checkReqAll (e) {
      this.$emit('update-comp', e[0])
    },
    totalItComp (e) {
      this.$emit('update-tot', e)
    }
  },
  methods: {
    ...mapActions('menu', ['bindItem', 'bindGroupComp', 'bindCategorias', 'bindPromos']),
    roundNumber (num) {
      return parseFloat(num.toFixed(2))
    },
    readOnlyPrice (items) {
      let check = items ?? false
      if (!check) {
        return 'Valor no encontrado'
      }
      let price = typeof items.quantity === 'undefined' ? items.price : (items.price * items.quantity)
      let total = price * (1 - (this.discount / 100))
      return parseFloat(total.toFixed(2))
    },
    getValueInput (value, component, items) {
      if (value.length) {
        if (typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined') {
          return value.find(x => (x['component'] === component.id && x['item'] === items.id))['quantity']
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    sumValueInput (value, component, items, x) {
      let max = this.qSliderMax(component, items)
      let obj = { component: component.id, component_name: component.name, item: items.id, price: items.price, name: items.name }
      let sum = this.getValueInput(value, component, items) + x
      if (max >= sum && sum >= 0) {
        this.qSliderInput(obj, sum)
      } else if (sum <= 0) {
        this.qSliderInput(obj, 0)
      } else if (sum >= max) {
        this.qSliderInput(obj, max)
      }
      this.$forceUpdate()
    },
    getComponent (id, val) {
      var comp = this.groupComp.find(x => x.id === id)
      if (typeof comp === 'undefined') { return null }
      return comp[val]
    },
    getItem (id, val) {
      var item = this.item.find(x => x.id === id)
      if (typeof item === 'undefined') { return null }
      return item[val]
    },
    radioInput (x, e, r) {
      var newElement = JSON.parse(x)
      this.value.forEach(e => {
        var oldElement = e
        if (oldElement.component === newElement.component) {
          var index = this.value.findIndex(el => el.item === oldElement.item && el.component === oldElement.component)
          if (index !== (-1)) {
            this.value.splice(index, 1)
          }
        }
      })
      this.value.push(newElement)
    },
    checkBoxInput (x, e, r) {
      var newElement = x
      if (r) {
        this.value.push(newElement)
      } else {
        var index = this.value.findIndex(el => el.item === newElement.item && el.component === newElement.component)
        if (index !== (-1)) {
          this.value.splice(index, 1)
        }
      }
    },
    qSliderInput (x, e) {
      var newElement = x
      if (e) {
        var index = this.value.findIndex(el => el.item === newElement.item && el.component === newElement.component)
        if (index !== (-1)) {
          this.value[index]['quantity'] = e
        } else {
          this.value.push({ ...newElement, quantity: e })
        }
      } else {
        index = this.value.findIndex(el => el.item === newElement.item && el.component === newElement.component)
        if (index !== (-1)) {
          this.value.splice(index, 1)
        }
      }
    },
    qSliderMax (component, item) {
      var sum = 0
      this.value.forEach(x => {
        if (component.id === x.component) {
          sum = sum + x.quantity
        }
      })
      var ret = component.max - sum
      if (ret < component.maxUnit) {
        var index = this.value.findIndex(el => el.item === item.id && el.component === component.id)
        var it = this.value[index]
        if (typeof it === 'undefined') {
          return ret
        } else {
          if ((ret + it.quantity) > component.maxUnit) {
            return component.maxUnit
          } else {
            return ret + it.quantity
          }
        }
      } else {
        return component.maxUnit
      }
    },
    sliderValidate (component) {
      if (component.required && this.qSliderMinCheck(component) < 0) {
        // console.log('sliderVal1')
        return 'Seleccionar el mínimo'
      }
      if (!component.required && this.qSliderMinCheck(component) !== component.min && this.qSliderMinCheck(component) < 0) {
        // console.log('sliderVal2')
        return 'Seleccionar el mínimo o 0'
      }
      // console.log('sliderVal3')
      return true
    },
    qSliderMinCheck (component) {
      var sum = 0
      for (let x of this.value) {
        if (component.id === x.component) {
          sum = sum + x.quantity
        }
      }
      return sum - component.min
    }
  },
  created () {
    // this.bindItem()
    // this.bindGroupComp()
  }
}
</script>
