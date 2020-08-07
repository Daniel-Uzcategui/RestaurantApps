<template>
  <q-page class="q-pa-lg" >
     <div class="q-gutter-md">
      <q-card>
       <q-card-section  class="bg-secondary text-white header" >
          <div class="text-h5">Ajustes de Horarios</div>
          <div>
            <q-btn class="header-btn" flat color="white" push label="Regresar" icon="fa fa-arrow-left" @click="$router.replace('/home')"/>
          </div>
       </q-card-section>
     <q-card-section>
      <business-hours
            :days="days"
            name="holidayHours"
            type="select"
            :time-increment="60"
            :localization="localization"
            color="#00af0b"
          ></business-hours>
      </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>

<script>
import BusinessHours from 'vue-business-hours'
export default {
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
.header
 padding-bottom: 50px
</style>
