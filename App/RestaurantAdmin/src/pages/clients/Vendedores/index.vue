<template>
    <div>
    <q-card class="my-card " >
     <q-input label="Buscar Cliente" v-model="filtrado" filled  />
    </q-card>
      <q-table  class="q-mt-md full-width" :title="'Total Venta X Vendedor'"
                    style="border-radius: 28px"
                      :data="ordersfilter"
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
        <q-btn no-caps round color="green" push icon="archive" />
      </template>
       <template v-slot:body-cell-boton1 ="props" id=1>
             <q-td :props="props" class="q-pa-md q-gutter-sm">
              <q-btn  q-btn dense round flat color="grey" icon="list" @click="listar(props.row)" />
              </q-td>
        </template>

 </q-table>
     <q-dialog v-model="ver" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ordenes</div>
        </q-card-section>
          <q-card-section>
            <q-table  class="q-mt-md full-width" :title="'Ordenes'"
                    style="border-radius: 28px"
                      :data="detalle"
                      :columns="columns2"

                      no-data-label="No se encontraron registros"

                      >
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
      ArreVendores: [],
      detalle: [],
      ver: false,
      ordersfilter: [],
      texto: '',
      aux: [],
      columns: [
        { name: 'nameSede', required: true, label: 'Sede', align: 'left', field: row => row.sede, sortable: true },
        { name: 'nombre', required: true, align: 'center', label: 'Cliente', field: row => row.name, sortable: true },
        { name: 'email', required: true, align: 'center', label: 'email', field: row => row.email, sortable: true },
        { name: 'paid', label: 'Monto', field: row => row.monto, sortable: true },
        { name: 'boton1', label: '', sortable: true }
      ],
      columns2: [
        { name: 'nameSede', required: true, label: 'Orden', align: 'left', field: row => row.factura, sortable: true },
        { name: 'dateIn', label: 'Fecha de solicitud', field: 'dateIn', format: val => date.formatDate(val.toDate(), 'MM-DD YYYY HH:mm'), sortable: true },
        { name: 'email', required: true, align: 'center', label: 'Monto', field: row => row.paid, sortable: true }
      ]
    }
  },
  mounted () {
    this.bindLocalizations()
    this.bindOnlyVendedor()
    this.bindOrders()
  },
  methods: {
    ...mapActions('order', ['bindOrders', 'alterRange']),
    ...mapActions('client', ['bindOnlyVendedor']),
    ...mapActions('localization', ['bindLocalizations']),
    mostrar () {
      let obj, obj2, obj3, sede
      let montototal = 0
      let auxvendedor = ''
      console.log('estas son todas las ordenes', this.orders)
      for (let i = 0; i < this.orders.length; i++) {
        obj3 = this.orders[i]
        this.aux.push(obj3)
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
          if (k <= this.aux.length) {
            obj2 = this.aux[k]
            if (obj2 !== undefined) {
              if (obj.customer_id === obj2.customer_id) {
                if (obj?.status === 3) {
                  montototal = montototal + obj.paid
                }
              } else {
                montototal = montototal + obj.paid
                auxvendedor = this.vendedor.find(x => x.id === obj.customer_id)
                sede = this.localizations.find(x => x.id === obj.sede)
                this.ArreVendores.push({
                  id: obj.id,
                  idcustomer: obj.customer_id,
                  sede: sede?.name,
                  name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                  email: auxvendedor?.email,
                  monto: montototal
                })
                montototal = 0
              }
            }
          } else {
            obj2 = this.aux[i - 1]
            if (obj.customer_id === obj2.customer_id) {
              this.ArreVendores[this.ArreVendores.length - 1].monto = this.ArreVendores[this.ArreVendores.length - 1].monto + obj.paid
            } else {
              montototal = obj.paid
              sede = this.localizations.find(x => x.id === obj.sede)
              auxvendedor = this.vendedor.find(x => x.id === obj.customer_id)
              this.ArreVendores.push({
                id: obj.id,
                idcustomer: obj.customer_id,
                dateIn: obj?.dateIn,
                sede: sede?.name,
                name: auxvendedor?.nombre + ' ' + auxvendedor?.apellido,
                email: auxvendedor?.email,
                monto: montototal
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
    listar (objeto) {
      console.log('el objeto', objeto)
      this.ver = true
      this.detalle = this.orders.filter(x => x.customer_id === objeto.idcustomer)
      console.log('los detalles', this.detalle)
    }
  },

  computed: {
    ...mapGetters('localization', ['localizations']),
    ...mapGetters('client', ['vendedor']),
    ...mapGetters('order', ['orders', 'ordersClient', 'typePayment_options', 'dateRange', 'tipoServicio', 'allestatus']),
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
    localizations () {
      console.log('sedes', this.localizations)
    },
    dateRange (e) {
      if (e === null) {
        return this.bindOrders().catch(e => console.error(e))
      }
      console.log(e, 'DateRange')
      this.ArreVendores = []
      let end = new Date(e.to)
      end.setDate(end.getDate() + 1)
      this.bindOrders(
        {
          start: new Date(e.from),
          end: end
        }
      ).catch(e => console.error(e))
    },
    vendedor () {
      console.log('vendedores', this.vendedor)
    },
    orders () {
      this.mostrar()
    }
  }

}
</script>
