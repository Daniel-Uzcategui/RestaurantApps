<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Orden</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/Orders/index')"/>
          </div>
       </q-card-section>
         <div class='filled'></div>
       <div v-if="typeof order !== 'undefined'">
       <div class="row header-container">
        <div class="header-cell col-6">
          <label>Nombre</label>
          <q-input :value="order.name"  @input="(e) => saved(e, this.$route.query.order_Id, 'name')"  type="text" float-label="Float Label" placeholder="Nombre de la Sede" />
        </div>
        <div class="header-cell col-4">
          <q-select standout="bg-teal text-white"  :value="order.status"  @input="(e) => saved(e, this.$route.query.order_Id, 'status')" :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-6">
          <label>Localización</label>
          <q-input :value="JSON.stringify(markers)"  @input="(e) => saved(e, this.$route.query.order_Id, 'localizacion_sede')" type="text" float-label="Float Label" placeholder="Localización" />
        </div>
         <div class="header-cell col-5">
          <label>Dirección</label>
         <q-input :value="order.address"  @input="(e) => saved(e, this.$route.query.order_Id, 'address')" filled type="textarea" placeholder="Dirección"  />
      </div>
      </div>
     </div>
      <div class='filled'></div>
     </q-card>
  </div>
</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      estatus_options: [
        'En Espera', 'En progreso', 'Completado'
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.order_Id
      })
    }
  },
  methods: {
    ...mapActions('order', ['saveOrder']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveOrder({ value, id, key })
    }
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
.filled
  padding-top: 50px
</style>
