 <template>
  <div :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-mt-lg'" >
     <div>
  </div>
      <q-table
      v-if="report === 'estandar'"
      class="table"
      :loading="loading"
      style="border-radius: 28px"
      title="Ordenes"
      :data="ordersfilter"
      :columns="columns"
      :grid="$q.screen.lt.md"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label=" "
      >

     <template v-slot:top-right>
        <tabletop
        :filtrado="filtrado"
        :report="report"
        :dateRange="dateRange"
        :dateRango="dateRango"
        @exportTable="exportTable"
        @report="(e) => report = e"
        @dateRango="(e) => dateRango = e"
        @filtrado="(e) => filtrado = e" />
</template>

      <template v-slot:body="props">
        <tablestandard :item="false" :props="props"  @routerpush="(e) => $router.push({ path: '/orders/show', query: { Order_Id: e } })" />
      </template>
      <template v-slot:item="props">
        <tablestandard :item="true" :props="props" @routerpush="(e) => $router.push({ path: '/orders/show', query: { Order_Id: e } })" />
      </template>
    </q-table>
  <q-table flat bordered
  v-if="report === 'tproducts'"
    class="table"
      :loading="loading"
      style="border-radius: 28px"
      title="Total de productos Vendidos"
    :data="dataprod.data"
    :visible-columns="['nombre', 'monto', 'cantidad']"
    row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label=" "
  >
  <template v-slot:bottom-row>
        <q-tr>
          <q-td></q-td>
          <q-td class="text-left">
        Total => {{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(parseFloat(dataprod.total))}}
        </q-td >
        <q-td class="text-right" > <strong>Cantidad => {{dataprod.cantidad}}</strong></q-td>

        </q-tr>
      </template>
  <template v-slot:top-right>
          <tabletop
          :filtrado="filtrado"
          :report="report"
          :dateRange="dateRange"
          :dateRango="dateRango"
          :allestatus="allestatus"
          :statusFilter="statusFilter"
          @exportTable="exportTable"
          @report="(e) => report = e"
          @dateRango="(e) => dateRango = e"
          @statusFilter="(e) => statusFilter = e"
          @filtrado="(e) => filtrado = e">

          </tabletop>
          <q-btn  @click="Marcar()"> Quitar Filtro</q-btn>
  </template>
 </q-table>
</div>
</template>

