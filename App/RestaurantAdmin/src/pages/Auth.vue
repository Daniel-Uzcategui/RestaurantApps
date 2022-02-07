<template>
  <q-page class="">
    <div class="bghome1 col-12">
     <div id="hero" class="col-12 row justify-center">
          <q-img class="col-12" height="150px" width="300px" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FChopzi-Logo-White-Horizontal.png?alt=media&token=fd8f987b-43e7-4912-a150-d83417ceb591" />
        <nav role="navigation" class="nav-menu w-nav-menu col-12 row justify-center">
        <a href="#about" class="nav-link w-nav-link q-pa-md">Nosotros</a>
        <a href="#modules" class="nav-link w-nav-link q-pa-md">Módulos</a>
        <a href="#features" class="nav-link w-nav-link q-pa-md" >Features</a>
      </nav>
      <div class="col-12 col-md-6">
        <q-card flat class="bg-transparent">
        <q-card-section :class="{'q-ma-md': $q.screen.gt.xs}" style="max-width: 400px">
          <span class="fontsize-18 text-bold">E-Commerce
          <span class="text-weight-thin"> made</span>
          EASY</span>
          <p>
        Transforma tu negocio y se parte del futuro
        conviertiendo tu empresa en una progressive web app
          </p>
          <q-btn label="Iniciar Sesión / Registrarse" no-caps color="purple" @click="login = !login" />
        </q-card-section>
        </q-card>
        </div>
        <div class="col-12 col-md-6 column items-center">
          <transition
                appear
                enter-active-class="animated rotateInDownRight"
                leave-active-class="animated fadeOut"
              >
          <q-img contain style="max-width: 400px;" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FMobile_Screen.png?alt=media&token=757cec06-d294-4b1d-b812-3432ebecf066" spinner-color="white"/>
              </transition>
        </div>
      </div>
    </div>
      <div class="col-12 bgsecond row" id="about" style="height:80vh">
        <div class="col-12 col-sm-8 q-mt-xl col-md-6 col-lg-4">
        <q-card class="bg-white " :class="{'q-ma-md': $q.screen.gt.xs}">
          <div class="text-block-4 q-ml-lg" :class="{'q-ml-xl': $q.screen.gt.xs}">Quiénes somos</div>
           <div class="q-ma-lg fontsize-18 text-bold text-black" :class="{'q-ma-xl': $q.screen.gt.xs}">Bríndale a tus clientes, la mejor experiencia de compra posible</div>
          <div class="q-ma-lg text-black q-pb-xl" :class="{'q-ma-xl': $q.screen.gt.xs}">Ofrecemos una plataforma ideal para la creación, diseño y gestión de tu propia app de manera asequible, simple y práctica.<br></div>
        </q-card>
        </div>
      </div>
      <div id="offer" class="bgecommerce col-12">
    <div class="text-center row justify-center">
      <div class="fontsize-32 text-black col-12">E-COMMERCE<br>PARA TU NEGOCIO</div>
      <div class="fontsize-14 text-black col-12 row justify-center">
        <p style="width: 50%"> ChopZi te brinda dos módulos, los cuales te ayudarán a administrar y optimizar tus operaciones impulsando tus ventas.
        </p>
        </div>
      <div class="button-row">
         <q-btn style="background-color: #54B9BF" text-color="white" label="Ver Features" />
      </div>
    </div>
  </div>
    <div id="modules" class="modules q-pt-lg row justify-around col-12 cardsholder" style="background-color: #FFFFFF">
    <q-card class="purplecard col-10 absolute" style="border-radius: 28px; height: 25vh">
    </q-card>
      <q-card id="w-node-3383cfcbda18-b5e9fda5" style="border-radius: 0px" class="clientcard text-black col-9 col-md-3 q-ma-xl bg-white">
        <div class="text-block-4 q-ml-md">Modulo cliente</div>
        <div class="heading-2 fontsize-18 text-bold q-ma-xl">Dale la comodidad al ciente de comprar desde cualquier parte</div>
        <div class="text-block-3 q-ma-xl">Esta sección está visible para que el cliente final pueda ver el catálogo de productos, registrarse y realizar su compra desde cualquier dispositivo móvil Android/iOS y ordenador.<br></div>
      </q-card>
      <q-card id="w-node-e7262ac0f4df-b5e9fda5" style="border-radius: 0px" class="clientcard text-black col-9 col-md-3 q-ma-xl bg-white">
        <div class="text-block-4 q-ml-md">modulo admin</div>
        <div class="heading-2 fontsize-18 text-bold q-ma-xl">Impulsa tus ventas a través de la optimización de tus operaciones</div>
        <div class="text-block-3 q-ma-xl">La empresa podrá gestionar los procesos internos de las órdenes de sus sedes, además, podrá administar sus promociones, catálogo y programa de fidelización.<br></div>
      </q-card>
  </div>
  <div class="col-12 row justify-center" id="features">
    <div class="fontsize-32 col-12 text-center q-pa-md">FEATURES</div>
    <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FIcon-Registro.png?alt=media&token=18d459db-7df0-4ab3-b91e-da74d802c6b3" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">registro de órdenes de compra</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Administradores.png?alt=media&token=302daceb-6d9b-427e-8e1c-53aff8fcefa3" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">MÚLTIPLES ADMINISTRADORES</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Categorizacion.png?alt=media&token=735910be-6374-404b-8107-5115f9deb85d" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">CATEGORIZACIÓN DE PRODUCTOS</div>
  </div>
  <div class="col-12"></div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FIcon-Sedes.png?alt=media&token=d1c8f3be-81e5-42cd-b708-b93e4df91b2f" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">MANEJO DE MÚLTIPLES SEDES</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FIcon-Horarios.png?alt=media&token=b8fa5c7f-e190-4d1f-aea5-39041531998e" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">CONFIGURACIÓN DE HORARIOS LABORALES</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Pagos.png?alt=media&token=53848b7b-e69c-4c00-877e-04d64ae8f171" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">PASARELA DE PAGO</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Descuentos.png?alt=media&token=fd6c9f70-47d3-4f67-8764-ca0859a43c1c" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">PROMOCIONES Y DESCUENTOS</div>
  </div>
  <div class="col-12"></div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Notificaciones.png?alt=media&token=8874834f-7ca4-4793-8bd6-51816435a370" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">NOTIFICACIONES</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FIcon-Editor.png?alt=media&token=39715538-b343-4585-a0b4-1a3ed9e69ad1" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">MANEJO DE VENDEDORES</div>
  </div>
  <div class="feature-container q-ma-md">
      <img src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2Ficon-Widgets.png?alt=media&token=85d0f998-fdd3-4c1b-9b72-144aba5e4960" loading="lazy" width="50" alt="" class="feature-image">
    <div class="text-block-13">WIDGETS (CHATBOT)</div>
  </div>
  </div>
  <div class="col-12 bg-secondary q-pa-md">
    <div class="contacttitle row justify-around">
      <div class="col-12 col-md-4 q-pa-md">
        <div class="fontsize-18">Contáctanos</div>
        <div class="text-block-16">+584241553703</div>
        <div class="text-block-16">info@chopzi.com</div>
        <div class="text-block-16">La Urbina, Caracas, Venezuela</div>
      </div>
      <div id="w-node-a5bd30884fae-b5e9fda5" class="col-12 col-md-4 contacttitle q-pa-md">
        <div class="div-block-15 column">
          <div class="text-block-15 fontsize-18">Nuestros Servicios</div>
          <div class="column q-pl-md">
          <a href="#hero" class="footer-link text-white">Inicio</a>
          <a href="#about" class="footer-link text-white">Nosotros</a>
          <a href="#modules" class="footer-link text-white">Módulos</a>

          </div>
        </div>
    </div>
      <div id="w-node-4e3f79e62545-b5e9fda5" class="footer-logo-content col-12 col-md-4 row justify-center">
        <q-img class="col-12" height="40%" width="40%" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FChopzi-Logo-White-Horizontal.png?alt=media&token=fd8f987b-43e7-4912-a150-d83417ceb591" />
        <div class="fontsize-32 col-12 row justify-center">
          <q-icon name="fab fa-whatsapp-square" />
          <q-icon name="fab fa-instagram-square" />
        </div>
      </div>
      </div>
    </div>
    <q-dialog persistent v-model="login">
      <q-card style="border-radius: 28px" flat square>
              <q-card-section class="bg-primary">
              <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
                <q-btn fab no-caps :label="inverseGetAuthType" color="secondary" :to="routeAuthentication" />
              </div>
              </q-card-section>
      <q-card-section>
      <q-form class="authentication q-px-sm q-pt-xl" ref="emailAuthenticationForm" @submit="onSubmit">
        <q-input class="q-mb-md" filled
          square
          clearable
          v-model="nombre"
          v-if="isRegistration"
          label="Nombre"
          color="primary"
          @keyup.enter="onSubmit(); $event.target.blur()"
        />
        <q-input class="q-mb-md" filled
          square
          clearable
          v-model="apellido"
          v-if="isRegistration"
          label="Apellido"
          color="primary"
          @keyup.enter="onSubmit(); $event.target.blur()"
        />
        <q-input class="q-mb-md" filled
          square
          clearable
          v-model="cedula"
          v-if="isRegistration"
          label="Documento de identidad"
          color="primary"
          type="number"
          @keyup.enter="onSubmit(); $event.target.blur()"
        />
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
        <q-select options-selected-class="text-blue" filled map-options emit-value standout="bg-teal text-white"
            v-model="sexo"
            v-if="isRegistration"
            :options="sexo_options"
            label="Sexo" />
          <q-input filled  label="Fecha de Nacimiento" v-if="isRegistration" class="filled" v-model="fecnac" :rules="['fecnac']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="fecnac" :locale="Local_ES" mask="DD-MM-YYYY" ></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
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
        <div v-if="isRegistration">
          <q-checkbox v-model="checkTerms"/><q-btn flat color="primary" label="Terminos y Condiciones " v-ripple @click.native="getTermsDialog();" />
        </div>
        <q-btn id="btnRegistro"
          class="full-width q-mt-md"
          color="primary"
          type="submit"
          rounded
          no-caps
          :label="getAuthType"
        >
        </q-btn>
        <p v-if="!isRegistration" class="q-mb-md text-center">
          <q-btn flat text-color="primary" no-caps to="/auth/forgotPassword" label="Olvido de contraseña" />
            <!-- <router-link class="text-primary" to="forgotPassword">Olvido de contraseña</router-link> -->
        </p>
        <q-btn v-if="!isRegistration" rounded class="full-width q-mt-md" label="Cancelar" no-caps color="purple" @click="login = !login" />
      <q-dialog v-model="viewTermsDialog" full-height="full-height" persistent="persistent" >
              <terms></terms>
      </q-dialog>
        <q-card-section>
              <div class="text-center q-pa-md q-gutter-md">
                <q-btn round color="indigo-7" icon="fab fa-facebook-f" />
                <q-btn round color="red-8">
                  <q-icon name="fab fa-google-plus-g" size="1.2rem" />
                </q-btn>
                <q-btn round color="light-blue-5">
                  <q-icon name="fab fa-twitter" size="1.2rem" />
                </q-btn>
              </div>
            </q-card-section>
      </q-form>
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
         Debe Acpetar los Terminos y Condiciones para continuar
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
    }
    // getUser () {
    //   let Access = false
    //   for (let i = 0; i < this.users.length; i++) {
    //     if (this.users[i].email === this.email && this.users[i].typeAccess === 'Admin' && this.users[i].status === true) {
    //       Access = true
    //     }
    //   }
    //   return Access
    // }
  },
  data () {
    return {

      login: false,
      email: null,
      isPwd: true,
      password: null,
      passwordMatch: null,
      nombre: null,
      apellido: null,
      cedula: null,
      sexo: null,
      fecnac: null,
      checkTerms: false,
      viewTermsDialog: false,
      validationError: false,
      validarUsers: false,
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
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
  created () {
    this.logoutUser()
  },
  mounted () {
    // this.bindusers()
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser', 'logoutUser']),
    ...mapActions('user', ['bindusers']),
    getTermsDialog () {
      this.viewTermsDialog = true
    },
    async authValidate () {
      const { email, password, nombre, apellido, cedula, sexo, fecnac } = this
      let success = await this.$refs.emailAuthenticationForm.validate()
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
          let waitAuth
          if (this.isRegistration) {
            if (this.checkTerms) {
              waitAuth = await this.createNewUser({ email, password, nombre, apellido, cedula, sexo, fecnac })
              this.$q.loading.hide()
            } else {
              this.validationError = true
              this.$q.loading.hide()
              return false
            }
          } else {
            waitAuth = await this.loginUser({ email, password })
            this.$q.loading.hide()
          }
          return waitAuth
        } catch (err) {
          console.error(err)
          this.$q.notify({
            message: `A occurido un error: ${err}`,
            color: 'negative'
          })
          this.$q.loading.hide()
        }
      }
    },
    async onSubmit () {
      let validate = await this.authValidate()
      // this.validarUserActive(validate)
      // this.setAuth(validate.user)
      if (validate !== undefined) {
        return this.$router.push({ path: '/ambientes' })
      }
      return this.$q.notify({
        message: `Acceso no permitido`,
        color: 'negative'
      })
    },
    validarUserActive (uservalidate) {
      console.log('el valor del usuario logeado', uservalidate)
      if (uservalidate.user.emailVerified !== false) {
        this.ActivarUsuario = true
        console.log('pase')
      }
    }
  }
  // watch: {
  //   currentUser (e) {
  //     console.log(e, 'current watcher')
  //     if (e === null) { return }
  //     if (e && e.status === true) {
  //       return this.$router.push({ path: '/ambientes' })
  //     // && e.typeAccess === 'Admin'
  //       // if (e && e.rol) {
  //       //   this.$q.loading.hide()
  //       //   return this.$router.push({ path: '/home' })
  //       // } else {
  //       //   this.$q.notify({ message: 'El usuario no tiene ningun rol asignado, comuniquese con su administrador para que le asigne uno ', color: 'blue' })
  //       //   this.logoutUser()
  //       // }
  //     } else {
  //       this.$q.notify({
  //         message: `Acceso no permitido`,
  //         color: 'negative'
  //       })
  //     }
  //     this.$q.loading.hide()
  //   }
  // }
}
</script>

