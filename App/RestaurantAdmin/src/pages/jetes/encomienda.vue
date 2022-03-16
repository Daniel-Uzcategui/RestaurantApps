<template>
    <div>
        <h1>Encomienda</h1>
<courier
:propsEcomienda ="Encomienda"
/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import courier from '../../components/jetes/courierDatos.vue'
export default {

  components: {
    courier
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('order', ['orderencomienda', 'orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus', 'Encomienda'])
  }

}
</script>
