<template>
  <div>
    <div v-if="readOnly && Group.length">
      <div  v-for="(component, index) in Group" :key="index">
      <div>
        <q-list v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section>
              <q-item-label>{{items.name}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      </div>
    </div>
    <div class="row justify-center" v-if="!readOnly && Group.length">
    <div :class="mode == 1 ? 'q-ma-md q-pa-lg  col-5' : ''" style="min-width: 300px" v-for="(component, index) in Group" :key="index">
      <div v-if="component.type === 1">
        <div class="text-h6">{{component.name}} <div class="text-caption" v-if="component.required">campo obligatorio*</div> </div>
        <p class="text-caption" v-html="component.descripcion"></p>
        <q-list  class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio  :value="value.length ? JSON.stringify(value.find(x => x['component'] === component.id)) : ''" @input="(x) => {radioInput(x)}" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id, component_name: component.name, name: items.name }) : JSON.stringify({ item: items.id, price: 0, component: component.id, component_name: component.name, name: items.name })" color="teal" />
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
        <q-list  class="full-width" v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox

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
        <q-list  v-for="(items, indice) in component.items" :key="indice">
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
        <q-list  v-for="(items, indice) in component.items" :key="indice">
          <q-item>
            <q-item-section style="min-width: 100px">

              <q-item-section :class="$q.screen.lt.md ? 'col column' : ''">
                <q-item-label class="text-h6 row justify-between">
                  <div class="text-weight-thin col-6">{{getValueInput(value, component, items)}}</div>
                  <div class="relative-position col-6">
                  <q-btn-group v-if="!item.reward"  style="transform: rotateZ(90deg); height: 20px ; border-radius: 0.5em">
                    <q-btn @click="sumValueInput(value, component, items, 1)" size="0.4em" class="q-pl-xs" color="blue" icon="fas fa-chevron-left" text-color="white" dense >
                    </q-btn>
                     <div size="0.3em" color="primary" text-color="black" label="│" dense/>
                    <q-btn @click="sumValueInput(value, component, items, -1)" size="0.4em" class="q-pr-xs" color="blue" icon="fas fa-chevron-right" text-color="white" dense />
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

import { mapGetters } from 'vuex'
export default {
  props: ['comp', 'required', 'readOnly', 'value', 'elitempass'],
  computed: {
    ...mapGetters('menu', ['item', 'groupComp']),
    Group () {
      var group = []
      console.log(this.comp)
      this.comp.forEach(element => {
        // var items = this.item.filter(x => x && x.group_id && x.group_id.includes(element.group_id))
        var items = this.elitempass.filter(x => x && x.group_id && x.group_id.includes(element.group_id))
        group.push({ ...element, items })
      })
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
    }
  },
  data () {
    return {
      mode: 0
    }
  },
  methods: {
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
  mounted () {
    // this.required = this.checkReqAll
  }
}
</script>
