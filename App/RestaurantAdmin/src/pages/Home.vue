<template>
  <q-page class="flex flex-center" >
  <div class="q-pa-md row items-start q-gutter-md" >
   <q-card class="my-card text-white" horizontal>
      <q-card-section class="bg-green-3">
        <div class="text-h5">98</div>
        <div class="text-subtitle2">Ordenes Pendientes </div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions class="bg-green-2" vertical>
        <q-btn flat icon-right="arrow_right_alt" label="más info" />
      </q-card-actions>
       </q-card>
      <q-card class="my-card text-white" horizontal>
        <q-card-section  class="bg-green-3">
        <div class="text-h5">13</div>
        <div class="text-subtitle2">Ordenes en Progreso</div>
      </q-card-section>
       <q-separator dark />
      <q-card-actions  class="bg-green-2" vertical>
        <q-btn flat icon-right="arrow_right_alt" label="más info" />
      </q-card-actions>
       </q-card>
       <q-card class="my-card text-white" horizontal>
            <q-card-section  class="bg-green-3">
        <div class="text-h5">3</div>
        <div class="text-subtitle2">Ordenes en Anuladas</div>
      </q-card-section>
       <q-separator dark />
      <q-card-actions class="bg-green-2" vertical>
        <q-btn flat icon-right="arrow_right_alt" label="más info" />
      </q-card-actions>
    </q-card>
      <div class="separator"></div>
     <q-table class="orders"
      :dense="$q.screen.lt.md"
      title="Ordenes"
      :data="data"
      :columns="columns"
      color="primary"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Exportar a csv"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
  </div>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  methods: {
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Navegador no permitio la descarga del Archivo...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  },

  data () {
    return {
      columns: [
        {
          name: 'descrip',
          required: true,
          label: 'Descripción',
          align: 'left',
          field: 'descrip',
          sortable: true
        },
        { name: 'typePayment', align: 'center', label: 'Tipo de Pago', field: 'typePayment' },
        { name: 'status', label: 'Estado', field: 'status' },
        { name: 'order_date', label: 'Fecha', field: 'order_date' }
      ],

      data: [
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso',
          order_date: '19/05/2000 10:50'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso',
          order_date: '19/05/2000 10:50'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso',
          order_date: '19/05/2000 10:50'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso',
          order_date: '19/05/2000 10:50'
        },
        {
          descrip: 'Frozen Yogurt',
          typePayment: 'Efectivo',
          status: 'En progreso',
          order_date: '19/05/2000 10:50'
        }
      ]
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
.orders
  width: 100%
  max-width: 780px
.separator
  margin-bottom: 20%
 </style>
