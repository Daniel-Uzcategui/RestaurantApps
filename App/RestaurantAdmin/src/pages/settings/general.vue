<template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop  header" >
          <div class="text-h5">Configuración General
            <q-btn flat color="white" push @click="explain = true" icon="help" />

          </div>
          <div>
            <div v-if="config">
              <q-btn class="header-btn" flat color="white" push  @click="save" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push @click="add" icon="add"/>
            </div>
            <q-btn class="header-btn-back" flat color="white" push  icon="arrow_back" @click="$router.replace('/home')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled
          v-model="companyName"
          label="Nombre Legal de la empresa"
          type="text"
          float-label="Float Label"
          placeholder="Nombre Legal de la empresa"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Nombre Legal de la empresa']"/>
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input filled
          v-model="companyComercialName"
          label="Nombre comercial de la empresa"
          type="text"
          float-label="Float Label"
          placeholder="Nombre comercial de la empresa"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Nombre comercial']"/>
        </div>
          </div>
           <div class='filled'></div>
        <div class="row header-container">
          <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
              <span>Moneda</span>
            <q-option-group color="blue" inline filled v-model="moneda" map-options emit-value standout="bg-teal "
            outlined :options="currency_options" label="Moneda" />
          </div>
          <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
            <span>Estatus</span>
            <q-option-group color="blue" inline filled v-model="status" map-options emit-value standout="bg-teal "
            outlined :options="estatus_options" label="Estatus" />
          </div>
        </div>
         <div class='filled'></div>
     </q-card>
  </div>
<q-dialog v-model="validationError">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <q-card-section>
          EL siguiente campo es requerido
          {{messageError}}
        </q-card-section>
      </q-card>
    </q-dialog>
</q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  created () {
    this.bindConfigs().then(() => this.afterBindigGeneral())
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(e => e.id === 'general')
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig2']),
    add () {
      if (this.companyName === '' || this.companyName === 0) {
        this.messageError = []
        this.messageError.push('Nombre legal de la Empresa')
        this.validationError = true
        return
      }
      console.log(this.companyName)
      this.$q.loading.show()
      const payload = {
        companyName: this.companyName,
        companyComercialName: this.companyComercialName,
        moneda: this.moneda,
        status: this.status,
        source: 'general'
      }
      this.addConfig2({ payload, doc: 'general' }).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    save () {
      let companyName = this.companyName
      let companyComercialName = this.companyComercialName
      let moneda = this.moneda
      let status = this.status
      if (this.companyName === '' || this.companyName === 0) {
        this.messageError = []
        this.messageError.push('Nombre legal de la Empresa')
        this.validationError = true
        return
      }
      this.saveConfig2({ id: 'general', companyName, companyComercialName, moneda, status }).then(() => this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      })).catch(e => this.$q.dialog({
        title: '',
        message: 'Hubo un error al agregar los ajustes, porfavor contactar con el administrador',
        cancel: false,
        persistent: true
      }))
      // value = this.status
      // key = 'status'
      // this.saveConfig({ value, id, key })
    },
    afterBindigGeneral () {
      if (typeof this.config !== 'undefined') {
        this.companyName = this.config.companyName
        this.companyComercialName = this.config.companyComercialName
        this.moneda = this.config.moneda
        this.status = this.config.status
      }
    }
  },
  data () {
    return {
      explain: false,
      validationError: false,
      messageError: [],
      companyName: '',
      companyComercialName: '',
      status: 1,
      moneda: '$',
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
      ],
      currency_options: [
        { label: 'Bolivares', value: 'BS' },
        { label: 'Dolares', value: '$' }
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
.header-btn-back
  position: absolute; right:120px !important
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
.filled
  padding-top: 50px
</style>
