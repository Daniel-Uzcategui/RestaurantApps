<template>
    <div>
      <q-table :loading="loading"  class="q-mt-md full-width" :title="'Total Venta X Vendedor'"
                    style="border-radius: 28px"
                      :data="ordersfilter"
                      :columns="columns"

                      no-data-label="No se encontraron registros"

                      >
<template v-slot:top-right>
  <q-input label="Buscar Vendedor" v-model="filtrado" filled  />
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
        <q-btn no-caps round color="green" push icon="archive" />
      </template>
       <template v-slot:body-cell-boton1 ="props" id=1>
             <q-td :props="props" class="q-pa-md q-gutter-sm">
              <q-btn  q-btn dense round flat color="grey" icon="list" @click="listar(props.row)" />
              </q-td>
        </template>

 </q-table>
     <q-dialog  v-model="ver" transition-show="rotate" transition-hide="rotate"  style="max-width: 80% !important;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;">
      <q-card style="margin: 0px;
          padding: 0px;
          overflow-x: hidden; max-width: 80% !important;">
        <q-card-section>
          <div class="text-h6">Ordenes</div>
        </q-card-section>
          <q-card-section>
            <q-table  style="margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          class="q-fullscreen-glassMorph full-width" :title="'Ordenes'"
                      :data="detalle2"
                      :columns="columns2"

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
              </q-table>
        </q-card-section>
        <q-card-actions align="right">

            <q-btn flat label="Aceptar" rounded color="white" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
