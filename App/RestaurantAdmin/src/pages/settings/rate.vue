<template>
<q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
   <div >
   <q-table
      :data="rates"
      :columns="columns"
      title="Tasa de Cambio"
      row-key="id"
      no-data-label="No se encontraron registros"
      rows-per-page-label="Registros por página"
    >
    <template v-slot:top-right>
        <q-btn-group flat push >
          <q-btn class="header-btn-back" flat push  icon="arrow_back" @click="$router.replace('/home')"/>
          <q-btn flat push label="Agregar" icon="add" @click="addrow"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="rateValue" :props="props" v-if="add">
              <q-input filled
                @input="(e) => saved(e, props.row.name, props.row.id, 'rateValue')"
                :value="props.row.rateValue"
                type="number"
                dense  input-style="text-align: right" disable
                />
          </q-td>
           <q-td key="rateValue2" :props="props" v-else-if="add==false">
              <q-input filled
                @input="(e) => saved(e, props.row.name, props.row.id, 'rateValue')"
                :value="props.row.rateValue"
                type="number"
                dense  input-style="text-align: right" disable
                />
          </q-td>
          <q-td key="currency" :props="props">
              <q-input filled
              :value="props.row.currency"  dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'currency')"
              input-style="text-align: right" disable
                />
          </q-td>
          <q-td key="dateIn" :props="props">
             <q-input filled  :value="formatDate(props.row.dateIn)"  dense  disable input-style="text-align: right"
                />
           </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="addRateDialog"  >
    <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar Tasa de Cambio</div>
          <q-space />
        </q-card-section>
        <q-card-section class="row  q-pb-none">
          <div class="offset-message">
            Tasa <q-input type="number" v-model="rateValue"
                dense  input-style="text-align:center"
                />
          </div>
           <div class="text-h6" >
              Moneda:  Bs
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn no-caps flat label="Aceptar" @click="addrate()" color="primary" v-close-popup />
           <q-btn no-caps flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
  </q-dialog>
 </q-page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
const columns = [
  { name: 'rateValue', align: 'center', label: 'Tasa', field: 'rateValue', style: 'min-width: 260px; width: 260px' },
  { name: 'currency', align: 'center', label: 'Moneda (Abreviado)', field: 'currency', style: 'min-width: 160px; width: 160px' },
  { name: 'dateIn', align: 'center', label: 'Fecha', field: 'dateIn', style: 'min-width: 260px; width: 260px' }
]
export default {
  computed: {
    ...mapGetters('config', ['rates']),
    ...mapGetters('user', ['currentUser'])
  },
  data () {
    return {
      selected: [],
      columns,
      rateValue: 0,
      currency: 'Bs',
      dateIn: new Date(),
      add: false,
      addRateDialog: false
    }
  },
  created () {
    this.bindRates().then(() => this.afterBindigRate())
  },
  methods: {
    ...mapActions('config', ['addRate', 'bindRates', 'setValueRate']),
    saved (value, initialValue, id, key) {
      console.log(`original value = ${initialValue}, new value = ${value}, row = ${id}, name  = ${key}`)
      this.setValueRate({ payload: { value, id, key } })
    },
    addrow () {
      this.addRateDialog = true
    },
    addrate () {
      this.addRateDialog = false
      console.log(this.currentUser)
      let rateValue = this.rateValue
      let dateIn = new Date()
      let currency = 'Bs'
      let userId = this.currentUser.id
      this.add = true
      this.addRate({ rateValue, dateIn, currency, userId })
      this.rateValue = 0
    },
    afterBindigRate () {
      // console.log('afterBindigRate')
      // console.log(this.rates)
      if (typeof this.rates !== 'undefined') {
        console.log(this.rates)
      }
    },
    formatDate (dt) {
      // console.log(dt)
      return date.formatDate(dt.toDate(), 'DD-MM-YYYY HH:mm:ss')
    }
  }
}
</script>

<style lang="stylus">
offset-message{
  margin-bottom:15px
  align=center
}
</style>
