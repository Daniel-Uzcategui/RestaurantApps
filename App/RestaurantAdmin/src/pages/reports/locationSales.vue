<template>
  <q-page class="q-pa-md q-pa-sm " >
    <div class="row header-container">
     <div class="flex-break"></div>
     <div class="col-12" tabindex="0">
      <q-card class="qSection">
       <q-card-section  class="bg-secondary text-white" >
        <div class="text-h5">Ventas por Sede</div>
       <q-btn flat color="white" push label="Exportar a csv" icon="archive" @click="exportTable"/>
      </q-card-section>
       <!--div class="q-pb-sm">
<div class="q-pa-md" style="max-width: 300px">
Filtros por Dias
  <q-input filled v-model="days">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="days" range multiple>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
</div>
</div!-->
      <table class="tableReports" >
        <tr>
          <th class="td-detail-title"></th>
            <th class="td-detail-title" v-for="localization in localizations" :key="localization.id">{{localization.name}}</th>
        </tr>
        <tr class="">
            <td class="td-detail-title" >{{contentHeader[0]}}</td>
            <td class="td-detail" v-for="totalSales in this.SalesSede[0].totalSede" :key="totalSales.mtoOrdenKey">{{totalSales.value}} </td>
        </tr>
        <tr class="">
            <td class="td-detail-title">{{contentHeader[1]}}</td>
            <td class="td-detail" v-for="quantitySales in this.SalesSede[0].quantitySales" :key="quantitySales.QuantityOrdenKey">{{quantitySales.value}} </td>
        </tr>
        <tr class="">
            <td class="td-detail-title">{{contentHeader[2]}}</td>
            <td class="td-detail" v-for="newCustomerSede in this.SalesSede[0].newCustomerSede" :key="newCustomerSede.NwCustomerSedeKey">{{newCustomerSede.value}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">{{contentHeader[3]}}</td>
            <td class="td-detail" v-for="newquantityCustomer in this.SalesSede[0].newquantityCustomer" :key="newquantityCustomer.QuantityNwCustomerKey">{{newquantityCustomer.value}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">{{contentHeader[4]}}</td>
            <td class="td-detail" v-for="customerSede in this.SalesSede[0].customerSede" :key="customerSede.QuantityCustomerKey">{{customerSede.value}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">{{contentHeader[5]}}</td>
            <td class="td-detail" v-for="quantityCustomer in this.SalesSede[0].quantityCustomer" :key="quantityCustomer.QuantityOrden_id">{{quantityCustomer.value}} </td>
        </tr>
        <tr>
            <td class="td-detail-title">{{contentHeader[6]}}</td>
            <td class="td-detail" v-for="avquantityCustomer in this.SalesSede[0].avquantityCustomer" :key="avquantityCustomer.avCustomerKey">{{avquantityCustomer.value}}</td>
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

export default {
  computed: {
    ...mapGetters('order', ['orders']),
    ...mapGetters('client', ['clients']),
    ...mapGetters('localization', ['localizations']),
    SalesSede () {
      let SalesSede = []
      let totalSales = []
      let quantitySales = []
      let quantityCustomer = []
      let quantityNwCustomer = []
      let quantityAverageCustomer = []
      let totalOrdersSales = []
      let totalCustomer = []
      let totalNwCustomer = []
      let i, obj
      for (i = 0; i < this.localizations.length; i++) {
        obj = this.localizations[i]
        totalOrdersSales = this.totalOrdersSede(obj.id)
        // console.log(totalOrdersSales)
        totalSales.push({ value: totalOrdersSales[0].totalSede.toFixed(2), mtoOrdenKey: i })
        totalCustomer.push({ value: totalOrdersSales[0].customerSede.toFixed(2), CustomerSedeKey: i })
        totalNwCustomer.push({ value: totalOrdersSales[0].newCustomerSede.toFixed(2), NwCustomerSedeKey: i })
        quantityAverageCustomer.push({ value: totalOrdersSales[0].averagequantityCustomer.toFixed(2), avCustomerKey: i })
        quantitySales.push({ value: totalOrdersSales[0].quantitySales, QuantityOrdenKey: i })
        quantityCustomer.push({ value: totalOrdersSales[0].quantityCustomer, QuantityCustomerKey: i })
        quantityNwCustomer.push({ value: totalOrdersSales[0].newquantityCustomer, QuantityNwCustomerKey: i })
      }
      SalesSede.push({
        'totalSede': totalSales,
        'quantitySales': quantitySales,
        'customerSede': totalCustomer,
        'quantityCustomer': quantityCustomer,
        'newCustomerSede': totalNwCustomer,
        'newquantityCustomer': quantityNwCustomer,
        'avquantityCustomer': quantityAverageCustomer
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
      let content = '  '
      let sede
      for (let i = 0; i < this.localizations.length; i++) {
        sede = this.localizations[i]
        content = content + ',' + sede.name
        // console.log(content)
      }
      content = content + '\r\n'
      console.log(this.SalesSede[0])
      content = content + this.getColumns(this.contentHeader[0], this.SalesSede[0].totalSede)
      content = content + this.getColumns(this.contentHeader[1], this.SalesSede[0].quantitySales)
      content = content + this.getColumns(this.contentHeader[2], this.SalesSede[0].newCustomerSede)
      content = content + this.getColumns(this.contentHeader[3], this.SalesSede[0].newquantityCustomer)
      content = content + this.getColumns(this.contentHeader[4], this.SalesSede[0].customerSede)
      content = content + this.getColumns(this.contentHeader[5], this.SalesSede[0].quantityCustomer)
      content = content + this.getColumns(this.contentHeader[6], this.SalesSede[0].avquantityCustomer)
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
        'quantitySales': countSalesSede,
        'customerSede': customerPaidOrder,
        'quantityCustomer': countCustomerSede,
        'newCustomerSede': customerNwrPaidOrder,
        'newquantityCustomer': countNewCustomerSede,
        'averagequantityCustomer': averageCustomerSede
      })
      return Sales
    },
    totalOrdersClient (value) {
      var totalOrderCustomer = this.orders.filter(obj => {
        return obj.customer_id === value
      })
      return totalOrderCustomer.length
    },
    getColumns (title, obj) {
      let column = title + ','
      for (let i = 0; i < this.localizations.length; i++) {
        column = column + obj[i].value + ','
      }
      column = column + '\r\n'
      return column
    }
  },

  data () {
    return {
      separator: 'cell',
      days: [],
      contentHeader: [
        'Monto en Ventas',
        'Cantidad en Ventas',
        'Montos en Cliente Nuevos',
        'Cantidad en Cliente Nuevos',
        'Montos en Cliente Recurrentes',
        'Cantidad en Cliente Recurrentes',
        'Comprar promedio por transaccion'
      ]
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
.qSection
    overflow: scroll
    overflow-x: auto
    overflow-y: auto
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
