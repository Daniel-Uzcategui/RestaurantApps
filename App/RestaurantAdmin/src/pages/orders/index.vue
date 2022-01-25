 <template>
  <div :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-mt-lg'" >
     <div>
  </div>
    <div>
      <q-table flat square
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
        <q-input label="Buscar Cliente" v-model="filtrado" filled  />
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
      <template v-slot:body="props">
        <q-tr :props="props" class="cursor-pointer" @click="$router.push({ path: '/orders/show', query: { Order_Id: props.row.id } })" >
           <q-td v-if="$q.screen.lt.md"  auto-width>
             <q-checkbox />
          </q-td>
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <q-list class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" flat>
              <q-item>
                <q-item-section>
                  <q-item-label>{{props.row.factura}}</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-item-label>{{props.row.status}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-icon name="edit" @click="$router.push({ path: '/orders/show', query: { Order_Id: props.row.id } })" />
              </q-item-section>
              </q-item>
              <q-separator></q-separator>
            </q-list>
        <!-- <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <q-card-section>
              <q-icon name="search" @click="$router.push({ path: '/orders/show', query: { Order_Id: props.row.id } })" />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label :style="$q.screen.lt.md ? 'max-width: 200px' : ''" caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div> -->
      </template>
    </q-table>
 </div>
</div>
</template>

<script>
import { exportFile, date } from 'quasar'
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
    ...mapGetters('corporativos', ['branches']),
    ...mapGetters('order', ['orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus']),
    ...mapGetters('client', ['clients', 'clients2']),
    ...mapGetters('localization', ['localizations']),

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
      for (i = 0; i < this.ordersClient.length; i++) {
        obj = this.ordersClient[i]
        if (!(typeof this.$route.query.status !== 'undefined' && !(parseInt(this.$route.query.status) === this.ordersClient[i].status))) {
          if (obj.tipEnvio === '3') {
            clientforOrder = this.clientOrders2(obj.buyOrderClient)
            sucursalforOrder = this.buscarsurcursal2(obj)
            console.log('valores retornados', sucursalforOrder)
            sedeforOrder = this.sedeOrders(obj.sede)
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
            clientforOrder = this.clientOrders(obj.customer_id)
            sedeforOrder = this.sedeOrders(obj.sede)
            fullname = typeof clientforOrder !== 'undefined' ? clientforOrder.nombre + ' ' + clientforOrder.apellido : 'No disponible'
            nameSede = typeof sedeforOrder !== 'undefined' ? sedeforOrder.name : 'No disponible'
            typeService = typeof obj.tipEnvio !== 'undefined' && obj.tipEnvio !== null ? this.tipoServicio[obj.tipEnvio]['label'] : 'No disponible'
            if (typeof obj.typePayment !== 'undefined') {
              tipoPago = this.typePayment_options && this.typePayment_options[obj.typePayment] && this.typePayment_options[obj.typePayment]['label'] ? this.typePayment_options[obj.typePayment]['label'] : ''
            } else { tipoPago = '' }
            statusOrder = typeof obj.status !== 'undefined' ? this.allestatus[obj.status]['label'] : ''
          }

          let mtoTotal = obj.paid
          OrderClient.push({
            'id': obj.id,
            'nombre': fullname,
            'typePayment': tipoPago,
            'nameSede': nameSede,
            'status': statusOrder,
            'paid': mtoTotal,
            'dateIn': obj.dateIn,
            'dateOrd': typeof obj.orderWhen !== 'undefined' && obj.orderWhen.orderWhen === '1' ? obj.orderWhen.orderDate : 'NA',
            'factura': obj.factura,
            // 'table': tableOrder,
            'typeService': typeService
          })
        }
      }
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
    if (!this.branches.length) {
      await this.bindonlybranches().catch(e => console.error(e))
    }
    if (!this.clients.length) {
      await this.bindClients().catch(e => console.error(e))
    }
    if (!this.localizations.length) {
      await this.bindLocalizations().catch(e => console.error(e))
    }
    if (!this.clients2.length) {
      await this.bindClients2().catch(e => console.error(e))
    }
    if (!this.orders.length) {
      await this.bindOrders(this.getDateRange()).catch(e => console.error(e))
    }
    return (() => { this.loading = false; this.mostrar() })()
  },
  watch: {
    branches () {
      console.log('los branches', this.branches)
    },
    orders () {
      this.mostrar()
    },
    dateRange (e) {
      this.loading = true
      if (e === null) {
        return this.bindOrders().then(() => {
          this.loading = false
        }).catch(e => console.error(e))
      }
      console.log(e, 'DateRange')
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      this.bindOrders(
        {
          start: new Date(e.from),
          end: end
        }
      ).then(() => {
        this.loading = false
      }).catch(e => console.error(e))
    }
  },
  methods: {
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
    // getLogDate (obj) {
    //   let ret = obj.statusLog?.find(x => x.status === 3)
    //   if (typeof ret === 'undefined') {
    //     return new Date()
    //   }
    //   return ret.dateIn.toDate()
    // },
    clientOrders (value) {
      return this.clients.find(obj => {
        return obj.id === value
      })
    },
    clientOrders2 (value) {
      return this.clients2.find(obj => {
        return obj.id === value
      })
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
    sedeOrders (value) {
      return this.localizations.find(obj => {
        return obj.id === value
      })
    },
    mostrar () {
      this.ordersfilter = this.OrderClient
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
    ...mapActions('corporativos', ['bindonlybranches']),
    ...mapActions('order', ['deleteOrder', 'bindOrders', 'alterRange']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('client', ['bindClients', 'bindClients2']),

    deleted () {
      this.deleteOrder(this.selected)
    }
  },
  data () {
    return {
      loading: false,
      selected: [],
      arrecleinte: [],
      arreglobranches: [],
      OrderClient2: [],
      ordersfilter: [],
      texto: '',
      columns: [
        { name: 'nameSede', required: true, label: 'Sede', align: 'left', field: 'nameSede', sortable: true },
        { name: 'factura', required: true, label: 'Nro. Pedido', align: 'left', field: 'factura', sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: 'nombre', sortable: true },
        { name: 'typePayment', required: true, align: 'center', label: 'Tipo de Pago', field: 'typePayment', sortable: true },
        { name: 'typeService', align: 'center', label: 'Tipo de Servicio', field: 'typeService', sortable: true },
        { name: 'status', required: true, label: 'Estatus', field: 'status', sortable: true },
        { name: 'paid', label: 'Monto', field: 'paid', sortable: true },
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
</style>
