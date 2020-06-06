<template>
    <q-page v-if="currentUser" padding>
        <q-card class="q-my-md">
            <q-card-section class="bg-primary text-h5 text-white justify-center col">
                <q-item>
                    <q-item-section avatar>
                        <q-avatar v-if="showDefaultPhoto()" size="100px" round="round" color="blue-grey-8" icon="person" text-color="white"></q-avatar>
                        <q-avatar size="100px" v-else class="q-mb-sm shadow-2">
                            <q-img :src="currentUser.profilePhoto" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>
                            {{ getUserData('nombre') }}
                            {{ getUserData('apellido') }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
                <div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
                    <q-btn v-ripple @click.native="setEditUserDialog(true); setBlur()" fab label="Edit Profile" color="secondary" />
                </div>
            </q-card-section>
            <q-separator spaced color="transparent" />
            <q-separator spaced color="transparent" />
        </q-card>
        <q-btn @click="logoutUser()"> logout </q-btn>
        <q-dialog v-model="editUserDialog" full-height="full-height" persistent="persistent" @before-hide="setBlur">
            <user-settings></user-settings>
        </q-dialog>
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
  data () {
    return {
      items: [
        null
      ]
    }
  },
  created () {
    const online = window.navigator.onLine
    this.$q.loading.show({
      message: online ? 'Loading your user information...' : 'Looks like you\'ve lost network connectivity. Please connect back to your network to access your data.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    })
  },
  async mounted () {
    this.$hyp.onConnect = () => {
      this.$hyp.streamDeltas({
        code: 'danieluzca22',
        table: 'accounts',
        scope: this.currentUser.CheckingAcc,
        payer: '',
        start_from: 0,
        read_until: 0
      })
    }

    this.$hyp.onData = async (data) => {
      console.log(data) // process incoming data, replace with your code
      // ACK when done
    }

    this.$hyp.connect(() => {
      console.log('connected!')
    })
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
    ...mapMutations('user', ['setEditUserDialog', 'setSummary']),
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('user', ['updateSummary']),
    radio () {
      this.$q.dialog({
        title: 'Options',
        message: 'Choose an option:',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Transfer from Checking to Savings', value: 0, color: 'primary' },
            { label: 'Transfer from Savings to Checking', value: 1, color: 'secondary' }
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        const firstoptn = data
        this.$q.dialog({
          title: 'Prompt',
          message: 'Amount to Transfer',
          prompt: {
            model: '',
            type: 'number' // optional
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          var stracc
          const amount = data
          if (firstoptn) { stracc = 'Checking' } else { stracc = 'Savings' }
          this.$q.dialog({
            title: 'Confirm',
            message: `Are you sure you want to transfer to ${stracc} the amount of  ${data}`,
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$q.loading.show()
            this.$axios.post(`https://us-central1-unico-wallet.cloudfunctions.net/inTransfer?type=${firstoptn}&from=${this.currentUser.email}&amount=${amount}`)
              .then(response => {
                this.setSummary({
                  Checking: null,
                  Savings: null
                })
                setTimeout(() => {
                  this.updateSummary(this)
                }, 1500)
                this.$q.loading.hide()
                this.$q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Submitted'
                })
                console.log(response.data)
                return response.data
              }).catch(e => { console.log(e); this.$q.loading.hide() })
          })
        })
      })
    },
    getUserData (attr) {
      return (this.currentUser[attr]) ? this.currentUser[attr] : 'Please update your profile'
    },
    setBlur () {
      this.$emit('setBlur')
    },
    showDefaultPhoto () {
      return this.currentUser.profilePhoto === '' ||
        this.currentUser.profilePhoto === null ||
        this.currentUser.profilePhoto === undefined
    }
  },
  watch: {
    currentUser () {
      this.$q.loading.hide()
      this.updateSummary(this)
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
