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
          <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
          <q-btn flat color="white" push label="Agregar" icon="fas fa-plus" @click="addrow"/>
        </q-btn-group>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="rateValue" :props="props" v-if="add">
              <q-input
                @input="(e) => saved(e, props.row.name, props.row.id, 'rateValue')"
                :value="props.row.rateValue"
                type="number"
                dense  input-style="text-align: right"
                />
          </q-td>
           <q-td key="rateValue" :props="props" v-else-if="add==false">
              <q-input
                @input="(e) => saved(e, props.row.name, props.row.id, 'rateValue')"
                :value="props.row.rateValue"
                type="number"
                dense  input-style="text-align: right" disable
                />
          </q-td>
          <q-td key="currency" :props="props">
              <q-input
              :value="props.row.currency"  dense
              @input="(e) => saved(e, props.row.name, props.row.id, 'currency')"
              input-style="text-align: right"
                />
          </q-td>
          <q-td key="dateIn" :props="props">
             <q-input  :value="formatDate(props.row.dateIn)"  dense  disable input-style="text-align: right"
                />
           </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
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
      rateValue: '',
      currency: '',
      dateIn: '',
      add: false
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
      console.log(this.currentUser)
      let rateValue = ''
      let dateIn = new Date()
      let currency = 'Bs'
      let userId = this.currentUser.id
      this.add = true
      this.addRate({ rateValue, dateIn, currency, userId })// .then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
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
  .q-table__top
    background-color $secondary
    color white
</style>
