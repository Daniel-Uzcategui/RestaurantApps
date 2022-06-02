<template>
    <div>
       <q-btn flat label="Regresar" icon="chevron_left" class="q-ma-md" no-caps to="/corporativo/index" />
         <q-dialog @hide="clieEditar = false" v-model="forma">
           <div class="q-diag-glassMorph q-pa-xs row justify-start">
         <q-form
      @submit="guardar"
      @reset="cancelar" greedy >
         <q-input class="col-12 col-sm-6 q-pa-xs" label="Nombre Sucursal" :rules="[val => evalString(val) || 'Nombre no puede quedar en blanco']" v-model="nombresurculsal"/>
         <q-input class="col-12 col-sm-6 q-pa-xs" label="Razón Social" :rules="[val => evalString(val) || 'Razón Social no puede quedar en blanco']"  v-model="razon"/>
          <q-select options-selected-class="text-orange" class="col-12 col-sm-3 q-pa-xs" label="Prefijo Rif" :rules="[val => evalString(val) || 'No puede quedar en blanco']"  id="sortBy3" v-model="prefijo" :options="options2" />
             <q-input class="col-12 col-sm-6 q-pa-xs" label="Rif" v-model="numerorif" :rules="[val => !!val || 'Solo numeros', validarnumeros]"/>
             <q-select options-selected-class="text-orange" class="col-12 col-sm-6 q-pa-xs" label="Tipo Pago"  id="sortBy1" :rules="[val => typeof val === 'number' || 'No puede quedar en blanco']" v-model="tipopago" map-options emit-value :options="options" />
              <q-select options-selected-class="text-orange" class="col-12 col-sm-6 q-pa-xs" label="Vendedor" id="sortBy2" use-chips multiple  v-model="selle" :options="seller" :option-label="(e) => e.nombre + ' ' + e.apellido"/>
              <q-input class="col-12 col-sm-6 q-pa-xs" label="Dias de Credito" v-if="tipopago === 1" v-model="diacredito"/>
                 <q-input class="col-12 col-sm-6 q-pa-xs" label="Direccion de envio" :rules="[val => val !== 'Agregue dirección' || 'Agregue una direccion']" :value="shippingAddress === null ? 'Agregue dirección': 'Agregado'" readonly >
                    <template v-slot:append>
                <q-btn :rules="[val => false || 'No puede quedar en blanco']" :icon="adShippingDone ? 'done' : 'add'" @click="adShipping = true" />
                    </template>
                 </q-input>
              <div class="col-12 row justify-center q-mt-md">

              <q-btn label="Cancelar" rounded color="red" class="q-ma-md text-bold" no-caps type="reset" v-close-popup/>
              <q-btn v-if="clieEditar" no-caps rounded class="q-ma-md text-bold" label="Guardar" color="blue" icon="save"  type="submit" />
              <q-btn v-else label="Crear" rounded class="q-ma-md text-bold" no-caps color="green"  type="submit"/>
           </div>
         </q-form>
         </div>
              </q-dialog>
          <div class="center q-ma-md col-12 row justicy-center">
                <q-table  class="q-mt-md full-width" :title="'Sucursales ' + getname(clientenombre)"
                    style="border-radius: 28px"
                      :data="clients2Filtered"
                      :columns="columns"
                      :grid="$q.screen.lt.md"
                      no-data-label="No se encontraron registros"

                      >
                      <template v-slot:item="props">
                        <!-- template for mobile view only -->
                        <div
                          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                          :style="props.selected ? 'transform: scale(0.95);' : ''"
                        >
                          <q-card :class="props.selected ? 'bg-grey-2' : ''">
                            <q-card-section>
                              {{props.row.name}}
                            </q-card-section>
                            <q-separator />
                            <q-list dense>
                              <q-item v-show="col.name !== 'Nombre'" v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                                <q-item-section>
                                  <q-item-label>{{ col.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>{{ col.value }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                            <q-separator />
                            <div class="row bg-secondary">
                              <q-btn class="col-6" q-btn dense round flat icon="edit" @click="editar(props.row)" />
                              <q-btn class="col-6"  q-btn dense round flat icon="delete" @click="borrar(props.row)"  />
                            </div>
                          </q-card>
                        </div>
                      </template>
                      <template v-slot:top-right >
                        <div class="row justify-start">
                          <q-select options-selected-class="text-orange" class="col-12 col-sm-6 q-pa-xs" label="Vendedores asignados" id="sortBy2" use-chips multiple  v-model="clientSellers" :options="seller" map-options emit-value :option-value="(e) => e" :option-label="(e) => e.nombre + ' ' + e.apellido"/>
                          <q-btn label="Crear Nuevo" rounded class="q-ma-md text-bold" no-caps color="green" icon="add" @click="initforma()"/>
                          <q-input class="" filled outlined v-model="search" label="Filtro" />
                        </div>
                      </template>
                      <template v-slot:body-cell-boton1 ="props" id=1>
                        <q-td :props="props" class="q-pa-md q-gutter-sm">
                            <q-btn  q-btn dense round flat color="grey" icon="edit" @click="editar(props.row)" />
                          </q-td>
                      </template>
                        <template v-slot:body-cell-boton2 ="props" id=2>
                        <q-td :props="props" class="q-pa-md q-gutter-sm">
                            <q-btn   q-btn dense round flat color="grey" icon="delete" @click="borrar(props.row)"  />
                          </q-td>
                      </template>
                    </q-table >
           </div>
           <q-dialog v-model="adShipping">
            <address-client @input="(e)=> {shippingAddress = e; adShipping = false; adShippingDone = true}" :clientId="idClientSel"/>
          </q-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import addressClient from '../../components/seller/addressClient.vue'
export default {
  components: { addressClient },
  data () {
    return {
      nombresurculsal: '',
      clieEditar: false,
      search: '',
      forma: false,
      shippingAddress: null,
      adShippingDone: false,
      adShipping: false,
      numerorif: '',
      idsuculsal: '',
      razon: '',
      selle: '',
      idselle: '',
      tipopago: null,
      clientenombre: '',
      diacredito: 0,
      model2: '',
      prefijo: '',
      options: [{ label: 'Contado', value: 0 }, { label: 'Credito', value: 1 }],
      options2: ['J', 'V', 'E', 'G'],
      Vendedores: [],
      columns: [
        { name: 'Nombre', required: false, label: 'Nombre', align: 'left', field: row => row?.name, sortable: true },
        { name: 'Rif', required: false, label: 'Rif', field: row => row.Rif?.prefijo && row.Rif?.numero ? row.Rif?.prefijo + '-' + row.Rif?.numero : null, align: 'left', sortable: true },
        { name: 'Razon', required: false, label: 'Razon Social', field: row => row?.RazonSocial, align: 'left', sortable: true },
        // { name: 'Vendedor', required: false, label: 'Vendedor', field: row => row.Vendedor?.name, align: 'left', sortable: true },
        { name: 'creditDays', required: false, label: 'Dias Credito', field: row => row?.creditDays, align: 'left', sortable: true },
        { name: 'tipoPago', required: false, label: 'Tipo Pago', field: row => typeof row?.tipoPago === 'number' ? this.options[row.tipoPago].label : 'NA', align: 'left', sortable: true },
        { name: 'boton1', required: false, label: '', align: 'left', sortable: true },
        { name: 'boton2', required: false, label: '', align: 'left', sortable: true }
      ]
    }
  },
  methods: {
    ...mapActions('corporativos', ['bindcorporativo', 'setValuenew', 'setValueborrar', 'setValueEditados']),
    ...mapActions('client', ['bindOnlyVendedor', 'bindClients2', 'setValue']),
    ...mapActions('seller', ['bindseller']),
    initforma () {
      if (!this.corporativo.length) {
        this.forma = true
        return
      }
      let objeto = this.corporativo[0]
      console.log('los valores', objeto)
      this.idsuculsal = objeto.id
      this.nombresurculsal = objeto?.name
      this.razon = objeto?.RazonSocial
      this.prefijo = objeto.Rif?.prefijo
      this.shippingAddress = objeto?.shippingAddressC
      this.numerorif = objeto.Rif?.numero
      this.tipopago = objeto?.tipoPago
      this.selle = this.modifySellerObj(objeto?.Vendedor)
      this.diacredito = objeto?.creditDays
      this.forma = true
    },
    getname (ob) {
      return ob?.name ? ob.name : ' '
    },
    evalString (val) {
      let value = val ?? ''
      return value.length > 0
    },
    mostrar () {
      let obj
      console.log('los valores de corportivo', this.corporativo)
      console.log('los valores de Vendedores', this.vendedor)
      for (let i = 0; i < this.vendedor.length; i++) {
        obj = this.vendedor[i]
        this.Vendedores.push(obj.nombre)
      }
      this.clientenombre = this.clients2.find(x => x.id === this.idClientSel)
    },
    modifySellerObj (seller) {
      console.log(seller)
      if (Array.isArray(seller)) {
        let newSellerObj = {}
        for (let i of seller) {
          const { id, nombre, apellido, phone, email } = i
          const user = { id, nombre, apellido, phone, email }
          newSellerObj[i.id] = user
        }
        return newSellerObj
      }
      if (!Array.isArray(seller)) {
        if (seller?.id) {
          return [seller]
        }
        let newSellerObj = []
        for (let i in seller) {
          const { id, nombre, apellido, phone, email } = seller[i]
          const user = { id, nombre, apellido, phone, email }
          newSellerObj.push(user)
        }
        return newSellerObj
      }
    },
    guardar () {
      const { nombresurculsal, razon, prefijo, numerorif, tipopago, selle, diacredito, clieEditar } = this
      this.$q.loading.show()
      if (clieEditar) {
        return this.guardarEditado()
      }
      // adShippingDone
      console.log('los valores del prefijo', prefijo)
      let newSellerObj = this.modifySellerObj(selle)
      if (Array.isArray(newSellerObj)) {
        newSellerObj = {}
      }
      this.setValuenew({
        id: this.idClientSel,
        client_id: this.idClientSel,
        name: nombresurculsal,
        RazonSocial: razon,
        shippingAddress: this.shippingAddress.id ?? null,
        shippingAddressC: this.shippingAddress,
        Rif: {
          prefijo: prefijo,
          numero: numerorif
        },
        Vendedor: newSellerObj,
        creditDays: diacredito,
        tipoPago: tipopago

      }).then(() => {
        this.$q.loading.hide()
        this.$q.notify({ message: 'Cliente Guardado', color: 'green' })
        this.inicializar()
      }).catch((e) => {
        console.error(e)
        this.$q.loading.hide()
        this.$q.notify({ message: 'Ocurrió un error, verifique su conexión', color: 'red' })
      })
    },
    cancelar () {
      if (this.clieEditar) {
        this.clieEditar = !this.clieEditar
      }
      this.inicializar()
    },
    validarnumeros (val) {
      const numeroPattern = /^[0-9]{1,}$/
      return numeroPattern.test(val) || 'Invalid Rif'
    },
    inicializar () {
      this.nombresurculsal = ''
      this.razon = ''
      this.prefijo = ''
      this.numerorif = '0'
      this.tipopago = null
      this.selle = []
      this.diacredito = 0
      this.shippingAddress = null
      this.adShippingDone = false
      this.forma = false
    },
    borrar (objeto) {
      this.$q.dialog({
        title: 'Eliminar Sucursal',
        message: '¿Desea Eliminar la Sucursal ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('estos son los valores', objeto)
        this.setValueborrar({ idcliente: this.idClientSel,
          id: objeto.id }).catch(() => {
          this.$q.notify({ message: 'Ocurrió un error, verifique su conexión', color: 'red' })
        })
      }).onCancel(() => {
      })
    },
    editar (objeto) {
      console.log('los valores', objeto)
      this.idsuculsal = objeto.id
      this.nombresurculsal = objeto?.name
      this.razon = objeto?.RazonSocial
      this.prefijo = objeto.Rif?.prefijo
      this.shippingAddress = objeto?.shippingAddressC
      this.numerorif = objeto.Rif?.numero
      this.tipopago = objeto?.tipoPago
      this.selle = this.modifySellerObj(objeto.Vendedor)
      this.diacredito = objeto?.creditDays
      this.clieEditar = true
      this.forma = true
    },
    guardarEditado () {
      const { idsuculsal, nombresurculsal, razon, prefijo, numerorif, tipopago, selle, diacredito, shippingAddress } = this
      let newSellerObj = this.modifySellerObj(selle)
      if (Array.isArray(newSellerObj)) {
        newSellerObj = {}
      }
      this.setValueEditados({
        idcliente: this.idClientSel,
        id: idsuculsal,
        datos: {
          shippingAddress: shippingAddress.id,
          shippingAddressC: shippingAddress,
          name: nombresurculsal,
          RazonSocial: razon,
          Rif: {
            prefijo: prefijo,
            numero: numerorif
          },
          Vendedor: newSellerObj,
          creditDays: diacredito,
          tipoPago: tipopago
        }
      }).then(() => {
        this.$q.loading.hide()
        this.$q.notify({ message: 'Cambios Guardados', color: 'green' })
      }).catch((e) => {
        console.error(e)
        this.$q.loading.hide()
        this.$q.notify({ message: 'Ocurrió un error, verifique su conexión', color: 'red' })
      })
      this.inicializar()
    },
    obtenerprefijo () {
      this.prefijo = this.model2
    },
    obtenervendedor () {
      let obj
      obj = this.seller.find(x => x.nombre === this.selle)
      console.log('este es el vendedor', obj)
      this.idselle = obj?.id
      return this.idselle
    }
  },
  computed: {
    ...mapGetters('client', ['clients2', 'idClientSel', 'vendedor']),
    ...mapGetters('corporativos', ['corporativo']),
    ...mapGetters('seller', ['seller']),
    clientSellers: {
      get () {
        let client = this.clients2.find(x => x.id === this.idClientSel)
        let seller = client?.Vendedor
        if (seller) {
          return this.modifySellerObj(seller)
        }
        return []
      },
      set (e) {
        let newSellers = this.modifySellerObj(e)
        this.setValue({
          id: this.idClientSel,
          Vendedor: newSellers
        })
      }
    },
    clients2Filtered () {
      return this.corporativo.filter(x => x.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted () {
    this.bindClients2()
    this.bindseller()
    this.bindcorporativo({ id: this.idClientSel })
  },
  watch: {
    corporativo () {

    },
    clients2 () {
      this.mostrar()
    }
  }
}
</script>
<style >
.thumbresultnew{
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 60%;
}
.thumbresultnew:hover{
  margin-top: 15px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

}
</style>
