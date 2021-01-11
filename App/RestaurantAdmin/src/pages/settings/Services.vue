<template>
  <div style="min-width: 320px;" :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Servicios y Rewards</div>
          <div>
           <div v-if="config">
              <q-btn class="header-btn" flat color="white" push  @click="validator" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push  @click="add" icon="fas fa-save"/>
            </div>
            <q-btn v-if="quick" class="header-btn-back" flat color="white" push  icon="arrow_back" @click="$router.replace('/home')"/>
          </div>
         </q-card-section>

        <q-card-section>
        <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Tipo de Servicios</div>
       </div>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
           <p>Delivery</p>
          <q-option-group filled rounded v-model="statusDelivery" map-options emit-value color="blue"
          outlined :options="estatus_options" label="Delivery" />
        </div>
      </div>
       <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
           <p>Pick Up</p>
          <q-option-group color="blue" filled rounded v-model="statusPickup" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Pick Up" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <p>In Local</p>
          <q-option-group color="blue" filled rounded v-model="statusInlocal" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="In Local" />
        </div>
        <div class="flex-break q-py-md "></div>
      </div>
      <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-12 col-md-12 col-lg-12 text-h6">Recompensas</div>
       </div>
       <div class="flex-break q-py-md "></div>
        <div class="row header-container">
         <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-option-group dense inline color="blue" filled rounded v-model="statusRewards" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Activar Recompensas" />
        </div>
        <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-input filled rounded
          label="Cantidad Necesitada"
          type="number"
          v-show="statusRewards"
          float-label="Float Label"
          outlined
          v-model="rewards"
          :rules="[ val => val && val > 0 || '*Requerido el campo Precio y mayor a 0']"/>
        </div>
        </div>
         </q-card-section>
     </q-card>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    quick: {
      type: Boolean,
      default: () => true
    }
  },
  created () {
    this.bindConfigs().then(e => console.log(this.afterBindigs()))
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(obj => {
        return obj.id === 'paymentServ'
      })
    }
  },
  data () {
    return {
      validationError: false,
      messageError: [],
      statusDelivery: 1,
      statusPickup: 1,
      statusInlocal: 1,
      statusPto: 1,
      statusRewards: 0,
      rewards: 10,
      statusZelle: 0,
      statusVenmo: 0,
      statusCreditCorp: 0,
      statusMercantil: 0,
      Mercantil: {
        xibm: '',
        integratorId: '',
        merchantId: '',
        terminalId: '',
        ambiente: 0,
        claveSecreta: ''
      },
      statusCash: 0,
      statusPaypal: 0,
      statuspagomovil: 0,
      statustransfer: 0,
      PaypalApi: '',
      zelleEmail: '',
      venmoAcc: '',
      CreditCorp: '',
      transfer: '',
      pagomovil: '',
      price: 0,
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
      ]
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig']),
    add () {
      this.$q.loading.show()
      const payload = {
        statusDelivery: this.statusDelivery,
        statusPickup: this.statusPickup,
        statusInlocal: this.statusInlocal,
        statusRewards: this.statusRewards,
        rewards: this.rewards,
        statusZelle: this.statusZelle,
        statusVenmo: this.statusVenmo,
        statusCreditCorp: this.statusCreditCorp,
        statuspagomovil: this.statuspagomovil,
        statustransfer: this.statustransfer,
        statusCash: this.statusCash,
        Mercantil: this.Mercantil,
        statusPaypal: this.statusPaypal,
        PaypalApi: this.PaypalApi,
        zelleEmail: this.zelleEmail,
        venmoAcc: this.venmoAcc,
        CreditCorp: this.CreditCorp,
        transfer: this.transfer,
        pagomovil: this.pagomovil,
        source: 'paymentServ'
      }
      this.addConfig2({ payload, doc: 'paymentServ' }).then(e => { this.$q.loading.hide(); this.$emit('done', true) })
    },
    validator () {
      if (this.statusDelivery === 0 && this.statusPickup === 0 && this.statusInlocal === 0) {
        this.$q.dialog({
          title: 'Error al guardar sección de tipo de servicios',
          message: 'Debe seleccionar al menos un tipo de Servicio Activo ',
          cancel: false,
          persistent: true
        }).onOk(() => {
        })
      } else {
        if (this.statusPto === 0 && this.statusZelle === 0 && this.statusVenmo === 0 && this.statusPaypal === 0 && this.statusCash === 0 && this.statusCreditCrop === 0) {
          this.$q.dialog({
            title: 'Error al guardar sección de medios de pago',
            message: 'Debe seleccionar al menos un medio de pago Activo ',
            cancel: false,
            persistent: true
          }).onOk(() => {
          })
        } else {
          this.save()
        }
      }
    },
    save () {
      let value, id, key
      value = this.statusDelivery
      id = this.config.id
      key = 'statusDelivery'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusPickup
      id = this.config.id
      key = 'statusPickup'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusInlocal
      id = this.config.id
      key = 'statusInlocal'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.statusRewards
      key = 'statusRewards'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      value = this.rewards
      key = 'rewards'
      this.saveConfig({ value, id, key }).catch(e => console.log(e))
      this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
        this.$emit('done', true)
      })
    },
    afterBindigs () {
      if (this.config.source !== '') {
        for (let i of Object.keys(this.config)) {
          try {
            Object.assign(this, { [i]: this.config[i] })
          } catch (e) {
            console.log(e)
          }
        }
      }
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
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px

.filled
  padding-top: 50px
</style>
