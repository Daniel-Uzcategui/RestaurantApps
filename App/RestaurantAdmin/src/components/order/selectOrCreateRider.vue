<template>
  <div ref="dialogRef">
    <q-card class="q-dialog-plugin">
      <q-select outlined rounded emit-value map-options
      class="q-ma-xs"
      v-model="rider"
      :loading="riderLoading"
      :options="riders"
      :option-label="(item) => item === null ? 'Seleccione un valor' : item.name"
      :option-value="(item) => item === null ? null : item.id"
      label="Rider" >
      <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            name="add"
            @click.stop="addRiderDialog = true"
          />
        </template>
    </q-select>
    <q-dialog persistent v-model="addRiderDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Añadir rider</div>
        </q-card-section>
        <q-card-section>
          <q-input square outlined v-model="newRider.name" label="Nombre" />
          <q-input square outlined v-model="newRider.phone" label="Teléfono" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="resetNewRider()" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="addNewRider()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="emitRider()" />
        <q-btn color="primary" label="Cancel" @click="$emit('close')" />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'RiderSelect',
  computed: {
    ...mapGetters('rider', ['riders'])
  },
  methods: {
    ...mapActions('rider', ['bindRiders', 'addRider']),
    resetNewRider () {
      this.newRider = {
        name: null,
        phone: null
      }
    },
    emitRider () {
      if (this.rider !== '') {
        return this.$emit('riderInput', this.rider)
      }
      this.$q.dialog({ message: 'Seleccione un rider o cree un rider' })
    },
    async addNewRider () {
      this.riderLoading = true
      if (this.newRider.name !== null && this.newRider.phone !== null) {
        return this.addRider(this.newRider).then((e) => {
          this.rider = e
          this.riderLoading = false
          this.resetNewRider()
          this.addRiderDialog = false
        }).catch(e => {
          console.error(e)
          this.riderLoading = false
        })
      } else {
        this.$q.dialog({ message: 'Llene todos los datos' })
      }
    }
  },
  created () {
    this.bindRiders().catch((e) => console.error(e))
  },
  data () {
    return {
      shippingAddress: '',
      adShippingDone: false,
      adShipping: false,
      billingSameAddress: true,
      billingAdress: '',
      adBillingDone: false,
      adBilling: false,
      riderLoading: false,
      branchLoading: false,
      addBranchDialog: false,
      rider: '',
      branch: '',
      addRiderDialog: false,
      newRider: {
        name: null,
        phone: null
      },
      newBranch: {
        name: null
      }
    }
  }
}
</script>
