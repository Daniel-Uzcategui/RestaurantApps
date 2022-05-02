<template>
  <q-page  class= 'q-mt-lg'>
<div class="q-gutter-md" style="margin-left:14px;margin-right:16px">
      <q-card class="q-cardGlass">
        <q-card-section class="q-cardtop header">
          <div class="text-h5" style="padding-bottom: 50px;">Encomienda</div>
          <div class="absolute-bottom-right q-pa-md">
            <q-btn
              flat
              color="white"
              icon="arrow_back"
              @click="$router.replace('/encomienda/index')"
            >
            </q-btn>
          </div>
        </q-card-section>
        <div class="filled"></div>
        <q-card-section class="q-mr-lg">
<courier
:propsEcomienda ="Encomienda"
/>
</q-card-section>
</q-card>
</div>
</q-page>
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
