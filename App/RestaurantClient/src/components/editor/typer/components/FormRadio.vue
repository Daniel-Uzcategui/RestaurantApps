<template lang='pug'>
.form-group.row.flex-items-xs-center
  label.col-xs-4.col-md-3.col-lg-6 {{label}}
  .col-xs-4.col-md-3.col-lg-6
    .form-check(v-for='option of options')
      label.form-check-label
        input.form-check-input(
          type='radio',
          :value='option',
          @change='$emit("input", $event.target.value)',
          v-model='localModel'
        )
        | {{" " + option}}
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    options: Array,
    model: String
  },
  computed: {
    localModel: {
      get () {
        return this.model
      },
      set () {
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.col-lg-6 {
  padding-right: 0;
}
</style>
