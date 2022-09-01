<template>
  <q-layout view="hHr lpR ffr">

    <q-header reveal class="bg-primary text-white">
    </q-header>
    <q-page-container>
      <div class="bg-bottom-header">
      <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'BasicLayout',
  computed: {
    productName () {
      return window.sessionStorage.productName
    }
  },
  mounted () {
    this.$q.dark.set(false)
    this.bindEnv().then(e => {
      if (e) {
        let ver = localStorage.getItem('envVer')
        if (ver === null) {
          localStorage.setItem('envVer', e.version)
        } else if (ver !== e.version) {
          this.$q.dialog({
            title: 'Nueva Version',
            message: 'Hay una nueva version disponible.\nRefrescar la app para descargar las nuevas actualizaciones?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            localStorage.setItem('envVer', e.version)
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                  registration.update()
                }
              })
            }
            this.getNewVer()
          })
        }
        if (ver === e.version) {
          console.log('App is in the newer version')
        }
      }
    })
  },
  methods: {
    ...mapActions('config', ['bindEnv']),
    getNewVer () {
      window.location.reload(true)
    }
  },
  data () {
    return {
    }
  }
}
</script>
