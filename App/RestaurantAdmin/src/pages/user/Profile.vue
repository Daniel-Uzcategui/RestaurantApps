<template>
    <q-page v-if="currentUser">
        <q-card class="q-my-md">
            <q-card-section class="bg-primary text-h5  justify-center col">
                <q-item>
                    <!-- <q-item-section avatar>
                        <q-avatar v-if="showDefaultPhoto()" size="100px" round="round" color="blue-grey-8" icon="person" ></q-avatar>
                        <q-avatar size="100px" v-else class="q-mb-sm shadow-2">
                            <q-img :src="currentUser.profilePhoto" />
                        </q-avatar>
                    </q-item-section> -->
                    <q-item-section>
                        <q-item-label>
                            {{ getUserData('nombre') }}
                            {{ getUserData('apellido') }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
                    <q-btn v-ripple @click.native="setEditUserDialog(true); setBlur()" fab label="Perfil" color="secondary" />
                    <q-btn @click="logoutUser()" fab label="Cerrar Sesión" color="secondary" >  </q-btn>
                    <q-dialog v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="setBlur">
                        <user-settings></user-settings>
                    </q-dialog>
                </div>
            </q-card-section>
            <q-separator spaced color="transparent" />
            <q-separator spaced color="transparent" />
        </q-card>
    </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { QSpinnerGears, QSpinnerRadio } from 'quasar'
export default {
  name: 'Profile',
  components: {
    'user-settings': () => import('./profile/UserSettings.vue')
  },
  created () {
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Cargando informacion del usuario...' : 'Si ves esto perdiste la conección de la red. Por favor vuelve a conectarte.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
  },
  async mounted () {
    const { currentUser } = this
    if (currentUser) {
      // Hide the loading screen if currentUser
      // is available before the page renders
      console.log(this.currentUser)
      this.$q.loading.hide()
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'summary']),
    editUserDialog: {
      get () {
        return this.$store.state.user.editUserDialog
      },
      set (val) {
        this.setEditUserDialog(val)
      }
    }
  },
  methods: {
    ...mapMutations('user', ['setEditUserDialog']),
    ...mapActions('auth', ['logoutUser']),
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    },
    setBlur () {
      this.$emit('setBlur')
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
    }
  }
}
</script>
<style lang="stylus">
  .qchipmargin
    margin auto
  .background-photo
    cursor pointer
  .profile-container
    position relative
    text-align center
    background rgba(0,0,0,0)
    top -4.6em
  .user-info
    margin 2em auto
    max-width 24em
    position relative
</style>
