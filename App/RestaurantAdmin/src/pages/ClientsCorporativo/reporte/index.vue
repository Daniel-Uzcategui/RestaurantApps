<template>
    <div>
 <div class="center q-ma-md col-12 row justicy-center">
                <q-table  class="q-mt-md full-width" :title="'Ordenes Cliente Corporativo Estatus: Entregadas'"
                    style="border-radius: 28px"
                      :data="ordenes"
                      :columns="columns"

                      no-data-label="No se encontraron registros"

                      >
      <template  v-slot:body-cell-diasVencido="props" >

            <q-td :props="props"
              :class="(props.row.diferencia > 0)?'text-red radius':'text-white radius'"
                >
                {{props.value}}
        </q-td>

      </template>
       <template  v-slot:body-cell-Vencido="props" >

            <q-td :props="props"
              :class="(props.row.diferencia > 0)?'text-red radius':'text-white radius'"
                >
                {{props.value}}
        </q-td>

      </template>
      <template v-slot:item="props">
        <q-list class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item>
                <q-item-section>
                  <q-item-label >{{props.row.factura}}</q-item-label>
                </q-item-section>
                 </q-item>
              <q-separator></q-separator>
            </q-list>
            </template>
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
      ordenes: [],
      columns: [
        { name: 'cliente', required: true, label: 'client corp', align: 'left', field: row => row.buyOrder.Client.name, sortable: true },
        { name: 'Vendedor', required: true, label: 'Vendedor', align: 'left', field: row => this.buscarvendedor(row), sortable: true },
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: row => row.factura, sortable: true },
        { name: 'paid', label: 'Monto $', field: row => row.paid + '$', sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: row => row?.dateIn, format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true },
        { name: 'dateOrd', label: 'Fecha de Entrega', field: row => this.obtenerfecha(row), sortable: true },
        { name: 'diasVencido', required: true, label: 'Fecha Vencimiento', align: 'left', field: row => this.calculardias(row), sortable: true },
        { name: 'Vencido', required: true, label: 'Dias Vencido(s)', align: 'left', field: row => row.diferencia > 0 ? row.diferencia : '', sortable: true }

      ]
    }
  },
  async mounted () {
    let obj
    if (!this.ordercorporativo2.length) { await this.bindOrderscorp() }
    for (let i = 0; i < this.ordercorporativo2.length; i++) {
      obj = this.ordercorporativo2[i]
      console.log('here')
      if (obj.typePayment === null) {
        // if (obj.typePayment === null && typeof obj.statusLog !== 'undefined') {
        this.ordenes.push(obj)
        console.log('he3re!')
      }
    }
    console.log(this.ordenes, 'ordenes', this.ordercorporativo2)
  },
  watch: {
    ordenes () {
      console.log('cambio')
    },
    ordercorporativo2 () {
      let obj
      this.ordenes = []
      for (let i = 0; i < this.ordercorporativo2.length; i++) {
        obj = this.ordercorporativo2[i]
        if (obj.typePayment === null && obj.statusLog !== undefined) {
          this.ordenes.push(obj)
        }
      }
    }
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
    buscarvendedor (objeto) {
      let seller
      let keys
      seller = objeto.buyOrder.Branch?.Vendedor
      console.log('El Vendedor', seller)
      if (seller !== undefined) {
        keys = Object.keys(seller)
        console.log('este es el keys', keys)
      }
      if (keys !== undefined) {
        return seller[keys]?.nombre
      }
    },
    buscartipopago (objeto) {
      let obj
      console.log('el tipo de pago', objeto.typePayment)
      obj = this.typePayment_options.find(x => x.value === objeto.typePayment)

      if (obj !== undefined) {
        return obj.label
      }
    },
    obtenerfecha (objeto) {
      let objetoconvertido
      if (objeto?.statusLog !== undefined) {
        for (let i = 0; i < objeto.statusLog.length; i++) {
          if (objeto?.statusLog[i]?.receptor !== undefined) {
            objetoconvertido = Object.assign({}, objeto?.statusLog[i])
            console.log('objeto convertido', objetoconvertido)
          }
        }
      }

      if (objetoconvertido === undefined && objetoconvertido?.receptor === undefined) {
        return 'No Entregado'
      } else {
        return date.formatDate(objetoconvertido?.dateIn.toDate(), 'MM-DD YYYY HH:mm')
      }
    },
    calculardias (objeto) {
      let dias
      let objetoconvertido
      if (objeto?.statusLog !== undefined) {
        for (let i = 0; i < objeto.statusLog.length; i++) {
          objetoconvertido = Object.assign({}, objeto?.statusLog[i])
          //  if (objetoconvertido.receptor !== undefined) {
          let fecha = new Date(objetoconvertido?.dateIn.toDate())
          let fecha2 = new Date(objetoconvertido?.dateIn.toDate())
          objeto.hoy = new Date()
          if (objeto?.creditDays === undefined || objeto?.creditDays === undefined) {
            dias = 0
          } else {
            dias = objeto.creditDays
          }
          objeto.diasVencido = new Date(fecha.setDate(fecha.getDate() + Number(dias)))
          objeto.diferencia = Math.trunc((objeto.hoy.getTime() - objeto.diasVencido.getTime()) / (1000 * 3600 * 24))
          console.log('el nuevo objeto', objeto)
          return date.formatDate(fecha2.setDate(fecha2.getDate() + Number(dias)), 'MM-DD YYYY HH:mm')
        }
      }
    }

  },
  computed: {
    ...mapGetters('order', ['ordercorporativo2', 'allestatus', 'tipoServicio', 'typePayment_options'])
  }
}
</script>
