<template>
<div class="thumbresultnew">

<div class="row justify-center items-center">
  <div class=" column justify-center items-center">
   <h2 >Clientes  Corporativos</h2>

</div>

<div>
   <br>
   <br>
   <q-card  class="q-ma-md cardradius bg-primary">
        <q-card-section class="column items-center">
          <q-btn flat  icon="add" size="lg"/>
            <p>Añadir Clientes</p>
           </q-card-section>
         </q-card>
</div>
<div class="row justify-center items-center">
 <q-card  class=" q-ma-md cardradius bg-primary" @click="ClienteRoute(item.id)" v-for="item in clients2" :key="item.id">

        <q-card-section>
          <q-item-label class="text-h3">
            {{item.name}}
          </q-item-label>

        </q-card-section>

      </q-card>

</div>

 </div>
 </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index2',
  data () {
    return {

    }
  },
  methods: {
    ...mapActions('client', ['bindClients2', 'setIdCliente']),

    mostrar () {
      console.log('los valores de la colletions clients', this.clients2)
    },

    ClienteRoute (id) {
      console.log('el id del cleinte corporativo', id)
      this.setIdCliente(id)
      console.log('el nuevo valor de la mutacion es:', this.idClientSel)
      this.$router.push({ path: '/corporativo/branches/index2' })
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
