import layout from 'layouts/User.vue'
import Home from 'pages/home.vue'
import auth from 'pages/Auth.vue'
import Menu from 'pages/menu/menu.vue'
import MenuIndex from 'pages/menu/index.vue'
const routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '',
        component: Home
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/user/dashboard.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'findus',
        name: 'findUs',
        component: () => import('pages/findus.vue')
      },
      {
        path: 'debit',
        name: 'debit',
        component: () => import('components/payment/debit.vue')
      }
    ]
  },
  {
    path: '/pg',
    component: layout
  },
  {
    path: '/auth',
    component: layout,
    children: [
      {
        path: 'forgotPassword',
        name: 'ForgotPassword',
        component: () => import('pages/ForgotPassword.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: auth
      },
      {
        path: 'register',
        name: 'Register',
        component: auth
      }
    ]
  },
  {
    path: '/user',
    component: layout,
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
    component: layout,
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: Menu
      },
      {
        path: 'index',
        name: 'index',
        component: MenuIndex,
        props: route => ({ query: route.query.q, queryprod: route.query.t, qprodtype: route.query.j })
      }
    ]
  },
  {
    path: '/test',
    component: layout,
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
    component: layout,
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
    component: layout,
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
