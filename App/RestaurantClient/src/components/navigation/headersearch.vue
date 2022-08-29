<template>
<q-header>
      <div
      class="row bg-primary q-ma-none q-pa-none"
      >
      <div class="col-2 col-sm-2 col-xs-12">
        <q-img contain :height="$q.screen.lt.md ? '128px' : 'auto'" src="https://firebasestorage.googleapis.com/v0/b/chopzi-production.appspot.com/o/Editor%2Fmarketdecamino%2FLogo%20caminoMARKET%20SIN%20FONDO.png?alt=media&token=0ff71189-a628-47d1-82c4-94645743c7e6" />
      </div>
      <div class=" col-md-8 col-sm-8 col-xs-12 row q-pa-md">
        <q-input
          v-if="$route.name === 'Menu'"
          v-model="searchBar" class="col bg-white self-end q-pl-md" style="border-radius: 8px;" borderless dense label="Hoy estoy buscando..." >
          <template v-slot:append>
            <div style="border-top-right-radius: 8px; border-bottom-right-radius: 8px;" class="bg-grey-7 q-pl-md q-pr-lg full-height">
              <q-icon  name="fas fa-search" color="white" />

            </div>
          </template>
        </q-input>
      </div>
      </div>
      <Navtabs class="desktop-only" ></Navtabs>
    </q-header>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Navtabs from './navtabs.vue'
export default {
  computed: {
    ...mapGetters('config', ['searchBarState']),
    searchBar: {
      get () {
        return this.searchBarState
      },
      set (e) {
        this.searchBarCommit(e)
      }
    }
  },
  methods: {
    ...mapActions('config', ['searchBarCommit'])
  },
  components: { Navtabs }
}
</script>
