<template>
  <q-page class="column justify-start">
    <div id="paypal-button-container"></div>
  </q-page>
</template>
<script>
export default {
  methods: {
    thf () {
    }
  },
  mounted () {
    this.paypal.Buttons({
      createOrder: function (data, actions) {
      // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '0.01'
            }
          }]
        })
      }
    }).render('#paypal-button-container')
  },
  data () {
    return {
      paypal: window.paypal
    }
  },
  name: 'PageIndex'
}
</script>
