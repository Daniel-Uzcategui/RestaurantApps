const routes = [
  {
    path: '/',
    component: () => import('layouts/Basic.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Auth.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('pages/home.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/Basic.vue'),
    children: [
      {
        path: 'forgotPassword',
        name: 'ForgotPassword',
        component: () => import('pages/ForgotPassword.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/Auth.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('pages/Auth.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('pages/user/Profile.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/editor',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'Editor',
        component: () => import('pages/editor/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Editor Web'
        }
      }
    ]
  },
  {
    path: '/localization',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listLocalization',
        component: () => import('pages/localization/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Sedes'
        }
      },
      {
        path: 'create',
        name: 'createlocalization',
        component: () => import('pages/localization/create.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Crear Sedes'
        }
      },
      {
        path: 'show',
        name: 'showlocalization',
        component: () => import('pages/localization/show.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Visualizar Sedes'
        }
      }
    ]
  },
  {
    path: '/menu',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'categorias',
        name: 'Categorias',
        component: () => import('pages/menu/categorias.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Categorias'
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('pages/menu/menu.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Menu'
        }
      },
      {
        path: 'promo',
        name: 'Promo',
        component: () => import('pages/menu/promociones.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Promo'
        }
      },
      {
        path: 'options',
        name: 'Options',
        component: () => import('pages/menu/options.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Opciones'
        }
      },
      {
        path: 'optionsconf',
        name: 'options_Config',
        component: () => import('pages/menu/optionsConf.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Configuracion de Opciones'
        }
      }
    ]
  },
  {
    path: '/clients',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listClients',
        component: () => import('pages/clients/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Clientes'
        }
      },
      {
        path: 'create',
        name: 'createClient',
        component: () => import('pages/clients/create.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Crear clientes'
        }
      },
      {
        path: 'show',
        name: 'showClient',
        component: () => import('pages/clients/show.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Visualizar Clientes'
        }
      }
    ]
  },
  {
    path: '/orders',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listOrders',
        component: () => import('pages/orders/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Ordenes'
        }
      },
      {
        path: 'create',
        name: 'createOrders',
        component: () => import('pages/orders/create.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Crear Ordenes'
        }
      },
      {
        path: 'show',
        name: 'showOrders',
        component: () => import('pages/orders/show.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Visualizar Ordenes'
        }
      }
    ]
  },
  {
    path: '/payments',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listpayments',
        component: () => import('pages/payments/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Pagos'
        }
      },
      {
        path: 'show',
        name: 'showPayments',
        component: () => import('pages/payments/show.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Visualizar Pagos'
        }
      }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listusers',
        component: () => import('pages/users/index.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Usuarios'
        }
      },
      {
        path: 'show',
        name: 'showUsers',
        component: () => import('pages/users/show.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Visualizar Usuarios'
        }
      }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('pages/settings/schedule.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Horarios de sedes'
        }
      },
      {
        path: 'paymentServ',
        name: 'paymentServ',
        component: () => import('pages/settings/paymentServ.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Pagos y Servicios'
        }
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('pages/settings/chat.vue'),
        meta: {
          requiresAuth: true,
          nombre: 'Chat'
        }
      }
    ]
  }
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
