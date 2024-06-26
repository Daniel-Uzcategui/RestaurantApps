
<template>
  <div class="">
    <div class="q-mt-md" v-for="({ open, close, id, isOpen }, index) in hours" :key="id">
      <div class="row justify-center">
    <div class="self-end row q-mr-md q-mb-sm" style="min-width: 170px">
        <div style="min-width: 80px" v-if="showDay(index)">{{ localization.days[day] }}</div>
        <ToggleButton
              style="min-width: 90px"
              v-if="showDay(index)" @change="
              toggleOpen();
              resetHours();
              runValidations();
            " :value="anyOpen" :sync="true" :labels="{
              checked: localization.switchOpen,
              unchecked: localization.switchClosed
            }" :color="color" :width="switchWidth" :height="25" :font-size="12" />
    </div>
    <div class="row">
      <div class="q-mr-xs" v-if="isOpenToday">
          <BusinessHoursSelect v-if="type === 'select'" :name="name" :input-num="inputNum('open', index)" :total-inputs="totalInputs" :day="day" :hours="hours" :time-increment="timeIncrement" :index="index" :selected-time="open" :localization="localization" :hour-format24="hourFormat24" @input-change="onChangeEventHandler('open', index, $event)"></BusinessHoursSelect>
          <BusinessHoursDatalist v-if="type === 'datalist'" :name="name" :input-num="inputNum('open', index)" :total-inputs="totalInputs" :day="day" :hours="hours" :time-increment="timeIncrement" :index="index" :selected-time="open" :any-error="anyError(validations[index].open)" :localization="localization" :hour-format24="hourFormat24" @input-change="onChangeEventHandler('open', index, $event)"></BusinessHoursDatalist>
      </div>

      <div   v-if="isOpenToday">
          <BusinessHoursSelect v-if="type === 'select'" :name="name" :input-num="inputNum('close', index)" :total-inputs="totalInputs" :day="day" :hours="hours" :time-increment="timeIncrement" :index="index" :selected-time="close" :localization="localization" :hour-format24="hourFormat24" @input-change="onChangeEventHandler('close', index, $event)"></BusinessHoursSelect>
          <BusinessHoursDatalist v-if="type === 'datalist'" :name="name" :input-num="inputNum('close', index)" :total-inputs="totalInputs" :day="day" :hours="hours" :time-increment="timeIncrement" :index="index" :any-error="anyError(validations[index].close)" :updated-validations="validations[index].close" :selected-time="close" :hour-format24="hourFormat24" :localization="localization" @input-change="onChangeEventHandler('close', index, $event)"></BusinessHoursDatalist>
      </div>
    <div class="column">
    <div class="self-center">
        <q-btn flat type="button" size="xs" icon="delete_outline" class="font-awesome-button" v-if="showRemoveButton() && isOpenToday" @click="removeRow(index)">
        </q-btn>
    </div>
    <div class="self-center">
          <q-btn
            type="button"
            round
            :style="{ color: color }"
            color="primary"

            size="xs"
            v-if="showAddButton(index) && isOpenToday"
            @click="addRow()"
            icon="add"
          ></q-btn>
        </div>
    </div>
    </div>
      </div>
      <ul class="time-errors" v-if="validations[index].anyErrors">
        <li
          v-for="{ whichTime, error } in activeErrors(index)"
          :key="whichTime + '.' + error"
        >{{ errorMessage(whichTime, error) }}</li>
      </ul>
    </div>
    <q-separator class="q-mt-sm"/>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
