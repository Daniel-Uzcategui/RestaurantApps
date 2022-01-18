<template>
<q-card class="q-cardGlass">
  <q-card-section>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" >
      <q-input filled v-model="doc.nroDoc" label="Nro Documento"
      lazy-rules :rules="[ val => val && val.length > 0 || 'Porfavor colocar un valor']"
      />
        <q-input type="number" filled v-model.number="doc.amount" label="Monto"
      lazy-rules :rules="[ val => val > 0 || 'Porfavor colocar un valor']"
      />
      <q-date filled type="number" v-model="doc.date" lazy-rules
      :rules="[
      val => val !== null || 'Please type your age'
      ]"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-card-section>
</q-card>
</template>
<script>
export default {
  name: 'AddPayment',
  props: ['soportePago'],
  data () {
    return {
      doc: {
        date: null,
        nroDoc: null,
        amount: null
      }
    }
  },
  created () {
    if (this.soportePago) {
      this.doc = this.soportePago
    }
  },
  methods: {
    onSubmit () {
      if (this.doc.date === null) {
        return this.$q.dialog({ message: 'Colocar fecha' })
      }
      this.$emit('sumbit', this.doc)
    },
    onReset () {
      this.doc = {
        date: null,
        type: null,
        nroDoc: null,
        amount: null
      }
    }
  }
}
</script>
