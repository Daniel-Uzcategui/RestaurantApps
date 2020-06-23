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
    path: '/localization',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'listLocalization',
        component: () => import('pages/localization/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'create',
        name: 'createlocalization',
        component: () => import('pages/localization/create.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'show',
        name: 'showlocalization',
        component: () => import('pages/localization/show.vue'),
        meta: {
          requiresAuth: true
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
          requiresAuth: true
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('pages/menu/menu.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'extras',
        name: 'Extras',
        component: () => import('pages/menu/extras.vue'),
        meta: {
          requiresAuth: true
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
          requiresAuth: true
        }
      },
      {
        path: 'create',
        name: 'createClient',
        component: () => import('pages/clients/create.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'show',
        name: 'showClient',
        component: () => import('pages/clients/show.vue'),
        meta: {
          requiresAuth: true
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
          requiresAuth: true
        }
      },
      {
        path: 'create',
        name: 'createOrders',
        component: () => import('pages/orders/create.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'show',
        name: 'showOrders',
        component: () => import('pages/orders/show.vue'),
        meta: {
          requiresAuth: true
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
          requiresAuth: true
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
          requiresAuth: true
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
