<template>
  <div id="cantidadsemanal">
    <column-chart id="cantidadsemanal" :data="[
  {name: 'Total Vendido por semana', data:chardataTotalVenta}
] "
:colors="['#40A3F3', '#666']"
></column-chart>
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
    this.bindOrders().catch(e => console.error(e))
  },
  mounted () {
    this.GraficaVentaCantidadSemanal()
  },
  watch: {
    orders () {
      this.GraficaVentaCantidadSemanal()
    },
    dateRange (e) {
      if (e === null) {
        return this.bindOrders().catch(e => console.error(e))
      }
      // // console.log(e, 'DateRange')
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
    GraficaVentaCantidadSemanal () {
      let objsemana
      let acumd = 0
      let acuml = 0
      let acumm = 0
      let acummi = 0
      let acumj = 0
      let acumv = 0
      let acums = 0
      let dateStart, dateEnd
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
      let chardatasemana = []
      this.chardataTotalVenta = [ ]
      objsemana = this.obtenerDiaXSemana(dateStart, dateEnd)
      // console.log('valores semanales', objsemana)
      acumd = this.contardia(objsemana.Domingo)
      acuml = this.contardia(objsemana.Lunes)
      acumm = this.contardia(objsemana.Martes)
      acummi = this.contardia(objsemana.Miercoles)
      acumj = this.contardia(objsemana.Jueves)
      acumv = this.contardia(objsemana.Viernes)
      acums = this.contardia(objsemana.Sabado)
      chardatasemana.push(['Lunes', acuml])
      chardatasemana.push(['Martes', acumm])
      chardatasemana.push(['Miercoles', acummi])
      chardatasemana.push(['Jueves', acumj])
      chardatasemana.push(['Viernes', acumv])
      chardatasemana.push(['Sabados', acums])
      chardatasemana.push(['Domindos', acumd])
      this.chardataTotalVenta = chardatasemana
      // console.log('arreglo', this.chardataTotalVenta)
      return chardatasemana
    },
    obtenerDiaXSemana (dateStart, dateEnd) {
      // let numeroDia = new Date('01 apr 2021 10:00:00 GMT').getDay()
      // console.log(numeroDia)
      let domingo = []
      let lunes = []
      let martes = []
      let miercoles = []
      let jueves = []
      let viernes = []
      let sabado = []
      let ventaAcum
      // let k = 0
      let contd = 0, contl = 0, contm = 0, contmi = 0, contj = 0, contv = 0, conts = 0
      dateStart = new Date(dateStart)
      dateEnd = new Date(dateEnd)
      var diasdif = dateEnd.getTime() - dateStart.getTime()
      let contdias = Math.round(diasdif / (1000 * 60 * 60 * 24))
      // dateStart = date.formatDate(dateStart, 'YYYY-MM-DD')
      dateEnd = date.formatDate(dateEnd, 'YYYY-MM-DD')
      // console.log('cantidad dia', contdias)
      for (let j = 0; j < contdias + 1; j++) {
        // obj = this.orders[j]
        // console.log('elvalor de j', j, 'k', k)

        // dateStart = date.formatDate(dateStart, 'YYYY-MM-DD')
        // console.log('dia dela semana ', dateStart)
        ventaAcum = this.TotalVentas(dateStart, dateEnd)
        // console.log('acumulado de venta ', ventaAcum)
        // console.log('acumulado de venta ', new Date(date.formatDate(dateStart, 'YYYY-MM-DD')).getDay())
        if ((new Date(dateStart).getDay() === 0)) {
          domingo.push(ventaAcum)
          contd = contd + 1
        }
        if ((new Date(dateStart).getDay() === 1)) {
          lunes.push(ventaAcum)
          contl = contl + 1
        }
        if ((new Date(dateStart).getDay() === 2)) {
          martes.push(ventaAcum)
          contm = contm + 1
        }
        if ((new Date(dateStart).getDay() === 3)) {
          miercoles.push(ventaAcum)
          contmi = contmi + 1
        }
        if ((new Date(dateStart).getDay() === 4)) {
          jueves.push(ventaAcum)
          contj = contj + 1
        }
        if ((new Date(dateStart).getDay() === 5)) {
          viernes.push(ventaAcum)
          contv = contv + 1
        }
        if ((new Date(dateStart).getDay() === 6)) {
          sabado.push(ventaAcum)
          conts = conts + 1
        }
        // k++
        dateStart = this.sumarDias(dateStart, 1)
      } // fin del for j

      let semana = {
        Domingo: domingo,
        Lunes: lunes,
        Martes: martes,
        Miercoles: miercoles,
        Jueves: jueves,
        Viernes: viernes,
        Sabado: sabado

      }
      // console.log('registros de los dias', semana)
      return semana
    },
    TotalVentas (dateStart, dateEnd) {
      let objdateIn
      let obj
      let acum = 0
      let cont = 0
      let contacum

      for (let i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        objdateIn = obj.dateIn.toDate()

        // console.log(objdateIn, '--', dateStart, 'estatus', obj.status, 'paid', obj.paid)
        if (obj.status === 3) {
          if (date.formatDate(dateStart, 'YYYY-MM-DD') === date.formatDate(objdateIn, 'YYYY-MM-DD')) {
            // console.log('entre2')
            // console.log(acum)
            // console.log(obj.paid)
            acum = obj.paid + acum
            cont = cont + 1
            // console.log(cont)
          }
        }
        // console.log('resultado', acum)

        contacum = {
          cont: cont,
          acum: acum
        }
      }

      return contacum
    },
    acumulardia (arreglo) {
      let acum = 0
      for (let i = 0; i < arreglo.length; i++) {
        acum = acum + arreglo[i].acum
      }
      return acum
    },
    contardia (arreglo) {
      let cont = 0
      for (let i = 0; i < arreglo.length; i++) {
        cont = cont + arreglo[i].cont
      }
      return (cont / (arreglo.length))
    }

  },
  data () {
    return {
      chardataTotalVenta: [],
      responseVentas: [],
      selected: [],
      responsesalesSum: ''
    }
  }
}
</script>
