<template>
  <div>
    <q-select rounded outlined emit-value map-options
      @input="$emit('clientInput', client)"
      class="q-ma-xs"
      v-model="client"
      :loading="clientLoading"
      :options="clients"
      :option-label="(item) => item === null ? 'Seleccione un valor' : item.name"
      :option-value="(item) => item === null ? null : item.id"
      label="Cliente" >
      <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            name="add"
            @click.stop="addClientDialog = true"
          />
        </template>
    </q-select>
    <q-dialog v-model="addClientDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Añadir cliente</div>
        </q-card-section>
        <q-card-section>
          <q-input square outlined v-model="newClient.name" label="Nombre" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="resetNewClient()" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="addNewClient()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-select rounded outlined emit-value map-options
      class="q-ma-xs"
      v-if="client !== ''"
      v-model="branch"
      :loading="branchLoading"
      :options="branches"
      :option-label="(item) => item === null ? 'Seleccione un valor' : item.name"
      :option-value="(item) => item === null ? null : item.id"
      label="Sede o Sucursal">
            <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            name="add"
            @click.stop="addBranchDialog = true"
          />
        </template>
    </q-select>
    <q-dialog v-model="addBranchDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Añadir Sucursal</div>
        </q-card-section>
        <q-card-section>
          <q-input dense rounded outlined v-model="newBranch.name" label="Nombre" />
          <div class="row justify-center q-ma-md">
           <q-btn color="primary" rounded no-caps @click="adShipping = true" label="Dirección Envío" /> <q-icon v-if="adShippingDone" name="check" size="md" color="green" />
          </div>
          <!-- <q-checkbox v-model="billingSameAddress" label="Dirección de Envío es igual que la dirección de facturación" />
          <div v-if="!billingSameAddress" class="row justify-center q-ma-md">
           <q-btn color="primary" rounded no-caps @click="adBilling = true" label="Dirección Facturación" /> <q-icon v-if="adBillingDone" name="check" size="md" color="green" />
          </div> -->
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="resetNewBranch()" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" @click="addNewBranch()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="adShipping">
      <address-client @input="(e)=> {shippingAddress = e; adShipping = false; adShippingDone = true}" :clientId="client"/>
    </q-dialog>
    <!-- <q-dialog v-model="adBilling">
      <address-client @input="(e)=> {billingAdress = e; adBilling = false; adBillingDone = true}" :clientId="client"/>
    </q-dialog> -->
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import addressClient from './addressClient.vue'
export default {
  name: 'clientlist',
  components: {
    addressClient
  },
  computed: {
    ...mapGetters('seller', ['clients', 'branches']),
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    getBranchValues (value) {
      if (value === '') {
        return null
      }
      return this.branches.find(x => x.id === value)
    },
    getBranchClient (value) {
      if (value === '') {
        return null
      }
      return this.clients.find(x => x.id === value)
    },
    ...mapActions('seller', ['bindClients', 'bindClientBranch', 'addClient', 'addBranch']),
    resetNewClient () {
      this.newClient = {
        name: null
      }
    },
    addNewClient () {
      this.clientLoading = true
      const { id, nombre, apellido, phone, email } = this.currentUser
      const user = { id, nombre, apellido, phone, email }
      this.addClient({ ...this.newClient,
        Vendedor: {
          [user.id]: user
        }
      }).then((e) => {
        this.client = e
        this.clientLoading = false
        this.resetNewClient()
      }).catch(e => {
        console.error(e)
        this.clientLoading = false
      })
    },
    resetNewBranch () {
      this.newBranch = {
        name: null
      }
    },
    addNewBranch () {
      // if (this.newBranch.name !== '' && this.adShippingDone && (this.adBillingDone || this.billingSameAddress)) {
      if (this.newBranch.name !== '' && this.adShippingDone) {
        this.branchLoading = true
        const { id, nombre, apellido, phone, email } = this.currentUser
        const user = { id, nombre, apellido, phone, email }
        this.addBranch({
          data: {
            ...this.newBranch,
            shippingAddressC: this.shippingAddress,
            shippingAddress: this.shippingAddress.id,
            Vendedor: {
              [user.id]: user
            },
            // billingAddress: this.billingSameAddress ? this.shippingAddress : this.billingAdress,
            dateIn: new Date()
          },
          client: this.client
        }).then((e) => {
          this.branch = e
          this.branchLoading = false
          this.resetNewBranch()
          this.addBranchDialog = false
          this.shippingAddress = ''
          this.adShippingDone = false
          this.adShipping = false
          this.billingSameAddress = true
          this.billingAdress = ''
          this.adBillingDone = false
          this.adBilling = false
        }).catch(e => {
          console.error(e)
          this.branchLoading = false
        })
      } else {
        this.$q.notify({
          message: 'Porfavor llenar todos los Datos'
        })
      }
    }
  },
  watch: {
    client (e) {
      this.branch = ''
      this.branchLoading = true
      this.bindClientBranch({ client: e, user: this.currentUser }).then(() => {
        this.branchLoading = false
      }).catch((e) => { console.error(e, 'Error'); this.branchLoading = false })
    },
    branch (e) {
      console.log('Branch Agregado', this.client)
      this.$emit('branchInput', this.getBranchValues(e))
      this.$emit('clientInput', this.getBranchClient(this.client))
    }
  },
  created () {
    this.bindClients(this.currentUser).catch((e) => console.error(e))
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
      clientLoading: false,
      branchLoading: false,
      addBranchDialog: false,
      client: '',
      branch: '',
      addClientDialog: false,
      newClient: {
        name: null
      },
      newBranch: {
        name: null
      }
    }
  }
}
</script>
