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
         <div class="header-cell col-4">
          <q-input label="Nombre del Cliente" :value="order.name"  @input="(e) => saved(e, this.$route.query.Order_Id, 'name')"  type="text" float-label="Float Label" />
        </div>
        <div class="header-cell col-4">
          <q-input label="Monto" :value="order.paid"  @input="(e) => saved(e, this.$route.query.Order_Id, 'paid')"  type="text" float-label="Float Label"  />
        </div>
        <div class="header-cell col-4">
          <q-select :value="order.status"  @input="(e) => saved(e, this.$route.query.Order_Id, 'status')" standout="bg-teal text-white"  :options="estatus_options" label="Estatus" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-4">
          <q-input label="Responsable" :value="order.responsable"  @input="(e) => saved(e, this.$route.query.Order_Id, 'responsable')"  type="text" float-label="Float Label"  />
        </div>
        <div class="header-cell col-4">
          <q-input label="Sede" :value="order.sede"  @input="(e) => saved(e, this.$route.query.Order_Id, 'sede')"  type="text" float-label="Float Label" placeholder="Sede de la Orden" />
        </div>
        <div class="header-cell col-4">
          <q-select :value="order.typePayment"  @input="(e) => saved(e, this.$route.query.Order_Id, 'typePayment')" standout="bg-teal text-white"  :options="typePayment_options" label="Tipo de Pago" />
        </div>
         <div class="flex-break q-py-md "></div>
         <div class="header-cell col-5">
            <q-input label="Dirección" :value="order.delivered"  @input="(e) => saved(e, this.$route.query.Order_Id, 'delivered')"  filled type="textarea" placeholder="Dirección"  />
         </div>
      </div>
     </div>
     <div class="header-cell col-6 filled">
          <q-table
          title="Detalle de Orden"
          color="primary"
          :data="orders"
          :columns="columns"
          :dense="$q.screen.lt.md"
          row-key="id"
          no-data-label="No se encontraron registros"
      >
      <template v-slot:body="props">
        <q-tr>
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
        'Pendiente', 'En Espera', 'En progreso', 'Completada', 'Anulada'
      ],
      typePayment_options: [
        'Efectivo', 'Paypal', 'Zelle'
      ],
      columns: [
        { name: 'Category', required: true, label: 'Categoria', align: 'left', field: 'category', sortable: true },
        { name: 'nameMenu', required: true, align: 'center', label: 'Nombre', field: 'name' },
        { name: 'Price', required: true, align: 'center', label: 'Precio', field: 'price' },
        { name: 'Extras', label: 'Extras', field: 'extras' }
      ]
    }
  },
  computed: {
    ...mapGetters('order', ['orders']),
    order () {
      return this.orders.find(obj => {
        return obj.id === this.$route.query.Order_Id
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
