<template>
  <div class="q-diag-glassMorph full-width" style="border-radius: 28px" v-if="currentUser">
    <q-form @submit="saveUserData">
        <section class="user-info text-bold">
            <h6 class="q-mt-none q-mb-md text-center q-cardtop">Editar Perfil</h6>
            <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="fullName">Nombre</label>
                <q-input filled rounded outlined dense class="col" id="nombre" v-model="nombre" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="fullName">Apellido</label>
                <q-input filled rounded outlined dense class="col" id="apellido" v-model="apellido" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="email">Email</label>
                <q-input filled rounded outlined dense class="col" id="email" v-model="email" borderless="borderless"  type="text"></q-input>
            </div>
            <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="email">Cedula</label>
                <q-input filled rounded outlined dense class="col" id="email" v-model="cedula" borderless="borderless"  type="number"></q-input>
            </div>
            <div class="column q-mr-md q-ml-md q-mb-lg "><label class="col-3" for="phone">Teléfono</label>
                <q-input filled class="col" id="phone" v-model="phone" borderless="borderless" dense="dense" type="number"></q-input>
            </div>
           <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="fecnac">Fecha  de Nac.</label>
                 <q-input filled class="col" id="fecnac" v-model="fecnac" borderless="borderless" dense="dense"  readonly></q-input>
          </div>
          <div class="column q-mr-md q-ml-md q-mb-lg"><label class="col-3" for="sexo">Sexo</label>
             <q-select filled map-options emit-value standout="bg-teal text-white"  v-model="sexo"  :options="sexo_options"  class="col"  />
        </div>
        <div class="row justify-between q-my-lg q-px-md ">
            <q-btn  rounded no-caps color="primary" label="Cancelar" style="min-width:6em;" @click="setEditUserDialog(false)"></q-btn>
            <q-btn  rounded no-caps color="primary" type="submit" label="Guardar" style="min-width:6em;"></q-btn>
        </div>
        </section>
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
      cedula: state.cedula,
      phone: state.phone,
      sexo: state.sexo,
      fecnac: state.fecnac,
      sexo_options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Femenino', value: 'F' }
      ]
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
      const { currentUser, email, nombre, apellido, cedula, phone, sexo, fecnac } = this
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
          cedula,
          phone,
          sexo,
          fecnac
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
  .user-settings
    background-color $grey-3
    .default-user-image
      cursor pointer
      color white
      @media(max-width $breakpoint-sm)
        margin-bottom 2em
      .q-icon
        @media(max-width $breakpoint-sm)
          font-size 1em!important

    .profile-photo
      cursor pointer
      margin -6em 0 2em
      .q-avatar
        @media(max-width $breakpoint-sm)
          margin-top 1rem
          height .75em
          width .75em
      .user-image
        .edit
          top 2.5em

    .user-info
      max-width 20.5em
      margin auto
      color $blue-grey-10
      label
        text-align left
        font-weight bold
      input
        background rgba(101,104,110,.20)
        border-radius 6px
        color $blue-grety-10
        font-weight bold
        padding .5em
</style>
