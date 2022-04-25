<template>
    <div>
<h1>
    Ordenes por Envio
</h1>
  <q-table flat bordered
      class="table"
      style="border-radius: 28px"
      title="Ordenes"
      :data="orderencomienda"
      :columns="columns"
      :grid="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label=" "
      >
       <template v-slot:body-cell-boton1 ="props" id=1>
             <q-td :props="props" class="q-pa-md q-gutter-sm">
           <a href="#/encomienda/form/index"><q-btn label="Encomienda" q-btn dense round flat color="grey" icon="search" @click="encomienda2(props.row)" /></a>
             </q-td>
      </template>
    </q-table>
    </div>

</template>
<script>
import { date } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      columns: [
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: 'typePayment', sortable: true },
        { name: 'status', required: true, label: 'Estatus', field: 'status', sortable: true },
        { name: 'paid', label: 'Monto', field: 'paid', sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: 'dateIn', format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true },
        { name: 'boton1', required: false, label: '', align: 'left', sortable: true }
      ]
    }
  },
  mounted () {
    this.bindOrdersEnvio()
  },
  methods: {
    ...mapActions('order', ['bindOrdersEnvio', 'encomienda']),
    mostrar () {
      console.log('los valores', this.orderencomienda)
    },
    encomienda2 (datos) {
      console.log('los datos', datos)
      let encomiendaAxu = datos.encomienda
      encomiendaAxu = { ...encomiendaAxu, idorden: datos.id }
      encomiendaAxu = { ...encomiendaAxu, factura: datos.factura }
      this.encomienda(encomiendaAxu)
      console.log('esta es la encomienda', this.Encomienda)
    }
  },
  computed: {
    ...mapGetters('order', ['orderencomienda', 'orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus', 'Encomienda'])
  },
  watch: {
    orderencomienda () {
      this.mostrar()
    }
  }
}
</script>