<script>
import { exportFile, date } from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import tablestandard from '../../components/order/tablestandard.vue'
import tabletop from '../../components/order/tabletopright.vue'

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
  components: { tablestandard, tabletop },
  computed: {
    ...mapGetters('corporativos', ['branches']),
    ...mapGetters('order', ['orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus', 'Ordersfilter']),
    ...mapGetters('client', ['clients', 'clients2']),
    ...mapGetters('localization', ['localizations']),
    dataprod () {
      let prods = {}
      // let prodPrice = 0
      console.log('dataprod', this.ordersfilter)
      for (let order of this.ordersfilter) {
        let productos = order.productos
        if (productos) {
          Object.keys(productos).forEach(key => {
            console.log(key, 'key')
            let producto = productos[key]
            let oldprod = prods[producto.prodId]
            console.log('producto viejo', oldprod)
            console.log(producto, 'prod')
            prods[producto.prodId] = {
              quantity: oldprod && oldprod.quantity ? oldprod.quantity + producto.quantity : producto.quantity,
              monto: oldprod && oldprod.monto ? (oldprod.monto) + (producto.prodPrice * producto.quantity) : producto.prodPrice * producto.quantity,
              name: producto.name,
              id: producto.prodId
            }
          })
        }
      }
      let out = []
      let total = 0
      let cantidad = 0
      console.log(prods, 'PRODS')
      Object.keys(prods).forEach(key => {
        let producto = prods[key]
        out.push({
          id: producto.id,
          nombre: producto.name,
          monto: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(producto.monto),
          cantidad: producto.quantity
        })
        total = total + producto.monto
        cantidad = cantidad + producto.quantity
      })
      total = total.toFixed(2) + ' $'
      return { data: out, total, cantidad }
    },
    dateRango: {
      get () {
        return this.dateRange
      },
      set (e) {
        this.alterRange(e)
      }
    },
    OrderClient () {
      let OrderClient = []
      let i, obj, clientforOrder, tipoPago, sedeforOrder, sucursalforOrder
      let fullname, statusOrder, typeService, nameSede
      if (typeof this.$route.query.status !== 'undefined') {
        this.setear()
      }
      for (i = 0; i < this.ordersClient.length; i++) {
        obj = this.ordersClient[i]
        /// Fncion filtro aqui
        let filterType = this.filtroOrderType(obj) // --- return true si statusFilter.include(statusOrder) || statusFilter.lenght[0]
        if (((typeof this.$route.query.status !== 'undefined') && (parseInt(this.$route.query.status) === obj.status))) {
          if (obj.tipEnvio === '3') {
            console.log(obj)
            clientforOrder = obj.buyOrder.Client
            sucursalforOrder = obj.buyOrder.Branch
            console.log('valores retornados', sucursalforOrder)
            sedeforOrder = obj.sede
            fullname = clientforOrder?.name + '-' + sucursalforOrder?.name
            nameSede = sedeforOrder?.name
            typeService = this.buscartiposervicio(obj)
            console.log('los tipos de servicios', typeService)
            if (typeof obj.typePayment !== 'undefined') {
              tipoPago = this.buscartipopago(obj)
              console.log('los tipos de pagos', tipoPago)
            } else { tipoPago = '' }
            statusOrder = this.buscarstatus(obj)
          } else {
            clientforOrder = obj.customer
            sedeforOrder = obj.sede
            fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
            nameSede = typeof sedeforOrder !== 'undefined' ? sedeforOrder.name : 'No disponible'
            typeService = typeof obj.tipEnvio !== 'undefined' && obj.tipEnvio !== null ? this.tipoServicio[obj.tipEnvio]['label'] : 'No disponible'
            if (typeof obj.typePayment !== 'undefined') {
              tipoPago = this.typePayment_options && this.typePayment_options[obj.typePayment] && this.typePayment_options[obj.typePayment]['label'] ? this.typePayment_options[obj.typePayment]['label'] : ''
            } else { tipoPago = '' }
            statusOrder = typeof obj.status !== 'undefined' ? this.allestatus[obj.status]['label'] : ''
          }
          this.Status({ status: this.$route.query.status })
          let mtoTotal = obj.paid
          OrderClient.push({
            'id': obj.id,
            'nombre': fullname,
            'typePayment': tipoPago,
            'nameSede': nameSede,
            'status': statusOrder,
            'paid': mtoTotal,
            'productos': obj.productos,
            'dateIn': obj.dateIn,
            'dateOrd': typeof obj.orderWhen !== 'undefined' && obj.orderWhen.orderWhen === '1' ? obj.orderWhen.orderDate : 'NA',
            'factura': obj.factura,
            'vuelto': obj?.vuelto,
            // 'table': tableOrder,
            'typeService': typeService
          })
        }
        if (filterType && !(typeof this.$route.query.status !== 'undefined' && !(parseInt(this.$route.query.status) === this.ordersClient[i].status))) {
          if (obj.tipEnvio === '3') {
            console.log(obj)
            clientforOrder = obj.buyOrder.Client
            sucursalforOrder = obj.buyOrder.Branch
            console.log('valores retornados', sucursalforOrder)
            sedeforOrder = obj.sede
            fullname = clientforOrder?.name + '-' + sucursalforOrder?.name
            nameSede = sedeforOrder?.name
            typeService = this.buscartiposervicio(obj)
            console.log('los tipos de servicios', typeService)
            if (typeof obj.typePayment !== 'undefined') {
              tipoPago = this.buscartipopago(obj)
              console.log('los tipos de pagos', tipoPago)
            } else { tipoPago = '' }
            statusOrder = this.buscarstatus(obj)
          } else {
            clientforOrder = obj.customer
            sedeforOrder = obj.sede
            fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
            nameSede = typeof sedeforOrder !== 'undefined' ? sedeforOrder.name : 'No disponible'
            typeService = typeof obj.tipEnvio !== 'undefined' && obj.tipEnvio !== null ? this.tipoServicio[obj.tipEnvio]['label'] : 'No disponible'
            if (typeof obj.typePayment !== 'undefined') {
              tipoPago = this.typePayment_options && this.typePayment_options[obj.typePayment] && this.typePayment_options[obj.typePayment]['label'] ? this.typePayment_options[obj.typePayment]['label'] : ''
            } else { tipoPago = '' }
            statusOrder = typeof obj.status !== 'undefined' ? this.allestatus[obj.status]['label'] : ''
          }
          let mtoTotal = obj.paid

          if (typeof this.$route.query.status === 'undefined') {
            this.Status({ status: 3 })
            OrderClient.push({
              'id': obj.id,
              'nombre': fullname,
              'typePayment': tipoPago,
              'nameSede': nameSede,
              'status': statusOrder,
              'paid': mtoTotal,
              'productos': obj.productos,
              'dateIn': obj.dateIn,
              'dateOrd': typeof obj.orderWhen !== 'undefined' && obj.orderWhen.orderWhen === '1' ? obj.orderWhen.orderDate : 'NA',
              'factura': obj.factura,
              'vuelto': obj?.vuelto,
              // 'table': tableOrder,
              'typeService': typeService
            })
          }
        }
      }

      this.Ordersfilter2({ Ordersfilter: OrderClient })

      this.setearruta()

      return OrderClient
    },
    filtrado: {
      get () {
        return this.texto
      },
      set (value) {
        console.log(value)
        value = value.toLowerCase()

        this.ordersfilter = this.OrderClient.filter(function (item) {
          console.log('este valor de item', item)
          if (item.nombre !== undefined) {
            return item.nombre.toLowerCase().indexOf(value) !== -1
          }
        })
        this.texto = value
        console.log('nuevos valores', this.ordersfilter)
      }
    }
  },
  async mounted () {
    this.loading = true
    // if (!this.branches.length) {
    //   await this.bindonlybranches().catch(e => console.error(e))
    // }
    // if (!this.clients.length) {
    //   await this.bindClients().catch(e => console.error(e))
    // }
    // if (!this.localizations.length) {
    //   await this.bindLocalizations().catch(e => console.error(e))
    // }
    // if (!this.clients2.length) {
    //   await this.bindClients2().catch(e => console.error(e))
    // }
    console.log('el valor de route Id orden', this.$route.query.valor)
    if (typeof this.$route.query.valor !== 'undefined') {
      console.log('los valores de arreglo', this.Ordersfilter)
      this.ordersfilter = this.Ordersfilter
    }

    if (!this.orders.length) {
      await this.bindOrders(this.getDateRange()).catch(e => console.error(e))
    }
    return (() => { this.loading = false; this.mostrar() })()
  },
  watch: {
    // branches () {
    //   console.log('los branches', this.branches)
    // },
    orders () {
      this.mostrar()
    },
    async dateRange (e) {
      this.loading = true
      if (e === null) {
        return this.bindOrders().then(() => {
          this.loading = false
        }).catch(e => console.error(e))
      }
      console.log(e, 'DateRange')
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      await this.bindOrders(
        {
          start: new Date(e.from),
          end: end
        }
      ).then(() => {
        this.loading = false
      }).catch(e => console.error(e))
    },
    statusFilter () {
    },
    OrderClient () {
      if (this.estado) {
        this.ordersfilter = this.OrderClient.concat(this.ordersfilter)
      } else {
        this.ordersfilter = this.OrderClient
      }
    },
    seleccionado () {

    }
    /* Ordersfilter () {
      this.ordersfilter = this.Ordersfilter
    } */
  },
  methods: {
    filtroOrderType (objeto) {
      let obj
      let valor = false
      for (let i = 0; i < this.statusFilter.length; i++) {
        obj = this.statusFilter[i]
        if (obj !== objeto.status) {
          valor = false
        } else {
          valor = true
          return valor
        }
      }
      this.estado = valor
      return valor
    },
    setearruta () {
      this.$route.query.status = undefined
    },
    guardarordersfilter () {
      this.Ordersfilter2({ Ordersfilter: this.ordersfilter })
    },
    getDateRange () {
      if (this.dateRange === null) {
        return null
      }
      let e = this.dateRange
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      return {
        start: new Date(e.from),
        end: end
      }
    },

    Marcar () {
      console.log('los valor se seleccionado', this.seleccionado)

      this.statusFilter = []
    },
    setear () {
      this.statusFilter = []
      // this.statusFilter[0] = parseInt(this.$route.query.status)
      /* this.OrderClient = this.OrderClient.filter((item, index) => {
        return this.OrderClient.indexOf(item) === index
      }) */
    },
    buscartiposervicio (objeto) {
      let obj

      obj = this.tipoServicio.find(x => x.value === parseInt(objeto.tipEnvio))
      console.log('resultado de la busquedad', obj)
      if (obj !== undefined) {
        return obj.label
      }
    },
    buscarsurcursal2 (objeto) {
      let obj
      obj = this.buscarsurcursal(objeto)
      return obj
    },
    buscarsurcursal (objeto) {
      console.log('entra objeto', objeto)

      let reg = this.branches.find(x => x.id === objeto.buyOrderBranch)
      console.log('resultado de busquedad', reg)
      return reg
    },

    buscartipopago (objeto) {
      let obj
      console.log('el tipo de pago', objeto.typePayment)
      obj = this.typePayment_options.find(x => x.value === objeto.typePayment)

      if (obj !== undefined) {
        return obj.label
      }
    },
    buscarstatus (objeto) {
      let obj
      obj = this.allestatus.find(x => x.value === objeto.status)
      if (obj !== undefined) {
        return obj.label
      }
    },
    // sedeOrders (value) {
    //   return this.localizations.find(obj => {
    //     return obj.id === value
    //   })
    // },
    mostrar () {
      this.ordersfilter = this.OrderClient
      console.log(this.branches, 'BRANCHES')
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
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.ordersClient.length}`
    },
    // ...mapActions('corporativos', ['bindonlybranches']),
    ...mapActions('order', ['deleteOrder', 'bindOrders', 'alterRange', 'Status', 'Ordersfilter2']),
    // ...mapActions('localization', ['bindLocalizations']),
    // ...mapActions('client', ['bindClients', 'bindClients2']),

    deleted () {
      this.deleteOrder(this.selected)
    }
  },
  data () {
    return {
      statusFilter: [3],
      report: 'estandar',
      loading: false,
      seleccionado: true,
      selected: [],
      estado: false,
      arrecleinte: [],
      arreglobranches: [],
      OrderClient2: [],
      ordersfilter: [],
      ordersfilter2: [],
      opt: [],
      selection: [],
      texto: '',
      columns: [
        { name: 'nameSede', required: true, label: 'Sede', align: 'left', field: 'nameSede', sortable: true },
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: row => row.factura, sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre', sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: 'typePayment', sortable: true },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService', sortable: true },
        { name: 'status', required: true, label: 'Estatus', field: 'status', sortable: true },
        { name: 'paid', label: 'Monto', field: row => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(row.paid), sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: 'dateIn', format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true },
        { name: 'dateOrd', label: 'Fecha de Entrega', field: 'dateOrd', format: val2 => val2 !== 'NA' && typeof val2 !== 'undefined' ? date.formatDate(val2.toDate(), 'MM-DD YYYY HH:mm') : 'De inmediato', sortable: true }
      ]

    }
  }
}
</script>
<style lang="stylus">
 .table
  width: 100%
.notificacion {
  border-radius: 20px;
  border: 2px solid #FFF;
}
.notificacion:hover{
  padding-top: 1%;
}
</style>
