<template>
           <q-card v-if="$q.screen.lt.md" class="row text-bold">
             <Nav
                class="q-pb-lg cursor-pointer col-4 col-lg-3"
                v-for="link in nav"
                :key="link.title"
                v-bind="link"
                size="xl"
                />
         <q-card
            flat
            clickable
            class="text-center bg-transparent col-4 col-lg-3"
        >
            <q-card-section
            side
            style="color: inherit"
            >
            <q-icon size="lg" name="face"/>
            </q-card-section>
            <q-card-section class="q-pa-none">
            <q-item-label>Ir a página cliente</q-item-label>
            </q-card-section>
        </q-card>
    </q-card>
 </template>

<script>
import Nav from 'components/nav2'
import { mapGetters } from 'vuex'
export default {
  name: 'UserLayout',
  components: {
    Nav
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'roles']),
    ...mapGetters('order', ['orders']),
    amb () {
      return localStorage.getItem('amb')
    },
    editUserDialog: {
      get () {
        return this.$store.state.user.editUserDialog
      },
      set (val) {
        this.setEditUserDialog(val)
      }
    }
  },
  methods: {
    onClickOption (node) {
      this.$router.push({ path: '/settings/' + node })
    },
    onClickGuide (node) {
      this.$router.push({ path: '/guide/' + node })
    },
    onClickPayments (node) {
      this.$router.push({ path: '/payments/' + node })
    },
    onClickReports (node) {
      this.$router.push({ path: '/reports/' + node })
    }
  },
  data () {
    return {
      nav: [
        {
          title: 'Mis Tiendas',
          caption: '',
          icon: 'language',
          handler: () => {
            this.$router.push({ path: '/ambientes' })
          }
          // link: '#/ambientes'
        },
        {
          title: 'Dashboard',
          caption: '',
          icon: 'dashboard',
          link: '#/home'
          // separator: true,

        },
        {
          title: 'Asistentes',
          caption: '',
          icon: 'assistant',
          // separator: true,
          tree:
              [
                { label: 'Intro',
                  link: 'intro',
                  handler: (node) => this.onClickGuide('intro') },
                { label: 'Cambiar Tema de Cliente',
                  link: 'quicktheme',
                  handler: (node) => this.onClickGuide('quicktheme') }
              ]

        },
        {
          title: 'Catálogo',
          caption: '',
          icon: 'menu_book',
          // separator: true,
          tree: [

            {
              label: 'Categorías',
              caption: '',
              icon: 'fa fa-bars',
              handler: () => this.$router.push({ path: '/menu/categorias' })
              // separator: true,

            },
            {
              label: 'Productos',
              caption: '',
              icon: 'fas fa-utensils',
              handler: () => this.$router.push({ path: '/menu/menu' })
              // separator: true,
            },
            {
              label: 'Multi Catálogo',
              caption: '',
              icon: 'fas fa-filter',
              handler: () => this.$router.push({ path: '/menu/menufilters' })
              // separator: true,

            },
            {
              label: 'Opciones',
              caption: '',
              icon: 'fab fa-gulp',
              handler: () => this.$router.push({ path: '/menu/options' })
              // separator: true,

            },
            {
              label: 'Grupos de Opciones',
              caption: '',
              icon: 'menu_book',
              handler: () => this.$router.push({ path: '/menu/GroupOptions' })
              // separator: true,

            },
            {
              label: 'Cupones',
              caption: '',
              icon: 'fas fa-ad',
              handler: () => this.$router.push({ path: '/menu/coupons' })
              // separator: true,

            }

          ]
        },
        {
          title: 'Ordenes',
          caption: '',
          icon: 'room_service',
          handler: () => this.$router.push({ path: '/orders/index', query: { status: 3 } })
          // link: '#/orders/index'
          // separator: true,

        },
        {
          title: 'Pagos',
          caption: '',
          icon: 'request_quote',
          // separator: true,
          tree: [

            { label: 'Consulta general',
              link: 'index',
              handler: (node) => this.onClickPayments('index') },
            { label: 'Transacciones',
              link: 'transactions',
              handler: (node) => this.onClickPayments('transactions') }

          ]
        },
        {
          title: 'Clientes',
          caption: '',
          icon: 'fa fa-user',
          link: '#/clients/index'
          // separator: true,

        }, {
          title: 'Corporativo',
          caption: '',
          icon: 'business',
          // separator: true,
          tree: [
            { label: 'Venta por Vendedor',
              handler: (node) => this.$router.push({ path: '/vendedor/index' })
            },
            {
              label: 'Clientes',
              handler: (node) => this.$router.push({ path: '/corporativo/index' })
            },
            {
              label: 'Ordenes',
              handler: (node) => this.$router.push({ path: '/corporativo/reporte/index' })
            }] },
        {
          title: 'Encomiendas',
          caption: '',
          icon: 'local_shipping',
          // separator: true,
          tree: [
            { label: 'Verificar Encomiendas',
              handler: (node) => this.$router.push({ path: '/encomienda/index' })
            },
            { label: 'Tracking',
              handler: (node) => this.$router.push({ path: '/tracking/index' })
            }
          ]
        },

        {
          title: 'Configuración',
          caption: '',
          icon: 'fa fa-cog',
          // separator: true,
          tree: [
            {
              label: 'General',
              link: 'general',
              handler: (node) => this.onClickOption('general')
            },
            {
              label: 'Sedes',
              handler: () => this.$router.push({ path: '/localization/index' })
            },
            { label: 'Horarios',
              link: 'schedule',
              handler: (node) => this.onClickOption('schedule') },
            { label: 'Servicios de Pago',
              link: 'paymentServ',
              handler: (node) => this.onClickOption('paymentServ') },
            { label: 'Servicios y Rewards',
              link: 'services',
              handler: (node) => this.onClickOption('services') },
            { label: 'Tasa de cambio',
              link: 'rate',
              handler: (node) => this.onClickOption('rate') },
            {
              label: 'Usuarios',
              handler: () => this.$router.push({ path: '/users/index' })

            },
            {
              label: 'Widgets',
              // separator: true,
              tree: [
                { label: 'Chat',
                  link: 'chat',
                  handler: (node) => this.$router.push({ path: '/settings/chat' }) }
              ]
            }
          ]
        }
      ]
    }
  },
  created () {
    let colors = ['green', 'blue', 'indigo', 'orange', 'brown', 'red', 'purple', 'cyan', 'teal', 'grey', 'blue-grey']
    for (let i in this.nav) {
      this.nav[i].color = colors[i]
    }
  }
}
</script>
 <style lang="stylus">
   .main
     &.blur-layout
       filter blur(5px)
   .q-drawer
     overflow hidden
   .q-toolbar
     background-repeat no-repeat
     background-size 15vmin
     background-position center
   .q-popup-edit
     min-width: unset !important
   .q-popup-edit__buttons > .q-btn
     color: white !important
 </style>
