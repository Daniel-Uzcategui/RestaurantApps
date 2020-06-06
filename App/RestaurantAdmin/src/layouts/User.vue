<template>
  <q-layout class="main bg-green-1" :class="{ 'blur-layout': blurLayout }" view="lHh Lpr lff">
    <q-header class="bg-transparent">
          <q-btn-group flat spread>
            <q-btn to="/loan/guarantorN">
              <q-icon color="grey-7" name="fas fa-bell" >
                <q-badge color="red" floating>{{notifications}}</q-badge>
              </q-icon>
            </q-btn>
            <q-btn >
              <q-icon color="grey-7" name="fas fa-envelope">
                <q-badge color="red" floating>4</q-badge>
              </q-icon>
            </q-btn>
          </q-btn-group>
    </q-header>
    <q-page-container>
      <transition
              name="transitions"
              enter-active-class="animated slideInUp"
              leave-active-class="animated slideOutDown"
              mode="out-in"
      >
      <router-view @setBlur="setBlur" />
      </transition>
    </q-page-container>
        <q-footer reveal class="bg-grey-8 text-white">
          <q-btn-group push spread>
      <q-btn  icon="fas fa-id-card-alt"  to="/user/profile"/>
      <q-btn  icon="fas fa-paper-plane"/>
      <q-btn  icon="fas fa-hand-holding-usd"/>
    </q-btn-group>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'UserLayout',
  computed: {
    ...mapGetters('user', ['currentUser']),
    productName () {
      return window.sessionStorage.productName
    }
  },
  created () {
    // Check that our app has access to the user id
    // from Firebase before the page renders
    console.log('FIREBASE AUTH USER uid', this.$store.state.auth.uid)
  },
  data () {
    return {
      notifications: 0,
      blurLayout: false
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    setBlur () {
      this.blurLayout = !this.blurLayout
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
    }
  }
}
</script>
<style lang="stylus" scoped>
  .main
    &.blur-layout
      filter blur(5px)
</style>
