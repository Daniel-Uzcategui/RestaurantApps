<template>
<div>
<div v-if="readOnly">
        <q-list>
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">Dirección de Pickup</div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{addPickup}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple>
            <q-item-section class="text-left" >
            <div class="text-caption">Dirección de Entrega</div>
            </q-item-section>
            <q-item-section class="text-center">
              <q-item-label lines="3">{{addShipping}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </div>

  <div v-if="!readOnly">
    <div >
    <q-btn-group v-if="!isAnonymous" rounded spread class="full-width">
      <q-btn no-caps color="secondary" v-if="addressRadio.length !== 0" @click="dialog = true; dialogType = 'visual'; setDialog()" icon="search" />
      <q-btn no-caps color="secondary" @click="dialog = true; dialogType = 'new'; newAddDialog()" icon="add" />
      <q-btn no-caps color="secondary" v-if="addressRadio.length !== 0" icon="remove" @click="deleteAddress({id: value})" />
    </q-btn-group>
    <div class="row justify-center q-pa-md">
      <q-spinner class="col" v-if="loading && (typeof noload === 'undefined' || noload === null)" size="lg" color="primary" />
      <p v-if="addressRadio.length === 0 && !loading" class="text-h4 text-center col-12">No existen direcciones asociadas a esta cuenta</p>
      <div class="text-h4 text-center col-12" v-if="isAnonymous">
        <p> Para agregar debe iniciar sesión</p>
         <q-btn color="primary" rounded label="Iniciar Sesión" to="/auth/login" />
      </div>
    </div>
    <q-option-group
      :value="returnValue()"
      @input="(e) => $emit('input', addressSelected(e))"
      :options="addressRadio"
      color="primary"
    />
  </div>
  <q-dialog
  style="z-index: 9999999"
  seamless
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card
    v-show="diagHack"
    style="width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;"
          class="q-fullscreen-glassMorph">
        <q-bar class="bg-transparent q-mt-sm">
              <q-btn flat ></q-btn>
               <q-btn style="z-index: 2001" dense flat icon="fas fa-chevron-left" v-close-popup>
                  <q-tooltip :hide-delay="650" content-class=" text-primary">Close</q-tooltip>
               </q-btn>
            </q-bar>
    <q-card-section @click.prevent class="q-pt-none q-pa-md">
      <google-map
        v-if="address.length || markers.length || gActive "
        :poly="getZones()"
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
            <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="number" v-model="phone" label="Teléfono" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
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
          if (markers.length && isValidMarker()) {
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
import GoogleMap from './GoogleMap.vue'
export default {
  components: {
    GoogleMap: GoogleMap
  },
  props: ['noload', 'readOnly', 'addressPickup', 'addressShipping'],
  computed: {
    ...mapGetters('localization', ['localZones', 'localizations']),
    ...mapGetters('address', ['address']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['sede']),
    ...mapGetters('user', ['currentUser']),
    addPickup () {
      let p = this.addressRadio.find(x => x.value === this.addressPickup)
      if (p) {
        return p.label
      } else {
        return ''
      }
    },
    addShipping () {
      let p = this.addressRadio.find(x => x.value === this.addressShipping)
      if (p) {
        return p.label
      } else {
        return ''
      }
    },
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
    returnValue () {
      return this.value?.id || null
    },
    addressSelected (e) {
      let id
      console.log('parametro de entrada', e)
      id = this.address.find(x => x.id === e)
      console.log('registro', id)
      this.value = id
      return id
    },
    ...mapActions('address', ['bindAddress', 'addAddress', 'updateAddress', 'deleteAddress', 'addAddress2']),
    ...mapActions('localization', ['bindLocalZones', 'bindLocalizations']),
    isValidMarker () {
      if (this.getZones().length === 0 && this.markers.length !== 0) {
        return true
      }
      if (this.markers.length === 0) { return false }
      // eslint-disable-next-line no-undef
      if (typeof google === 'undefined') { return false }
      for (let i in this.getZones()) {
        let latLng = this.markers[0].position
        if (!isNaN(latLng.lat)) {
          // eslint-disable-next-line no-undef
          latLng = new google.maps.LatLng(this.markers[0].position)
        }
        // eslint-disable-next-line no-undef
        let poly = new google.maps.Polygon({ paths: this.getZones()[i] })
        // console.log({ latLng, mark: this.markers, poly })
        // eslint-disable-next-line no-undef
        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
          this.$emit('update-price', this.getZonePrices()[i]['price'])
          return true
        }
      }
      return false
    },
    getZones () {
      if (typeof this.sede === 'undefined' || this.sede === null) { return false }
      let sede = this.localizations.find(x => x.id === this.sede)
      // console.log(sede)
      let zone = this.localZones.find(x => x.id === sede.deliveryZone)
      if (typeof zone === 'undefined' || typeof zone.paths === 'undefined') { return [] }
      return JSON.parse(zone.paths)
    },
    getZonePrices () {
      if (typeof this.sede === 'undefined' || this.sede === null) { return false }
      let sede = this.localizations.find(x => x.id === this.sede)
      // console.log(sede)
      let zone = this.localZones.find(x => x.id === sede.deliveryZone)
      if (typeof zone === 'undefined' || typeof zone.paths === 'undefined') { return false }
      return zone.zones
    },
    showNotif () {
      this.$q.notify({
        message: `Debe seleccionar la ubicación en el mapa, Dentro de las limitaciones marcadas`,
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
      // console.log({ add: e })
    },
    translateLabel (e) {
      return this.addressIn && this.addressIn.country && this.translationJson[this.addressIn.country] && this.translationJson[this.addressIn.country][e] ? this.translationJson[this.addressIn.country][e] : e
    },
    async newAddress () {
      if (this.dialogType === 'new') {
        this.objeto = await this.addAddress2({

          user: this.currentUser.id,
          alias: this.alias,
          address: this.addressIn,
          contact: this.contact,
          phone: this.phone,
          // urb: this.urb,
          puntoRef: this.puntoRef,
          location: JSON.stringify(this.markers) })
        console.log('el valor del objeto', this.objeto)
        let valores = this.addressSelected(this.objeto)
        console.log('el valor del objeto', valores)
        this.$emit('input', valores)

        console.log('cual es valor de value', this.value)
        this.value = valores
        this.returnValue()
      } else {
        this.updateAddress({

          address: this.addressIn,
          id: this.id,
          contact: this.contact,
          phone: this.phone,
          alias: this.alias,
          puntoRef: this.puntoRef,
          location: JSON.stringify(this.markers) })
      }
      this.$emit('input', null)
    },
    setDialog () {
      this.readAddr = true
      if (this.value === null) { this.dialog = false; return }
      const obj = this.value
      // this.estado = obj.estado
      // this.ciudad = obj.ciudad
      // this.municipio = obj.municipio
      // this.calle = obj.calle
      // this.domicilio = obj.domicilio
      this.addressIn = obj && obj.address ? obj.address : {}
      this.addressOpt = obj && obj.address ? Object.keys(obj.address) : []
      this.alias = obj.alias
      this.contact = obj.contact
      this.phone = obj.phone
      // this.urb = obj.urb
      this.markers = obj && obj.location ? JSON.parse(obj.location) : []
      this.puntoRef = obj.puntoRef
      this.id = obj.id
    },
    newAddDialog () {
      this.gActive = true
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
    this.bindLocalizations().catch(e => console.log(e))
    this.bindLocalZones().catch(e => console.log(e))
    if (this.isAnonymous) {
      this.loading = false
    }
    if (this.currentUser !== null) {
      var binded = await this.bindAddress(this.currentUser.id).catch(e => { console.log(e); this.loading = false })
      if (binded) {
        this.loading = false
      }
    }
    if (this.address.length) {
      this.loading = false
    }
    console.log({ addd: this.address })
    setTimeout(() => {
      this.dialog = false
      this.diagHack = true
    }, 100)
  },
  watch: {
    loading () {
      this.$emit('stoploading', true)
    },
    value () {
      this.setDialog()
      if (this.isValidMarker()) {
        console.log('hi')
        this.$emit('invalid-address', true)
      } else {
        this.$emit('invalid-address', false)
      }
    }
  },
  data () {
    return {
      gActive: false,
      contact: '',
      phone: '',
      readAddr: false,
      addressOpt: [],
      addressIn: {},
      loading: true,
      id: null,
      dialogType: null,
      objeto: '',
      alias: null,
      puntoRef: null,
      maximizedToggle: true,
      value: '',
      dialog: true,
      diagHack: false,
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
          street_number: '# de Calle',
          establishment: 'Domicilio',
          bus_station: 'Terminal de Autobuses'
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
          street_number: '# de Calle',
          establishment: 'Domicilio',
          bus_station: 'Terminal de Autobuses'
        }
      }
    }
  }
}
</script>
