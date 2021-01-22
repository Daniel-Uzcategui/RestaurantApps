<template>
  <q-page :class="$q.screen.gt.xs ? 'q-pa-lg' : ''" >
     <div class="q-gutter-md">
      <q-card class="q-cardGlass">
        <q-card-section  class="q-cardtop " >
          <div class="text-h5">Ajustes de Horarios</div>
          <div v-if="$q.screen.gt.xs" class="absolute-bottom-right row ">
          <q-btn class="q-mr-md" no-caps flat color="white" push icon="arrow_back" @click="$router.replace('/home')"/>
          <div class="q-mr-md" v-show="sede">
            <div v-if="config">
              <q-btn no-caps flat color="white" push @click="updatedHours" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn no-caps flat color="white" push @click="add" icon="fas fa-save"/>
            </div>
          </div>
        </div>
        </q-card-section>
       <q-card-section  class="q-cardtop " >
          <q-select options-selected-class="text-blue" filled
          class="q-mt-md"
        rounded
        dense
        outlined
        v-model="sede"
        :options="locList"
        style="width: 250px"
        behavior="menu"
        emit-value
        map-options
        stack-label
        label="Seleccionar Sede"
        @input="getDays"
      />
       </q-card-section>
     <q-card-section class="column items-center">
      <business-hours style="max-width: 650px" v-if="sede && !destroy"
            :days="days"
            name="dayHours"
            type="select"
            :time-increment="15"
            :localization="localization"
          ></business-hours>
      </q-card-section>
    <q-card-section class="column items-center" v-if="sede && !destroy">
        <div class="row header-container" >
         <div class="header-cell q-pa-sm  text-h6">Permitir pagos fuera de horario</div>
       </div>
        <div class="row header-container">
            <div class="header-cell q-pa-sm  col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <q-option-group dense inline color="blue"
              v-model="statusCierre"
              filled rounded  map-options emit-value standout="bg-teal "
              outlined :options="estatus_options" label="Permite pagos" />
            </div>
        </div>
      </q-card-section>
     </q-card>
     </div>
    <q-footer v-if="sede !== null && $q.screen.lt.sm" reveal>
      <q-tabs dense mobile-arrows indicator-color="transparent" no-caps>
        <q-tab no-caps flat push icon="arrow_back" @click="$router.replace('/home')"/>
        <q-tab v-if="config" no-caps flat push @click="updatedHours" icon="fas fa-save"/>
        <q-tab v-else no-caps flat push @click="add" icon="fas fa-save"/>
      </q-tabs>
    </q-footer>
  </q-page>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import BusinessHours from '../../components/business-hour/src/components/BusinessHours'
