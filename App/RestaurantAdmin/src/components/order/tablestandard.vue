<template>
<q-list v-if="item" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
  <q-item>
    <q-item-section>
      <q-item-label :class="(iditificarVuelto(props.row))?'text-red radius notificacion':'text-white radius'" >{{props.row.factura}}</q-item-label>
    </q-item-section>
    <q-item-section >
      <q-item-label>{{props.row.status}}</q-item-label>
    </q-item-section>
    <q-item-section side>
    <q-icon name="edit" @click="$router.push({ path: '/orders/show', query: { Order_Id: props.row.id } })" />
  </q-item-section>
  </q-item>
  <q-separator></q-separator>
</q-list>
<q-tr v-else :props="props" class="cursor-pointer" @click="$emit('routerpush', props.row.id)" >
  <q-td v-if="$q.screen.lt.md"  auto-width>
    <q-checkbox />
  </q-td>
    <q-td
    v-for="col in props.cols"
    :key="col.name"
    :props="props"
    :class="(iditificarVuelto(props.row))?'text-red radius notificacion':'text-white radius'"
  >
    {{ col.value }}
  </q-td>
</q-tr>
</template>
<script>
export default {
  props: ['props', 'item'],
  methods: {
    iditificarVuelto (row) {
      if (row.vuelto !== undefined) {
        return row.vuelto.status
      } else {
        return false
      }
    }
  }
}
</script>
