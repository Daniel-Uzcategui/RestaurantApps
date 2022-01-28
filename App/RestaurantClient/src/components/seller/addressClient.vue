<template>
      <q-card
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
        @address-update="(e) => updateAddIn(e)"
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
        <!-- <q-input dense class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="alias" label="Alias" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/> -->
        <q-input dense class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="contact" label="Nombre de Contacto" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
        <q-input dense class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="phone" label="Teléfono" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
        <q-input dense class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" readonly v-for="(addr, index) in addressOpt" :key="index" v-model="addressIn[addr]" :label="translateLabel(addr)" />
        <q-input dense class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="textarea" v-model="puntoRef" label="Punto de referencia y/o detalles" />
      </div>
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
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import { mapGetters } from 'vuex'
import GoogleMap from '../GoogleMap.vue'
export default {
  name: 'addressClient',
  props: ['clientId'],
  data () {
    return {
      center: { 'lat': 10.489585981801593, 'lng': -66.90502725946766 },
      markers: [],
      places: [],
      alias: '',
      contact: '',
      phone: '',
      addressOpt: [],
      addressIn: {},
      puntoRef: '',
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
  },
  computed: {
    ...mapGetters('address', ['address'])
  },
  components: {
    GoogleMap: GoogleMap
  },
  methods: {
    addressSelected (e) {
      return this.address.find(x => x.id === e)
    },
    ...mapActions('address', ['bindAddress', 'addAddress']),
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
    newAddress () {
      if (this.clientId) {
        this.addAddress({
          user: this.clientId,
          address: this.addressIn,
          contact: this.contact,
          phone: this.phone,
          puntoRef: this.puntoRef,
          location: JSON.stringify(this.markers) }).then((e) => this.$emit('input', e))
      }
    },
    translateLabel (e) {
      return this.addressIn && this.addressIn.country && this.translationJson[this.addressIn.country] && this.translationJson[this.addressIn.country][e] ? this.translationJson[this.addressIn.country][e] : e
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
    }
  }
}
</script>
