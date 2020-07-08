<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Clientes</div>
          <div>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/clients/index')"/>
          </div>
       </q-card-section>
        <div class="row header-container">
         <div class="header-cell col-4" v-if="typeof client !== 'undefined'">
           <q-input :value="client.cedula"   @input="(e) => saved(e, this.$route.query.client_Id, 'cedula')"
            type="text" float-label="Float Label" placeholder="Identificación" />
          <q-input :value="client.nombre"   @input="(e) => saved(e, this.$route.query.client_Id, 'nombre')"
            type="text" float-label="Float Label" placeholder="Nombre" />
          <q-input :value="client.apellido" @input="(e) => saved(e, this.$route.query.client_Id, 'apellidos')"
            type="text" float-label="Float Label" placeholder="Apellido" />
          <q-input :value="client.email"    @input="(e) => saved(e, this.$route.query.client_Id, 'email')"
            type="text" float-label="Float Label" placeholder="Correo Electrónico" />
          <q-input :value="client.phone"    @input="(e) => saved(e, this.$route.query.client_Id, 'phone')"
            type="text" float-label="Float Label" placeholder="Telefono" />
          <q-input :value="client.address"  @input="(e) => saved(e, this.$route.query.client_Id, 'address')"
            filled type="textarea" placeholder="Dirección"  />
        </div>
        <div class="header-cell col-6 filled">
          <q-table
          title="Ordenes"
          color="primary"
          :data="orders"
          :columns="columns"
          :dense="$q.screen.lt.md"
          row-key="id"
          no-data-label="No se encontraron registros"
      >
      <template v-slot:body="props">
        <q-tr>
           <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
        </div>
     </div>
       <diV class='filled'></diV>
     </q-card>
  </div>

</q-page>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      columns: [
        { name: 'delivered', required: true, label: 'Entregado', align: 'left', field: 'delivered', sortable: true },
        { name: 'responsable', required: true, align: 'center', label: 'Responsable de la Entrega', field: 'responsable' },
        { name: 'paid', label: 'Pago Realizado', field: 'paid' }
      ]
    }
  },
  computed: {
    ...mapGetters('client', ['clients']),
    ...mapGetters('order', ['orders']),
    client () {
      console.log(this.$route.query.client_Id)
      console.log('clientes filtrado')
      console.log(this.clientDetail(this.$route.query.client_Id))
      console.log(this.clients + 'clientes')
      return this.clientDetail(this.$route.query.client_Id)
    }
  },
  mounted () {
    this.bindClients()
    console.log(this.clients)
  },
  methods: {
    ...mapActions('client', ['saveClient', 'bindClients']),
    saved (value, id, key) {
      console.log(`original new value = ${value}, row = ${id}, name  = ${key}`)
      this.saveClient({ value, id, key })
    },
    clientDetail (value) {
      return this.clients.find(obj => {
        return obj.id === value && obj.rol === 'Usuario'
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
.filled
  padding-top: 50px
.header-cell
  padding-left: 50px
.header-btn-back
  position: absolute; right:20px !important
.header
 padding-bottom: 50px
</style>