</template>
<script>
import { date } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      ArreVendores: [],
      detalle: [],
      detalle2: [],
      ver: false,
      ordersfilter: [],
      texto: '',
      aux: [],
      columns: [
        { name: 'nombre', required: true, align: 'center', label: 'Vendedor', field: row => row.name, sortable: true },
        { name: 'email', required: true, align: 'center', label: 'email', field: row => row.email, sortable: true },
        { name: 'paid', label: 'Monto', field: row => row.monto, sortable: true },
        { name: 'cantidad', label: 'cantidad Ventas', field: row => row.cantidad, sortable: true },
        { name: 'boton1', label: '', sortable: true }
      ],
      columns2: [
        { name: 'Sede', required: true, label: 'Sede', align: 'left', field: row => row.sede, sortable: true },
        { name: 'cliente', required: true, label: 'Cliente', align: 'left', field: row => row.cliente, sortable: true },
        { name: 'nameSede', required: true, label: 'Orden', align: 'left', field: row => row.factura, sortable: true },
        { name: 'credito', required: true, label: 'Dias Credito', align: 'left', field: row => row.credito, sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: 'dateIn', format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true },
        { name: 'dateOrd', label: 'Fecha de Entrega', field: row => this.obtenerfecha(row), sortable: true },
        { name: 'email', required: true, align: 'center', label: 'Monto', field: row => row.paid, sortable: true },
        { name: 'diasVencido', required: true, label: 'Fecha Vencimiento', align: 'left', field: row => this.calculardias(row), sortable: true },
        { name: 'Vencido', required: true, label: 'Dias Vencido(s)', align: 'left', field: row => row.diferencia, sortable: true }
      ]
    }
  },
  async mounted () {
    this.loading = true
    if (!this.orders.length) {
      await this.bindOrders(this.getDateRange())
    }

    // if (!this.clients2.length) {
    //   await this.bindClients2()
    // }
    // if (!this.localizations.length) {
    //   await this.bindLocalizations()
    // }
    // if (!this.vendedor.length) {
    //   await this.bindOnlyVendedor()
    // }

    return (() => { this.loading = false; this.mostrar() })()
  },
  methods: {
    ...mapActions('order', ['bindOrders', 'alterRange']),
    ...mapActions('client', ['bindOnlyVendedor', 'bindClients2']),
    ...mapActions('localization', ['bindLocalizations']),
    ...mapActions('corporativos', ['getbranches2']),
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
    obtenerstatus (objeto) {
      let obj
      obj = this.allestatus.find(x => x.value === objeto.status)
      if (obj !== undefined) {
        return obj.label
      }
    },
    obtenerfecha (objeto) {
      let objetoconvertido
      console.log('los valores', objeto)
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
      console.log('los valores2', objeto)
      if (objeto?.statusLog !== undefined) {
        console.log('el tamaño del ', objeto.statusLog.length)
        for (let i = 0; i < objeto.statusLog.length; i++) {
          objetoconvertido = Object.assign({}, objeto?.statusLog[i])
          //  if (objetoconvertido.receptor !== undefined) {
          let fecha = new Date(objetoconvertido?.dateIn.toDate())
          let fecha2 = new Date(objetoconvertido?.dateIn.toDate())
          objeto.hoy = new Date()
          if (objeto?.credito === undefined) {
            dias = 0
          } else {
            dias = objeto.credito
          }
          console.log('los dias de credito', dias, objeto.creditDays)
          objeto.diasVencido = new Date(fecha.setDate(fecha.getDate() + Number(dias)))
          objeto.diferencia = Math.trunc((objeto.hoy.getTime() - objeto.diasVencido.getTime()) / (1000 * 3600 * 24))
          console.log('el nuevo objeto', objeto)
          return date.formatDate(fecha2.setDate(fecha2.getDate() + Number(dias)), 'MM-DD YYYY HH:mm')
        }
      }
    },
    mostrar () {
      let obj, obj2, obj3, sede
      let montototal = 0
      let cantidad = 0
      let auxvendedor = ''
      this.aux = []
      this.ordersfilter = []
      this.ArreVendores = []

      console.log('estas son todas las ordenes', this.orders)
      for (let i = 0; i < this.orders.length; i++) {
        obj3 = this.orders[i]
        if (obj3.tipEnvio === '3' && (obj3.status === 3)) {
          this.aux.push(obj3)
        }
      }
      this.aux.sort((a, b) => {
        if (a.customer_id < b.customer_id) {
          return -1
        } else if (a.customer_id > b.customer_id) {
          return 1
        } else {
          return 0
        }
      })
      console.log('el arreglo ordenado', this.aux)
      for (let i = 0; i < this.aux.length; i++) {
        obj = this.aux[i]

        if (obj !== undefined) {
          let k = i + 1
          if (k <= (this.aux.length)) {
            obj2 = this.aux[k]
            if (obj2 !== undefined) {
              if (obj.customer_id === obj2.customer_id) {
                montototal = montototal + obj.paid
                cantidad = cantidad + 1

                if (i === (this.aux.length - 1)) {
                  auxvendedor = obj.customer
                  sede = obj.sede
                  this.ArreVendores.push({
                    id: obj.id,
                    idcustomer: obj.customer_id,
                    sede: sede?.name,
                    name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                    email: auxvendedor?.email,
                    monto: montototal,
                    cantidad: cantidad,
                    vuelto: obj?.vuelto
                  })
                }
              } else {
                if (obj?.status === 3) {
                  montototal = montototal + obj.paid
                  cantidad = cantidad + 1
                  auxvendedor = obj.customer
                  sede = obj.sede
                  this.ArreVendores.push({
                    id: obj.id,
                    idcustomer: obj.customer_id,
                    sede: sede?.name,
                    name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                    email: auxvendedor?.email,
                    monto: montototal,
                    cantidad: cantidad,
                    vuelto: obj?.vuelto
                  })
                }
                montototal = 0
                cantidad = 0
              }
            } else {
              console.log('aca', 'el valor de cantidad es', cantidad, 'el valor de i es ', i, 'y tamaño del arreglo es ', this.aux.length, 'el objeto es:', obj.status)
              if ((cantidad > 0) || ((i + 1) === this.aux.length)) {
                if ((obj.status === 3)) {
                  montototal = montototal + obj.paid
                  cantidad = cantidad + 1
                  // sede = obj.sede
                  sede = obj.sede.name
                  // auxvendedor = obj.customer
                  auxvendedor = obj.customer
                  this.ArreVendores.push({
                    id: obj.id,
                    idcustomer: obj.customer_id,
                    dateIn: obj?.dateIn,
                    sede: sede?.name,
                    name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                    email: auxvendedor?.email,
                    monto: montototal,
                    cantidad: cantidad,
                    vuelto: obj?.vuelto
                  })
                } else {
                  let encontrado = this.ArreVendores.find(x => x.id === obj.id)
                  if (encontrado === undefined) {
                    sede = obj.sede
                    auxvendedor = obj.customer
                    this.ArreVendores.push({
                      id: obj.id,
                      idcustomer: obj.customer_id,
                      dateIn: obj?.dateIn,
                      sede: sede?.name,
                      name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                      email: auxvendedor?.email,
                      monto: montototal,
                      cantidad: cantidad,
                      vuelto: obj?.vuelto
                    })
                  }
                }
              }
            }
          } else {
            obj2 = this.aux[i - 1]
            if (obj.customer_id === obj2.customer_id) {
              this.ArreVendores[this.ArreVendores.length - 1].monto = this.ArreVendores[this.ArreVendores.length - 1].monto + obj.paid
            } else {
              montototal = obj.paid
              cantidad = cantidad + 1
              sede = obj.sede
              auxvendedor = obj.customer
              this.ArreVendores.push({
                id: obj.id,
                idcustomer: obj.customer_id,
                dateIn: obj?.dateIn,
                sede: sede?.name,
                name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                email: auxvendedor?.email,
                monto: montototal,
                cantidad: cantidad,
                vuelto: obj?.vuelto
              })
            }
          }
        }
      }
      this.ArreVendores.sort((a, b) => {
        if (a.dateIn < b.dateIn) {
          return -1
        } else if (a.customer_id > b.customer_id) {
          return 1
        } else {
          return 0
        }
      })
      this.ordersfilter = this.ArreVendores
      console.log('el arreglo', this.ArreVendores)
      return this.ArreVendores
    },
    async listar (objeto) {
      let obj, sede, clientes
      // let corp
      //  let cred
      console.log('el objeto', objeto)
      this.ver = true
      this.detalle2 = []
      this.detalle = this.orders.filter(x => ((x.customer_id === objeto.idcustomer) && (x.status === 3) && (x.tipEnvio === '3')))
      for (let i = 0; i < this.detalle.length; i++) {
        obj = this.detalle[i]
        sede = obj.sede
        if (obj?.buyOrderBranch !== undefined) {
          console.log('el ambiente', localStorage.amb, 'id del cliente', obj.buyOrderClient)
        }

        clientes = obj.buyOrder.Client

        this.detalle2.push({
          id: obj.id,
          factura: obj.factura,
          dateIn: obj.dateIn,
          status: obj.status,
          paid: obj.paid,
          sede: sede.name,
          credito: parseFloat(obj.creditDays) || 0,
          cliente: clientes?.name || 'Nombre no encontrado',
          statusLog: obj?.statusLog
        })
      }
      console.log('los detalles', this.detalle)
    }
  },

  computed: {
    ...mapGetters('order', ['orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus']),
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('client', ['vendedor', 'clients2']),
    dateRango: {
      get () {
        return this.dateRange
      },
      set (e) {
        this.alterRange(e)
      }
    },
    filtrado: {
      get () {
        return this.texto
      },
      set (value) {
        console.log(value)
        value = value.toLowerCase()

        this.ordersfilter = this.ArreVendores.filter(function (item) {
          console.log('este valor de item', item)
          if (item.name !== undefined) {
            return item.name.toLowerCase().indexOf(value) !== -1
          }
        })
        this.texto = value
        console.log('nuevos valores', this.ordersfilter)
      }
    }

  },
  watch: {
    orders () {
      console.log('ordenes', this.orders, 'cantidad ordenes', this.orders.length)
      this.mostrar()
    },

    // localizations () {
    //   console.log('sedes', this.localizations, 'cantidad sedes', this.localizations.length)
    // },
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
      }).catch(e => {
        this.loading = false
        console.error(e)
      })
    }
    // vendedor () {
    //   console.log('vendedores', this.vendedor)
    // }

  }

}
</script>
