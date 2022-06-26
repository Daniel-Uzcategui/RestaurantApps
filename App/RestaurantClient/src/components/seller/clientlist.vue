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
    <br>
    <label v-show="client !== '' && branch !== ''">Fecha de Vencimiento</label>
    <q-btn icon="event" class="q-mr-sm" round color="blue" v-show="client !== '' && branch !== ''">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date color="blue" v-model="date" @input="verificarValor"/>
          </q-popup-proxy>
    </q-btn>
    <br>
    <q-input filled mask="########" v-show="client !== '' && branch !== ''" v-model="Monto"  title="Monto" label="Monto"/>
    <br>
    <q-input filled mask="###" v-show="client !== '' && branch !== ''" v-model="Porcentaje"  title="Porcentaje" label="Porcentaje Retencion"/>
    <br>
    <q-input filled  v-show="client !== '' && branch !== ''" v-model="ordencompra"  title="Orden Compra" label="Orden de Compra"/>
    <br>
    <q-card class="q-pa-xl q-cardGlass"  v-show="client !== '' && branch !== ''" style="border-radius: 28px;"  @click="showPhotoUpload()">
                        <q-card-section>
                            <div class="column items-center ">
                                <div class=" column items-center" v-show='photoMessage'>
                                  <div>
                                  <q-btn style="border-radius: 28px;" push>
                                      <q-avatar rounded class="q-mb-sm" icon="collections" font-size="50px" size="130px" text-color="grey-4" >
                                      </q-avatar>
                                      <p v-if="pagoSel != 1">Haga click para cargar la captura de la orden de pago </p>
                                      <p v-if="pagoSel == 1">Haga click para cargar foto de la orden </p>
                                  </q-btn>
                                  </div>
                                </div>
                                <div class=" column items-center">
                                <img :src="photoSRC" class="q-mb-sm" style="width:100%; max-width: 300px;">
                                </div>
                           </div>
                        </q-card-section>

       </q-card>
    <q-dialog v-model="adShipping">
      <address-client @input="(e)=> {shippingAddress = e; adShipping = false; adShippingDone = true}" :clientId="client"/>
    </q-dialog>
       <q-dialog v-model="photoUpload" transition-hide="scale" transition-show="scale" @before-hide="resetPhotoType">
            <photo-upload
              :row="photoSRC"
              :photoUpload="photoUpload"
              @updated="uploadComplete"
            />
      </q-dialog>
    <!-- <q-dialog v-model="adBilling">
      <address-client @input="(e)=> {billingAdress = e; adBilling = false; adBillingDone = true}" :clientId="client"/>
    </q-dialog> -->
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import addressClient from './addressClient.vue'
import photoUpload from '../../components/photoUpload/uploadphoto.vue'
// import { ref } from 'vue'
export default {
  name: 'clientlist',
  components: {
    addressClient,
    photoUpload
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
    showPhotoUpload () {
      this.photoUpload = true
      this.photoType = Math.random().toString(16).substr(2, 8)
    },
    uploadComplete (info) {
      // console.log('info payment: ' + info)
      this.photoSRC = info
      this.photoUpload = false
      this.photoMessage = false
      this.CheckTDD = true
    },
    resetPhotoType () {
      this.photoType = ''
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
    verificarValor () {
      console.log('el valor de date', this.date)
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
    },
    date () {
      this.$emit('DateInput', this.date)
    },
    photoSRC () {
      this.$emit('PhotoInput', this.photoSRC)
    },
    Porcentaje () {
      this.$emit('PorcentajeInput', this.Porcentaje)
    },
    Monto () {
      this.$emit('MontoInput', this.Monto)
    },
    ordencompra () {
      this.$emit('OrderInput', this.ordencompra)
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
      photoSRC: '',
      photoType: '',
      Monto: 0,
      ordencompra: '',
      pagoSel: null,
      photoMessage: true,
      Porcentaje: '',
      date: new Date(),
      photoUpload: false,
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
