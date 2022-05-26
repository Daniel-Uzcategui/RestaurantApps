<template>
    <div>
 <div class="center q-ma-md col-12 row justicy-center">
                <q-table  class="q-mt-md full-width" :title="'Ordenes Cliente Corporativo'"
                    style="border-radius: 28px"
                      :data="ordercorporativo2"
                      :columns="columns"

                      no-data-label="No se encontraron registros"

                      >
                </q-table>
    </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
export default {
  data () {
    return {
      ordercorporativo: [],
      columns: [
        { name: 'cliente', required: true, label: 'client corp', align: 'left', field: row => row.buyOrder.Client.name, sortable: true },
        { name: 'Vendedor', required: true, label: 'Vendedor', align: 'left', field: row => row.buyOrder.Branch.Vendedor?.name || 'No tiene Nombre', sortable: true },
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: row => row.factura, sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: row => this.buscartipopago(row), sortable: true },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: row => this.buscartiposervicio(row), sortable: true },
        { name: 'status', required: true, label: 'Estatus', field: row => this.buscarstatus(row), sortable: true },
        { name: 'paid', label: 'Monto', field: row => row.paid, sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: row => row.dateIn, format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true }
      ]
    }
  },
  async mounted () {
    if (!this.ordercorporativo2.length) { await this.bindOrderscorp() }
  },
  methods: {
    ...mapActions('order', ['bindOrderscorp']),
    buscarstatus (objeto) {
      let obj
      obj = this.allestatus.find(x => x.value === objeto.status)
      if (obj !== undefined) {
        return obj.label
      }
    },
    buscartiposervicio (objeto) {
      let obj
      obj = this.tipoServicio.find(x => x.value === parseInt(objeto.tipEnvio))
      if (obj !== undefined) {
        return obj.label
      }
    },
    buscartipopago (objeto) {
      let obj
      console.log('el tipo de pago', objeto.typePayment)
      obj = this.typePayment_options.find(x => x.value === objeto.typePayment)

      if (obj !== undefined) {
        return obj.label
      }
    }

  },
  computed: {
    ...mapGetters('order', ['ordercorporativo2', 'allestatus', 'tipoServicio', 'typePayment_options'])
  }
}
</script>
