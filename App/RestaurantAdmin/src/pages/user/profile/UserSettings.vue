<template>
  <div class="user-settings full-width" v-if="currentUser">
    <q-form class="full-height" @submit="saveUserData">
      <q-banner class="bg-transparent"/> <q-banner class="bg-transparent"/>
        <section class="user-info">
            <h6 class="q-mt-none q-mb-md text-center">Editar Perfil</h6>
            <div class="row justify-between items-center q-mb-lg"><label class="col-3" for="fullName">Nombre</label>
                <q-input filled rounded outlined dense class="col" id="nombre" v-model="nombre" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="row justify-between items-center q-mb-lg"><label class="col-3" for="fullName">Apellido</label>
                <q-input filled rounded outlined dense class="col" id="apellido" v-model="apellido" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="row justify-between items-center q-mb-lg"><label class="col-3" for="email">Email</label>
                <q-input filled rounded outlined dense class="col" id="email" v-model="email" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="row justify-between items-center q-mb-lg"><label class="col-3" for="email">Cedula</label>
                <q-input filled rounded outlined dense class="col" id="email" v-model="cedula" borderless="borderless"  type="number"></q-input>
            </div>
        </section>
        <div class="row justify-between q-my-lg q-px-md ">
            <q-btn rounded color="primary" label="Cancelar" style="min-width:6em;" @click="setEditUserDialog(false)"></q-btn>
            <q-btn rounded color="primary" type="submit" label="GUARDAR" style="min-width:6em;"></q-btn>
        </div>
    </q-form>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'UserSettings',
  data () {
    const state = this.$store.state.user.currentUser
    return {
      email: state.email,
      nombre: state.nombre,
      apellido: state.apellido,
      cedula: state.cedula
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    meta () {
      return {
        id: this.currentUser.id
      }
    }
  },
  methods: {
    ...mapActions('user', ['updateUserData']),
    ...mapMutations('user', ['setEditUserDialog']),
    async saveUserData () {
      const { currentUser, email, nombre, apellido, cedula } = this
      this.$q.loading.show({
        message: 'Updating your data, please stand by...',
        customClass: 'text-h3, text-bold'
      })

      try {
        await this.updateUserData({
          id: currentUser.id,
          email,
          nombre,
          apellido,
          cedula
        })
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem updating your profile: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
        this.setEditUserDialog(false)
      }
    }
  }
}
</script>
<style lang="stylus">
</style>
