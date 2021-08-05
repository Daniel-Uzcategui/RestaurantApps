<template>
  <div class="row header-container">
    <div class="header-cell q-ma-sm col-3">
      <p class="text-bold">Cliente</p>
      <p>{{getClientValue('name')}}</p>
    </div>
    <div class="header-cell q-ma-sm col-3">
      <p class="text-bold">Sede</p>
      <p>{{getBranchValue('name')}}</p>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['client', 'branch'],
  name: 'viewClient',
  computed: {
    ...mapGetters('seller', ['orderClients', 'branches'])
  },
  created () {
    this.bindOrderClients()
    this.bindClientBranch(this.client)
  },
  methods: {
    ...mapActions('seller', ['bindOrderClients', 'bindClientBranch']),
    getClientValue (value) {
      let cliente = this.orderClients.find(x => x.id === this.client)
      return cliente && cliente[value] ? cliente[value] : 'Valor no encontrado'
    },
    getBranchValue (value) {
      let cliente = this.branches.find(x => x.id === this.branch)
      return cliente && cliente[value] ? cliente[value] : 'Valor no encontrado'
    }
  }
}
</script>
