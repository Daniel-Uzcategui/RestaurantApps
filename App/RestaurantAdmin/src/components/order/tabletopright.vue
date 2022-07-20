<template>
<div class="row ">
  <div class="row justify-end col-12">
        <div class="boton_reporte" style="display: flex;align-items:center"><q-btn color="blue"  label="Reporte" rounded style="font-size:12px;margin-right:15px;">
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
      </div>
        <div class="buscar_responsive"><q-input label="Buscar Cliente" :value="filtrado" @input="(e) =>$emit('filtrado', e)" dark  /></div>
        <div class="etiqueta_fecha" style="display: flex;align-items: center;margin-right:15px;">
          <q-badge v-if="dateRange !== null " color="blue-grey">
            {{ dateRange.from }} - {{ dateRange.to }}
          </q-badge>
          <q-badge v-else>
            Últimos 30 días
          </q-badge>
        </div>
        <div class="botones">
        <q-btn icon="event" class="q-mr-sm" rounded color="blue" >
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date color="blue" :value="dateRango" @input="(e)=>$emit('dateRango', e)" range >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Borrar Filtro" @click="$emit('dateRango',null)" color="white" flat v-close-popup/>
              </div>
            </q-date>
          </q-popup-proxy>
          </q-btn>
            <q-btn no-caps rounded color="green" push icon="archive" :size="q-mr-sm" @click="$emit('exportTable')"/>
        </div>
        <div class="" style="padding-top:1.5%">
            <q-option-group
            :value="statusFilter"
            @input="(e) => $emit('statusFilter', e)"
              :options="allestatus"
              dense
              color="green"
              type="checkbox"
              inline
              name ="foo"
            /></div>
            </div>
</div>
</template>
<script>
export default {
  name: 'tabletop',
  props: { report: {}, filtrado: {}, dateRange: {}, dateRango: {}, statusFilter: {}, allestatus: { type: Array, default: () => [] } }
}
</script>
<style lang="stylus">
.flex-break
  flex: 1 0 100% !important
.row
  .flex-break
    height: 0 !important
.column
  .flex-break
    width: 0 !important
</style>
<style >
.botones{
  display:flex;
}
@media (min-width: 320px) and (max-width: 780px){
.buscar_responsive{
margin: 1rem;
padding: 1rem;
}
.etiqueta_fecha{
margin-left: 30%;
width: 96%;
}
.boton_reporte{
  margin-right: 8rem !important;
}
.botones{
 margin: 1rem;
padding: 1rem;
width: 100%;
margin-left:25%;
}
}

</style>
