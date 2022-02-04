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
.q-fullscreen-glassMorph
  @extends .q-diag-glassMorph
  border-radius 0px !important

.q-dialog__backdrop
  background-color transparent

.q-select__dialog
  @extends .q-diag-glassMorph

.q-drawer
  // background rgba( 0, 0, 0, 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )

.q-table__container
  @extends .q-drawer
  font-weight: 800
.q-table__top
  @extends .q-drawer
  background var(--q-color-secondary)
  color white

.q-cardtop
  @extends .q-table__top

.q-cardGlass
  @extends .q-diag-glassMorph

.q-dialog-plugin
  @extends .q-diag-glassMorph
.q-menu
  @extends .q-diag-glassMorph
  border-top-right-radius: 0px !important
  border-top-left-radius: 0px !important
  box-shadow none
</style>
