<template>
    <q-card class="q-diag-glassMorph">
      <q-card-section>
             <slot></slot>
      </q-card-section>
      <q-card-section class="fontsize-18 text-center">
        Cantidad disponible {{quantity}}
        <div v-if="quantity !== (available) + 1">
          Actualmente en el carrito {{quantity - (available + 1)}}
        </div>
      </q-card-section>
    <q-card-section>
    <q-form @submit="onSubmit" class="q-gutter-md" >
    <q-input filled type="number" v-model="qty" label="Cantidad" lazy-rules
    :rules="[
    val => val !== null && val !== '' || 'Porfavor indicar cantidad',
    val => validation(val)
    ]"
    />
    <div class="row justify-center">
    <q-btn label="Agregar" class="col" rounded no-caps type="submit" color="primary"/>
    </div>
    </q-form>
    </q-card-section>
    </q-card>
</template>
<script>
export default {
  methods: {
    onSubmit () {
      this.$emit('Submit', parseInt(this.qty))
    },
    close () {
      this.$emit('hide')
    },
    validation (val) {
      if (this.quantity === 0) {
        return 'No hay stock disponible'
      }
      if (!(val > 0 && val <= this.quantity)) {
        return 'Valor debe ser mayor a 0 y menor o igual a ' + this.quantity
      }
      return true
    }
  },
  data () {
    return {
      qty: 0
    }
  },
  props: {
    quantity: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  }
}
</script>
