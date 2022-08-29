<template>
<section>
    <div class="fontsize-12">
      {{ label }}
    </div>
          <q-menu
        touch-position
        context-menu
        class="bg-grey"
      >
        <q-list dense style="min-width: 100px">
          <q-item @click="$emit('editar', label)" clickable v-close-popup>
            <q-item-section>Editar...</q-item-section>
          </q-item>
          <q-item @click="$emit('add')" clickable v-close-popup>
            <q-item-section>Agregar Subcategoria</q-item-section>
          </q-item>
           <q-item @click="$emit('delete')" clickable v-close-popup>
            <q-item-section>Eliminar</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>Cerrar</q-item-section>
          </q-item>
        </q-list>

      </q-menu>
  </section>
</template>
<script>
export default {
  name: 'contextmenucat',
  props: {
    label: String
  }
}
</script>

<style lang="stylus">
  .q-menu
    border-top-right-radius: 28px !important
    border-top-left-radius: 28px !important
</style>
