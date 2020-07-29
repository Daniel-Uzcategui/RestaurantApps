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
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
