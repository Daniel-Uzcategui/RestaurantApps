<template>
  <div  id="productos" >
    <column-chart download="Productos Vendidos" id="productos"
    :colors="['#FFD600', '#666']"
     :data="[
  {name: 'Productos Vendidos', data:chardataCantidadProducto}
] "></column-chart>
      </div>
</template>
<script>
// import { date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('order', ['orders']) },

  created () {
    // this.bindOrders().catch(e => console.error(e))
  },
  mounted () {
    this.graficarproducto()
  },
  watch: {
    orders () {
      // console.log('Cambio orders!!!')
      this.graficarproducto()
    }
  },
  methods: {
    ...mapActions('order', ['bindOrders']),
    sumarDias (fecha, dias) {
      fecha.setDate(fecha.getDate() + dias)
      return fecha
    },
    graficarproducto () {
      let objresponseProducto = []
      let productos = []
      let productofinal = []
      productos = this.obtenerproductorango()
      productofinal = this.obtenercantidaproducto(productos)
      for (let i = 0; i < productofinal.length; i++) {
        let objproducto = productofinal[i]
        //    console.log(objproducto.cont)
        objresponseProducto.push([objproducto.name, objproducto.cont])
      }

      this.chardataCantidadProducto = objresponseProducto
      // console.log(this.chardataCantidadProducto)
    },
    obtenerproductorango () {
      let obj
      let item
      // obtiene un arreglo con todas los productos en una fecha
      //      let dateStart, dateEnd
      let productos = []
      //    dateStart = this.orders[this.orders.length - 1]?.dateIn?.toDate()
      //  dateEnd = this.orders[0]?.dateIn?.toDate()

      // dateStart = date.formatDate(dateStart, 'YYYY-MM-DD')
      // dateEnd = date.formatDate(dateEnd, 'YYYY-MM-DD')
      //  console.log('fecha inicio', dateStart, 'fecha final', dateEnd)
      let j = 0
      for (let i = 0; i < this.orders.length; i++) {
        obj = this.orders[i]
        if (obj.status === 3) {
          //    console.log('valor', obj.cart)
          for (item in obj.cart) {
            productos[j] = {

              id: obj.cart[item].prodId,
              name: obj.cart[item].name

            }
            j++
          }
        }
      }
      // console.log('valores del arreglo de pŕoducto', this.productos)
      return productos
    },
    obtenercantidaproducto (productos) {
      let contproducto = 0
      let productoreg
      let productofinal = []
      // obtiene una rreglo de los productos vendido sin repetir
      let sinRepetidos = productos.filter((valorActual, indiceActual, arreglo) => {
        return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual
      })
      // console.log('Sin repetidos es:', sinRepetidos)

      // rutina que  cuenta la cantidad vendida de un producto

      for (let i = 0; i < sinRepetidos.length; i++) {
        for (let j = 0; j < productos.length; j++) {
        //  console.log(sinRepetidos[i].id, 'ylos otros', productos[j].id)
          if (sinRepetidos[i].id === productos[j].id) {
            contproducto = contproducto + 1
          }
        }
        productoreg = {
          name: sinRepetidos[i].name,
          cont: contproducto
        }
        contproducto = 0
        // console.log('los valores del registro', productoreg)
        productofinal.push(productoreg)
      }
      // console.log('cantidad producto', productofinal)
      return productofinal
    }
  },
  data () {
    return {
      chardataCantidadProducto: [],
      responseVentas: [],
      selected: [],
      responsesalesSum: ''
    }
  }
}
</script>
