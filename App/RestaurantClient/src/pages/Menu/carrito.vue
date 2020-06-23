<template>
  <q-page padding>
    {{cart}}
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('menu', ['categorias', 'menu', 'cart', 'listcategorias', 'plaincategorias', 'listextras', 'plainExtras']),
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
