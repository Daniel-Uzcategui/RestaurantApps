<template>
  <q-page class="" >
     <div class="">
      <q-form @submit="agregar" class="" >
      <q-card >
       <q-card-section  class="q-cardtop header" >
          <div class="text-h5">Agregar Usuarios</div>
          <div>
            <q-btn class="header-btn" flat push label="Agregar" type="submit" icon="add"/>
            <q-btn class="header-btn-back" flat push  icon="arrow_back" @click="$router.replace('/users/index')"/>
          </div>
       </q-card-section>
       <div class='filled'></div>
        <q-card-section class="row">
          <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4" >
          <q-input debounce="1000" :rules="[ Checkmail ]" filled label="Correo Electrónico"  v-model="email" outlined
            type="email" float-label="Float Label" placeholder="Correo Electrónico" />
         </div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-input filled
          :rules="[ (val) => validatePhoneForE164(val) || 'Porfavor coloque un teléfono valido, con su código de país ej: +584121234567' ]"
          v-model="phone"
          type="text"
          float-label="Float Label"
          placeholder="Telefono"
          label="Telefono"
          outlined
           />
        </div>
          <!-- <q-btn color="white" text-color="black" label="Verificar Correo" /> -->
         <div class="flex-break q-py-md "></div>
        <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-input filled
          v-model="nombre"
          type="text"
          float-label="Float Label"
          placeholder="Nombre"
          ref="nombre"
          label="Nombre"
          outlined
          />
        </div>
        <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-input filled
          v-model="apellido"
          type="text"
          float-label="Float Label"
          placeholder="Apellido"
          ref="apellido"
          label="Apellido"
          outlined
          />
        </div>
        <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <!-- <q-select options-selected-class="text-blue" filled v-model="status" map-options emit-value standout="bg-teal "
          outlined :options="estatus_options" label="Estatus" /> -->
        </div>
        <div class="flex-break q-py-md "></div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
          <q-radio  dense label="Administrador" color="teal" val="Admin"  v-model="typeAccess"  class="typeAccess"/>
          <q-radio  dense label="Cliente" color="orange" val="Client" v-model="typeAccess"  class="typeAccess" />
          <q-radio  dense label="Proveedor" color="red" val="Proveedor" v-model="typeAccess"  class="typeAccess" />
          <q-radio  dense label="Delivery" color="blue" val="Delivery"  v-model="typeAccess" class="typeAccess" />
          <q-radio  dense label="Vendedor" color="yellow" val="Seller"  v-model="typeAccess" class="typeAccess" />
        </div>
        <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4" >
            <q-input filled label="Identificación" v-model="cedula" outlined
             type="text" float-label="Float Label" placeholder="Identificación" />
          </div>

      <div class="flex-break q-py-md "></div>
      <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
      <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal "
          v-model="sexo" outlined
          :options="sexo_options"
          label="Sexo" />
      </div>
      <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4" >
        <q-input filled  label="Fecha de Nacimiento"  v-model="fecnac" :rules="['fecnac']" outlined>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="fecnac" :locale="Local_ES" mask="DD-MM-YYYY" ></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      </div>
      <div class="flex-break q-py-md "></div>
      <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4">
      <q-input filled
        square outlined
        clearable
        v-model="password"
        lazy-rules="lazy-rules"
        autocomplete="current-password new-password"
        color="primary"
        data-cy="password"
        label="contraseña"
        :rules="[val => !!val || '*Campo es requerido']" :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      </div>
      <div class="header-cell col-xs-12 col-sm-6 col-md-4 col-lg-4" >
        <q-input filled
        square outlined
        clearable
        lazy-rules="lazy-rules"
        autocomplete="new-password"
        color="primary"
        data-cy="verifyPassword"
        label="Confirmar contraseña"
        v-model="passwordMatch"
        :rules="[val => !!val || '*Campo es requerido', val => val === password || '*contraseña y confirmación no son iguales']"
        :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      </div> <!-- Proveedor -->
      <div class="flex-break q-py-md "></div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Proveedor'" >
          <q-input filled
          v-model="codigoDelivery"
          type="text"
          float-label="Float Label"
          placeholder="Codigo"
          ref="codigoDelivery"
          label="Codigo"
          outlined/>
        </div>
        <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Proveedor'" >
            <q-input filled
          v-model="razonSocial"
          type="text"
          float-label="Float Label"
          placeholder="Razón Social"
          ref="razonSocial"
          label="Razón Social"
          outlined/>
          </div>
          <div class="header-cell col-xs-12 col-sm-6 col-md-2 col-lg-2" v-if="typeAccess==='Proveedor'">
          <q-input filled
          v-model="RIF"
          type="text"
          float-label="Float Label"
          placeholder="Id Fiscal"
          ref="RIF"
          label="Id Fiscal"
          outlined/>
         </div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Proveedor'">
          <q-input filled
          v-model="razonComercial"
          type="razonComercial"
          float-label="Float Label"
          placeholder="Razón Comercial"
          label="Razón Comercial"
          outlined/>
         </div>
        <!-- delivery  o seller-->
       <div class="flex-break q-py-md "></div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Delivery' ||  typeAccess==='Seller'" >
          <q-input filled
          v-model="codigo"
          type="text"
          float-label="Float Label"
          placeholder="Codigo"
          ref="codigoDelivery"
          label="Codigo"
          outlined/>
        </div>
        <!-- delivery -->
        <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Delivery'" >
         <q-select options-selected-class="text-blue" filled v-model="statusUbicacion" map-options emit-value standout="bg-teal "
          outlined :options="estatus_ubicacion" label="Estatus de Ubicación" />
          </div>
          <div class="header-cell col-xs-12 col-sm-6 col-md-2 col-lg-2" v-if="typeAccess==='Delivery'">
          <q-select options-selected-class="text-blue" filled v-model="movilidad" map-options emit-value standout="bg-teal "
          outlined :options="tipo_options" label="Tipo movilidad" />
         </div>
         <div class="header-cell col-xs-12 col-sm-6 col-md-3 col-lg-3" v-if="typeAccess==='Delivery'">
         <q-select options-selected-class="text-blue" filled v-model="statusdelivery" map-options emit-value standout="bg-teal "
          outlined :options="estatus_delivery" label="Estatus delivery" />
         </div>
          </q-card-section>
      <diV class='filled'></diV>
     </q-card>
    </q-form>
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
import { mapActions } from 'vuex'
import createauser from '../../mixins/createauser'
export default {
  mixins: [createauser],
  data () {
    return {
      validationError: false,
      codigo: '',
      codigoDelivery: '',
      razonSocial: '',
      phone: '',
      RIF: '',
      razonComercial: '',
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      status: 1,
      statusUbicacion: '',
      movilidad: '',
      statusdelivery: '',
      isPwd: true,
      typeAccess: 'Admin',
      fecnac: '',
      sexo: '',
      password: '',
      passwordMatch: '',
      messageError: [],
      rol: ['Admin'],
      localizacion_sede: [],
      estatus_options: [
        { label: 'Activo', value: 0 },
        { label: 'Inactivo', value: 1 }
      ],
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' },
        { label: 'Otros', value: 'O' }
      ],
      typeAccess_options: [
        { label: 'Proveedor', value: 'Proveedor' },
        { label: 'Delivery', value: 'Delivery' },
        { label: 'Cliente', value: 'Client' },
        { label: 'Administrativo', value: 'Admin' }
      ],
      estatus_ubicacion: [
        { label: 'En Sede', value: 1 },
        { label: 'Asignado', value: 2 },
        { label: 'En vía al destino', value: 3 },
        { label: 'En Retorno', value: 4 }
      ],
      tipo_options: [
        { label: 'Vehículo', value: 0 },
        { label: 'Motocicleta', value: 1 },
        { label: 'Bicicleta', value: 2 },
        { label: 'Caminando', value: 3 }
      ],
      estatus_delivery: [
        { label: 'Disponible', value: 0 },
        { label: 'No disponible', value: 1 },
        { label: 'Suspendido', value: 2 }
      ],
      Local_ES: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      }
    }
  },
  methods: {
    async Checkmail (val, rules) {
      if (!rules.email(val)) {
        return 'Porfavor coloque un correo electrónico valido'
      }
    },
    validatePhoneForE164 (phoneNumber) {
      const regEx = /^\+[1-9]\d{10,14}$/
      return regEx.test(phoneNumber)
    },
    ...mapActions('auth', ['createUser']),
    async agregar () {
      const { email, password, nombre, apellido, cedula, sexo,
        fecnac, codigo, razonSocial, RIF, razonComercial,
        rol, typeAccess, codigoDelivery, statusUbicacion,
        movilidad, statusdelivery, phone } = this
      // this.$refs.emailAuthenticationForm.validate()
      console.log(email, password, nombre, apellido, cedula,
        sexo, fecnac, codigo, razonSocial, RIF, razonComercial,
        rol, typeAccess, codigoDelivery, statusUbicacion, movilidad, statusdelivery, phone)
      try {
        this.$q.loading.show()
        await this.createAUser({ email, password, nombre, apellido, cedula, sexo, fecnac, codigo, razonSocial, RIF, razonComercial, rol, typeAccess, codigoDelivery, statusUbicacion, movilidad, statusdelivery, phone, ambiente: localStorage.getItem('amb') }).then(() => this.$q.loading.hide())
        return this.$q.dialog({
          title: '',
          message: 'Se ha guardado exitosamente el Usuario',
          cancel: false,
          persistent: true
        }).onOk(() => this.$router.replace('/users/index'))
      } catch (error) {
        this.$q.loading.hide()
        console.error(error)
        this.$q.dialog({
          title: '',
          message: 'Hubo un error al agregar el usuario, ' + error,
          cancel: false,
          persistent: true
        })
      }
    }
  },
  watch: {
    typeAccess (e) {
      switch (e) {
        case 'Admin':
          this.rol = ['Admin']
          break
        case 'Seller':
          this.rol = ['Vendedor']
          break
        default:
          this.rol = []
          break
      }
    }
  },
  mounted () {
    this.$refs.nombre.focus()
  }
}
</script>
<style lang="stylus" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute
  right: 10px !important
.filled
  padding-top: 50px
.header-cell
  padding-left: 30px
.header-btn-back
  position: absolute
  right: 120px !important
.header
 padding-bottom: 50px
.div-typeServices
 padding-top: 20px
.typeServices
 padding-left: 10px
.pac-container
 z-index: 99999999 !important
.typeAccess
 padding-left: 10px
 </style>
