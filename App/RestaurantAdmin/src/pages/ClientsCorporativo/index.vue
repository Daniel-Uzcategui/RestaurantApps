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
          <q-btn flat  icon="add" size="lg" @click="nuevo"/>
            <p>Añadir Clientes</p>
           </q-card-section>
         </q-card>
</div>

<div class="row justify-center items-center" v-for="item in clients2" :key="item.id">
 <q-card  class=" q-ma-md cardradius bg-primary" @click="ClienteRoute(item.id)" >

        <q-card-section>
          <q-item-label class="text-h3">
            {{item.name}}
          </q-item-label>

        </q-card-section>

      </q-card>
          <div>
          <q-btn flat  icon="edit" size="lg" @click="editar(item)"/>
          <q-btn flat  icon="delete" size="lg" @click="borrar(item)"/>
          </div>

</div>
  <q-dialog v-model="clie" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cliente</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input label="Nombre" v-model="cliedit"></q-input>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="Accept" color="primary"  @click="guardar(idclie,cliedit)" v-close-popup/>
            <q-btn flat label="Cancelar" color="primary" v-close-popup/>
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
            <q-btn flat label="Accept" color="primary"  @click="guardarnew(clinew)" v-close-popup/>
            <q-btn flat label="Cancelar" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
 </div>
 </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'index2',
  data () {
    return {
      clienuevo: false,
      clinew: '',
      clie: false,
      cliedit: '',
      idclie: ''

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
      console.log('el id de la operacion', objeto.id)
      this.setValueborar({ id: objeto.id })
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
