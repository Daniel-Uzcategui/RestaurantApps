<template>
  <div>
    <div :class=" $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
    <q-btn-group spread class="full-width">
      <q-btn color="secondary" @click="dialog = true; dialogType = 'visual'; setDialog()" label="Visualizar" />
      <q-btn color="secondary" @click="dialog = true; dialogType = 'new'; newAddDialog()" label="Agregar" />
      <q-btn color="secondary" label="Eliminar" @click="deleteAddress({id: value})" />
    </q-btn-group>
    <q-option-group
      :value="value"
      @input="(e) => $emit('input', e)"
      :options="addressRadio"
      color="primary"
    />
  </div>
  <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card :class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-bar class="bg-primary">
          <q-space />
          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
      <q-card-section class="q-pt-none q-pa-md">
        <q-form
          ref="addrs"
          class="q-gutter-md"
        >
      <q-input class="q-pa-sm" filled type="text" v-model="alias" label="Alias" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm" filled type="text" v-model="estado" label="Estado" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm" filled type="text" v-model="ciudad" label="Ciudad" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm" filled type="text" v-model="municipio" label="Municipio" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm" filled type="text" v-model="urb" label="Urbanización" :rules="[ val => val && val.length > 0 || 'Campo Requerido']" />
      <q-input class="q-pa-sm" filled type="text" v-model="calle" label="Calle" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm" filled type="text" v-model="domicilio" label="Domicilio" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input class="q-pa-sm"  filled type="textarea" v-model="puntoRef" label="Punto de referencia" />
    </q-form>
    </q-card-section>
    <q-card-section class="q-pt-none q-pa-md">
    <google-map
      :center="center"
      :markers="markers"
      @update-mark="(e) => markers = e" />
    </q-card-section>
    <q-card-actions align="around">
        <q-btn color="secondary" v-close-popup >Cancelar</q-btn>
        <q-btn color="primary" @click="$refs.addrs.validate().then(e => { if (e) {newAddress(); dialog = false}})">Guardar</q-btn>
      </q-card-actions>
       </q-card>
  </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    GoogleMap: require('./GoogleMap.vue').default
  },
  props: ['value'],
  computed: {
    ...mapGetters('address', ['address']),
    ...mapGetters('user', ['currentUser']),
    addressRadio () {
      return this.address.map(x => {
        return {
          value: x.id,
          label: x.alias
        }
      })
    }
  },
  methods: {
    ...mapActions('address', ['bindAddress', 'addAddress', 'updateAddress', 'deleteAddress']),
    newAddress () {
      this.dialogType === 'new' ? this.addAddress({
        estado: this.estado,
        ciudad: this.ciudad,
        municipio: this.municipio,
        calle: this.calle,
        domicilio: this.domicilio,
        user: this.currentUser.id,
        alias: this.alias,
        urb: this.urb,
        puntoRef: this.puntoRef,
        location: JSON.stringify(this.markers) }) : this.updateAddress({
        estado: this.estado,
        ciudad: this.ciudad,
        urb: this.urb,
        municipio: this.municipio,
        calle: this.calle,
        domicilio: this.domicilio,
        id: this.id,
        alias: this.alias,
        puntoRef: this.puntoRef,
        location: JSON.stringify(this.markers) })
    },
    setDialog () {
      if (this.value === null) { this.dialog = false; return }
      const obj = this.address.find(x => x.id === this.value)
      this.estado = obj.estado
      this.ciudad = obj.ciudad
      this.municipio = obj.municipio
      this.calle = obj.calle
      this.domicilio = obj.domicilio
      this.alias = obj.alias
      this.urb = obj.urb
      this.markers = JSON.parse(obj.location)
      this.puntoRef = obj.puntoRef
      this.id = obj.id
    },
    newAddDialog () {
      this.id = null
      this.alias = null
      this.markers = []
      this.urb = null
      this.puntoRef = null
      this.estado = null
      this.ciudad = null
      this.municipio = null
      this.calle = null
      this.domicilio = null
    }
  },
  mounted () {
    if (this.currentUser !== null) {
      this.bindAddress(this.currentUser.id)
    }
  },
  data () {
    return {
      id: null,
      dialogType: null,
      alias: null,
      puntoRef: null,
      maximizedToggle: true,
      dialog: false,
      center: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 },
      markers: [],
      places: [],
      options: [],
      estado: null,
      urb: null,
      ciudad: null,
      municipio: null,
      calle: null,
      domicilio: null
    }
  }
}
</script>
