<template>
    <div>
      <q-table class="full-width q-mt-md" style="border-radius: 28px" title="Treats" :columns="columns" :data="seller" row-key="name">
              <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
    </div>
</template>
<script>
const columns = [
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'apellido', label: 'Apellido', field: 'apellido', sortable: true },
  { name: 'email', label: 'Correo', field: 'email', sortable: true },
  { name: 'phone', label: 'Teléfono', field: 'phone', sortable: true }
]
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      columns
    }
  },
  computed: {
    ...mapGetters('seller', ['seller'])
  },
  methods: {
    ...mapActions('seller', ['bindseller'])
  },
  mounted () {
    this.bindseller()
  }
}
</script>