export default {
  created () {
    this.bindLocalizations()
    this.bindConfigs().then(e => this.getDays())
    this.days = this.default
  },
  computed: {
    ...mapGetters('config', ['configs']),
    ...mapGetters('localization', ['localizations']),
    config () {
      return this.configs.find(obj => {
        return obj.source === 'schedule' && obj.id === `sede${this.sede}`
      })
    },
    locList () {
      return this.localizations.map(x => {
        return {
          value: x.id,
          label: x.name
        }
      })
    }
  },
  methods: {
    ...mapActions('config', ['addConfig2', 'bindConfigs', 'saveConfig']),
    ...mapActions('localization', ['bindLocalizations']),
    add () {
      if (this.days !== 'undefiend') {
        const payload = {
          days: this.days,
          sede: this.sede,
          status: this.statusCierre,
          source: 'schedule'
        }
        this.addConfig2({ payload, doc: `sede${this.sede}` })
        this.$q.dialog({
          title: '',
          message: 'Se han guardo exitosamente los ajustes',
          cancel: false,
          persistent: true
        }).onOk(() => {
        })
      }
    },
    getDays () {
      console.log('getDays')
      console.log(this.config)
      console.log(this.sede)
      if (this.sede) {
        if (typeof this.config !== 'undefined') {
          let objMonday, objTuesday, objWednesday, objThursday, objFriday, objSaturday, objSunday
          objMonday = JSON.parse(JSON.stringify(this.config.days.monday))
          objTuesday = JSON.parse(JSON.stringify(this.config.days.tuesday))
          objWednesday = JSON.parse(JSON.stringify(this.config.days.wednesday))
          objThursday = JSON.parse(JSON.stringify(this.config.days.thursday))
          objFriday = JSON.parse(JSON.stringify(this.config.days.friday))
          objSaturday = JSON.parse(JSON.stringify(this.config.days.saturday))
          objSunday = JSON.parse(JSON.stringify(this.config.days.sunday))
          this.days = { monday: objMonday, tuesday: objTuesday, wednesday: objWednesday, thursday: objThursday, friday: objFriday, saturday: objSaturday, sunday: objSunday }
          this.cache = 1
          this.statusCierre = this.config.status
          console.log('status', this.status)
        } else {
          this.days = this.default
        }
      }
    },
    updatedHours () {
      console.log(this.days)
      let value, id, key
      value = this.days
      id = this.config.id
      key = 'days'
      this.saveConfig({ value, id, key })
      value = this.statusCierre
      id = this.config.id
      key = 'status'
      this.saveConfig({ value, id, key })
      this.$q.dialog({
        title: '',
        message: 'Se han guardo exitosamente los ajustes',
        cancel: false,
        persistent: true
      }).onOk(() => {
      })
    }
  },
  components: {
    BusinessHours
  },
  data () {
    return {
      sede: null,
      destroy: false,
      statusCierre: 0,
      days: [],
      cache: 0,
      estatus_options: [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
      ],
      default: {
        'monday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5d1',
            'isOpen': true
          }
        ],
        'tuesday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5d8',
            'isOpen': true
          }
        ],
        'wednesday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5df',
            'isOpen': true
          }
        ],
        'thursday': [
          {
            'open': '0800',
            'close': '1600',
            'id': '5ca5578b0c5e6',
            'isOpen': true
          }
        ],
        'friday': [
          {
            'open': '0800',
            'close': '1600',
            'id': '5ca5578b0c5ec',
            'isOpen': true
          }
        ],
        'saturday': [
          {
            'open': '24hrs',
            'close': '24hrs',
            'id': '5ca5578b0c5f8',
            'isOpen': true
          }
        ],
        'sunday': [
          {
            'open': '0800',
            'close': '1700',
            'id': '5ca5578b0c5c7',
            'isOpen': true
          }
        ]
      },
      localization: {
        'switchOpen': 'Abierto',
        'switchClosed': 'Cerrado',
        'placeholderOpens': 'Abre',
        'placeholderCloses': 'Cierra',
        'addHours': 'Agregar horas',
        'open': {
          'invalidInput': 'Ingrese una hora de apertura en el formato de 12 horas (es decir, 08:00 a.m.). También puede ingresar las "24 horas".',
          'greaterThanNext': 'Ingrese un horario de apertura que sea anterior al horario de cierre.',
          'lessThanPrevious': 'Ingrese un horario de apertura posterior al horario de cierre anterior.',
          'midnightNotLast': 'La medianoche solo se puede seleccionar para la última hora de cierre del día.'
        },
        'close': {
          'invalidInput': 'Ingrese una hora de cierre en el formato de 12 horas (es decir, 05:00 PM). También puede ingresar "24 horas" o "Medianoche".',
          'greaterThanNext': 'Ingrese una hora de cierre que sea posterior a la hora de apertura.',
          'lessThanPrevious': 'Ingrese una hora de cierre anterior a la próxima hora de apertura.',
          'midnightNotLast': 'La medianoche solo se puede seleccionar para la última hora de cierre del día.'
        },
        't24hours': '24 horas',
        'midnight': window.outerWidth < 377 ? '12:00 AM' : 'Medianoche',
        'days': {
          'sunday': 'Domingo',
          'monday': 'Lunes',
          'tuesday': 'Martes',
          'wednesday': 'Miércoles',
          'thursday': 'Jueves',
          'friday': 'Viernes',
          'saturday': 'Sábado'
        }
      }
    }
  },
  watch: {
    sede (e) {
      this.destroy = true
      setTimeout(() => {
        this.destroy = false
      }, 200)
    }
  }
}
</script>
<style lang="sass" scoped>
.flex-break
  flex: 1 0 100% !important
  height: 0 !important
.header-btn
  position: absolute; right: 10px !important
.header-btn-back
  position: absolute; right:120px !important

.error
 color: red
</style>
