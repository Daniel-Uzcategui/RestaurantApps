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
      :value="valorSeleccionado = returnValue()"
      @input="(e) => $emit('input', addressSelected(e))"
      :options="addressRadio"
      color="primary">
    </q-option-group>

  </div>
 <div v-if="loading2">
      <q-spinner color="primary" size="6em" />
  </div>
  <div class="col-2"  v-show="deshabilitarguardar">
     <q-select v-model="courier" :options="couriersList2" label="Corrier" @blur="actualizarCourier()"  @change="actualizarCourier()"/>
  </div>
  <div class="col-2" v-show="deshabilitarguardar">
     <q-select v-model="tipoServicio" :options="tipoServicios"  label="Tipo Servicio" />
  </div>
  <div class="col-2" v-show="deshabilitarguardar">
   <q-toggle v-model="retirarOficina" label="Retirar en la Oficina" @input="recalcular2()" :disable="isLiberty ? true:false" />
  </div>
  <div class="col-2" v-show="retirarOficina">
    <q-select v-model="oficina" :options="oficinasList" label="Oficina" @blur="actualizarOficina()" @input="recalcular()" :disable="isLiberty ? true : false"/>
  </div>

    <div class="col-2" v-show="deshabilitarguardar">
      <q-toggle v-model="seguro" label="Seguro" @input="recalcular()"/>
    </div>
     <div class="col-2"  v-show="deshabilitarguardar">
        <q-input v-model="destinatario" label="Destinatario" />
    </div>
    <div class="col-2"  v-show="deshabilitarguardar">
        <q-input v-model="cirif" label="CI/RIF" />
     </div>
      <div >
        <br>
        <br>
   <p v-show="deshabilitarguardar">
    Tarifa de Envio: {{tarifa.data.total}} Bs.
    </p>
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
            <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" v-model="phone" label="Teléfono" :rules="[ val => val && val.length > 0 || 'Campo Requerido']"/>
        <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="text" readonly v-for="(addr, index) in addressOpt" :key="index" v-model="addressIn[addr]" :label="translateLabel(addr)" />
        <q-input filled class="q-pa-sm col-4" rounded outlined style="min-width: 200px" type="textarea" v-model="puntoRef" label="Punto de referencia y/o detalles" />
      </div>

    </q-form>
    </q-card-section>

    <q-card-actions align="around">
        <q-btn color="secondary" v-close-popup no-caps rounded >Cancelar</q-btn>
        <q-btn color="primary"  no-caps rounded @click="confirm()">Guardar</q-btn>

      </q-card-actions>
      <q-card-actions align="around">

  </q-card-actions>
       </q-card>
  </q-dialog>
  </div>
   <q-dialog
    style="z-index: 9999999"

      v-model="mostarDatos"
      persistent
    >
       <q-card
         style="width: 80%;
          height: 80%;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;">
          <q-card-section class="q-pt-none q-pa-md">
              <div class="col-2">
                 <q-select v-model="tipoServicio" :options="tipoServicios"  label="Tipo Servicio" />
               </div>
               <div class="col-2">
                  <q-select v-model="courier" :options="couriersList2" label="Corrier" @blur="actualizarCourier()"  @change="actualizarCourier()"/>
               </div>
                   <div class="col-12"></div>
                <div class="col-2">
                    <q-input v-model="destinatario" label="Destinatario" />
                </div>
                <div class="col-2">
                    <q-input v-model="contacto" label="Contacto" />
                </div>
                <div class="col-2">
                    <q-input v-model="cirif" label="CI/RIF" />
                </div>
                <div class="col-2">
                    <q-input v-model="telefono" type="tel" label="Telefono" />
                </div>
               <div class="col-2">
                    <q-toggle v-model="retirarOficina" label="Retirar en la Oficina" :disable="isLiberty ? true:false" />
                </div>
                 <div class="col-2" v-show="retirarOficina">
                    <q-select v-model="oficina" :options="oficinasList" label="Oficina" @blur="actualizarOficina()" :disable="isLiberty ? true : false"/>
                </div>
                <div class="col-12"></div>
                                <div class="col-2">
                    <q-input v-model="numeroPiezas" disable type="number" label="Número de Piezas" />
                </div>
                <div class="col-2">
                    <q-input v-model="peso" disable type="number" label="Peso" />
                </div>

                <div class="col-2">
                    <q-input v-model="valor" type="number" disable label="Valor" />
                </div>
                <div class="col-2">
                    <q-toggle v-model="seguro" label="Seguro" />
                </div>
          </q-card-section>
          <q-card-section class="q-pt-none q-pa-md">
            <q-btn color="secondary"  v-close-popup no-caps rounded @click="calcularTarifa" >Aceptar</q-btn>
          </q-card-section>
       </q-card>
    </q-dialog>
    <q-dialog v-model="tarifaModal">
            <q-card>
                <q-card-section>
                <div class="text-h6">Tarifa Aproximada</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <div class="row" v-if="tarifa.ok">
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.combustible" hint="Combustible" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-1 q-px-sm" >
                        <q-input v-model="tarifa.data.flete" hint="Flete" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.franqueo_postal" hint="Franqueo Postal" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-1 q-px-sm" >
                        <q-input v-model="tarifa.data.iva" hint="Iva" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.seguro" hint="Seguro" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm" >
                        <q-input v-model="tarifa.data.subtotal" hint="SubTotal" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                    <div class="col-2 q-px-sm">
                        <q-input v-model="tarifa.data.total" hint="TOTAL" :dense="dense" disable class="text-weight-bold"/>
                    </div>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
            </q-card>
        </q-dialog>
     <q-dialog v-model="alerta">
            <q-card>
                <q-card-section>
                <div class="text-h6">Error</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                {{alertaMsg}}
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
            </q-card>
        </q-dialog>
