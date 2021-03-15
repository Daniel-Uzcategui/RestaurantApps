<template lang='pug'>
.form-group.row.flex-items-xs-center
  label.col-form-label.col-xs-4.col-md-3.col-lg-6(:for='label') {{label}}
  .col-xs-4.col-md-3.col-lg-6
    q-select.form-control(
      filled
      :id='label',
      :type='type',
      :value='value',
      :options='options'
      map-options
      emit-value
      @input='(e) => $emit("input", e)'
    )
</template>

<script>
export default {
  props: {
    value: {},
    label: String,
    type: String,
    options: Array
  }
}
</script>

<style scoped lang='scss'>
.col-form-label {
  padding-top: 0.4rem;
}
</style>
