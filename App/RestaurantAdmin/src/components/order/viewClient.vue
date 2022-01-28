<template>
  <div class="row header-container">
    <div class="header-cell q-ma-sm col-3">
      <p class="text-bold">Cliente</p>
      <p>{{client}}</p>
    </div>
    <div class="header-cell q-ma-sm col-3">
      <p class="text-bold">Sede</p>
      <p>{{branch}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['client', 'branch'],
  name: 'viewClient'
}
</script>