<style lang="stylus">
.nav-link
  font-family: Montserrat, sans-serif;
  color: #efe9f4;
  font-size: 18px;
.contacttitle
  -webkit-text-size-adjust: 100%;
  line-height: 1.2;
  -webkit-box-direction: normal;
  box-sizing: border-box;
  margin-bottom: 8px;
  font-family: Montserrat, sans-serif;
  color: #efe9f4;
.text-block-13
  -webkit-text-size-adjust: 100%;
  -webkit-box-direction: normal;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  margin-top: 0px;
  padding-right: 16px;
  padding-bottom: 36px;
  padding-left: 16px;
  align-self: center;
  -webkit-box-flex: 0;
  flex: 0 auto;
  font-family: Montserrat, sans-serif;
  color: #efe9f4;
  font-size: 14px;
  line-height: 1.3;
  text-align: center;
  text-transform: uppercase;
.feature-image
  -webkit-text-size-adjust: 100%;
  font-size: 14px;
  line-height: 1.2;
  font-family: Lora, sans-serif;
  color: #171d1c;
  -webkit-box-direction: normal;
  box-sizing: border-box;
  border: 0;
  max-width: 100%;
  vertical-align: middle;
  display: inline-block;
  position: relative;
  left: auto;
  top: -22%;
  right: 0%;
  bottom: auto;
  width: 70px;
  height: 70px;
  max-height: 100%;
  padding-bottom: 0px;
