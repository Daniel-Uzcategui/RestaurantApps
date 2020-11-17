<template>
  <q-card flat>
                         <q-card-section>
                            <div class="q-gutter-sm">
                              <q-radio v-model="orderWhen" @input="$emit('validated', true)" val=0 label="Lo más pronto posible" />
                              <q-radio v-model="orderWhen" @input="$emit('validated', false)" val=1 label="Fecha en específico" />
                            </div>
                            <div v-if="orderWhen == 1" class="q-pt-md" style="max-width: 300px">
                              <q-input @click="date = true; validate = false" readonly v-model="orderDate" hint="Seleccione Fecha y hora">
                                <template v-slot:prepend>
                                  <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy @show="validate = false" @hide="time = true" v-model="date" transition-show="scale" transition-hide="scale">
                                      <q-date @input="$emit('validated', false)" :options="dateOptions" v-model="orderDate" mask="YYYY-MM-DD HH:mm">
                                        <div class="row items-center justify-end">
                                          <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-date>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>

                                <template v-slot:append>
                                  <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy @show="validate = false; $emit('validated', false)" v-model="time" transition-show="scale" transition-hide="scale">
                                      <q-time @input="$emit('validated', true); validate = true" :disable="orderDate === null" :options="optionsFnTime" v-model="orderDate" mask="YYYY-MM-DD HH:mm" format24h>
                                        <div class="row items-center justify-end">
                                          <q-btn v-if="validate" v-close-popup label="Close" color="primary" flat />
                                        </div>
                                      </q-time>
                                    </q-popup-proxy>
                                  </q-icon>
                                </template>
                              </q-input>
                            </div>
                         </q-card-section>
                       </q-card>
</template>
<script>
/* eslint-disable camelcase */
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'my-card',
  props: ['value'],
  computed: {
    ...mapGetters('config', ['configurations']),
    configDates () {
      let cfg = this.configurations.find(e => e.id === 'sede' + this.sede)
      return cfg
    }
  },
  mounted () {
    this.bindConfigs()
  },
  methods: {
    ...mapActions('config', ['bindPaymentServ', 'bindConfigs']),
    ...mapActions('editor', ['bindBlocks']),
    dateOptions (date) {
      if (typeof this.configDates === 'undefined') { return new Date(date + ' 23:59:59') >= new Date() }
      let sedecfg = this.configDates
      let today = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
      if (!sedecfg.days[today][0].isOpen) {
        return false
      }
      return new Date(date + ' 23:59:59') >= new Date()
    },
    hourOptions (hr) {
      return hr >= parseInt(new Date(new Date().getTime() + 80 * 60000).toLocaleTimeString('en-GB', { hour: '2-digit' }))
    },
    minuteOptions (min) {
      if (min === null) { return true }
      return min >= parseInt(new Date(new Date().getTime() + 80 * 60000).toLocaleTimeString('en-GB', { minute: '2-digit' }))
    },
    optionsFnTime (hr, min) {
      console.log({ hr, min })
      if (typeof this.configDates === 'undefined') {
        if (!this.hourOptions(hr)) {
          return false
        }
        if (!this.minuteOptions(min)) {
          return false
        }
        return true
      }
      let sedecfg = this.configDates
      let today = new Date(this.orderDate).toLocaleString('en-us', { weekday: 'long' }).toLowerCase()
      if (min === null) {
        for (let i of sedecfg.days[today]) {
          let open = parseInt(i.open.slice(0, 2))
          let close = parseInt(i.close.slice(0, 2))
          if (hr >= open && hr <= close) {
            return true
          }
        }
      } else {
        for (let i of sedecfg.days[today]) {
          let openhr = parseInt(i.open.slice(0, 2))
          let openmin = parseInt(i.open.slice(2, 4))
          let closehr = parseInt(i.close.slice(0, 2))
          let closemin = parseInt(i.close.slice(2, 4))
          if (hr >= openhr && hr <= closehr && (hr === openhr ? min >= openmin : true) && (hr === closehr ? min <= closemin : true)) {
            return true
          }
        }
      }
      return false
    }
  },
  watch: {
    orderDate () {
      this.$emit('input', { orderDate: this.orderDate, orderWhen: this.orderWhen })
    },
    orderWhen () {
      this.$emit('input', { orderDate: this.orderDate, orderWhen: this.orderWhen })
    }
  },
  data () {
    return {
      orderDate: null,
      orderWhen: null,
      date: false,
      time: false,
      validate: false
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
