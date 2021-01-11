<template>
<div>
<slot></slot>
</div>
</template>

<script>
import { colors } from 'quasar'
export default {
  mounted () {
    this.$q.dark.set(false)
    colors.setBrand('primary', '#089')
    colors.setBrand('secondary', '#089')
  }
}
</script>

<style lang="stylus">
.itemcompback
  background-color $primary
  color white
  border-radius 28px
.q-diag-glassMorph
  border-radius 28px
  background-color white
.q-cardGlass
  border: 1px solid $separator-color
  border-radius 28px
.orderHome
  border: 1px solid $separator-color
  border-radius 28px
</style>
