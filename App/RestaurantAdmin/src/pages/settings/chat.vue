<template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
       <q-card-section  class="q-cardtop text-white header" >
          <div class="text-h5">Widgets Chat
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
          v-model="key"
          label="PropiedadId"
          type="text"
          float-label="Float Label"
          placeholder="Key default chat"
          outlined
          :rules="[ val => val && val.length > 0 || '*Requerido el campo Key default chat']"/>
        </div>
        <div class="header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4">
          <q-select filled v-model="status" map-options emit-value standout="bg-teal text-white"
          outlined :options="estatus_options" label="Estatus" />
        </div>
         <div class='filled'></div>
    </div>
     </q-card>
  </div>
  <q-dialog v-model="explain">
    <q-card class="q-cardGlass">
      <q-card-section class="column items-center">

    <p class="text-h6 text-bold"> Para configurar el chat dirigirse a </p>
    <q-btn :href="'//' + 'tawk.to'" type="a" target="_blank" label="Tawk.to" rounded color="primary"/>
    <p class="text-h6 text-bold q-ma-md"> Crear una cuenta al iniciar sesión abajo a la izquierda entras a la configuración, en visión general buscar el campo PropiedadId, copiar los datos de ese campo</p>
    <q-img width="200px" src="https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2FCapture3290?alt=media&token=d8e76081-26ba-496b-b4df-f8a49d489385"/>
      </q-card-section>
    </q-card>
  </q-dialog>
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
    this.bindConfigs().then(() => this.afterBindigChat())
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find(e => e.id === 'chat')
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig2']),
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
      this.addConfig2({ payload, doc: 'chat' }).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    save () {
      // let value, id, key
      // value = this.key
      // key = 'key'
      let key = this.key
      let status = this.status
      this.saveConfig2({ id: 'chat', key, status }).then(() => this.$q.dialog({
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
    afterBindigChat () {
      if (typeof this.config !== 'undefined') {
        this.key = this.config.key
        this.status = this.config.status
      }
    }
  },
  data () {
    return {
      explain: false,
      validationError: false,
      messageError: [],
      key: '',
      status: 1,
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
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
