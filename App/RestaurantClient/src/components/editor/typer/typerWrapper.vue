<template lang="pug">
  div
    vue-typer(
      v-bind="{ ...value, titleColor }"
    )
</template>
<script>
import { VueTyper } from './vue-typer'
export default {
  components: { VueTyper },
  props: ['value', 'titleColor']
}
</script>
