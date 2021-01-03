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
.itemcompback
  background-color $primary
  color white
  border-radius 28px
.q-diag-glassMorph
  border-radius 28px
  background-color white

</style>
