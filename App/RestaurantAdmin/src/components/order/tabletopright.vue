<template>
  <div class="row full-width justify-start ">
    <div class="col-12 text-h5">
      {{ page || 'Ordenes'}}
    </div>
    <div class="text-caption col-12">
      <q-item-label v-if="dateRange !== null " color="blue-grey">
        {{ dateRange.from }} - {{ dateRange.to }}
      </q-item-label>
      <q-item-label v-else>
        Últimas 100
      </q-item-label>
    </div>
        <q-input class="col-3 col-md-3 col-xs-12" :label="page ? 'Buscar Vendedor': 'Buscar Cliente'" :value="filtrado" @input="(e) =>$emit('filtrado', e)"  />
          <div class="col-12 row justify-center" v-if="!$q.screen.lt.md" >
            <q-btn-group rounded>
              <q-btn color="blue" no-caps label="Reporte" icon="summarize" stack>
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
            <q-btn icon="event"  color="blue" stack label="Rango de Fecha"  no-caps>
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date color="blue" :value="dateRango" @input="(e)=>$emit('dateRango', e)" range >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn label="Borrar Filtro" @click="$emit('dateRango',null)" flat v-close-popup/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
            <q-btn no-caps color="green" label="Exportar" stack push icon="archive" @click="$emit('exportTable')"/>
            </q-btn-group>
          </div>
          <q-footer v-else style="z-index:9999">
            <q-tabs class="bg-primary" rounded>
              <Routetabmenu></Routetabmenu>
              <q-tab color="blue" no-caps label="Reporte" icon="summarize" stack>
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
                </q-tab>
              <q-tab icon="event" stack label="Rango de Fecha"  no-caps>
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date color="blue" :value="dateRango" @input="(e)=>$emit('dateRango', e)" range >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Borrar Filtro" @click="$emit('dateRango',null)" color="white" flat v-close-popup/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-tab>
              <q-tab no-caps label="Exportar" stack push icon="archive" @click="$emit('exportTable')"/>
              </q-tabs>
          </q-footer>
          <div class="row justify-center full-width">
            <q-option-group
            class="col-7 col-md-11 col-lg-7 col-sm-12 col-xs-12"
            :value="statusFilter"
            @input="(e) => $emit('statusFilter', e)"
              :options="allestatus"
              dense
              color="green"
              type="checkbox"
              inline
              name ="foo"
            />
          </div>
          </div>
</template>
<script>
import Routetabmenu from '../navigation/routetabmenu.vue'
export default {
  name: 'tabletop',
  props: { report: {}, filtrado: {}, dateRange: {}, dateRango: {}, statusFilter: {}, allestatus: { type: Array, default: () => [] }, page: {} },
  components: { Routetabmenu }
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
.opciones_reporte{
  padding-top:1.5%;
  width:100%
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
height:31%;
}
}
@media (min-width: 780px) and (max-width: 1280px){

}

</style>
