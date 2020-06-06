<template>
  <q-layout view="hHr lpR ffr">

    <q-header reveal class="bg-primary text-white">
    </q-header>
    <q-page-container>
      <div class="bg-bottom-header">
      <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'BasicLayout',
  computed: {
    productName () {
      return window.sessionStorage.productName
    }
  },
  data () {
    return {
    }
  }
}
</script>
