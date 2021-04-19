<template>
  <div class="column items-center">
    <q-card class="cardbg full-width full-height" flat>
      <q-card-section>
        <q-item-label class="text-center text-white text-h5 text-bold">
          Mi Billetera
        </q-item-label>
      </q-card-section>
      <q-card-section class="text-center text-white">
        <q-item-label class="text-h4 text-bold">
          <span class="text-h6">$</span>{{chopziAcc.balance}}
        </q-item-label>
        <div class="text-caption">
          Balance Total
        </div>
      </q-card-section>
      <q-card-section class="column items-center">
        <q-card class="lastpurchase">
          <q-card-section class="row justify-between">
            <q-icon class="col-2" name="shopping_cart" size="md" color="purple" />
            <div class="col-8 column items-center">
              <div class="text-caption">
                Última compra
              </div>
              <div class="text-bold text-h6">
                <span class="text-h7">$</span>88.00
              </div>
              <div class="text-caption">
                19 Enero 5:43pm
              </div>
            </div>
            <q-icon class="col-2" name="payment" size="md" color="orange" />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section v-for="(payments, index2) in paymentMethods" :key="index2" class="column items-center">
        <q-card class="lastpurchase bg-transparent" flat>
          <q-card-sections v-if="index2 === 0" class="row justify-start">
            <q-item-label class="text-bold">
              Tarjetas
            </q-item-label>
          </q-card-sections>
          <q-card-section class="full-width">
            <div class="row justify-start q-mb-md full-width">
            <q-icon class="col-2" name="payment" size="md" :color="payments.color" />
            <div class="text-bold col-4 self-center">
              {{payments.alias}}
            </div>
            <q-item-label class="col column items-end justify-center">
              <div class="text-bold text-h6">
                <span class="text-h7">$</span>{{payments.balance}}
                <q-icon class="cursor-pointer" name="arrow_drop_down" @click="expand = !expand" color="blue"></q-icon>
              </div>
            </q-item-label>
            </div>
          <div v-for="(payment, index) in payments.payments" :key="index" class="row q-mb-xs justify-start">
            <div class="col-2"/>
            <div class="text-bold col-4 self-center">
              {{payment.date}}
            </div>
            <q-item-label class="col column items-end justify-center">
              <div class="text-bold text-h7 q-mr-xl">
                <span class="text-h7">-$</span>{{payment.amount.toLocaleString()}}
              </div>
            </q-item-label>
          </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="column items-center">
        <q-card class="lastpurchase bg-transparent" flat>
          <q-card-sections class="row justify-start">
            <q-item-label class="text-bold">
              Depositos
            </q-item-label>
          </q-card-sections>
          <q-card-section class="full-width">
            <div class="row justify-start q-mb-md full-width">
            <q-icon class="col-2" name="payment" size="md" :color="chopziAcc.color" />
            <div class="text-bold col-4 self-center">
              Este Mes
            </div>
            <q-item-label class="col column items-end justify-center">
              <div class="text-bold text-h6">
                <span class="text-h7">$</span>{{chopziAcc.balance}}
                <q-icon class="cursor-pointer" name="arrow_drop_down" @click="expand = !expand" color="blue"></q-icon>
              </div>
            </q-item-label>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'wallet',
  data () {
    return {
      expand: false,
      chopziAcc: {
        name: 'purple',
        color: 'purple',
        balance: 140.13,
        payments: [{ date: 'Vie 18 Ene 2:32pm', amount: 68.83 }, { date: 'Vie 19 Ene 4:23pm', amount: 13.33 }],
        deposits: [{ date: 'Vie 18 Ene 2:32pm', amount: 68.83 }, { date: 'Vie 19 Ene 4:23pm', amount: 13.33 }]
      },
      paymentMethods: [{
        name: 'orange',
        color: 'orange',
        alias: '*** 5456',
        balance: 88.07,
        payments: [{ date: 'Vie 18 Ene 2:32pm', amount: 50 }, { date: 'Vie 19 Ene 4:23pm', amount: 23.43 }]
      },
      {
        name: 'blue',
        color: 'blue',
        alias: '*** 7894',
        balance: 140.13,
        payments: [{ date: 'Vie 18 Ene 2:32pm', amount: 68.83 }, { date: 'Vie 19 Ene 4:23pm', amount: 13.33 }]
      }]
    }
  }
}
</script>
<style lang="stylus">
.cardbg
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%230099ff' fill-opacity='1' d='M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,218.7C1120,224,1280,160,1360,128L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z'%3E%3C/path%3E%3C/svg%3E")
  background-repeat no-repeat
  background-size cover
.lastpurchase
  min-width 550px
@media only screen and (max-width: 600px)
  .lastpurchase
    min-width 90vw
  .cardbg
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 260'%3E%3Cpath fill='%230099ff' fill-opacity='1' d='M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,218.7C1120,224,1280,160,1360,128L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z'%3E%3C/path%3E%3C/svg%3E")
    background-repeat no-repeat
    background-size cover
</style>
