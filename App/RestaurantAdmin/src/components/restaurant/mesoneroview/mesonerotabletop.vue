<template>
    <q-card class="full-width q-cardGlass overflow-hidden">
        <q-card-section class="row reverse-wrap">
            <div class="row col-5 col-md-5 col-sm-12 col-xs-12 column self-center">
              <div class="row">
                <q-avatar color="green" text-color="white"/>
                 <div class="self-center q-ma-md text-bold">Mesa Abierta</div>
              </div>
              <div class="row">
                <q-avatar color="red" text-color="white"/>
                 <div class="self-center q-ma-md text-bold">Nuevo Pedido</div>
              </div>
              <div class="row">
                <q-avatar color="grey" text-color="white"/>
                 <div class="self-center q-ma-md text-bold">Mesa Cerrada</div>
              </div>
            </div>
            <div class="col-12 row justify-center" :class="{'absolute-center': $q.screen.gt.md}">
              <q-avatar size="100px" class="self-start" color="green" text-color="white" icon="dinner_dining"></q-avatar>
            </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center" class="q-pa-none">
            <div class="bg-secondary full-width full-height">
                <q-btn class="full-width text-bold" color="white" flat push icon="filter_alt" no-caps  stack label="Filtrar Mesas" />
            </div>
        </q-card-actions>
    </q-card>
</template>