.feature-container
  -webkit-text-size-adjust: 100%;
  font-size: 14px;
  line-height: 1.2;
  font-family: Lora, sans-serif;
  color: #171d1c;
  box-sizing: border-box;
  display: flex;
  width: 220px;
  height: 120px;
  padding: 0px;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  border-style: solid;
  border-width: 2px;
  border-color: #fff;
  border-radius: 20px;
  opacity: 1;
  justify-self: center;
  align-self: center;
.feature-container:hover
  transition: box-shadow 0ms ease;
  box-shadow: 1px 1px 12px 1px #54b9bf;
.purplecard
  background-image url('https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FPurple-BG.png?alt=media&token=a58a6303-71bc-444d-870f-62b8ddca8fcb')
  background-size 100% 100%
  background-repeat no-repeat
.bghome1
  background-image url('https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FHome-BG.png?alt=media&token=6bc9220c-c16e-43f5-b368-5d5875d539cd')
  background-size cover
  background-repeat no-repeat
  background-position 50% 50%
  height 100vh
.bgsecond
  background-image url('https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FQuienes-somos-BG2.png?alt=media&token=8ec5bf23-a6b2-4b03-bab4-c92da44dcd01')
  background-size cover
  background-repeat no-repeat
  background-position 50% 50%
  height 100vh
.bgecommerce
  background-image url('https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/chopzi%2FnewWeb%2FE-Commerce-para-tu-negocio-BG4.png?alt=media&token=7781f67b-31b7-40d6-b0ab-a777775745e1')
  background-size cover
  background-repeat no-repeat
  background-position 50% 50%
  height 50vh
.authentication
  margin auto
  max-width 30em
  width 100%
.imglogo {
  border-radius:150px;
  }
.filled
  padding-top 15px
.text-block-4
  -webkit-text-size-adjust: 100%;
  box-sizing: border-box;
  position: relative;
  left: 0px;
  bottom: 19px;
  display: flex;
  width: 200px;
  height: 40px;
  margin-right: 0px;
  padding-right: 10px;
  padding-left: 10px;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  background-color: #54b9bf;
  font-family: Montserrat, sans-serif;
  color: #fff;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;

</style>
