<template>
  <div>
    <q-btn flat @click="isAnonymous ? (() => {})() : (() => { setEditUserDialog(true) })()" icon="fas fa-user" />
    <q-btn flat @click="isAnonymous ? (() => { $router.push({ path: '/auth/login' }) })() : (() => { loguserout() })()" icon="fas fa-sign-out-alt" />
  </div>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', ['isAnonymous'])
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('user', ['setEditUserDialog']),
    loguserout () {
      this.logoutUser(); localStorage.removeItem('ott-token')
    }
  }
}
</script>
