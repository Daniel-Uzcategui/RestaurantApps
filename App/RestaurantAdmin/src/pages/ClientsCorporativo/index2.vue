<template>
    <div style="overflow:hidden">
      <div class="row justify-center items-center">
        <h3> Sucursales</h3>
      </div>
    <div class="row justify-center items-center">
    <q-card class="q-pa-s q-cardGlass" style="border-radius: 30px;">
       <q-card-section>
         <q-input label="Nombre Sucursal"> </q-input>
         <q-input label="Razón Social"> </q-input>
         <h7><q-select label="----" id="sortBy"  v-model="model2" :options="options2">

            </q-select> <q-input label="Rif"> </q-input> </h7>

             <q-select label="Tipo Pago"  id="sortBy1" v-model="tipopago" :options="options" >
             </q-select>
              <q-select label="Vendedores" id="sortBy2"  v-model="selle" :options="Vendedores" >
              </q-select>
              <q-input label="Dias de Credito"> </q-input>
      </q-card-section>
       <div class="center">
          <q-btn color="primary" text-color="white" label="Guardar" />
          &nbsp;&nbsp;
          <q-btn color="primary" text-color="white" label="Cancelar" />
           </div>
    </q-card>

    </div>
    <div class="row justify-center items-center">>
    <q-table  class="column  justify-center items-center " title="Sucursales"
      :data="corporativo"
      :columns="columns"

      no-data-label="No se encontraron registros"

      >
       <template v-slot:body-cell-boton1 ="props" id=1>
         <q-td :props="props" class="q-pa-md q-gutter-sm">
            <q-btn  color="primary" label="Editar"  />
           </q-td>
       </template>
        <template v-slot:body-cell-boton2 ="props" id=2>
         <q-td :props="props" class="q-pa-md q-gutter-sm">
            <q-btn  color="primary" label="Quitar"   />
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
      selle: '',
      tipopago: '',
      model2: '',
      options: ['Contado', 'Credito'],
      options2: ['J', 'V', 'E', 'G'],
      Vendedores: [],
      columns: [
        { name: 'Nombre', required: false, label: 'Nombre', align: 'left', field: row => row.name, sortable: true },
        { name: 'Rif', required: false, label: 'Rif', field: row => row.Rif.prefijo + '-' + row.Rif.numero, align: 'left', sortable: true },
        { name: 'Razon', required: false, label: 'Razon Social', field: row => row.RazonSocial, align: 'left', sortable: true },
        { name: 'Vendedor', required: false, label: 'Vendedor', field: row => row.Vendedor.name, align: 'left', sortable: true },
        { name: 'creditDays', required: false, label: 'Razon Social', field: row => row.RazonSocial, align: 'left', sortable: true },
        { name: 'tipoPago', required: false, label: 'Tipo Pago', field: row => row.tipoPago, align: 'left', sortable: true },
        { name: 'boton1', required: false, label: '', align: 'left', sortable: true },
        { name: 'boton2', required: false, label: '', align: 'left', sortable: true }
      ]
    }
  },
  methods: {
    ...mapActions('corporativos', ['bindcorporativo']),
    ...mapActions('client', ['bindOnlyVendedor']),
    mostrar () {
      let obj
      console.log('los valores de corportivo', this.corporativo)
      console.log('los valores de Vendedores', this.vendedor)
      for (let i = 0; i < this.vendedor.length; i++) {
        obj = this.vendedor[i]
        this.Vendedores.push(obj.nombre)
      }
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
    corporativo () {
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
