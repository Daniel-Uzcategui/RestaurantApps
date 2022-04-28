<template>

    <div>
        <div><h6>Chequeo de Tracking</h6></div>
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
