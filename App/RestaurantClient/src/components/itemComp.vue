<template>
  <div :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <div v-if="readOnly">
        <q-list dense v-for="(items, indice) in value" :key="indice">
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">{{getComponent(items.component, 'name')}} </div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{items.quantity > 1 ? items.quantity + ' x ' : null}} {{getItem(items.item, 'name')}}</q-item-label>
            </q-item-section>
            <q-item-section class="text-right" v-if="!getComponent(items.component, 'free')">
              <q-item-label caption>$ {{(typeof items.quantity === 'undefined' ? items.price : (items.price * items.quantity)).toFixed(2)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>
    <div class="row justify-center" v-if="!readOnly">
      <q-spinner
        v-if="!groupComp.length"
        :size="$q.screen.name"
        color="primary"
      />
    <div :class="mode == 1 ? 'bg-primary q-ma-md q-pa-lg text-white col-5' : ''" :style="mode == 1 ? 'border-radius: 28px;' : ''" style="min-width: 300px" v-for="(component, index) in Group" :key="index">
      <div v-if="component.type === 1">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list dense :dark="mode == 1" class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio :dark="mode == 1" :value="value.length ? JSON.stringify(value.find(x => x['component'] === component.id)) : ''" @input="(x) => {radioInput(x)}" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id, component_name: component.name, name: items.name }) : JSON.stringify({ item: items.id, price: 0, component: component.id, component_name: component.name, name: items.name })" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>$ {{(items.price).toFixed(2)}}</q-item-label>
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
                color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>$ {{(items.price).toFixed(2)}}</q-item-label>
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
                :value="value.length ? typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined' ? value.find(x => (x['component'] === component.id && x['item'] === items.id))['quantity'] : 0 : 0"
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
              <q-item-label caption>$ {{(items.price).toFixed(2)}}</q-item-label>
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
        <q-list dense :dark="mode == 1" v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section style="min-width: 100px">

              <q-input
                dense
                :color="mode == 1 ? 'positive' : 'primary'"
                :dark="mode == 1"
                rounded
                outlined
                @input="(x)=> qSliderInput({ component: component.id, component_name: component.name, item: items.id, price: items.price, name: items.name }, parseInt(x) < 0 || isNaN(parseInt(x)) ? 0 : Math.min(parseInt(x), qSliderMax(component, items)))"
                :value="value.length ? typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined' ? value.find(x => (x['component'] === component.id && x['item'] === items.id))['quantity'] : 0 : 0"
                type="number"
                reactive-rules
                :rules="[val => sliderValidate(component) || '']"
                style="max-width: 200px"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption v-html="items.descripcion"></q-item-label>
            </q-item-section>
            <q-item-section v-if="!component.free" >
              <q-item-label caption>$ {{(items.price).toFixed(2)}}</q-item-label>
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
      comp.forEach(element => {
        var grp = groupComp.find(x => x.id === element)
        if (typeof groupComp !== 'undefined' && typeof grp !== 'undefined') {
          var items = this.item.filter(x => x.group_id.includes(grp.group_id))
          items = items.sort((a, b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0))
          group.push({ ...grp, id: element, items })
        }
      })
      return group.sort((a, b) => a.priority - b.priority)
    },
    checkReqAll () {
      if (typeof this.value !== 'undefined' && this.comp.length) {
        for (let e of this.Group) {
          var items = this.value.filter(x => e.id === x.component)
          switch (true) {
            case (e.type === 0):
              if ((e.required && items.length < e.min) || (!e.required && items.length > 0 && items.length < e.min)) {
                return false
              }
              break
            case (e.type === 1):
              if (e.required && !items.length) {
                return false
              }
              break
            case (e.type === 2 || e.type === 3):
              if ((e.required && this.qSliderMinCheck(e) < 0) || (!e.required && this.qSliderMinCheck(e) !== e.min && this.qSliderMinCheck(e) < 0)) {
                return false
              }
              break
            default:
              return true
          }
          return true
        }
      } else {
        return true
      }
      return true
    },
    totalItComp () {
      var sum = 0
      this.value.forEach(x => {
        var free = this.getComponent(x.component, 'free')
        if (!free) {
          if (typeof x.quantity === 'undefined') {
            sum = sum + x.price
          } else {
            sum = sum + (x.price * x.quantity)
          }
        } else {
          x.price = 0
        }
      })
      return sum
    }
  },
  mounted () {
    if (this.Group.length === 0) {
      this.$emit('update-comp', this.checkReqAll)
    }
  },
  watch: {
    checkReqAll (e) {
      this.$emit('update-comp', e)
    },
    totalItComp (e) {
      this.$emit('update-tot', e)
    }
  },
  methods: {
    ...mapActions('menu', ['bindItem', 'bindGroupComp', 'bindCategorias', 'bindPromos']),
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
        console.log('sliderVal1')
        return 'Seleccionar el mínimo'
      }
      if (!component.required && this.qSliderMinCheck(component) !== component.min && this.qSliderMinCheck(component) < 0) {
        console.log('sliderVal2')
        return 'Seleccionar el mínimo o 0'
      }
      console.log('sliderVal3')
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
