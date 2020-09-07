<template>
  <div class="flex flex-center">
    <q-card class="q-pa-lg menudiv">
        <q-item class="fontsize-18">
          <q-item-section>
                <q-item-label>
                  Mis Recompensas
                </q-item-label>
            </q-item-section>
        </q-item>
        <div v-if="getUserData('points') !== 0">
        <q-item>
          <q-item-section>
                <q-item-label lines="2" class="text-center fontsize-18">
                  {{ (getUserData('points')).toFixed(2) }} pts
                </q-item-label>
            </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section v-for="(cat, index) in Object.keys(getUserData('pointsCat'))" :key="index" horizontal class="fontsize-12 row justify-between">
          <q-card-section >
            <q-item-label lines="5" >
              {{getCategoryName(cat)}}
            </q-item-label>
          </q-card-section>
          <q-card-section>
            <q-btn color="secondary" squared icon="fas fa-gift" dense class="q-mr-lg">
              <q-badge color="red" floating class="">{{ parseInt(getUserData('pointsCat')[cat] / 10)}}</q-badge>
            </q-btn>
            <q-rating
              readonly
              :value="getUserData('pointsCat')[cat] % 10"
              max="10"
              size="1em"
              color="primary"
              icon="far fa-circle"
              icon-selected="fas fa-circle"
            />
          </q-card-section>
        </q-card-section>
        </div>
        <div v-if="getUserData('points') === 0" >No hay Recompensas disponibles</div>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { QSpinnerGears, QSpinnerRadio } from 'quasar'
export default {
  data () {
    return {
      model1: 3
    }
  },
  name: 'Profile',
  created () {
    this.bindCategorias()
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
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
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('menu', ['categorias']),
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
    ...mapActions('menu', ['bindCategorias']),
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 0
    },
    getCategoryName (id) {
      console.log({ ...this.categorias })
      var cat = typeof this.categorias === 'undefined' ? 0 : this.categorias.find(e => e.id === id)
      console.log('getCategoryName')
      console.log({ cat })
      if (typeof cat === 'undefined') { return null }
      return cat.name
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
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
