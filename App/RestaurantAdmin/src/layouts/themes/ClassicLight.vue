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
    colors.setBrand('primary', colors.getPaletteColor('purple'))
    colors.setBrand('secondary', colors.getPaletteColor('purple-4'))
  }
}
</script>

<style lang="stylus">
// .q-diag-glassMorph
//   border-radius 28px !important
//   background rgb(186, 104, 200)
//   background-color rgb(186, 104, 200)
//   backdrop-filter none
//   -webkit-backdrop-filter none
//   border-radius 10px
// .q-fullscreen-glassMorph
//   @extends .q-diag-glassMorph
//   border-radius 0px !important

// .q-dialog__backdrop
//   background-color transparent

// .q-select__dialog
//   @extends .q-diag-glassMorph

// .q-drawer
//   background white
//   backdrop-filter none
//   -webkit-backdrop-filter none

// .q-table__container
//   @extends .q-drawer
//   font-weight: 800
// .q-table__top
//   @extends .q-drawer
//   background-color rgb(156, 39, 176)
//   background rgb(156, 39, 176)
  .q-table__top
    color white
// .q-cardtop
//   @extends .q-table__top

// .q-cardGlass
//   @extends .q-diag-glassMorph

// .q-dialog-plugin
//   @extends .q-diag-glassMorph
// .q-menu
//   @extends .q-diag-glassMorph
//   border-top-right-radius: 0px !important
//   border-top-left-radius: 0px !important
//   box-shadow none
</style>
