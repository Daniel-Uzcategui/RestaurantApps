<template>
<div>
<slot></slot>
</div>
</template>

<script>
export default {
  mounted () {
    this.$q.dark.set(false)
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
  height 100%

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
  border-top-right-radius: 100px;
.q-drawer
  background rgba( 255, 255, 255 0.40 )
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
  background-color rgba( 255, 255, 255 0.40 ) !important
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)
.q-cardtop
  @extends .q-table__top
.itemcompback
  background-color rgba( 0, 0, 0 0.40 )
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
