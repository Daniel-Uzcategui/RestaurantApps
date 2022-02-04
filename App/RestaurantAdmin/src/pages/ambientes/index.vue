<template>
  <div>
      <q-page class="items-center">
    <q-card flat square>
            <q-card-section class="bg-primary">
             <template>
               <img alt="chopZI" src="~assets/chopzi-01.png" class="imglogo">
            </template>
            </q-card-section>
    <q-card-section v-if="!bindedAmb || ambientes === null" class="row justify-center">
      <q-spinner color="primary" size="5em" />
    </q-card-section>
    <q-card-section v-else>
      <transition-group
          appear
          class="row justify-start"
          enter-active-class="animated fadeInRight"
        >
      <q-card key="createamb" class="q-ma-md cardradius bg-primary">
        <q-card-section v-if="!addnew" class="column items-center">
          <q-btn flat @click="addnew = !addnew" icon="add" size="lg"/>
            <p>Añadir ambiente</p>
        </q-card-section>
        <q-card-section v-else>
          <form @submit.prevent.stop="createAmbiente()" class="column items-center">
            <q-input class="full-width" ref="alias" dense :rules="[isValidCharacter]" @input="newname = newname.split(' ').join('').toLowerCase()" v-model="newname" label="Alias" hint="Una sola palabra solo letras" />
            <q-input class="full-width" ref="url" debounce="200" dense :rules="[isValidCharacterURL]" @input="url = url.split(' ').join('').toLowerCase()" :suffix="suffix" v-model="url" label="Url" hint="La direccion web que ven tus clientes" />
            <q-btn rounded class="q-mt-xs" color="secondary" type="submit" no-caps label="Crear"></q-btn>
          </form>
        </q-card-section>
      </q-card>
      <q-card @click="ambRoute(amb.id)" v-for="(amb, index) in ambientes" :key="index" v-ripple class="q-ma-md cardradius bg-primary">
        <q-card-section>
          <q-item-label class="text-h5">
            {{amb.id}}
          </q-item-label>
          <q-item-label class="text-caption">
            {{amb.url}}
          </q-item-label>
        </q-card-section>
      </q-card>
      </transition-group>
    </q-card-section>
    </q-card>
  </q-page>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', ['currentUser', 'ambientes'])
  },
  watch: {
    // ambientes () {
    //   this.$q.loading.hide()
    //   this.$q.notify({
    //     message: 'Ambiente creado exitosamente',
    //     color: 'blue'
    //   })
    // },
    currentUser () {
      if (this.currentUser && this.currentUser.id) {
        this.bindAmbiente(this.currentUser.id).then(e => console.log('Hello', e), this.bindedAmb = true).catch((e) => console.error(e))
      }
    }
  },
  data () {
    return {
      creandoAmbiente: false,
      addnew: false,
      newname: '',
      url: '',
      bindedAmb: false,
      suffix: '.chopzi.com'
    }
  },
  mounted () {
    if (!this.$store.state.auth.emailVerified) {
      this.$q.dialog({
        message: 'Le hemos enviado un correo para verificarlo',
        persistent: true
      })
    }
    if (this.currentUser && this.currentUser.id) {
      this.bindAmbiente(this.currentUser.id).then(e => console.log('Hello', e, this.currentUser), this.bindedAmb = true).catch((e) => console.error(e))
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    async validation () {
      return this.isValidCharacterURL(this.url + this.suffix) && this.isValidCharacter(this.newname)
    },
    ambRoute (id) {
      localStorage.setItem('amb', id)
      this.$router.push({ path: '/home' })
    },
    async createAmbiente () {
      this.$q.loading.show({ message: 'Creando ambiente' })
      try {
        this.$refs.alias.validate()
        let valid2 = await this.$refs.url.validate()
        if (!this.$refs.alias.hasError && valid2) {
          await this.$axios.post('https://chopzi.com/createambiente', {
            'alias': this.newname,
            'url': this.url + this.suffix,
            'amb': this.url,
            'user': this.currentUser
          }).then(e => console.log(e)).catch(e => console.log(e), this.addnew = false, this.$q.loading.hide())
          return this.$q.notify({
            message: 'Ambiente creado exitosamente',
            color: 'blue'
          })
        } else {
          throw Error({ error: true })
        }
      } catch (error) {
        console.error(error)
        this.$q.notify({ message: 'Error creando ambiente, verifique su conexión a internet e intente más tarde' })
        this.$q.loading.hide()
      }
    },
    ...mapActions('user', ['getAvailableUrls', 'bindAmbiente']),
    async isValidCharacterURL (title) {
      var regExp = /^\s*([0-9a-z]+)\s*$/
      if (!regExp.test(title)) {
        return 'El campo solo admite números o letras'
      } else {
        let validate = await this.getAvailableUrls(title + this.suffix)
        console.log(validate)
        switch (true) {
          case validate[0] && validate[1]:
            return true
          case !validate[0] && validate[1]:
            return 'Nombre no disponible'
          case !validate[0] && !validate[1]:
            return true
          default:
            return 'Error de conexión, intente más tarde si el error persiste contacte a soporte'
        }
      }
    },
    async isValidCharacter (title) {
      var regExp = /^\s*([0-9a-z]+)\s*$/
      if (!regExp.test(title)) {
        return 'El campo solo admite números o letras'
      }
      return true
    }
  }
}
</script>
<style lang="stylus">
.cardradius
  border-radius 28px
  width 300px
  height 190px
</style>
