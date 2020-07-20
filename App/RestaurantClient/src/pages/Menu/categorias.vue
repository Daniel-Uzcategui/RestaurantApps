<template>
  <div class="q-pa-md" :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <p>{{color}}</p>
    <div v-for="(component, index) in Group" :key="index">
      <div v-if="component.type === 1">
        <p class="text-h6">{{component.name}}</p>
        <p class="text-caption">{{component.descripcion}}</p>
        <q-list v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-radio :value="color.length ? color.find(x => JSON.parse(x)['component'] === component.id) : ''" @input="(x) => {radioInput(x)}" :disable="!component.free ? !color.includes(JSON.stringify({ item: items.id, price: items.price, component: component.id })) && color.length >= component.max : !color.includes(JSON.stringify({ item: items.id, price: 0, component: component.id })) && color.length >= component.max" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id }) : JSON.stringify({ item: items.id, price: 0, component: component.id })" color="teal" />
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
      <div v-if="component.type === 0">
        <p class="text-h6">{{component.name}}</p>
        <p class="text-caption">{{component.descripcion}}</p>
        <q-list v-for="(items, indice) in component.items" :key="indice">
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox :disable="!component.free ? !color.includes(JSON.stringify({ item: items.id, price: items.price, component: component.id })) && color.filter(x => JSON.parse(x)['component'] === component.id).length >= component.max : !color.includes(JSON.stringify({ item: items.id, price: 0, component: component.id })) && color.length >= component.max" v-model="color" :val="!component.free ? JSON.stringify({ item: items.id, price: items.price, component: component.id }) : JSON.stringify({ item: items.id, price: 0, component: component.id })" color="teal" />
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

import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['item', 'itemGroup', 'groupComp']),
    Group () {
      var group = []
      this.groupComp.forEach(element => {
        var items = this.item.filter(x => x.group_id.includes(element.group_id))
        group.push({ ...element, items })
      })
      return group.sort((a, b) => a.priority - b.priority)
    }
  },
  data () {
    return {
      color: [ ]
    }
  },
  mounted () {

  },
  methods: {
    radioInput (x) {
      console.log({ x })
      var newElement = JSON.parse(x)
      this.color.forEach(e => {
        var oldElement = JSON.parse(e)
        if (oldElement.component === newElement.component) {
          var index = this.color.indexOf(e)
          if (index !== (-1)) {
            this.color.splice(index, 1)
          }
        }
      })
      this.color.push(x)
    }
  }
}
</script>

<style lang="stylus">
  .q-table__top
    background-color $secondary
    color white

</style>
