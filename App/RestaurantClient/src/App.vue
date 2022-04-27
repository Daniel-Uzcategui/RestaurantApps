<template>
  <div id="q-app">
    <router-view />
  <q-dialog v-model="updateExists">
    <q-card class="my-card">
    <q-card-section>
    Descargando actualizaciones, espere un segundo
    <q-spinner
        color="primary"
        size="3em"
      />
    </q-card-section>
    </q-card>
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
