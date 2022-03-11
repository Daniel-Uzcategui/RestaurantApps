<template>
  <q-page class="column justify-start q-py-md">
    <div class="row justify-center q-my-xl">
      <div class=" column col-12" style="max-width: 80%; min-width: 50%">
        <h4>Generar Guía</h4>
        <couriers/>
      </div>
    </div>
  </q-page>
</template>

<script>
// import { defineComponent } from 'vue'
import couriers from '../components/jetes/courierDatos.vue'
export default {
  name: 'GenerarGuia',
  components: {
    couriers
  }
}
</script>
