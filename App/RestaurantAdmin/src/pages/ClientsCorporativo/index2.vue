<template>
    <div>
       <q-btn flat label="Regresar" icon="chevron_left" class="q-ma-md" no-caps to="/corporativo/index" />
         <q-dialog @hide="clieEditar = false" v-model="forma">
           <div class="q-diag-glassMorph q-pa-xs row justify-start">
         <q-form
      @submit="guardar"
      @reset="cancelar" greedy >
         <q-input class="col-12 col-sm-6 q-pa-xs" label="Nombre Sucursal" :rules="[val => val.length > 0 || 'Nombre no puede quedar en blanco']" v-model="nombresurculsal"/>
         <q-input class="col-12 col-sm-6 q-pa-xs" label="Razón Social" :rules="[val => val.length > 0 || 'Razón Social no puede quedar en blanco']"  v-model="razon"/>
          <q-select class="col-12 col-sm-3 q-pa-xs" label="Prefijo Rif" :rules="[val => val.length > 0 || 'No puede quedar en blanco']"  id="sortBy3" v-model="prefijo" :options="options2" />
             <q-input class="col-12 col-sm-6 q-pa-xs" label="Rif" v-model="numerorif" :rules="[val => !!val || 'Solo numeros', validarnumeros]"/>
             <q-select class="col-12 col-sm-6 q-pa-xs" label="Tipo Pago"  id="sortBy1" :rules="[val => typeof val === 'number' || 'No puede quedar en blanco']" v-model="tipopago" map-options emit-value :options="options" />
              <q-select class="col-12 col-sm-6 q-pa-xs" label="Vendedor" id="sortBy2"  v-model="selle" :options="Vendedores" @input="obtenervendedor()"/>
              <q-input class="col-12 col-sm-6 q-pa-xs" label="Dias de Credito" v-model="diacredito"/>
              <div class="col-12 row justify-center">

              <q-btn label="Cancelar" rounded color="red" class="q-ma-md text-bold" no-caps type="reset"/>
              <q-btn v-if="clieEditar" no-caps rounded class="q-ma-md text-bold" label="Guardar" color="blue" icon="save"  type="submit" v-close-popup/>
              <q-btn v-else label="Crear" rounded class="q-ma-md text-bold" no-caps color="green"  type="submit"/>

           </div>
         </q-form>
         </div>
              </q-dialog>
          <div class="center q-ma-md col-12 row justicy-center">
                <q-table  class="q-mt-md full-width" :title="'Sucursales ' + clientenombre.name"
                    style="border-radius: 28px"
                      :data="corporativo"
                      :columns="columns"

                      no-data-label="No se encontraron registros"

                      >
                      <template v-slot:top-right >
                        <div class="row justify-start">
                          <q-btn label="Crear Nuevo" rounded class="q-ma-md text-bold" no-caps color="green" icon="add" @click="forma=!forma"/>
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
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      nombresurculsal: '',
      clieEditar: false,
      forma: false,
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
        { name: 'Rif', required: false, label: 'Rif', field: row => row.Rif?.prefijo + '-' + row.Rif?.numero, align: 'left', sortable: true },
        { name: 'Razon', required: false, label: 'Razon Social', field: row => row?.RazonSocial, align: 'left', sortable: true },
        { name: 'Vendedor', required: false, label: 'Vendedor', field: row => row.Vendedor?.name, align: 'left', sortable: true },
        { name: 'creditDays', required: false, label: 'Dias Credito', field: row => row?.creditDays, align: 'left', sortable: true },
        { name: 'tipoPago', required: false, label: 'Tipo Pago', field: row => typeof row?.tipoPago === 'number' ? this.options[row.tipoPago].label : 'NA', align: 'left', sortable: true },
        { name: 'boton1', required: false, label: '', align: 'left', sortable: true },
        { name: 'boton2', required: false, label: '', align: 'left', sortable: true }
      ]
    }
  },
  methods: {
    ...mapActions('corporativos', ['bindcorporativo', 'setValuenew', 'setValueborrar', 'setValueEditados']),
    ...mapActions('client', ['bindOnlyVendedor', 'bindClients2']),
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
    guardar () {
      const { nombresurculsal, razon, prefijo, numerorif, tipopago, selle, idselle, diacredito, clieEditar } = this
      if (clieEditar) {
        return this.guardarEditado()
      }
      console.log('los valores del prefijo', prefijo)
      this.setValuenew({
        id: this.idClientSel,
        name: nombresurculsal,
        RazonSocial: razon,
        Rif: {
          prefijo: prefijo,
          numero: numerorif
        },
        Vendedor: {
          id: idselle,
          name: selle
        },
        creditDays: diacredito,
        tipoPago: tipopago

      }).then(() => {
        this.$q.notify({ message: 'Cliente Guardado', color: 'green' })
      }).catch(() => {
        this.$q.notify({ message: 'Ocurrió un error, verifique su conexión', color: 'red' })
      })
      this.inicializar()
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
      this.selle = ''
      this.diacredito = 0
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
      this.numerorif = objeto.Rif?.numero
      this.tipopago = objeto?.tipoPago
      this.selle = objeto.Vendedor?.name
      this.diacredito = objeto?.creditDays
      this.idselle = objeto.Vendedor?.id
      this.clieEditar = true
      this.forma = true
    },
    guardarEditado () {
      const { idsuculsal, nombresurculsal, razon, prefijo, numerorif, tipopago, idselle, selle, diacredito } = this
      this.setValueEditados({
        idcliente: this.idClientSel,
        id: idsuculsal,
        datos: {

          name: nombresurculsal,
          RazonSocial: razon,
          Rif: {
            prefijo: prefijo,
            numero: numerorif
          },
          Vendedor: {
            id: idselle,
            name: selle
          },
          creditDays: diacredito,
          tipoPago: tipopago
        }
      }).then(() => {
        this.$q.notify({ message: 'Cambios Guardados', color: 'green' })
      }).catch(() => {
        this.$q.notify({ message: 'Ocurrió un error, verifique su conexión', color: 'red' })
      })
      this.inicializar()
    },
    obtenerprefijo () {
      this.prefijo = this.model2
    },
    obtenervendedor () {
      let obj
      obj = this.vendedor.find(x => x.nombre === this.selle)
      console.log('este es el vendedor', obj)
      this.idselle = obj?.id
      return this.idselle
    }
  },
  computed: {
    ...mapGetters('client', ['clients2', 'idClientSel', 'vendedor']),
    ...mapGetters('corporativos', ['corporativo'])

  },
  mounted () {
    this.bindClients2()
    this.bindOnlyVendedor()
    this.bindcorporativo({ id: this.idClientSel })
  },
  watch: {
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
