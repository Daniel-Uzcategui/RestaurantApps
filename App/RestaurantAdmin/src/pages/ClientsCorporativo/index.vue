<template>
<div :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
   <div class="row justify-center">
   <q-table
      class="col-12 col-lg-6 col-md-12"
      :data="clients2"
      :columns="columns"
      title="Clientes Corporativos"
      row-key="id"
      :rows-per-page-options="[20, 30, 0]"
      flat
      rounded
      ref="table"
      style="border-radius: 28px"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
    >
    <template v-slot:top>
      <p class="text-h5 text-bold q-ma-md">
      Clientes Corporativos
      </p>
        <q-btn-group flat push >
          <q-btn flat push no-caps label="Agregar" icon="add" @click="nuevo"/>
        </q-btn-group>
        </template>
         <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn dense round flat color="grey" @click="ClienteRoute(props.row.id)" icon="search"></q-btn>
              <q-btn dense round flat color="grey" @click="editar(props.row)" icon="edit"></q-btn>
              <q-btn dense round flat color="grey" @click="borrar(props.row)" icon="delete"></q-btn>
            </q-td>
            </template>
        </q-table>
  </div>
    <q-dialog v-model="clie" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Cliente</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input label="Nombre" v-model="cliedit"></q-input>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="Guardar" rounded class="text-bold" no-caps color="white" icon="save" style="background-color: #2196f3;"  @click="guardar(idclie,cliedit)" v-close-popup/>
            <q-btn flat label="Cancelar" rounded color="white" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  <q-dialog v-model="clienuevo" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cliente</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input label="Nombre" v-model="clinew"></q-input>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="Guardar" rounded class="text-bold" no-caps color="white" icon="edit" style="background-color: #2196f3;"  @click="guardarnew(clinew)" v-close-popup/>
            <q-btn flat label="Cancelar" rounded color="white" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
 </div>
</template>
<script>
const columns = [
  { name: 'name', align: 'center', label: 'Nombre', field: 'name', sortable: true },
  { name: 'actions', align: 'center', label: 'Acción', field: '' }
]
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index2',
  data () {
    return {
      clienuevo: false,
      clinew: '',
      clie: false,
      cliedit: '',
      idclie: '',
      elcat: [],
      columns

    }
  },
  methods: {
    ...mapActions('client', ['bindClients2', 'setIdCliente', 'setValue', 'setValueborar', 'setValuenew']),

    mostrar () {
      console.log('los valores de la colletions clients', this.clients2)
    },

    ClienteRoute (id) {
      console.log('el id del cleinte corporativo', id)
      this.setIdCliente(id)
      console.log('el nuevo valor de la mutacion es:', this.idClientSel)
      this.$router.push({ path: '/corporativo/branches/index2' })
    },
    editar (objeto) {
      console.log('todo el registro', objeto)
      this.cliedit = objeto.name
      this.idclie = objeto.id
      this.clie = true
    },
    borrar (objeto) {
      this.$q.dialog({
        title: 'Eliminar Cliente Corporativo',
        message: '¿Desea Eliminar este Cliente ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('el id de la operacion', objeto.id)
        this.setValueborar({ id: objeto.id })
      }).onCancel(() => {
      })
    },
    guardar (id, nombre) {
      console.log('valor del id', id, 'valor del nombre', nombre)
      this.setValue({ id: id,
        name: nombre })
    },
    guardarnew (nombre) {
      this.setValuenew({ name: nombre })
    },
    nuevo () {
      this.clienuevo = true
    }
  },
  computed: {
    ...mapGetters('client', ['clients2', 'idClientSel'])

  },
  mounted () {
    this.bindClients2()
  },
  watch: {
    clients2 () {
      this.mostrar()
    }
  }
}
</script>
<style lang="stylus">
 .headerClients
  width: 100%
  margin-bottom: 50%
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
