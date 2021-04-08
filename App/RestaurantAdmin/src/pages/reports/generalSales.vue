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
      {{orders}}
    </div>
    <div class="filler">
     <button v-on:click="salesSum ('2020,4,12','2022,4,12')"> Procesar Ventas </button>
     <div v-if="responsesalesSum">Resultado :  {{responsesalesSum}}</div>
     </div>
     <div class="filler">
     <button  v-on:click="salesRange ('2021,3,11')"> Procesar Ventas por dia </button>
     <div v-if="responsesalesRange">Resultado : {{responsesalesRange}}</div>
     </div>
    </div>
  </q-page>
</template>
<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      countSales: 0,
      paidOrder: 0,
      responsesalesSum: '',
      responsesalesRange: ''
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
      let objdateIn
      this.paidOrder = 0
      this.countSales = 0
      for (let i = 0; i < this.orders.length; i++) {
        let obj = this.orders[i]
        if (obj.status === 3) {
          objdateIn = date.formatDate(obj.dateIn.toDate(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
          if (date.isBetweenDates(objdateIn, dateStart, dateEnd)) {
            this.countSales++
            this.paidOrder = parseFloat(obj.paid) + parseFloat(this.paidOrder)
          }
        }
      }
      let result = {
        countSales: this.countSales,
        totalSales: this.paidOrder
      }
      this.responsesalesSum = result // temporal solo para fines de verificar la rutina
      return result
    },
    salesRange (dateStart, quantity) {
      let dateEnd
      let result, responseSales
      if (quantity > 0) {
        dateEnd = date.addToDate(dateStart, { days: quantity })
      } else {
        dateEnd = date.addToDate(dateStart, { days: 30 })
      }
      responseSales = this.salesSum(dateStart, dateEnd)
      result = {
        dateSale: dateStart,
        countSales: responseSales['countSales'],
        totalSales: responseSales['totalSales']
      }
      this.responsesalesRange = result // temporal solo para fines de verificar la rutina
      return result
    }
  }
}
</script>
<style lang="sass" scoped>
.filler
  margin : 40px
</style>
