<template>
  <q-page :class="$q.screen.gt.xs ? 'q-ma-lg' : 'q-mt-lg'" >
     <div class='q-gutter-md'>
      <q-card class='q-cardGlass'>
       <q-card-section  class='q-cardtop  header' >
          <div class='text-h5'>Configuración General
            <q-btn flat color='white' push @click='explain = true' icon='help' />
          </div>
          <div>
            <!--div v-if='config'>
              <q-btn class='header-btn' flat color='white' push  @click='save' icon='fas fa-save'/>
            </div> <div v-else!-->
            <div v-if='!config'>
              <q-btn class='header-btn' flat color='white' push @click='add' icon='add'/>
            </div>
            <q-btn class='header-btn-back' flat color='white' push  icon='arrow_back' @click="$router.replace('/home')"/>
          </div>
       </q-card-section>
        <h5 class="header-cell">Datos Legales</h5>
        <div class='row header-container'>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
              <q-select options-selected-class='text-blue' filled rounded outlined map-options emit-value standout='bg-teal '
              v-model = country
              :options='country_options'
               />
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
              <q-select options-selected-class='text-blue' filled rounded outlined map-options emit-value standout='bg-teal '
            v-model = tipoPersona
            :options='tipoPersona_options' />
          </div>
        </div>
        <div id='juridico' v-show="tipoPersona=='Juridico'">
          <div class='filled'></div>
          <div class='row header-container'>
              <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <q-input filled
                v-model='companyName'
                label='Razón Social'
                type='text'
                float-label='Float Label'
                placeholder='Razón Social'
                outlined
                :rules="[ val => val && val.length > 0 || '*Requerido el campo Razón Social']"/>
              </div>
              <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <q-input filled
                v-model='companyComercialName'
                label='Razón Comercial'
                type='text'
                float-label='Float Label'
                placeholder='Razón Comercial'
                outlined
                :rules="[ val => val && val.length > 0 || '*Requerido el campo Razón Comercial']"/>
              </div>
          </div>
         <div class='filled'></div>
          <div class='row header-container'>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='personaContacto'
            label='Persona Contacto'
            type='text'
            float-label='Float Label'
            placeholder='Persona Contacto'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Persona Contacto']"/>
          </div>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <span>Moneda</span>
              <q-option-group color='blue' inline filled v-model='moneda' map-options emit-value standout='bg-teal '
              outlined :options='currency_options' label='Moneda' />
            </div>
          </div>
         </div>
         <div id='Natural' v-show="tipoPersona=='Natural'">
          <div class='filled'></div>
          <div class='row header-container'>
              <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <q-input filled
                v-model='nombre'
                label='Nombre'
                type='text'
                float-label='Float Label'
                placeholder='Nombre'
                outlined
                :rules="[ val => val && val.length > 0 || '*Requerido el campo nombre']"/>
              </div>
              <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <q-input filled
                v-model='apellido'
                label='Apellido'
                type='text'
                float-label='Float Label'
                placeholder='Apellido'
                outlined
                :rules="[ val => val && val.length > 0 || '*Requerido el campo Apellido']"/>
              </div>
          </div>
         <div class='filled'></div>
          <div class='row header-container'>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='cedula'
            label='Cedula de Identidad'
            type='text'
            float-label='Float Label'
            placeholder='Cedula de Identidad'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Cedula de Identidad']"/>
          </div>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <span>Sexo</span>
              <q-option-group color='blue' inline filled v-model='sexo' map-options emit-value standout='bg-teal '
              outlined :options='sexo_options' label='Sexo' />
            </div>
          </div>
           <div class='filled'></div>
          <div class='row header-container'>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
              <q-input filled  label="Fecha de Nacimiento" class="filled" v-model="fecnac" :rules="['fecnac']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="fecnac" :locale="Local_ES" mask="DD-MM-YYYY" ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
           </div>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <span>Moneda</span>
              <q-option-group color='blue' inline filled v-model='moneda2' map-options emit-value standout='bg-teal '
              outlined :options='currency_options' label='Moneda' />
            </div>
          </div>
         </div>
          <div class='row header-container'>
            <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
               <span>Actividad Economica </span>
              <q-select options-selected-class='text-blue' filled rounded outlined map-options emit-value standout='bg-teal '
                 v-model = ActividadEconomica
               :options='ActividadEconomica_options' />
            </div>
          </div>
           <div class='filled'></div>
         <div class='row header-container'>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='telefonoLocal'
            label='Telefono'
            type='text'
            float-label='Float Label'
            placeholder='Telefono'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Telefono']"/>
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='telefonoMovil'
            label='Telefono Celular'
            type='text'
            float-label='Float Label'
            placeholder='Telefono Celular'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Telefono Celular']"/>
          </div>
         </div>
        <div class='filled'></div>
         <h5 class="header-cell">Redes Sociales</h5>
         <div class='row header-container'>
         <div class='header-cell col-xs-6 col-sm-6 col-md-3 col-lg-3'>
            <q-input filled
            v-model='instagram'
            label='Instagram'
            type='text'
            float-label='Float Label'
            placeholder='Instagram'
            outlined
            />
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-3 col-lg-3'>
            <q-input filled
            v-model='twitter'
            label='Twitter'
            type='text'
            float-label='Float Label'
            placeholder='Twitter'
            outlined
            />
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-3 col-lg-3'>
            <q-input filled
            v-model='facebook'
            label='Facebook'
            type='text'
            float-label='Float Label'
            placeholder='Facebook'
            outlined
            />
          </div>
       </div>
       <div class='filled'></div>
         <div class='row header-container'>
         <div class='header-cell col-xs-6 col-sm-6 col-md-3 col-lg-3'>
            <q-input filled
            v-model='linkedIn'
            label='LinkedIn'
            type='text'
            float-label='Float Label'
            placeholder='LinkedIn'
            outlined
            />
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-3 col-lg-3'>
            <q-input filled
            v-model='tiktok'
            label='tik tok'
            type='text'
            float-label='Float Label'
            placeholder='tik tok'
            outlined
            />
          </div>
       </div>
        <div class='filled'></div>
        <h5 class="header-cell">Datos Bancacrios</h5>
         <div class='row header-container'>
         <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='banco'
            label='Banco'
            type='text'
            float-label='Float Label'
            placeholder='Banco'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Banco']"/>
          </div>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
            <q-input filled
            v-model='numCuenta'
            label='Número de Cuenta'
            type='text'
            float-label='Float Label'
            placeholder='Número de Cuenta'
            outlined
            :rules="[ val => val && val.length > 0 || '*Requerido el campo Número de Cuenta']"/>
          </div>
       </div>
        <div class='filled'></div>
        <div class='row header-container'>
          <div class='header-cell col-xs-6 col-sm-6 col-md-4 col-lg-4'>
                <span>Tipo de Cuenta </span>
              <q-option-group color='blue' inline filled v-model='tipoCuenta' map-options emit-value standout='bg-teal '
              outlined :options='tipoCuenta_options' label='Tipo de Cuenta' />
            </div>
        </div>
         <div class='filled'></div>
     </q-card>
  </div>
