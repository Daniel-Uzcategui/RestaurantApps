<template>
<div>
<slot></slot>
</div>
</template>

<script>
import { colors } from 'quasar'
export default {
  created () {
    this.$q.dark.set(false)
    colors.setBrand('primary', colors.getPaletteColor('indigo'))
    colors.setBrand('secondary', colors.getPaletteColor('indigo-4'))
  }
}
</script>

<style lang="stylus">
.q-diag-glassMorph
  border-radius 28px !important
  // background rgba( 43, 55, 66, 0.40 )
  // background-color rgba( 43, 55, 66, 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )
  border-radius 10px
</style>
