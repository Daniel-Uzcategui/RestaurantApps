<template>
<div id="VentasT">
  <area-chart :colors="['#64B968', '#666']" download="Ventas" label="Total de Ventas por día" :legend="true" xtitle="Time" ytitle="Population" id="VentasT" prefix="$" :messages="{empty: 'No Hay data disponible'}" :data="objresponseventas" />
      </div>
</template>
<script>
import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('order', ['orders', 'dateRange']) },
  dateRango: {
    get () {
      return this.dateRange
    },
    set (e) {
      this.alterRange(e)
    }
  },

  created () {
    // this.bindOrders().catch(e => console.error(e))
  },
  mounted () {
    this.graficarVEntas()
  },
  watch: {
    orders () {
      this.graficarVEntas()
    },
    dateRange (e) {
      if (e === null) {
        return this.bindOrders().catch(e => console.error(e))
      }
      console.log(e, 'DateRange')
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      this.bindOrders(
        {
          start: new Date(e.from),
          end: end
        }
      ).catch(e => console.error(e))
    }
  },
  methods: {
    ...mapActions('order', ['deleteOrder', 'bindOrders', 'alterRange']),
    sumarDias (fecha, dias) {
      fecha.setDate(fecha.getDate() + dias)
      return fecha
    },
    obtenerVenta () {
      let dateStart, dateEnd
      let registro, registrofinal
      if (!this.orders.length) {
        return
      }
      if (this.dateRange === null) {
        dateStart = this.orders[this.orders.length - 1]?.dateIn?.toDate()
        dateEnd = this.orders[0]?.dateIn?.toDate()
      } else {
        dateStart = new Date(this.dateRange?.from)
        dateEnd = new Date(this.dateRange?.to)
      }

      var diasdif = dateEnd.getTime() - dateStart.getTime()
      let contdias = Math.round(diasdif / (1000 * 60 * 60 * 24))
      // console.log('cantidad dia', contdias)
      this.responsetotalsuma = []
      contdias = contdias + 1
      for (let j = 1; j <= contdias; j++) {
        registro = this.salesSum(dateStart)
        registrofinal = {
          fecha: date.formatDate(dateStart, 'YYYY-MM-DD'),
          countSales: registro.countSales,
          totalSales: registro.totalSales
        }

        this.responsetotalsuma.push(registrofinal)
        dateStart = this.sumarDias(dateStart, 1)
      }
      // console.log('el valorde arreglo', this.responsetotalsuma)
      return this.responsetotalsuma
    },
    salesSum (dateStart) {
      let objdateIn, obj
      let result
      let countSales
      let paidOrder

      countSales = 0
      paidOrder = 0
      for (let i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        objdateIn = date.formatDate(obj.dateIn?.toDate(), 'YYYY-MM-DD')
        if (obj.status === 3) {
          // console.log('fecha BD', objdateIn, 'fecha para', date.formatDate(dateStart, 'YYYY-MM-DD'))
          if (objdateIn === date.formatDate(dateStart, 'YYYY-MM-DD')) {
            // console.log('pase')
            countSales++
            paidOrder = obj.paid + paidOrder
          }
        }
      } // fin del for dela i

      result = {

        countSales: countSales,
        totalSales: paidOrder
      }

      return result
    },
    graficarVEntas () {
      if (!this.orders.length) {
        return
      }
      let objventas
      this.responseVentas = this.obtenerVenta()
      this.objresponseventas = []
      for (let i = 0; i < this.responseVentas.length; i++) {
        objventas = this.responseVentas[i]
        this.objresponseventas.push([objventas.fecha.slice(5), objventas.totalSales])
      }
      // console.log(this.objresponseventas)
      return this.objresponseventas
    }
  },
  data () {
    return {
      objresponsecantdventas: [],
      objresponseventas: [],
      responsetotalsuma: [],
      responseVentas: [],
      selected: [],
      responsesalesSum: ''
    }
  }
}
</script>