<q-dialog v-model='validationError'>
      <q-card>
        <q-card-section class='row items-center q-pb-none'>
          <div class='text-h6'>Error</div>
          <q-space />
          <q-btn icon='close' flat round dense v-close-popup />
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
import countryOptions from 'assets/countries.json'
export default {
  created () {
    this.bindConfigs().then(() => this.afterBindigGeneral())
    this.countries()
  },
  computed: {
    ...mapGetters('config', ['configs']),
    config () {
      return this.configs.find((e) => e.id === 'general')
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig2']),
    add () {
      console.log(this.companyName)
      this.$q.loading.show()
      const payload = {
        companyName: this.companyName,
        companyComercialName: this.companyComercialName,
        moneda: this.moneda,
        moneda2: this.moneda2,
        source: 'general',
        personaContacto: this.personaContacto,
        nombre: this.nombre,
        apellido: this.apellido,
        cedula: this.cedula,
        fecnac: this.fecnac,
        sexo: this.sexo,
        country: this.country,
        planes: this.planes,
        telefonoLocal: this.telefonoLocal,
        telefonoMovil: this.telefonoMovil,
        instagram: this.instagram,
        facebook: this.facebook,
        twitter: this.twitter,
        tiktok: this.tiktok,
        linkedIn: this.linkedIn,
        banco: this.banco,
        numCuenta: this.numCuenta,
        tipoCuenta: this.tipoCuenta,
        tipoPersona: this.tipoPersona,
        ActividadEconomica: this.ActividadEconomica
      }
      this.addConfig2({ payload, doc: 'general' }).then((e) => {
        this.$q.loading.hide()
        this.$router.replace('/home')
      })
    },
    save () {
      this.saveConfig2({
        id: 'general',
        companyName: this.companyName,
        companyComercialName: this.companyComercialName,
        moneda: this.moneda,
        moneda2: this.moneda2,
        source: 'general',
        personaContacto: this.personaContacto,
        nombre: this.nombre,
        apellido: this.apellido,
        cedula: this.cedula,
        fecnac: this.fecnac,
        sexo: this.sexo,
        country: this.country,
        planes: this.planes,
        telefonoLocal: this.telefonoLocal,
        telefonoMovil: this.telefonoMovil,
        instagram: this.instagram,
        facebook: this.facebook,
        twitter: this.twitter,
        banco: this.banco,
        numCuenta: this.numCuenta,
        tipoCuenta: this.tipoCuenta,
        tipoPersona: this.tipoPersona
      })
        .then(() =>
          this.$q.dialog({
            title: '',
            message: 'Se han guardo exitosamente los ajustes',
            cancel: false,
            persistent: true
          })
        )
        .catch((e) =>
          this.$q.dialog({
            title: '',
            message:
              'Hubo un error al agregar los ajustes, porfavor contactar con el administrador',
            cancel: false,
            persistent: true
          })
        )
    },
    countries () {
      let country, options
      for (let i = 0; i < this.countries_json.countries.length; i++) {
        country = JSON.parse(JSON.stringify(this.countries_json.countries[i]))
        options = {
          label: country.name_es,
          value: country.code
        }
        this.country_options.push(options)
      }
    },
    afterBindigGeneral () {
      if (typeof this.config !== 'undefined') {
        this.tipoPersona = this.config.tipoPersona
        if (this.tipoPersona === 'Juridico') {
          this.companyName = typeof this.config.companyName !== 'undefined' ? this.config.companyName : ''
          this.companyComercialName = typeof this.config.companyComercialName !== 'undefined' ? this.config.companyComercialName : ''
          this.personaContacto = typeof this.config.personaContacto !== 'undefined' ? this.config.personaContacto : ''
        } else {
          this.nombre = typeof this.config.nombre !== 'undefined' ? this.config.nombre : ''
          this.apellido = typeof this.config.apellido !== 'undefined' ? this.config.apellido : ''
          this.cedula = typeof this.config.cedula !== 'undefined' ? this.config.cedula : ''
          this.fecnac = typeof this.config.fecnac !== 'undefined' ? this.config.fecnac : ''
          this.sexo = typeof this.config.companyName !== 'undefined' ? this.config.sexo : ''
        }
        this.moneda = typeof this.config.moneda !== 'undefined' ? this.config.moneda : ''
        this.tipoPersona = typeof this.config.tipoPersona !== 'undefined' ? this.config.tipoPersona : ''
        this.country = typeof this.config.country !== 'undefined' ? this.config.country : ''
        this.planes = typeof this.config.planes !== 'undefined' ? this.config.planes : ''
        this.telefonoLocal = typeof this.config.telefonoLocal !== 'undefined' ? this.config.telefonoLocal : ''
        this.telefonoMovil = typeof this.config.telefonoMovil !== 'undefined' ? this.config.telefonoMovil : ''
        this.instagram = typeof this.config.instagram !== 'undefined' ? this.config.instagram : ''
        this.facebook = typeof this.config.facebook !== 'undefined' ? this.config.facebook : ''
        this.tiktok = typeof this.config.tiktok !== 'undefined' ? this.config.tiktok : ''
        this.linkedIn = typeof this.config.linkedIn !== 'undefined' ? this.config.linkedIn : ''
        this.twitter = typeof this.config.twitter !== 'undefined' ? this.config.twitter : ''
        this.banco = typeof this.config.banco !== 'undefined' ? this.config.banco : ''
        this.numCuenta = typeof this.config.numCuenta !== 'undefined' ? this.config.numCuenta : ''
        this.tipoCuenta = typeof this.config.tipoCuenta !== 'undefined' ? this.config.tipoCuenta : ''
        this.ActividadEconomica = typeof this.config.ActividadEconomica !== 'undefined' ? this.config.ActividadEconomica : ''
      }
    }
  },
  data () {
    return {
      explain: false,
      validationError: false,
      messageError: [],
      /* Persona Natural */
      nombre: '',
      apellido: '',
      cedula: '',
      fecnac: '',
      sexo: '',
      /* Persona Juridica */
      companyName: '',
      companyComercialName: '',
      personaContacto: '',
      moneda: '$',
      moneda2: '$',
      /* datos comunes */
      planes: '1',
      telefonoLocal: '',
      telefonoMovil: '',
      instagram: '',
      facebook: '',
      twitter: '',
      tiktok: '',
      linkedIn: '',
      tipoPersona: 'Natural',
      tipoCuenta: '',
      ActividadEconomica: '1',
      banco: '',
      numCuenta: '',
      country: 'VE',
      countries_json: countryOptions,
      country_options: [],
      currency_options: [
        { label: 'Dolares', value: '$' }
      ],
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
      ],
      tipoCuenta_options: [
        { label: 'Corriente', value: 'Cte' },
        { label: 'Ahorros', value: 'Cta' }
      ],
      tipoPersona_options: [
        { value: 'Natural', label: 'Persona Natural' },
        { value: 'Juridico', label: 'Persona Juridica' }
      ],
      ActividadEconomica_options: [
        { label: 'Servicios sin fines de lucro y bienes de alimentaciòn subsidiados', value: '1' },
        { label: 'Alimentaciòn', value: '2' },
        { label: 'Servicios pùblicos bàsicos', value: '3' },
        { label: 'Salud', value: '4' },
        { label: 'Educaciòn', value: '5' },
        { label: 'Vestido y Calzado', value: '6' },
        { label: 'Equipamiento del Hogar', value: '7' },
        { label: 'Entreteniminento', value: '8' },
        { label: 'Bienes y servicios Financieros y No Financieros', value: '9' },
        { label: 'Bienes y servicios suntuarios', value: '10' }
      ],
      plan_options: [
        { value: '1', label: 'Plan Emprededor' },
        { value: '2', label: 'Básico' },
        { value: '3', label: 'Medio' },
        { value: '4', label: 'Avanzado' },
        { value: '5', label: 'CHOPZI MALL / INMUEBLES' }
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
  }
}
</script>
<style lang='stylus' scoped>
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
  padding-top: 30px
</style>
