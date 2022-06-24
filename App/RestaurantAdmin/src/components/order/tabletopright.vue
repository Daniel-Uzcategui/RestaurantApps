<template>
<div class="row">
        <q-btn color="blue" rounded label="Reportes" no-caps class="q-ma-md">
        <q-menu
          transition-show="scale"
          transition-hide="scale"
        >
          <q-list style="min-width: 100px">
            <q-item clickable @click="$emit('report', 'estandar')">
              <q-item-section>Estándar</q-item-section>
            </q-item>
            <q-item clickable @click="$emit('report', 'tproducts')">
              <q-item-section>Total Productos Vendidos</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
        <q-input label="Buscar Cliente" :value="filtrado" @input="(e) =>$emit('filtrado', e)" dark  />
        <div class="q-mr-sm">
      <q-badge v-if="dateRange !== null " color="blue-grey">
        {{ dateRange.from }} - {{ dateRange.to }}
      </q-badge>
       <q-badge v-else>
        Últimos 30 días
      </q-badge>
    </div>

    <q-btn icon="event" class="q-mr-sm" rounded color="blue">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date color="blue" :value="dateRango" @input="(e)=>$emit('dateRango', e)" range >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Borrar Filtro" @click="$emit('dateRango',null)" color="white" flat v-close-popup/>
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
        <q-btn no-caps rounded color="green" push icon="archive" @click="$emit('exportTable')"/>
</div>
</template>
<script>
export default {
  name: 'tabletop',
  props: ['report', 'filtrado', 'dateRange', 'dateRango']
}
</script>
