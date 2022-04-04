<template>

    <div>
        <div><h1>Chequeo de Tracking</h1></div>
       <div class="col-4 d-flex justify-content-center text-center">
            <tracking/>
        </div>

    </div>
</template>
<script>
import tracking from '../../components/jetes/trackingDatos.vue'
export default {
  components: {
    tracking
  }

}
</script>
