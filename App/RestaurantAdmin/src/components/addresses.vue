<template>
<div>
<div v-if="readOnly">
        <q-list>
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">Dirección de Pickup</div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{addressRadio.find(x => x.value === addressPickup)['label']}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">Dirección de Entrega</div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{addressRadio.find(x => x.value === addressShipping)['label']}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>

  <div v-if="!readOnly">
    <div :class=" $q.dark.isActive ? 'bg-dark ' : 'bg-white text-black'">
    <q-btn-group rounded spread class="full-width">
      <q-btn no-caps color="secondary" @click="dialog = true; dialogType = 'visual'; setDialog()" icon="search" />
      <q-btn no-caps color="secondary" @click="dialog = true; dialogType = 'new'; newAddDialog()" icon="add" />
      <q-btn no-caps color="secondary" icon="remove" @click="deleteAddress({id: value})" />
    </q-btn-group>
    <div class="row justify-center q-pa-md">
      <q-spinner-cube class="col" v-if="loading && (typeof noload === 'undefined' || noload === null)" size="lg" color="primary" />
      <p v-if="addressRadio.length === 0 && !loading" class="text-h4 text-center col">No existen direcciones asociadas a esta cuenta</p>
    </div>
    <q-option-group
      :value="value"
      @input="(e) => $emit('input', e)"
      :options="addressRadio"
      color="primary"
    />
  </div>
  <q-dialog
  style="z-index: 9999999"
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card
    style="width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          :class=" $q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 2001" dense flat icon="fas fa-chevron-left" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
    <q-card-section @click.prevent class="q-pt-none q-pa-md">
      <google-map
        @address-update="(e) => updateAddIn(e)"
        :readOnly="readAddr"
        :center="center"
        :markers="markers"
        @update-mark="(e) => markers = e" />
    </q-card-section>
      <q-card-section class="q-pt-none q-pa-md">
        <q-form
          ref="addrs"
          class="q-gutter-md"
        >
      <div class="row justify-center">
        <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="alias" label="Alias" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
          <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="contact" label="Nombre de Contacto" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
            <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="phone" label="Teléfono" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
        <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" readonly v-for="(addr, index) in addressOpt" :key="index" v-model="addressIn[addr]" :label="translateLabel(addr)" />
        <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="textarea" v-model="puntoRef" label="Punto de referencia y/o detalles" />
      </div>
      <!-- <q-input filled class="q-pa-sm" filled type="text" v-model="alias" label="Alias" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm" filled type="text" v-model="estado" label="Estado" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm" filled type="text" v-model="ciudad" label="Ciudad" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm" filled type="text" v-model="municipio" label="Municipio" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm" filled type="text" v-model="urb" label="Urbanización" :rules="[ val => val && val.length > 0 || 'Campo Requerido']" />
      <q-input filled class="q-pa-sm" filled type="text" v-model="calle" label="Calle" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm" filled type="text" v-model="domicilio" label="Domicilio" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
      <q-input filled class="q-pa-sm"  filled type="textarea" v-model="puntoRef" label="Punto de referencia" /> -->
    </q-form>
    </q-card-section>
    <q-card-actions align="around">
        <q-btn color="secondary" v-close-popup no-caps rounded >Cancelar</q-btn>
        <q-btn color="primary" no-caps rounded @click="$refs.addrs.validate().then(e => { if (e) {
          if (markers.length) {
            confirm()
            } else {
            showNotif()
          }
          }})">Guardar</q-btn>
      </q-card-actions>
       </q-card>
  </q-dialog>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    GoogleMap: require('./GoogleMap.vue').default
  },
  props: ['value', 'noload', 'readOnly', 'addressPickup', 'addressShipping'],
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
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar la ubicación en el mapa`,
        color: 'red',
        actions: [
          { label: 'X', color: 'white' }
        ]
      })
    },
    confirm () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Luego de guardar, solo podrá editar el contacto, alias y puntos de referencia, ¿Desea continuar?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.newAddress()
        this.dialog = false
      })
    },
    updateAddIn (e) {
      if (typeof e === 'undefined') { return }
      let reverse = e.reverse()
      this.addressOpt = []
      for (let i in reverse) {
        this.addressOpt[i] = reverse[i].types[0]
      }
      this.addressIn = {}
      for (let i of e) {
        this.addressIn[i.types[0]] = i.long_name
      }
      console.log({ add: e })
    },
    translateLabel (e) {
      return this.addressIn && this.addressIn.country && this.translationJson[this.addressIn.country] && this.translationJson[this.addressIn.country][e] ? this.translationJson[this.addressIn.country][e] : e
    },
    newAddress () {
      this.dialogType === 'new' ? this.addAddress({
        // estado: this.estado,
        // ciudad: this.ciudad,
        // municipio: this.municipio,
        // calle: this.calle,
        // domicilio: this.domicilio,
        user: this.currentUser.id,
        alias: this.alias,
        address: this.addressIn,
        contact: this.contact,
        phone: this.phone,
        // urb: this.urb,
        puntoRef: this.puntoRef,
        location: JSON.stringify(this.markers) }) : this.updateAddress({
        // estado: this.estado,
        // ciudad: this.ciudad,
        // urb: this.urb,
        // municipio: this.municipio,
        // calle: this.calle,
        // domicilio: this.domicilio,
        address: this.addressIn,
        id: this.id,
        contact: this.contact,
        phone: this.phone,
        alias: this.alias,
        puntoRef: this.puntoRef,
        location: JSON.stringify(this.markers) })
    },
    setDialog () {
      this.readAddr = true
      if (this.value === null) { this.dialog = false; return }
      const obj = this.address.find(x => x.id === this.value)
      // this.estado = obj.estado
      // this.ciudad = obj.ciudad
      // this.municipio = obj.municipio
      // this.calle = obj.calle
      // this.domicilio = obj.domicilio
      this.addressIn = obj.address ? obj.address : {}
      this.addressOpt = obj.address ? Object.keys(obj.address) : []
      this.alias = obj.alias
      this.contact = obj.contact
      this.phone = obj.phone
      // this.urb = obj.urb
      this.markers = JSON.parse(obj.location)
      this.puntoRef = obj.puntoRef
      this.id = obj.id
    },
    newAddDialog () {
      this.readAddr = false
      this.id = null
      this.alias = null
      this.markers = []
      this.contact = ''
      this.phone = ''
      // this.urb = null
      this.puntoRef = null
      // this.estado = null
      // this.ciudad = null
      // this.municipio = null
      // this.calle = null
      // this.domicilio = null
      this.addressIn = {}
      this.addressOpt = []
    }
  },
  async mounted () {
    if (this.currentUser !== null) {
      var binded = await this.bindAddress(this.currentUser.id).catch(e => console.log(e))
      if (binded) {
        this.loading = false
      }
    }
  },
  watch: {
    loading () {
      this.$emit('stoploading', true)
    }
  },
  data () {
    return {
      contact: '',
      phone: '',
      readAddr: false,
      addressOpt: [],
      addressIn: {},
      loading: true,
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
      domicilio: null,
      translationJson: {
        Venezuela: {
          country: 'País',
          postal_code: 'Código Postal',
          administrative_area_level_1: 'Estado',
          administrative_area_level_2: 'Municipio',
          locality: 'Ciudad',
          route: 'Calle/Avenida',
          premise: 'Domicilio',
          political: 'Urbanización',
          street_number: '# de Calle'
        },
        Panamá: {
          country: 'País',
          postal_code: 'Código Postal',
          administrative_area_level_1: 'Provincia',
          administrative_area_level_2: 'Localización',
          locality: 'Ciudad',
          route: 'Calle/Avenida',
          premise: 'Domicilio',
          political: 'Urbanización',
          street_number: '# de Calle'
        }
      }
    }
  }
}
</script>
