<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Widgets Chat</div>
          <div>
            <div v-if="config">
              <q-btn class="header-btn" flat color="white" push label="Guardar" @click="save" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push label="Agregar" @click="add" icon="fas fa-plus"/>
            </div>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <div class="row header-container">
         <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-input
          v-model="key"
          type="text"
          float-label="Float Label"
          placeholder="Key default chat"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Key default chat']"/>
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select v-model="status" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Estatus" />
        </div>
         <div class='filled'></div>
    </div>
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
          Los siguientes campos son requeridos
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
    this.bindConfigs().then(e => console.log(this.afterBindigChat()))
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(obj => {
        return obj.source === 'chat'
      })
    }
  },
  methods: {
    ...mapActions('config', ['addConfig', 'bindConfigs', 'saveConfig']),
    add () {
      if (this.key === 0 || this.key.length === 0) {
        this.messageError = []
        if (this.localizacion_sede.length === 0) {
          this.messageError.push('Key default chat ')
        }
        this.validationError = true
        return
      }
      this.$q.loading.show()
      const payload = {
        key: this.key,
        status: this.status,
        source: 'chat'
      }
      this.addConfig(payload).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    save () {
      let value, id, key
      value = this.key
      id = this.config.id
      key = 'key'
      this.saveConfig({ value, id, key })
      value = this.status
      key = 'status'
      this.saveConfig({ value, id, key })
      this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
      })
    },
    afterBindigChat () {
      if (this.config.key !== '') {
        this.key = this.config.key
        this.status = this.config.status
      }
    }
  },
  data () {
    return {
      validationError: false,
      messageError: [],
      key: '',
      status: 1,
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
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
