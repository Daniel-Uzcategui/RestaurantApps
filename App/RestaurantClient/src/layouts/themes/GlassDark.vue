<template>
<div>
<slot></slot>
</div>
</template>

<script>
export default {
  mounted () {
    this.$q.dark.set(true)
  }
}
</script>

<style lang="stylus">

.q-diag-glassMorph
  border-radius 28px !important
  background-color transparent !important
  background rgba( 0, 0, 0, 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )
  border-radius 10px
.q-fullscreen-glassMorph
  @extends .q-diag-glassMorph
  border-radius 0px !important
  height 100%

.backgroundImage
  background-image: url('https://firebasestorage.googleapis.com/v0/b/restaurant-testnet.appspot.com/o/Editor%2FPhotos%2Fdarkslate975187?alt=media&token=790d4254-67c2-428d-9c57-bec81258b354');

.q-dialog__backdrop
  background-color transparent

.q-select__dialog
  @extends .q-diag-glassMorph
.q-drawer
  border-top-right-radius: 100px;
.q-drawer
  background rgba( 0, 0, 0, 0.40 )
  backdrop-filter blur( 8.0px )
  -webkit-backdrop-filter blur( 8.0px )
  color white
.q-table__container
  @extends .q-drawer
  font-weight: 800
.q-table__top
  @extends .q-drawer
  background-color rgba($secondary, 0.25)

.background-color
  margin 40px auto
  border-radius 20px
  width 90% !important
  height 60%
  background-color transparent !important
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)
.q-cardtop
  @extends .q-table__top

.q-cardGlass
  @extends .q-diag-glassMorph
.burgericon
  color white !important
.carticon
  color white !important
.q-dialog-plugin
  @extends .q-diag-glassMorph

.q-menu
  @extends .q-diag-glassMorph
  border-top-right-radius: 0px !important
  border-top-left-radius: 0px !important
  box-shadow none
</style>
