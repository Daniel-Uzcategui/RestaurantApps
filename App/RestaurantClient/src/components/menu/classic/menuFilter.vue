<template>
  <q-card-section>
    <div class="row q-pl-lg q-pr-lg relative-position">
        <div class="fontsize-18 self-center">{{rewards ? 'Recompensas': promo ? 'Promociones' : (selectedFilter === '' || typeof selectedFilter === 'undefined') ? (menucfg && menucfg.dispName === '') || typeof menucfg === 'undefined' ? 'Catálogo' : menucfg && menucfg.dispName ? menucfg.dispName : '' : (filterFindName)}}</div>
        <q-btn flat class="fontsize-13 self-center" v-if="filters.length && (rewards ? false : promo ? false : true)" @click="$emit('nextFilter')" icon="fas fa-chevron-circle-right" />
        <q-btn flat class="fontsize-13 self-center absolute-bottom-right" @click="$emit('nextDisp')" icon="fas fa-grip-horizontal"/>
    </div>
    <p v-if="typeof sede === 'undefined' || sede === null"> Ninguna sede seleccionada</p>
    <div>
        <q-list class="bg-dark" style="opacity: .7;overflow: hidden; z-index: 10; position: fixed; top: 50%; right: -16px; border-radius: 28px; padding-right: -15px; border-bottom-left-radius: 28px;">
          <q-item v-ripple style="padding-left: 10px;" v-if="pointsCat && Object.keys(pointsCat).length  && !promo && paymentServ && paymentServ.statusRewards">
              <q-btn :ripple='false' round dense flat color="white" icon="fas fa-gift" @click="$emit('rewards')" />
          </q-item>
          <q-item v-ripple :ripple='false' style="padding-left: 10px;" v-if="(promoData.length || promo)  && !rewards">
              <q-btn dense round flat color="white" icon="fab fa-creative-commons-nc" @click="$emit('promos')" />
          </q-item>
        </q-list>
    </div>
  </q-card-section>
</template>
<script>
export default {
  name: 'menufilter',
  props: ['rewards', 'promo', 'selectedFilter', 'menucfg', 'sede', 'filterFindName', 'pointsCat', 'paymentServ', 'promoData', 'filters']
}
</script>
