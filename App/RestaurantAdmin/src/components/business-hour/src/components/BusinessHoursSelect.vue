<template>
<div>
  <!-- <select :name="optionName" @change="inputEventHandler" v-model="selected">
    <option v-show="isFirstRow(index) && onlyOneRow(hours)" value>{{
      defaultText
    }}</option>
    <option v-show="isFirstRow(index)" value="24hrs">{{
      localization.t24hours
    }}</option>
    <option
      v-for="time in filteredTimes"
      :key="time"
      :value="time"
      :selected="time == selected"
      >{{ time | formatTime(hourFormat24) }}</option
    >
    <option v-show="showMidnightOption" value="2400">{{
      localization.midnight
    }}</option>
  </select> -->
  <q-select filled rounded outlined
  @input="inputEventHandler"
  style="min-width: 120px"
   v-model="selected"
   emit-value
   map-options
   :options="wtf"
   />
</div>
</template>

<script>
import { helperMixin } from '../mixins/helperMixin'
import { formFieldMixin } from '../mixins/formFieldMixin'
export default {
  computed: {
    wtf: {
      get () {
        let a = []
        if (this.isFirstRow(this.index)) {
          a.push({ value: '24hrs', label: this.localization.t24hours })
        }
        for (let time of this.filteredTimes) {
          a.push({ value: time, label: (formFieldMixin.filters.formatTime(time, false)) })
        }
        if (this.showMidnightOption) {
          a.push({ value: '2400', label: this.localization.midnight })
        }
        return a
      }
    }
  },
  name: 'BusinessHoursSelect',
  mixins: [helperMixin, formFieldMixin]
}
</script>
