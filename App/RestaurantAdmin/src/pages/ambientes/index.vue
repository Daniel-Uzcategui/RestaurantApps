<template>
  <div>
      <q-page class="items-center text-white">
    <q-card flat square>
            <q-card-section class="bg-primary column items-center">
             <template>
               <img alt="chopZI" src="~assets/chopzi-01.png" style="border-radius: 28px" class="imglogo">
            </template>
            </q-card-section>
            <q-card-section class="fontsize-18 bg-primary text-center">
            Mis tiendas
            </q-card-section>
    <q-card-section v-if="!bindedAmb || ambientes === null" class="row justify-center">
      <q-spinner color="primary" size="5em" />
    </q-card-section>
    <q-card-section v-else>
      <transition-group
          class="row justify-center"
          name="list-complete" tag="div"
        >
      <q-card key="createamb" class="list-complete-item q-ma-md cardradius bg-primary" :style="{height: addnew ? '190px' : ''}" :class="{'bg-white': addnew}">
        <q-card-section v-if="!addnew" class="column items-center">
          <q-btn flat @click="addnew = !addnew" icon="add" size="lg"/>
            <p>Añadir Tienda</p>
        </q-card-section>
        <q-card-section v-else>
          <form @submit.prevent.stop="createAmbiente()" class="column items-center">
            <q-input class="full-width" ref="alias" dense :rules="[isValidCharacter]" @input="newname = newname.split(' ').join('').toLowerCase()" v-model="newname" label="Alias" hint="Una sola palabra solo letras" />
            <q-input class="full-width" ref="url" debounce="200" dense :rules="[isValidCharacterURL]" @input="url = url.split(' ').join('').toLowerCase()" :suffix="suffix" v-model="url" label="Url" hint="La direccion web que ven tus clientes" />
            <q-btn rounded class="q-mt-xs" color="secondary" type="submit" no-caps label="Crear"></q-btn>
          </form>
        </q-card-section>
      </q-card>
      <q-card @click="ambRoute(amb.id)" v-for="(amb, index) in ambientes" :key="index" v-ripple class="list-complete-item q-ma-md cardradius bg-primary text-center">
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
    <q-dialog v-model="ActivarUsuario"  persistent="persistent">
      <q-card class="q-cardGlass">
        <q-card-section>
          <div class="text-h5">Porfavor verifique su correo electrónico</div>
         </q-card-section>
         <q-card-section>
           Si la verificación no ocurre automáticamente refresque la página
           </q-card-section>
          <q-separator />
         <q-card-actions class="row justify-around">
           <q-btn label="Enviar Correo" color="purple" rounded no-caps @click="SendMail()"/>
         </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { auth } from '../../services/firebase/base'
export default {
  computed: {
    ...mapGetters('user', ['currentUser', 'ambientes'])
  },
  watch: {
    currentUser () {
      if (this.currentUser && this.currentUser.id) {
        this.bindAmbiente(this.currentUser.id).then(e => console.log('Hello', e), this.bindedAmb = true).catch((e) => console.error(e))
      }
    }
  },
  data () {
    return {
      creandoAmbiente: false,
      ActivarUsuario: false,
      addnew: false,
      newname: '',
      url: '',
      bindedAmb: false,
      suffix: '.chopzi.com'
    }
  },
  mounted () {
    if (!auth().currentUser.emailVerified) {
      this.ActivarUsuario = true
    } else {
      this.ActivarUsuario = false
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
    SendMail () {
      let notif = this.$q.notify
      if (!this.currentUser.emailVerified) {
        let user = auth().currentUser
        user.sendEmailVerification().then(() => {
          notif({
            message: `email ha sido enviado a su correo `,
            color: 'green'
          })
          this.checkAuth(this)
        }).catch(error => {
          if (error.code === 'auth/too-many-requests') {
            return notif({
              message: `Ha realizado muchas solicitudes espere unos minutos`,
              color: 'red'
            })
          }
          notif({
            message: `Ocurrió un error, intente más tarde, verifique su conexión`,
            color: 'red'
          })
          console.log(error)
        }
        )
      }
    },
    checkAuth (that) {
      let thet = that
      let refreshIntervalId = setInterval(function () {
        auth().currentUser.reload()
        if (auth().currentUser.emailVerified) {
          console.log('Email Verified!')
          clearInterval(refreshIntervalId)
          thet.ActivarUsuario = false
        }
      }, 1000)
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
    },
    async VerificarCorreo () {
      console.log('este es el valor que viene del storage', this.$store.state.auth.emailVerified)
      // this.$forceUpdate()
      this.$router.go(0)
      console.log('este es el valor que viene del storage', this.$store.state.auth.emailVerified)
      if (!this.$store.state.auth.emailVerified) {
        let valor = await this.chequearemail()
        console.log('este es el valor', valor)
        if (valor) {
          this.ActivarUsuario = true
        }
      } else {
        this.ActivarUsuario = false
      }
    },
    chequearemail () {
      return new Promise(resolve => {
        auth().onAuthStateChanged(function (user) {
          if (user) {
            resolve(user)
            if (user.emailVerified) {
              console.log('usuario  validado')
            } else {
              console.log('usuario no validado')
            }
          }
          resolve(null)
        })
      })
    }
  }
}
</script>
<style lang="stylus">
.cardradius
  border-radius 28px
  width 300px
  height 130px
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
