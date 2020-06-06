<template>
  <q-page class="items-center">
    <q-card flat square>
              <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-md">{{ getAuthType }}</h4>
            <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
              <q-btn fab :label="inverseGetAuthType" color="secondary" :to="routeAuthentication" />
            </div>
            </q-card-section>
            <q-card-section>
    <q-form class="authentication q-px-sm q-pt-xl" ref="emailAuthenticationForm" @submit="onSubmit">
      <q-input
        square
        clearable
        v-model="email"
        name="email"
        lazy-rules="lazy-rules"
        autocomplete="email"
        color="primary"
        data-cy="email"
        label="EMAIL"
        type="email"
        :rules="[val => !!val || '*Field is required', val => val.includes('@') && val.includes('.') || '*Please Provide a valid email']"
      >
                      <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
      <q-input
        square
        clearable
        v-model="password"
        lazy-rules="lazy-rules"
        autocomplete="current-password new-password"
        color="primary"
        data-cy="password"
        label="PASSWORD"
        :rules="[val =&gt; !!val || '*Field is required']" :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
                        <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
      </q-input>
      <q-input
        square
        clearable
        v-if="isRegistration"
        lazy-rules="lazy-rules"
        autocomplete="new-password"
        color="primary"
        data-cy="verifyPassword"
        label="VERIFY PASSWORD"
        v-model="passwordMatch"
        :rules="[val => !!val || '*Field is required', val => val === password || '*Passwords don\'t match']"
        :type="isPwd ? 'password' : 'text'"
        @keyup.enter="onSubmit(); $event.target.blur()"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input
        square
        clearable
        v-model="nombre"
        v-if="isRegistration"
        label="NOMBRE"
        color="primary"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
      <q-input
        square
        clearable
        v-model="apellido"
        v-if="isRegistration"
        label="APELLIDO"
        color="primary"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
      <q-input
        square
        clearable
        v-model="cedula"
        v-if="isRegistration"
        label="CEDULA"
        color="primary"
        type="number"
        @keyup.enter="onSubmit(); $event.target.blur()"
      />
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
      <q-btn
        class="full-width q-mt-md"
        color="primary"
        data-cy="submit"
        type="submit"
        :label="getAuthType"
      >
      </q-btn>
      <p class="q-ma-sm text-center">
          <router-link class="text-primary" to="forgotPassword">Forgot Password?</router-link>
      </p>
    </q-form>
    </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { QSpinnerGears } from 'quasar'
export default {
  name: 'Auth',
  computed: {
    getAuthType () {
      return this.isRegistration ? 'Register' : 'Login'
    },
    inverseGetAuthType () {
      return this.isRegistration ? 'Login' : 'Register'
    },
    isRegistration () {
      return this.$route.name === 'Register'
    },
    routeAuthentication () {
      return this.isRegistration ? '/auth/login' : '/auth/register'
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
      cedula: null
    }
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser']),
    onSubmit () {
      const { email, password, nombre, apellido, cedula } = this
      this.$refs.emailAuthenticationForm.validate()
        .then(async success => {
          if (success) {
            this.$q.loading.show({
              message: this.isRegistration
                ? 'Registering your account...'
                : 'Authenticating your account...',
              backgroundColor: 'grey',
              spinner: QSpinnerGears,
              customClass: 'loader'
            })
            try {
              if (this.isRegistration) {
                await this.createNewUser({ email, password, nombre, apellido, cedula })
              } else {
                await this.loginUser({ email, password })
              }
              this.$router.push({ path: '/user/profile' })
            } catch (err) {
              console.error(err)
              this.$q.notify({
                message: `An error as occured: ${err}`,
                color: 'negative'
              })
            } finally {
              this.$q.loading.hide()
            }
          }
        })
    }
  }
}
</script>

<style lang="stylus">
.authentication
  margin auto
  max-width 30em
  width 100%
</style>
