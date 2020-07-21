<template>
  <div :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <p>{{required}}</p>
    <div v-if="readOnly">
        <q-list v-for="(items, indice) in value" :key="indice">
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">{{getComponent(items.component)['name']}} </div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{items.quantity > 1 ? items.quantity + ' x ' : null}} {{getItem(items.item)['name']}}</q-item-label>
            </q-item-section>
            <q-item-section class="text-right" v-if="!getComponent(items.component)['free']">
              <q-item-label caption>$ {{(typeof items.quantity === 'undefined' ? items.price : (items.price * items.quantity)).toFixed(2)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>
    <div v-for="(component, index) in Group" :key="index">
      <div v-if="component.type === 1 && !readOnly">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio :value="value.length ? JSON.stringify(value.find(x => x['component'] === component.id)) : ''" @input="(x) => {radioInput(x)}" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id }) : JSON.stringify({ item: items.id, price: 0, component: component.id })" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption>{{items.descripcion}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>$ {{(items.price).toFixed(2)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="component.type === 0 && !readOnly">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox
                @input="(x,e)=> checkBoxInput({ component: component.id, item: items.id, price: items.price }, e, x)"
                :value="value.length ? (typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined') ? true : false : false"
                :disable="value.findIndex(el => el.item === items.id && el.component === component.id)===(-1) && value.filter(x => x['component'] === component.id).length >= component.max"
                color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption>{{items.descripcion}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>$ {{(items.price).toFixed(2)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div v-if="component.type === 2 && !readOnly">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section>
              <q-slider
                @input="(x)=> qSliderInput({ component: component.id, item: items.id, price: items.price }, x)"
                :value="value.length ? typeof value.find(x => (x['component'] === component.id && x['item'] === items.id)) !== 'undefined' ? value.find(x => (x['component'] === component.id && x['item'] === items.id))['quantity'] : 0 : 0"
                label-always
                :min="0"
                :max="qSliderMax(component, items)"
                :step="1"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
              <q-item-label caption>{{items.descripcion}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label v-if="!component.free" caption>$ {{(items.price).toFixed(2)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
<script>

import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
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
          group.push({ ...grp, id: element, items })
        }
      })
      console.log({ group })
      return group.sort((a, b) => a.priority - b.priority)
    },
    checkReqAll () {
      if (typeof this.value !== 'undefined') {
        for (let e of this.Group) {
          var items = this.value.filter(x => e.id === x.component)
          console.log({ items })
          if (items.length) {
            if (!(e.type === 1)) {
              if (items.length < e.min) {
                return false
              }
            }
          } else {
            if (e.required) {
              return false
            }
          }
        }
        return true
      } else {
        return true
      }
    },
    totalItComp () {
      var sum = 0
      this.value.forEach(x => {
        var free = this.getComponent(x.component)['free']
        if (!free) {
          if (typeof x.quantity === 'undefined') {
            sum = sum + x.price
          } else {
            sum = sum + (x.price * x.quantity)
          }
        }
      })
      return sum
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
    getComponent (id) {
      return this.groupComp.find(x => x.id === id)
    },
    getItem (id) {
      return this.item.find(x => x.id === id)
    },
    radioInput (x, e, r) {
      var newElement = JSON.parse(x)
      console.log({ newElement })
      this.value.forEach(e => {
        var oldElement = e
        if (oldElement.component === newElement.component) {
          var index = this.value.findIndex(el => el.item === oldElement.item && el.component === oldElement.component)
          console.log({ index })
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
    }
  },
  created () {
    this.bindItem()
    this.bindGroupComp()
  }
}
</script>
