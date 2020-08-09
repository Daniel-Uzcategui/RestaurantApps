<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Ajustes de Horarios</div>
           <div>
            <div v-if="config">
              <q-btn class="header-btn" flat color="white" push label="Guardar" @click="save" icon="fas fa-save"/>
            </div>
            <div v-else>
              <q-btn class="header-btn" flat color="white" push label="Agregar" @click="add" icon="fas fa-plus"/>
            </div>
            <q-btn class="header-btn-back" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
          </div>
       </q-card-section>
     <q-card-section>
      <div class="q-pa-md">SEDE</div>
      <q-select
        bg-color="white"
        outlined
        v-model="sede"
        :options="locList"
        style="width: 250px"
        behavior="menu"
        emit-value
        map-options
        stack-label
        label="Seleccione"
      />
      <business-hours
            :days="days"
            name="holidayHours"
            type="select"
            :time-increment="60"
            :localization="localization"
            color="#00af0b"
            @updated-hours="updatedHours"
          ></business-hours>
      </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BusinessHours from 'vue-business-hours'
export default {
  created () {
    this.bindConfigs().then(e => console.log(this.afterBindig()))
  },
  computed: {
    ...mapGetters('config', ['configs']),
    ...mapGetters('localization', ['localizations']),
    config () {
      return this.configs.find(obj => {
        return obj.source === 'schedule'
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
    ...mapActions('config', ['addConfig', 'bindConfigs', 'saveConfig']),
    add () {
      if (this.key === 0 || this.key.length === 0) {
        this.messageError = []
        if (this.localizacion_sede.length === 0) {
          this.messageError.push('Key default chat ')
        }
        this.validationError = true
        return
      }
      this.$q.loading.show()
      const payload = {
        key: this.key,
        status: this.status,
        source: 'schedule'
      }
      this.addConfig(payload).then(e => { this.$q.loading.hide(); this.$router.replace('/home') })
    },
    save () {
      let value, id, key
      value = this.key
      id = this.config.id
      key = 'key'
      this.saveConfig({ value, id, key })
      value = this.status
      key = 'status'
      this.saveConfig({ value, id, key })
    },
    afterBindig () {
      if (this.config.key !== '') {
        this.key = this.config.key
        this.status = this.config.status
      }
    },
    updatedHours (val) {
      console.log(val)
    }
  },
  components: {
    BusinessHours
  },
  data () {
    return {
      days: {
        'sunday': [
          {
            'open': '',
            'close': '',
            'id': '5ca5578b0c5c7',
            'isOpen': false
          }
        ],
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
            'close': '0300',
            'id': '5ca5578b0c5e6',
            'isOpen': true
          }
        ],
        'friday': [
          {
            'open': '0800',
            'close': 'asdda',
            'id': '5ca5578b0c5ec',
            'isOpen': true
          },
          {
            'open': '1900',
            'close': '2200',
            'id': '5ca5578b0c5f2',
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
        'midnight': 'Medianoche',
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
.header
 padding-bottom: 50px
.header-cell
  padding-left: 30px
</style>
