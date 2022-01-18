<template>
  <q-list class="bg-primary" style="border-radius: 28px" dark bordered separator>
    <q-item>
      <q-item-section>Usuario</q-item-section>
      <q-item-section>Estatus</q-item-section>
      <q-item-section>Fecha</q-item-section>
      <q-item-section v-if="ridersOnLog">Rider</q-item-section>
      <q-item-section v-if="receptorOnLog">Recibió</q-item-section>
    </q-item>
    <q-item class="row" v-for="(row, index) in log" :key="index">
      <q-item-section class="col">{{getUserFullName(row.user)}}</q-item-section>
      <q-item-section class="col">{{getStatusValue(row.status)}}</q-item-section>
      <q-item-section class="col">{{row.dateIn.toDate().toLocaleString()}}</q-item-section>
      <q-item-section class="col" v-if="ridersOnLog">
         <q-btn v-if="row.rider" dense color="blue" rounded no-caps :label="getRiderFullName(row.rider)" @click="showRiderInfo(row.rider)"/>
      </q-item-section>
      <q-item-section class="col" v-if="receptorOnLog">{{row.receptor}}</q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['log'],
  computed: {
    ...mapGetters('order', ['allestatus']),
    ...mapGetters('user', ['users']),
    ...mapGetters('rider', ['riders']),
    ridersOnLog () {
      return this.log.find(x => typeof x.rider !== 'undefined')
    },
    receptorOnLog () {
      return this.log.find(x => typeof x.receptor !== 'undefined')
    }
  },
  created () {
    this.bindRiders().catch((e) => console.error(e))
  },
  methods: {
    showRiderInfo (e) {
      let riderInfo = this.riders.find(x => x.id === e)
      return this.$q.dialog({
        title: riderInfo.name,
        message: riderInfo.phone ? `Teléfono: ${riderInfo.phone}` : 'Teléfono no registradoñ'
      })
    },
    ...mapActions('rider', ['bindRiders']),
    getUserFullName (e) {
      let user = this.users.find(x => e === x.id)
      if (typeof user !== 'undefined') {
        return user.nombre + ' ' + user.apellido
      }
      return 'Usuario no disponible'
    },
    getRiderFullName (e) {
      let rider = this.riders.find(x => e === x.id)
      if (typeof rider !== 'undefined') {
        return rider.name
      }
      return e
    },
    getStatusValue (e) {
      let status = this.allestatus.find(x => e === x.value)
      return status.label
    },
    ...mapActions('user', ['bindusers'])
  },
  data () {
    return {}
  }
}
</script>