import BusinessHoursSelect from './BusinessHoursSelect.vue'
import BusinessHoursDatalist from './BusinessHoursDatalist.vue'
import { ToggleButton } from 'vue-js-toggle-button'
import { helperMixin } from '../mixins/helperMixin'
import { validationMixin } from '../mixins/validationMixin'
import uniqid from 'uniqid'
export default {
  name: 'BusinessHoursDay',
  components: {
    BusinessHoursSelect,
    BusinessHoursDatalist,
    ToggleButton
  },
  mixins: [helperMixin, validationMixin],
  props: {
    day: {
      type: String,
      required: true
    },
    hours: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    timeIncrement: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    localization: {
      type: Object
    },
    switchWidth: {
      type: Number
    },
    hourFormat24: {
      type: Boolean
    }
  },
  computed: {
    totalInputs: function () {
      return this.hours.length * 2
    },
    isOpenToday: function () {
      return this.hours[0].isOpen
    },
    anyOpen: function () {
      return this.hours.some(hour => {
        return hour.isOpen === true
      })
    }
  },
  directives: {
    visible: function (el, binding) {
      el.style.visibility = binding.value ? 'visible' : 'hidden'
    }
  },
  methods: {
    onChangeEventHandler: function (whichTime, index, value) {
      value = this.backendInputFormat(value)

      if (value == '24hrs') {
        this.hours.splice(1)
        this.hours[0].open = this.hours[0].close = value
        this.runValidations()
        this.updateHours()
        return
      }

      if (
        (this.hours[index].open == '24hrs' ||
          this.hours[index].close == '24hrs') &&
        value == ''
      ) {
        this.hours[index].open = this.hours[index].close = value
        this.runValidations()
        this.updateHours()
        return
      }

      if (
        !this.onlyOneRow(this.hours) &&
        value === '' &&
        ((whichTime === 'open' && this.hours[index].close === '') ||
          (whichTime === 'close' && this.hours[index].open === ''))
      ) {
        this.removeRow(index)
        this.runValidations()
        this.updateHours()
        return
      }

      this.hours[index][whichTime] = value
      this.runValidations()
      this.updateHours()
    },
    inputNum: function (whichTime, index) {
      if (whichTime === 'open') {
        return index * 2 + 1
      } else if (whichTime === 'close') {
        return index * 2 + 2
      }
    },
    toggleOpen: function () {
      this.hours[0].isOpen = !this.hours[0].isOpen
    },
    resetHours: function () {
      this.hours.splice(1)
      this.hours[0].open = this.hours[0].close = ''
      this.updateHours()
    },
    addRow: function () {
      this.hours.push({
        id: uniqid(),
        open: '',
        close: '',
        isOpen: true
      })
      this.runValidations()
      this.updateHours()
    },
    removeRow: function (index) {
      this.hours.splice(index, 1)
      this.runValidations()
      this.updateHours()
    },
    showDay: function (index) {
      return !(index > 0)
    },
    showRemoveButton: function () {
      return this.hours.length > 1
    },
    showAddButton: function (index) {
      return !!(this.hours.length === index + 1 &&
        this.hours[index].open !== '' &&
        this.hours[index].close !== '' &&
        this.hours[index].open !== '24hrs' &&
        this.hours[index].close !== '24hrs' &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 15 &&
          this.hours[index].close === '2345'
        ) &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 30 &&
          this.hours[index].close === '2330'
        ) &&
        !(
          this.type === 'select' &&
          this.timeIncrement === 60 &&
          this.hours[index].close === '2300'
        ) &&
        this.hours[index].close !== '2400' &&
        this.validations[index].anyErrors === false)
    },
    updateHours: function () {
      const updatedHours = { [this.day]: this.hours }
      this.$emit('hours-change', updatedHours)
    }
  }
}
</script>

<style lang="scss" scoped>
.remove {
  display: flex;
  justify-content: center;
  width: 50px;
}

label.vue-js-switch {
  margin-bottom: 0;
}

button.add-hours,
button.font-awesome-button {
  height: 30px;
  background-color: transparent;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  padding: 0;
  cursor: pointer;
}

button.add-hours:focus,
button.font-awesome-button:focus {
  outline: none;
}

button.font-awesome-button {
  width: 30px;
  font-size: 24px;
}

button.add-hours {
  font-size: 14px;
  font-weight: bold;
}

.fa-times {
  color: #3d4852;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.time-errors {
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: $primary;
  list-style: none;
}

.time-errors li {
  margin-bottom: 6px;
}
</style>
