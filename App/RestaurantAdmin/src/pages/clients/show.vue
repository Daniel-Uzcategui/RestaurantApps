<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card >
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Editar Clientes</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Guardar" icon="update"/>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/clients/index')"/>
          </div>
       </q-card-section>
        <div class="row header-container">
         <div class="header-cell col-4">
          <q-input  type="text" float-label="Float Label" placeholder="Identificación" />
          <q-input  type="text" float-label="Float Label" placeholder="Nombre" />
          <q-input  type="text" float-label="Float Label" placeholder="Apellido" />
          <q-input  type="text" float-label="Float Label" placeholder="Correo Electrónico" />
          <q-input  type="text" float-label="Float Label" placeholder="Telefono" />
          <q-input  filled type="textarea" placeholder="Dirección"  />
        </div>
        <div class="header-cell col-4 filled">
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
          <q-td auto-width>
            <q-btn size="sm" color="green" round dense  icon="edit"/>
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
export default {
  data () {
    return {
      columns: [
        { name: 'delivered', required: true, label: 'Entregado', align: 'left', field: 'delivered', sortable: true },
        { name: 'Responsable', required: true, align: 'center', label: 'Responsable de la Entrega', field: 'Responsable' },
        { name: 'paid', label: 'Pago Realizado', field: 'paid' }
      ]
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
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
</style>
