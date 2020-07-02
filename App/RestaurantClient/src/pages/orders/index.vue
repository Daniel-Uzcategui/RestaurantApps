<template>
  <q-page padding>
    <q-card class="menudiv">
    <q-card-section>
    <div class="q-pa-md flex flex-center">
    <q-knob
      disable
      v-model="value"
      show-value
      size="320px"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"
      class="text-primary q-ma-md"
    >
    <p class="text-h6">{{texto}}</p>
    </q-knob>
    <p class="text-h6">{{texto2}}</p>
  </div>
    </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      texto: 'Por confirmar',
      texto2: 'Estamos trabajando Para entregarle su orden',
      value: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this.value = 40
      this.texto = 'Orden Confirmada'
    }, 3000)
    setTimeout(() => {
      this.value = 60
      this.texto = 'Preparando su pedido'
    }, 6000)
    setTimeout(() => {
      this.value = 80
      this.texto = 'Orden en vía'
    }, 9000)
    setTimeout(() => {
      this.value = 100
      this.texto = 'Orden Entregada'
      this.texto2 = ''
    }, 12000)
  }
}
</script>

<style lang="stylus">
  .menudiv
    border-top-left-radius 50px
    border-top-right-radius 50px
    border-bottom-left-radius 50px
    border-bottom-right-radius 50px
</style>
