<template>
  <div class="column items-center">
    <q-card class="q-cardGlass" style="max-width: 500px">
        <q-card-section>
            </q-card-section>
            <q-card-section>
               <div class="text-h6 text-white">
                 <p>Colores de la aplicación cliente</p>
                 <p class="text-caption">Para ver los cambios en el cliente es necesario refrescar la página luego de guardar</p>
                  <q-card-section class="row justify-between">
                     <q-btn
                     rounded
                     no-caps
                        filled
                        class="text-white col-4 q-ma-md"
                        v-model="page.lightPrimary"
                        label="Primario"
                        :style="typeof page.lightPrimary === 'undefined' ? `background: ${colors.getBrand('primary')}` : `background: ${page.lightPrimary};`"
                        >
                        <q-popup-edit auto-save :content-style="{'min-width': 'unset'}" buttons v-model="page.lightPrimary">
                           <q-color v-model="page.lightPrimary" />
                        </q-popup-edit>
                     </q-btn>
                     <q-btn
                     rounded
                        filled
                        no-caps
                        class="text-white col-4 q-ma-md"
                        v-model="page.lightSecondary"
                        label="Secundario"
                        :style="typeof page.lightSecondary === 'undefined' ? `background: ${colors.getBrand('secondary')}` : `background: ${page.lightSecondary};`"
                        >
                        <q-popup-edit auto-save :content-style="{'min-width': 'unset'}" color="primary" buttons v-model="page.lightSecondary">
                           <q-color v-model="page.lightSecondary" />
                        </q-popup-edit>
                     </q-btn>
                  </q-card-section>
               </div>
            </q-card-section>
            <q-card-section class="column items-center">
               <q-btn rounded color="blue" label="Guardar" icon="save" no-caps @click="saveP()" />
            </q-card-section>
         </q-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { colors } from 'quasar'
export default {
  methods: {
    ...mapActions('editor', ['savePage', 'bindBlocks', 'saveCss', 'saveScCss', 'saveVer', 'saveRoutes']),
    saveP () {
      this.$q.dialog({
        title: 'Confirmar',
        message: `¿Desea guardar los cambios?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.savePage({ payload: this.page, doc: '' })
        this.$emit('done')
      })
    }
  },
  mounted () {
    this.bindBlocks().then((e) => {
      let pageobj = e.find(e => e.id === 'page')
      if (pageobj) { this.page = JSON.parse(JSON.stringify(pageobj)) }
    })
  },
  data () {
    return {
      page: {},
      colors: colors
    }
  }
}
</script>
