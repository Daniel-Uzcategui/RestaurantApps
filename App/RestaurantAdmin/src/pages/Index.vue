<template>
  <q-page class="column justify-start">
    <div class="row justify-center q-my-xl">
      <img alt="" src="~assets/logo.png" height="326px" width="300px">
    </div>
    <q-dialog v-model="login">
    <div class="q-px-lg text-h6 text-center">
      <router-link to="auth/register" class="text-primary">Register</router-link> a new account or
      <router-link to="auth/login" class="text-primary">log in</router-link>.
    </div>
    </q-dialog>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      login: true
    }
  },
  name: 'PageIndex'
}
</script>
