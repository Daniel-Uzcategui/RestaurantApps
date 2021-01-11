<template>
<div>
<slot ></slot>
</div>
</template>

<script>
// import { colors } from 'quasar'
export default {
  created () {
    this.$q.dark.set(false)
    // colors.setBrand('primary', colors.getBrand('blue'))
    // colors.setBrand('secondary', colors.getBrand('light-blue'))
  }
}
</script>

<style lang="stylus">
.q-diag-glassMorph
  border-radius 28px !important
  background rgba( 255, 255, 255 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )
  border-radius 10px
.q-fullscreen-glassMorph
  @extends .q-diag-glassMorph
  border-radius 0px !important

.backgroundImage
  background: url('https://i.pinimg.com/originals/13/4f/27/134f271f8d0710edb376f2b7f2b82916.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;

.q-dialog__backdrop
  background-color transparent

.q-select__dialog
  @extends .q-diag-glassMorph

.q-drawer
  background rgba( 255, 255, 255 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )
  color white
.q-table__container
  @extends .q-drawer
  font-weight: 800
  color inherit
.q-table__top
  @extends .q-drawer
  background-color rgba($secondary, 0.25)
  color inherit
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
