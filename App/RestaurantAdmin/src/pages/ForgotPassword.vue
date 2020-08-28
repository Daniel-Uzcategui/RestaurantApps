<template>
  <q-page padding="padding">
    <q-form class="authentication q-gutter-y-md" ref="forgotPasswordForm" @submit="onSubmit">
      <router-link to="/">
          <img alt="pfcevolution" src="~assets/logo.png" class="imglogo">
      </router-link>
      <h4 class="q-mb-none">Olvido de contraseña</h4>
      <div class="inst q-mb-lg">Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.</div>
      <q-input
        v-model="email"
        outlined
        autocomplete="email"
        color="primary"
        data-cy="email"
        for="email"
        label="Email"
        lazy-rules="lazy-rules"
        name="email"
        type="email"
        :rules="[val =&gt; !!val || '*Campo es requerido', val =&gt; val.includes('@') &amp;&amp; val.includes('.') || '*Por favor ingrese un email valido']"
      ></q-input>
      <q-btn class="full-width q-mt-md" color="primary" data-cy="submit" label="Olvido de contraseña" :loading="loading" @click="onSubmit">
        <template v-slot:loading>
          <q-spinner-gears></q-spinner-gears>
        </template>
      </q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { QSpinnerGears } from 'quasar'
export default {
  name: 'ForgotPassword',
  data () {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    onSubmit () {
      this.$refs.forgotPasswordForm.validate()
        .then(async success => {
          this.$q.loading.show({
            message: 'Intentando restablecer su contraseña...',
            backgroundColor: 'grey',
            spinner: QSpinnerGears,
            customClass: 'loader'
          })
          if (success) {
            try {
              await this.$fb.auth().sendPasswordResetEmail(this.email)
              this.$q.notify({
                color: 'positive',
                message: 'Se envió un correo electrónico de restablecimiento al correo electrónico con el que se registró para restablecer su contraseña.'
              })
            } catch (err) {
              this.$q.notify({
                color: 'negative',
                message: `Hubo un error: ${err}`
              })
            }
          }
          this.$q.loading.hide()
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.authentication
  margin auto
  max-width 30em
  width 100%
  .q-img
    height 190px
.q-page >>> .q-img__image
  height 184px
  background-size 35% !important
  background-position 50% 100% !important
</style>
