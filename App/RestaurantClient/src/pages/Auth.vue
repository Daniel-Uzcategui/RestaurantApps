<template>
  <q-page class="bgimage">
    <q-card class="bg-transparent q-fullscreen-glassMorph q-pt-xl relative-position" flat square>
      <q-card-section class="relative-position">
         <div class="absolute-right q-mr-xl">
              <q-btn fab :label="inverseGetAuthType" color="secondary" :to="routeAuthentication" />
            </div>
      </q-card-section>
      <q-card-section class="q-pt-xl q-pl-xl">
            <h4 class="text-h3 q-my-md">{{ getAuthType }}</h4>
      </q-card-section>
  <q-card-section>
    <q-form class="column authentication q-px-sm" :class="$q.screen.gt.xs ? 'q-pl-xl' : ''" ref="emailAuthenticationForm" @submit="onSubmit">
      <q-input filled
        square
        clearable
        v-model="email"
        name="email"
        lazy-rules="lazy-rules"
        autocomplete="email"
        color="primary"
        data-cy="email"
        label="Email"
        type="email"
        :rules="[val => !!val || '*Campo es requerido', val => val.includes('@') && val.includes('.') || '*Por favor ingrese un email valido']"
      >
     </q-input>
      <q-input filled
        square
        clearable
        v-model="password"
        lazy-rules="lazy-rules"
        autocomplete="current-password new-password"
        color="primary"
        data-cy="password"
        label="Contraseña"
        :rules="[val =&gt; !!val || '*Campo es requerido']" :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input filled
        square
        clearable
        v-if="isRegistration"
        lazy-rules="lazy-rules"
        autocomplete="new-password"
        color="primary"
        data-cy="verifyPassword"
        label="Confirmación contraseña"
        v-model="passwordMatch"
        :rules="[val => !!val || '*Campo es requerido', val => val === password || 'contraseña y confirmación no son iguales']"
        :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input filled
        square
        clearable
        v-model="cedula"
        v-if="isRegistration"
        label="Cedula"
        color="primary"
        type="number"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
      <q-input filled
        square
        clearable
        v-model="nombre"
        v-if="isRegistration"
        label="Nombre"
        color="primary"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
      <q-input filled
        square
        clearable
        v-model="apellido"
        v-if="isRegistration"
        label="Apellido"
        color="primary"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
      <q-input filled
        square
        clearable
        v-model="phone"
        v-if="isRegistration"
        label="Teléfono"
        color="primary"
        type="number"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
        <q-input filled  label="Fecha de Nacimiento" v-if="isRegistration" class="filled" v-model="fecnac" :rules="['fecnac']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="fecnac" :locale="Local_ES" mask="DD-MM-YYYY" ></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select filled map-options emit-value standout="bg-teal text-white"
          v-model="sexo"
          v-if="isRegistration"
          :options="sexo_options"
          label="Sexo" />
      <div v-if="isRegistration">
        <q-checkbox v-model="checkTerms"/><q-btn flat color="primary" label="Terminos y Condiciones " v-ripple @click.native="getTermsDialog();" />
       </div>
      <q-btn
        class="q-ma-xl"
        rounded
        color="primary"
        data-cy="submit"
        type="submit"
        :label="getAuthType"
      >
      </q-btn>
      <p v-if="!isRegistration" class="q-ma-sm text-center">
          <router-link class="text-primary" to="forgotPassword">¿Olvidaste tu contraseña?</router-link>
      </p>
      <q-dialog v-model="viewTermsDialog" persistent="persistent">
             <terms></terms>
     </q-dialog>
     <q-card-section v-if="false">
            <div class="text-center q-pa-md q-gutter-md">
              <q-btn round color="indigo-7" icon="fab fa-facebook-f" />
              <q-btn round color="red-8">
                <q-icon name="fab fa-google" @click="$q.platform.is.mobile ? GoogleSignInMobile() : GoogleSignIn()" size="1.2rem" />
              </q-btn>
              <q-btn round color="light-blue-5">
                <q-icon name="fab fa-twitter" size="1.2rem" />
              </q-btn>
            </div>
          </q-card-section>
    </q-form>
    </q-card-section>
    </q-card>
    <q-dialog v-model="validationError">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
       <q-card-section>
         Debe Aceptar los Terminos y Condiciones para continuar
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { QSpinnerGears } from 'quasar'
import terms from '../pages/Terms.vue'
export default {
  components: {
    terms
  },
  name: 'Auth',
  computed: {
    ...mapGetters('user', ['users', 'currentUser']),
    getAuthType () {
      return this.isRegistration ? 'Registro' : 'Iniciar Sesión'
    },
    inverseGetAuthType () {
      return this.isRegistration ? 'Iniciar Sesión' : 'Registro'
    },
    isRegistration () {
      return this.$route.name === 'Register'
    },
    routeAuthentication () {
      return this.isRegistration ? '/auth/login' : '/auth/register'
    },
    getUser () {
      let Access = false
      if (this.currentUser && this.currentUser.status === true) {
        Access = true
      }
      return Access
    }
  },
  data () {
    return {
      email: null,
      isPwd: true,
      password: null,
      passwordMatch: null,
      nombre: null,
      apellido: null,
      cedula: null,
      phone: null,
      newuser: false,
      sexo: null,
      fecnac: null,
      checkTerms: false,
      viewTermsDialog: false,
      validationError: false,
      validarUsers: false,
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' },
        { label: 'Otros', value: 'O' }
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
  mounted () {
    // this.bindusers()
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser', 'GoogleSignIn', 'GoogleSignInMobile', 'logoutUser']),
    ...mapActions('user', ['bindusers']),
    getTermsDialog () {
      console.log('getTermsDialog')
      this.viewTermsDialog = true
    },
    async onSubmit () {
      const { email, password, nombre, apellido, cedula, phone, sexo, fecnac } = this
      this.$refs.emailAuthenticationForm.validate()
        .then(async success => {
          if (success) {
            this.$q.loading.show({
              message: this.isRegistration
                ? 'Registro de su cuenta...'
                : 'Autenticando su cuenta...',
              backgroundColor: 'grey',
              spinner: QSpinnerGears,
              customClass: 'loader'
            })
            try {
              if (this.isRegistration) {
                if (this.checkTerms) {
                  await this.createNewUser({ email, password, nombre, apellido, cedula, phone, sexo, fecnac }).then(() => {
                    console.log('Hola usuario creado', this.currentUser)
                    this.newuser = true
                  })
                } else {
                  this.validationError = true
                  return
                }
              } else {
                await this.loginUser({ email, password })
              }
            } catch (err) {
              console.error(err)
              this.$q.loading.hide()
              this.$q.notify({
                message: `Ocurrió un error: ${err}`,
                color: 'negative'
              })
            }
          }
        })
    }
  },
  watch: {
    currentUser (e) {
      console.log(e, 'Cuuurrreeent')
      if (e === null) { return }
      this.validarUsers = this.getUser
      if (this.validarUsers) {
        if (window.location.hostname === 'chopzi.com') {
          this.$router.push({ path: '/dashboard' })
        } else {
          if (window.location.hash === '#/auth/login' || window.location.hash === '#/auth/register') {
            this.$router.push({ path: '/menu/index' })
          } else {
            this.$router.go(-1)
          }
          // this.$router.push({ path: '/menu/index' })
        }
      } else {
        this.$q.notify({
          message: `Acceso no permitido`,
          color: 'negative'
        })
      }
      this.newuser = false
      this.$q.loading.hide()
    }
  }
}
</script>

<style lang="stylus">

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap')
.bgimage
  font-family 'Montserrat', sans-serif
  -webkit-background-size cover
  -moz-background-size cover
  -o-background-size cover
  background-size cover
.authentication
  max-width 30em
  width 100%
.filled
  padding-top: 20px;
</style>
