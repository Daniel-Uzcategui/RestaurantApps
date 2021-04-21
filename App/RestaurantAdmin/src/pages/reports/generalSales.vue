<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
    <div class="row header-container">
     <div class="flex-break"></div>
     <div class="header-cell col-xs-12 col-10" tabindex="0">
      <q-card >
       <q-card-section  class="q-cardtop " >
        <div class="text-h5">Ventas Generales </div>
      </q-card-section>
      </q-card>
    </div>
    <div class="filler"> <h3> Lista de ordenes </h3>
      <!-- {{orders}} -->
    </div>
    <div class="filler">
     <button v-on:click="salesSum ('2020,4,12','2022,4,12')"> Procesar Ventas </button>
     <div v-if="responsesalesSum">Resultado :  {{responsesalesSum}}</div>
     </div>
     <div class="filler">
     <button  v-on:click="salesRange ('12 Mar 2021 10:00:00 GMT')"> Procesar Ventas por dia </button>
     <div v-if="responsesalesRange">Resultado : {{responsesalesRange}}</div>
     </div>
    </div>
    <div >Resultado : {{responsesalesRange}}</div>
      <button  v-on:click="showGraph()"> Procesar showGraph </button>
    <div >Resultado : {{chardataTotal}}</div>
     <area-chart download="Ventas" label="Ventas" :legend="true" xtitle="Time" ytitle="Population" id="users-chart" prefix="$" :messages="{empty: 'No Hay data disponible'}" :data="chardataTotal" />
    <!--line-chart :data="[
  {name: 'Workout', data: {'2017-01-01 00:00:00 -0800': 3, '2017-01-02 00:00:00 -0800': 4}},
  {name: 'Call parents', data: {'2017-01-01 00:00:00 -0800': 5, '2017-01-02 00:00:00 -0800': 3}}
]"></line-chart!-->
  </q-page>
</template>
<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      chardataTotal: [ ],
      chardataCount: [ ],
      countSales: 0,
      paidOrder: 0,
      responsesalesSum: '',
      responsesalesRange: '',
      responsesalesGraph: ''
    }
  },
  computed: {
    ...mapGetters('order', ['orders'])
  },
  mounted () {
    this.DateBindOrders()
  },
  methods: {
    ...mapActions('order', ['DateBindOrders']),
    salesSum (dateStart, dateEnd) {
      dateStart = new Date(dateStart)
      dateEnd = new Date(dateEnd)
      let dateProceso = new Date(dateEnd)
      dateStart = date.formatDate(dateStart, 'YYYY-MM-DD')
      dateProceso = date.addToDate(dateProceso, { hours: 23 })
      dateEnd = date.formatDate(dateEnd, 'YYYY-MM-DD')
      let objdateIn
      this.paidOrder = 0
      this.countSales = 0
      for (let i = 0; i < this.orders.length; i++) {
        let obj = this.orders[i]
        if (obj.status === 3) {
          objdateIn = date.formatDate(obj.dateIn.toDate(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
          if (date.isBetweenDates(objdateIn, dateStart, dateProceso)) {
            this.countSales++
            this.paidOrder = parseFloat(obj.paid) + parseFloat(this.paidOrder)
          }
        }
      }
      let result = {
        countSales: this.countSales,
        totalSales: this.paidOrder
      }
      console.log(dateStart)
      console.log(dateEnd)
      console.log(result)
      this.responsesalesSum = result // temporal solo para fines de verificar la rutina
      return result
    },
    salesRange (dateStart, quantity) {
      let objresponseSales, responseSales
      let dateEnd
      let result = []
      dateStart = new Date(dateStart)
      dateStart = date.formatDate(dateStart, 'YYYY-MM-DD')
      quantity = quantity ?? 30
      for (let i = 1; i <= quantity; i++) {
        dateEnd = date.addToDate(dateStart, { days: i })
        dateEnd = date.formatDate(dateEnd, 'YYYY-MM-DD')
        responseSales = this.salesSum(dateStart, dateEnd)
        objresponseSales = {
          dateSale: dateEnd,
          countSales: responseSales['countSales'],
          totalSales: responseSales['totalSales']
        }
        result.push(objresponseSales)
        this.responsesalesRange = result // temporal solo para fines de verificar la rutina
      }
      return result
    },
    showGraph2 () {
      let responseSaleRange = this.salesRange('2021,04,03', 10)
      let objresponseSalesTotal
      let responseSalesTotal = []
      this.chardataTotal = []
      for (let i = 0; i <= responseSaleRange.length - 5; i++) {
        if (typeof responseSaleRange[i]['countSales'] !== 'undefined') {
          this.chardataTotal.push(responseSaleRange[i]['countSales'])
          console.log(responseSaleRange.length) // temporal solo para fines de verificar la rutina
          console.log(this.chardataTotal) // temporal solo para fines de verificar la rutina
          console.log(responseSaleRange[i], 'Salerange')
          objresponseSalesTotal = {
            name: responseSaleRange[i]['dateSale'],
            data: { cantidad: responseSaleRange[i]['countSales'] }
          }
        }
        responseSalesTotal.push(objresponseSalesTotal)
      }
      this.chardataTotal = responseSalesTotal
    },
    showGraph () {
      let responseSaleRange = this.salesRange('2021,03,20', 40)
      let objresponseSalesTotal = []
      this.chardataTotal = []
      for (let i = 0; i <= responseSaleRange.length - 5; i++) {
        if (typeof responseSaleRange[i]['countSales'] !== 'undefined') {
          this.chardataTotal.push(responseSaleRange[i]['countSales'])
          console.log(responseSaleRange.length) // temporal solo para fines de verificar la rutina
          console.log(this.chardataTotal) // temporal solo para fines de verificar la rutina
          console.log(responseSaleRange[i], 'Salerange')
          let date = responseSaleRange[i]['dateSale']
          objresponseSalesTotal.push([date.slice(5), parseFloat(responseSaleRange[i]['totalSales'].toFixed(2))])
        }
      }
      this.chardataTotal = objresponseSalesTotal
      console.log(this.chardataTotal)
    }
  }
}
</script>
