<template>
<div>
    <div class="center q-ma-md col-12 row justicy-center">
                <q-table  class="q-mt-md full-width" :title="'Cliente Corporativo'"
                    style="border-radius: 28px"
                      :data="ordercorporativo"
                      :columns="columns"

                      no-data-label="No se encontraron registros"

                      >
<template v-slot:top-right>
        <div class="q-mr-sm">
      <q-badge v-if="dateRange !== null " color="blue-grey">
        {{ dateRange.from }} - {{ dateRange.to }}
      </q-badge>
       <q-badge v-else>
        Últimos 30 días
      </q-badge>
    </div>

    <q-btn icon="event" class="q-mr-sm" round color="blue">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date color="blue" v-model="dateRango" range >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Borrar Filtro" @click="dateRango = null" color="white" flat v-close-popup/>
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
        <q-btn no-caps round color="green" push icon="archive" @click="exportTable"/>
      </template>
                </q-table >
    </div>
</div>
</template>
<script>
import { date, exportFile } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
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

  data () {
    return {
      columns: [
        { name: 'cliente', required: true, label: 'client corp', align: 'left', field: row => this.buscarcliente(row), sortable: true },
        { name: 'branches', required: true, label: 'Sucursal', align: 'left', field: row => this.buscarbranches(row), sortable: true },
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: row => row.factura, sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: row => this.buscartipopago(row), sortable: true },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: row => this.buscartiposervicio(row), sortable: true },
        { name: 'status', required: true, label: 'Estatus', field: row => this.buscarstatus(row), sortable: true },
        { name: 'paid', label: 'Monto', field: 'paid', sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: row => row.dateIn, format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true }
      ]
    }
  },
  mounted () {
    this.reportBindOrderscorporativo()
    this.bindClients2()
    this.bindcorporativo({ id: '' })
  },
  watch: {
    ordercorporativo () {
      this.mostrar()
    },
    dateRange (e) {
      if (e === null) {
        return this.reportBindOrderscorporativo().catch(e => console.error(e))
      }
      console.log(e, 'DateRange')
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      this.reportBindOrderscorporativo(
        {
          start: new Date(e.from),
          end: end
        }
      ).catch(e => console.error(e))
    }
  },
  methods: {
    ...mapActions('order', ['reportBindOrderscorporativo', 'alterRange']),
    ...mapActions('client', ['bindClients2']),
    ...mapActions('corporativos', ['bindcorporativo', 'getbranches']),
    buscarcliente (objeto) {
      let obj
      obj = this.clients2.find(x => x.id === objeto.buyOrderClient)
      if (obj !== undefined) {
        return obj.name
      }
    },
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.OrderClient.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'Ordenes.csv',
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
    buscartipopago (objeto) {
      let obj
      console.log('el tipo de pago', objeto.typePayment)
      obj = this.typePayment_options.find(x => x.value === objeto.typePayment)

      if (obj !== undefined) {
        return obj.label
      }
    },
    async buscarbranches (objeto) {
      let obj
      let nombre

      this.bindcorporativo({ id: objeto.buyOrderClient })
      console.log('los branches', objeto.buyOrderBranch)

      obj = await this.getbranches({ id: objeto.buyOrderBranch,
        idcliente: objeto.buyOrderClient,
        ambiente: localStorage.amb })
      console.log('el objeto', obj)
      console.log(localStorage.amb)
      obj.forEach(doc => {
        console.log('valores', doc.data())
        nombre = doc.data().name
      })
      return nombre
      // }
    },
    obtenerbranches (branches) {
      let obj
      obj = this.corporativo.find(x => x.id === branches)
      if (obj !== undefined) {
        return obj.name
      }
    },
    buscartiposervicio (objeto) {
      let obj
      //   console.log('el tipo de servicio ', objeto.tipEnvio)
      // console.log('los valores de servicios', this.tipoServicio)
      obj = this.tipoServicio.find(x => x.value === parseInt(objeto.tipEnvio))
      //  console.log('resultado de la busquedad', obj)
      if (obj !== undefined) {
        return obj.label
      }
    },
    clientOrders (value) {
      return this.clients2.find(obj => {
        return obj.id === value
      })
    },
    sedeOrders (value) {
      return this.localizations.find(obj => {
        return obj.id === value
      })
    },
    buscarstatus (objeto) {
      let obj
      obj = this.allestatus.find(x => x.value === objeto.status)
      if (obj !== undefined) {
        return obj.label
      }
    },
    mostrar () {
      console.log('las ordenes corporativas', this.ordercorporativo)
    }
  },
  computed: {
    ...mapGetters('order', ['ordercorporativo', 'tipoServicio', 'typePayment_options', 'allestatus', 'dateRange', 'ordersClient2']),
    ...mapGetters('client', ['clients2']),
    ...mapGetters('corporativos', ['corporativo']),
    dateRango: {
      get () {
        return this.dateRange
      },
      set (e) {
        this.alterRange(e)
      }
    }
  }
}

</script>
