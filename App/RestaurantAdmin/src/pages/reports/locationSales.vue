<template>
  <q-page class="q-pa-md q-pa-sm " >
    <div class="row header-container">
     <div class="flex-break"></div>
     <div class="header-cell col-xs-12 col-10" tabindex="0">
      <q-card >
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Ventas por Sede </div>
      </q-card-section>
      <table class="tableReports">
        <tr>
          <th class="td-detail-title"></th>
            <th class="td-detail-title" v-for="localization in localizations" :key="localization.id">{{localization.name}}</th>
        </tr>
        <tr class="">
            <td class="td-detail-title" >Monto en Ventas</td>
            <td class="td-detail" v-for="totalSales in this.SalesSede[0].totalSede" :key="totalSales.mtoOrdenKey">{{totalSales.mtoOrders}} </td>
        </tr>
        <tr class="">
            <td class="td-detail-title">Cantidad en Ventas</td>
            <td class="td-detail" v-for="quantitySalesSede in this.SalesSede[0].quantitySalesSede" :key="quantitySalesSede.QuantityOrdenKey">{{quantitySalesSede.QuantityOrder}} </td>
        </tr>
        <tr class="">
            <td class="td-detail-title">Montos en Cliente Nuevos</td>
            <td class="td-detail" v-for="newCustomerSede in this.SalesSede[0].newCustomerSede" :key="newCustomerSede.NwCustomerSedeKey">{{newCustomerSede.mtoNewCustomer}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">Cantidad en Cliente Nuevos</td>
            <td class="td-detail" v-for="newQuantitycustomerSede in this.SalesSede[0].newQuantitycustomerSede" :key="newQuantitycustomerSede.QuantityNwCustomerKey">{{newQuantitycustomerSede.nwQuantityOrder}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">Montos en Cliente Recurrentes</td>
            <td class="td-detail" v-for="customerSede in this.SalesSede[0].customerSede" :key="customerSede.QuantityCustomerKey">{{customerSede.mtoCustomer}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">Cantidad en Cliente Recurrentes</td>
            <td class="td-detail" v-for="quantitycustomerSede in this.SalesSede[0].quantitycustomerSede" :key="quantitycustomerSede.QuantityOrden_id">{{quantitycustomerSede.QuantityOrder}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">Comprar promedio por transacción</td>
            <td class="td-detail" v-for="avQuantitycustomerSede in this.SalesSede[0].avQuantitycustomerSede" :key="avQuantitycustomerSede.avCustomerKey">{{avQuantitycustomerSede.avQuantityOrder}}</td>
        </tr>
      </table>
    </q-card>
    </div>
    </div>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
export default {
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('localization', ['localizations']),
    SalesSede () {
      let SalesSede = []
      let totalSalesSede = []
      let QuantitySalesSede = []
      let QuantityCustomerSede = []
      let QuantityNwCustomerSede = []
      let QuantityaverageCustomerSede = []
      let totalOrdersSales = []
      let totalCustomerSede = []
      let totalNwCustomerSede = []
      let i, obj
      for (i = 0; i < this.localizations.length; i++) {
        obj = this.localizations[i]
        totalOrdersSales = this.totalOrdersSede(obj.id)
        // console.log(totalOrdersSales)
        totalSalesSede.push({ mtoOrders: totalOrdersSales[0].totalSede.toFixed(2), mtoOrdenKey: i })
        QuantitySalesSede.push({ QuantityOrder: totalOrdersSales[0].quantitySalesSede, QuantityOrdenKey: i })
        totalCustomerSede.push({ mtoCustomer: totalOrdersSales[0].customerSede.toFixed(2), CustomerSedeKey: i })
        QuantityCustomerSede.push({ QuantityOrder: totalOrdersSales[0].quantitycustomerSede, QuantityCustomerKey: i })
        totalNwCustomerSede.push({ mtoNewCustomer: totalOrdersSales[0].newCustomerSede.toFixed(2), NwCustomerSedeKey: i })
        QuantityNwCustomerSede.push({ nwQuantityOrder: totalOrdersSales[0].newQuantitycustomerSede, QuantityNwCustomerKey: i })
        QuantityaverageCustomerSede.push({ avQuantityOrder: totalOrdersSales[0].averageQuantitycustomerSede.toFixed(2), avCustomerKey: i })
      }
      SalesSede.push({
        'totalSede': totalSalesSede,
        'quantitySalesSede': QuantitySalesSede,
        'customerSede': totalCustomerSede,
        'quantitycustomerSede': QuantityCustomerSede,
        'newCustomerSede': totalNwCustomerSede,
        'newQuantitycustomerSede': QuantityNwCustomerSede,
        'avQuantitycustomerSede': QuantityaverageCustomerSede
      })
      return SalesSede
    }
  },
  mounted () {
    this.reportBindOrders()
    this.bindClients()
    this.bindLocalizations()
  },
  methods: {
    ...mapActions('order', ['reportBindOrders']),
    ...mapActions('client', ['bindClients']),
    ...mapActions('localization', ['bindLocalizations']),
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
      })
    },
    exportTable () {
      // naive encoding to csv format
      console.log({ cols: this.columns })
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.SalesSede.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'reportsLocationSales.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Navegador no permitio la descarga del Archivo...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    totalOrdersSede (value) {
      let Sales = []
      let paidOrder = 0
      let customerPaidOrder = 0
      let customerNwrPaidOrder = 0
      let countSalesSede = 0
      let countCustomerSede = 0
      let countNewCustomerSede = 0
      let previousCustomer = ''
      let cantidadOrderXclient = 0
      let averageCustomerSede = 0
      let cantidadXnew = 0
      let indicadorSede = true
      // console.log(this.orders)
      this.orders.filter(obj => {
        if (obj.sede === value) {
          paidOrder = parseFloat(obj.paid) + parseFloat(paidOrder)
          countSalesSede++
          // rutura de control por cliente
          if (indicadorSede) {
            previousCustomer = obj.customer_id
            indicadorSede = false
          }
          if (previousCustomer !== obj.customer_id) {
            cantidadXnew = cantidadOrderXclient
            cantidadOrderXclient = 0
            countCustomerSede++
            previousCustomer = obj.customer_id
          } else {
            cantidadOrderXclient++
          }
          customerPaidOrder = parseFloat(obj.paid) + parseFloat(customerPaidOrder)
          if (cantidadXnew === 1) {
            customerNwrPaidOrder = parseFloat(obj.paid) + parseFloat(customerNwrPaidOrder)
            customerPaidOrder = parseFloat(customerPaidOrder) - parseFloat(obj.paid)
            countNewCustomerSede++
          }
        }
        return 0
      })
      if (cantidadOrderXclient > 1 && countCustomerSede === 0) {
        countCustomerSede++
      }
      if (paidOrder > 0 && countSalesSede > 0) {
        averageCustomerSede = paidOrder / countSalesSede
        // console.log(averageCustomerSede)
      }
      Sales.push({
        'totalSede': paidOrder,
        'quantitySalesSede': countSalesSede,
        'customerSede': customerPaidOrder,
        'quantitycustomerSede': countCustomerSede,
        'newCustomerSede': customerNwrPaidOrder,
        'newQuantitycustomerSede': countNewCustomerSede,
        'averageQuantitycustomerSede': averageCustomerSede
      })
      return Sales
    },
    totalOrdersClient (value) {
      var totalOrderCustomer = this.orders.filter(obj => {
        return obj.customer_id === value
      })
      return totalOrderCustomer.length
    }
  },

  data () {
    return {
      estatus_options: [
        { label: 'Por Confirmar', value: 0 },
        { label: 'Preparando su pedido', value: 1 },
        { label: 'Orden en vía', value: 2 },
        { label: 'Orden Entregada', value: 3 },
        { label: 'Anulada', value: 4 }
      ],
      tipo_pago: [
        { label: 'Punto de venta', value: 0 },
        { label: 'Efectivo', value: 1 },
        { label: 'Zelle', value: 2 },
        { label: 'Tarjeta o Paypal', value: 3 }
      ],
      tipo_servicio: [
        { label: 'Pick-up', value: 0 },
        { label: 'Delivery', value: 1 },
        { label: 'En-Local', value: 2 }
      ],
      columns: [
        { name: 'totalSede', align: 'center', label: 'Monto en Ventas', field: 'totalSede', sortable: true },
        { name: 'status', align: 'center', label: 'col2', field: 'col2', sortable: true },
        { name: 'paid', align: 'center', label: 'col3', field: 'col3', sortable: true },
        { name: 'factura', align: 'center', label: 'col7', field: 'col7', sortable: true }
      ],
      separator: 'cell'
    }
  }
}
</script>
<style lang="sass" scoped>
.separate
 padding-left: 70%
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-container
  .header-cell
    margin: 2px
    padding: 4px 8px
.totalCard
    width: 30%
.tableReports
    width: 100%
    max-width: 100%
    border-collapse: separate
    border-spacing: 0 !important
.td-detail
  padding-top: 15px
  padding-bottom: 15px
  text-align: center
  border-style: solid
  border-width: 0
  border-bottom-width: 1px
  border-color: rgba(0,0,0,0.12)
.td-detail-title
  padding-left: 15px
  padding-top: 15px
  padding-bottom: 15px
  font-weight: bold
  font-size: 12px;
  border-style: solid
  border-width: 0
  border-bottom-width: 1px
  border-color: rgba(0,0,0,0.12)
</style>