</div>

</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import GoogleMap from './GoogleMap.vue'
// import tarifa from '../components/jetes/tarifa.vue'
export default {
  components: {
    GoogleMap: GoogleMap

  },
  props: ['noload', 'readOnly', 'addressPickup', 'addressShipping', 'cart', 'rate'],
  computed: {
    ...mapGetters('localization', ['localZones', 'localizations']),
    ...mapGetters('address', ['address']),
    ...mapGetters('auth', ['isAnonymous']),
    ...mapGetters('menu', ['sede']),
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('config', ['paymentServ', 'configurations', 'rates']),
    ...mapState('data', [
      'couriersList',
      'estadosList',
      'ciudadesList',
      'municipiosList',
      'parroquiasList',
      'oficinasList',
      'errorList',
      'dataSelected',
      'guia',
      'tarifa',
      'tracking',
      'pdfGuia'
    ]),

    deshabilitarguardar () {
      return this.valorSeleccionado !== null
    },
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
      this.DatosEncomienda(id.id, this.cart)
      return id
    },
    addressSelected2 (e) {
      let id
      console.log('parametro de entrada', e)
      id = this.address.find(x => x.id === e)
      console.log('registro', id)
      return id
    },

    async DatosEncomienda (id, cart) {
      let obj
      let cantidad = 0

      let monto = 0

      this.numeroPiezas = 0
      let corriers = []
      this.couriersList2 = []
      this.peso = 0
      this.valor = 0
      this.retirarOficina = false
      this.oficina = ''
      this.oficinasList = []
      this.seguro = false
      this.tipoServicio = {
        label: 'Cobro a Destino',
        value: 'cod',
        category: 1
      }
      this.loading2 = true
      console.log('este valor cual es', id, 'los valores de cart', cart)
      console.log('los valores de la tasa', this.rate.rateValue)
      this.addressAux = this.address.find(x => x.id === id)
      console.log(this.addressAux)
      for (let i = 0; i < cart.length; i++) {
        obj = cart[i]
        console.log('entreeeeeeeee al ciclo')
        monto = parseFloat(parseFloat(monto) + (parseFloat(obj.prodPrice) * parseFloat(obj.quantity)))
        cantidad = cantidad + obj.quantity
        if (obj?.peso === undefined) {
          this.peso = this.peso + (this.paymentServ?.pesoDefault * obj?.quantity)
        } else {
          this.peso = this.peso + (obj?.peso * obj?.quantity)
        }
      }
      this.numeroPiezas = cantidad
      this.valor = (parseFloat(monto) * parseFloat(this.rate.rateValue)).toFixed(2)
      corriers = await this.loadCouriers2()
      let cont = 1
      let obj2
      let reg = { label: '',
        value: '',
        category: 0 }
      // console.log('los curriers', corriers, 'y su lenth', corriers.data.length)
      //  this.corriers2 = corriers.data
      for (let i = 0; i < corriers.data.length; i++) {
        obj2 = corriers.data[i]
        reg = { label: obj2?.nombre,
          value: obj2._id,
          category: cont }
        this.couriersList2.push(reg)
        cont++
      }
      console.log('loa valores del curiers', corriers.data[0])
      this.actualizarCourier({ label: corriers.data[0].nombre,
        value: corriers.data[0]._id,
        category: 1 })
      //  }
      this.contacto = this.currentUser?.nombre
      this.telefono = this.addressAux.phone
      this.localizacion = this.addressAux.address.locality
      this.puntorefer = this.addressAux.puntoRef
      this.destinatario = this.currentUser?.nombre
      this.cirif = this.currentUser.cedula

      // this.mostarDatos = true
    },
    ...mapActions('address', ['bindAddress', 'addAddress', 'updateAddress', 'deleteAddress', 'addAddress2']),
    ...mapActions('data', ['loadEstados2', 'loadCiudades2', 'loadCouriers2']),
    ...mapActions('localization', ['bindLocalZones', 'bindLocalizations']),
    ...mapActions('config', ['bindPaymentServ', 'bindConfigs', 'bindRates']),
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
    recalcular () {
      console.log('este es el valor de retirar a oficina', this.retirarOficina)
      this.loading = true
      this.calcularTarifa()
      this.loading = false
    },
    recalcular2 () {
      console.log('este es el valor de retirar a oficina', this.retirarOficina)
      if (!this.retirarOficina) {
        this.loading = true
        this.calcularTarifa()
        this.loading = false
      }
    },
    async calcularTarifa () {
      let seguro = this.seguro ? 1 : 0
      let modalidad = this.retirarOficina ? 'oficina' : 'puerta'
      let ofic
      if (this.oficina.value === undefined) {
        ofic = ''
      } else {
        ofic = this.oficina.value
      }
      // this.generandoTarifa = true
      this.ciudad = { label: this.ciudadList?.nombre,
        value: this.ciudadList?._id,
        category: this.ciudadList?.codigo }
      console.log('los valores currier', this.courier, 'ciudad', this.ciudad, 'modalidad', modalidad, 'numero pieza', this.numeroPiezas, 'peso', this.peso, 'valor', this.valor, 'seguro', seguro, 'tipo tarifa', this.tipoServicio, 'oficina', this.oficina)
      this.alertaMsg = ''
      try {
        await this.$store.dispatch('data/getTarifa', {
          courier: this.courier.value,
          ciudad: this.ciudad.value,
          cantidadPiezas: this.numeroPiezas,
          peso: this.peso,
          seguro: seguro,
          valor: this.valor,
          tipoTarifa: this.tipoServicio.value,
          modalidadTarifa: modalidad,
          oficina: ofic
        })

        if (this.tarifa.error) {
          this.alerta = true
          this.alertaMsg = this.tarifa.error
        } else {
        //  this.tarifaModal = true
          this.taficacompleto = {
            tarifa: this.tarifa.data,
            tarifaOrden: {
            // courier: this.courier.label,
              courier: this.courier,
              estado: this.estado,
              ciudad: this.ciudad,
              cantidadPiezas: this.numeroPiezas,
              peso: this.peso,
              seguro: seguro,
              valor: this.valor,
              tipoTarifa: this.tipoServicio,
              modalidadTarifa: modalidad,
              oficina: this.oficina,
              status: 'enviar',
              destinatario: this.destinatario,
              contacto: this.contacto,
              telefono: this.telefono,
              puntoreferencia: this.puntorefer,
              localizacion: this.localizacion,
              cirif: this.cirif

            }
          }
          this.$emit('tarifa2-done', this.taficacompleto)
        }
      } catch (error) {
        console.error(error)
        this.alerta = true
        this.alertaMsg = error
      } finally {
        this.generandoTarifa = false
        this.loading2 = false
      }
    },
    Tarifas (tarifacompleta) {
      console.log('los valores de tarifa', tarifacompleta)
      this.Tarifita = tarifacompleta
      this.estados = false
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
    async actualizarCourier (currieraux) {
      if (currieraux.label === 'zoom') {
        this.courier = currieraux
        if (this.courier.label === 'Liberty') {
          this.isLiberty = true
          this.retirarOficina = false
        } else {
          this.isLiberty = false
        }

        //  this.$store.commit('data/loadCouriers')
        this.$store.commit('data/updateCourier', this.courier)
        this.$store.commit('data/initEstados')
        this.$store.commit('data/initCiudades')
        this.$store.commit('data/initMunicipios')
        this.$store.commit('data/initParroquias')
        this.$store.commit('data/initOficinas')
        //  this.estado = null
        this.$store.dispatch('data/loadEstados', this.courier)
        let listEstado = await this.loadEstados2(this.courier.value)
        console.log('los estado', listEstado, 'y el estado seleccionado es:', this.addressAux.address.administrative_area_level_1.toUpperCase())
        if (this.addressAux.address.locality === 'Caracas') {
          let edo = 'Distrito Capital'
          this.estadojete = listEstado.data.find(x => x.nombre.toUpperCase() === edo.toUpperCase())
        } else {
          this.estadojete = listEstado.data.find(x => x.nombre.toUpperCase() === this.addressAux.address.administrative_area_level_1.toUpperCase())
        }

        console.log('objeto estado', this.estadojete)
        // this.estados
        if (this.estadojete) {
          this.estado = { label: this.estadojete?.nombre,
            value: this.estadojete?._id,
            category: this.estadojete?.codigo }
          this.actualizarEstado()
        }
      }
    },
    async  actualizarEstado () {
      this.$store.commit('data/updateEstado', { label: this.estadojete.name,
        value: this.estadojete._id,
        category: this.estadojete.codigo })
      this.$store.commit('data/initCiudades')
      this.$store.commit('data/initMunicipios')
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      let ciudadList = await this.loadCiudades2(this.estadojete._id)
      this.ciudadList = ciudadList.data.find(x => x.nombre.toUpperCase() === this.addressAux.address?.locality.toUpperCase())
      this.ciudad = { label: this.ciudadList?.nombre,
        value: this.ciudadList?._id,
        category: this.ciudadList?.codigo }
      this.$store.dispatch('data/loadCiudades', this.ciudad)
      console.log('las ciudad del estado de Daniel', this.ciudadList)
      this.actualizarCiudad()
    },
    async  actualizarCiudad () {
      this.$store.commit('data/updateCiudad', { label: this.ciudadList?.nombre,
        value: this.ciudadList?._id,
        category: this.ciudadList?.codigo })
      this.$store.commit('data/initMunicipios')
      this.$store.commit('data/initParroquias')
      this.$store.commit('data/initOficinas')
      this.municipio = null
      this.$store.dispatch('data/loadMunicipios', { label: this.ciudadList?.nombre,
        value: this.ciudadList?._id,
        category: this.ciudadList?.codigo })
      console.log('las cuidades')
      this.$store.dispatch('data/loadOficinas', { label: this.ciudadList?.nombre,
        value: this.ciudadList?._id,
        category: this.ciudadList?.codigo })
      await this.actualizarOficina()
    },
    actualizarOficina () {
      this.$store.commit('data/updateOficina', this.oficina)
      console.log('la oficinas', this.oficina)
      this.calcularTarifa()
    },
    confirm () {
      this.$q.dialog({
        title: 'Confirmar',
        message: 'Luego de guardar, solo podrá editar el contacto, alias y puntos de referencia, ¿Desea continuar?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.newAddress()
        console.log('los datos extaridos', this.objeto)

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
      //  let valido = this.validarciudad()
        //   if (valido === true) {
        this.objeto = await this.addAddress2({

          user: this.currentUser.id,
          alias: this.alias,
          address: this.addressIn,
          contact: this.contact,
          phone: this.phone,
          // urb: this.urb,
          puntoRef: this.puntoRef,
          location: JSON.stringify(this.markers) })
        console.log('valor del objeto', this.objeto)
        let valores = this.addressSelected2(this.objeto)
        this.$emit('input', valores)

        console.log('cual es valor de value', this.value)
        this.value = valores
        this.returnValue()

        this.DatosEncomienda(this.objeto, this.cart)
        // }
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
    /*  validarciudad () {
      let corrieaux = this.loadCouriers2()
      let idcurrier = corrieaux.data[0]._id
      let estadosAux = this.loadEstados2(idcurrier)
      let idestado = estadosAux.find(x => x.nombre.toUpperCase() === this.addressIn.administrative_area_level_1.toUpperCase())
      let ciudades = this.loadCiudades2(idestado)
      let idcuidad = ciudades.find(x => x.nombre.toUpperCase() === this.addressIn.locality.toUpperCase())

    } , */
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

      this.addressIn = {}
      this.addressOpt = []
    }
  },
  async mounted () {
    this.bindPaymentServ()

    if (this.isAnonymous) {
      this.loading = false
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
    estados () {
      console.log('cambio')
    },
    value () {
      this.setDialog()
      if (this.isValidMarker()) {
        console.log('hi')
        this.$emit('invalid-address', true)
      } else {
        this.$emit('invalid-address', false)
      }
    },
    valorSeleccionado () {
      console.log('valor seleccionado', this.valorSeleccionado)
      if (this.valorSeleccionado === null) {
        this.$emit('valorcontinuar', false)
      }
    }
  },
  data () {
    return {
      tipoServicio: '',
      tipoServicios: [
        {
          label: 'Cobro a Destino',
          value: 'cod',
          category: 1
        },
        {
          label: 'Contado',
          value: 'nacional',
          category: 2
        }
      ],
      courier: '',
      isLiberty: false,
      retirarOficina: false,
      seguro: false,
      loading2: false,
      value: '',
      objeto: '',
      corriers2: [],
      ciudadList: [],
      idselecionado: '',
      oficina: '',
      couriersList2: [],
      valorSeleccionado: '',
      numeroPiezas: 0,
      alerta: false,
      alertaMsg: '',
      peso: 0,
      valor: 0,
      tarifaModal: false,
      taficacompleto: {},
      destinatario: '',
      contacto: '',
      telefono: '',
      dense: false,
      cirif: '',
      mostarDatos: false,
      addressAux: '',
      localizacion: '',
      puntorefer: '',
      estadojete: '',
      gActive: false,
      estados: true,
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
      Tarifita: {},
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
          bus_stsation: 'Terminal de Autobuses'
        }
      }
    }
  }
}
</script>
