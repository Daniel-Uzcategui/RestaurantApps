const routes = [
  {
    path: '/',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/home.vue')
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
        component: () => import('pages/home.vue')
      },
      {
        path: 'findus',
        name: 'findUs',
        component: () => import('pages/findus.vue')
      }
    ]
  },
  {
    path: '/pg',
    component: () => import('layouts/User.vue')
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
        path: 'rewards',
        name: 'Rewards',
        component: () => import('pages/user/Rewards.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'address',
        name: 'Address',
        component: () => import('pages/user/address.vue'),
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
        path: 'menu',
        name: 'Menu',
        component: () => import('pages/menu/menu.vue')
      },
      {
        path: 'index',
        name: 'index',
        component: () => import('pages/menu/index.vue')
      }
    ]
  },
  {
    path: '/test',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'payout',
        name: 'test',
        component: () => import('pages/testPayout.vue')
      }
    ]
  },
  {
    path: '/cart',
    component: () => import('layouts/User.vue'),
    children: [
      {
        path: 'index',
        name: 'carrito',
        component: () => import('pages/cart/index.vue'),
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
        name: 'indexord',
        component: () => import('pages/orders/index.vue'),
        meta: {
          requiresAuth: true
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
