<template>
<div>
<slot></slot>
</div>
</template>

<script>
import { colors } from 'quasar'
export default {
  mounted () {
    this.$q.dark.set(true)
    colors.setBrand('primary', '#2b3742')
    colors.setBrand('secondary', '#4B555E')
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
