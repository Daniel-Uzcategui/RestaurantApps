<template>
  <div id="q-app">
    <router-view />
  <q-dialog v-model="updateExists">
    Descargando actualizaciones
    <q-spinner
        color="primary"
        size="3em"
      />
  </q-dialog>
  </div>
</template>

<script>
import update from './mixins/update'
export default {
  mixins: [update],
  name: 'App'
}
</script>
