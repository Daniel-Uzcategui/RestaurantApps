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
.q-cardGlass
  border-radius: 28px
.menu-div2
  border-radius: 28px
.background-color
  margin 40px auto
  border-radius 20px
  width 90% !important
  height 60%
  background-color $primary !important
  -webkit-box-shadow -4px 8px 18px rgba(0,0,0,0.1)
  box-shadow -4px 8px 18px rgba(0,0,0,0.1)
.itemcompback
  background-color $primary
  border-radius 28px
.burgericon
  color white !important
.carticon
  color white !important
</style>
