<template>
    <div style="overflow:hidden">
      <div class="row justify-center items-center">
        <h3> Sucursales</h3>
      </div>
    <div class="row justify-center items-center">
    <q-card class="q-pa-s q-cardGlass" style="border-radius: 30px;">
       <q-card-section>
         <q-input label="Nombre Sucursal" v-model="nombresurculsal"> </q-input>
         <q-input label="Razón Social" v-model="razon"> </q-input>
          <q-select label="Nacionalidad"  id="sortBy3" v-model="prefijo" :options="options2" >

            </q-select>
             <q-input label="Rif" v-model="numerorif" :rules="[val => !!val || 'Solo numeros', validarnumeros]"> </q-input>

             <q-select label="Tipo Pago"  id="sortBy1" v-model="tipopago" :options="options" >
             </q-select>
              <q-select label="Vendedores" id="sortBy2"  v-model="selle" :options="Vendedores" @input="obtenervendedor()">
              </q-select>
              <q-input label="Dias de Credito" v-model="diacredito"> </q-input>
      </q-card-section>
       <div class="center">
          <q-btn color="primary" text-color="white" label="Guardar" @click="guardar(nombresurculsal,razon,prefijo,numerorif,tipopago,selle,idselle,diacredito)"/>
          &nbsp;&nbsp;
          <q-btn color="primary" text-color="white" label="Cancelar" />
           </div>
    </q-card>

    </div>
     <q-dialog v-model="clieEditar" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
           <q-input label="Nombre Sucursal" v-model="nombresurculsal"> </q-input>
         <q-input label="Razón Social" v-model="razon"> </q-input>
          <q-select label="Nacionalidad"  id="sortBy3" v-model="prefijo" :options="options2" >

            </q-select>
             <q-input label="Rif" v-model="numerorif"> </q-input>

             <q-select label="Tipo Pago"  id="sortBy1" v-model="tipopago" :options="options" >
             </q-select>
              <q-select label="Vendedores" id="sortBy2"  v-model="selle" :options="Vendedores" @input="obtenervendedor()">
              </q-select>
              <q-input label="Dias de Credito" v-model="diacredito"> </q-input>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="Accept" color="primary"  @click="guardarEditado(idsuculsal,nombresurculsal,razon,prefijo,numerorif,tipopago,idselle,selle,diacredito)" v-close-popup/>
            <q-btn flat label="Cancelar" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row justify-center items-center">>
    <q-table  class="column  justify-center items-center " title="Sucursales"
      :data="corporativo"
      :columns="columns"

      no-data-label="No se encontraron registros"

      >
       <template v-slot:body-cell-boton1 ="props" id=1>
         <q-td :props="props" class="q-pa-md q-gutter-sm">
            <q-btn  color="primary" label="Editar" @click="editar(props.row)" />
           </q-td>
       </template>
        <template v-slot:body-cell-boton2 ="props" id=2>
         <q-td :props="props" class="q-pa-md q-gutter-sm">
            <q-btn  color="primary" label="Quitar" @click="borrar(props.row)"  />
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
      numerorif: '',
      idsuculsal: '',
      razon: '',
      selle: '',
      idselle: '',
      tipopago: '',
      diacredito: 0,
      model2: '',
      prefijo: '',
      options: ['Contado', 'Credito'],
      options2: ['J', 'V', 'E', 'G'],
      Vendedores: [],
      columns: [
        { name: 'Nombre', required: false, label: 'Nombre', align: 'left', field: row => row?.name, sortable: true },
        { name: 'Rif', required: false, label: 'Rif', field: row => row.Rif?.prefijo + '-' + row.Rif?.numero, align: 'left', sortable: true },
        { name: 'Razon', required: false, label: 'Razon Social', field: row => row?.RazonSocial, align: 'left', sortable: true },
        { name: 'Vendedor', required: false, label: 'Vendedor', field: row => row.Vendedor?.name, align: 'left', sortable: true },
        { name: 'creditDays', required: false, label: 'Dias Credito', field: row => row?.creditDays, align: 'left', sortable: true },
        { name: 'tipoPago', required: false, label: 'Tipo Pago', field: row => row?.tipoPago, align: 'left', sortable: true },
        { name: 'boton1', required: false, label: '', align: 'left', sortable: true },
        { name: 'boton2', required: false, label: '', align: 'left', sortable: true }
      ]
    }
  },
  methods: {
    ...mapActions('corporativos', ['bindcorporativo', 'setValuenew', 'setValueborrar', 'setValueEditados']),
    ...mapActions('client', ['bindOnlyVendedor']),
    mostrar () {
      let obj
      console.log('los valores de corportivo', this.corporativo)
      console.log('los valores de Vendedores', this.vendedor)
      for (let i = 0; i < this.vendedor.length; i++) {
        obj = this.vendedor[i]
        this.Vendedores.push(obj.nombre)
      }
    },
    guardar (nombre, razon, prefijo, numerorif, tipopago, selle, idselle, diacredito) {
      console.log('los valores del prefijo', prefijo)
      this.setValuenew({
        id: this.idClientSel,
        name: nombre,
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

      })
      this.inicializar()
    },
    validarnumeros (val) {
      const numeroPattern = /^\d{9}$/
      return numeroPattern.test(val) || 'Invalid Rif'
    },
    inicializar () {
      this.nombresurculsal = ''
      this.razon = ''
      this.prefijo = ''
      this.numerorif = ''
      this.tipopago = ''
      this.selle = ''
      this.diacredito = 0
    },
    borrar (objeto) {
      console.log('estos son los valores', objeto)
      this.setValueborrar({ idcliente: this.idClientSel,
        id: objeto.id })
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
    },
    guardarEditado (idsuculsal, nombresurculsal, razon, prefijo, numerorif, tipopago, idselle, selle, diacredito) {
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
    this.bindOnlyVendedor()
    this.bindcorporativo({ id: this.idClientSel })
  },
  watch: {
    vendedor () {
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
