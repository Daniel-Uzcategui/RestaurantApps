import layout from 'layouts/User.vue'
import Home from 'pages/home.vue'
import auth from 'pages/Auth.vue'
import Menu from 'pages/menu/menu.vue'
import MenuIndex from 'pages/menu/index.vue'
import IndexOrd from 'pages/orders/index.vue'
import Cart from 'pages/cart/index.vue'
import FindUs from 'pages/findus.vue'
import Debit from 'components/payment/debit.vue'
import ForgotPassword from 'pages/ForgotPassword.vue'
import Dashboard from 'pages/user/dashboard.vue'
import Rewards from 'pages/user/Rewards.vue'
import Address from 'pages/user/address.vue'
import Wallet from 'pages/user/wallet.vue'
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
        component: Dashboard,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'findus',
        name: 'findUs',
        component: FindUs
      },
      {
        path: 'debit',
        name: 'debit',
        component: Debit
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
        component: ForgotPassword
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
        component: Rewards,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: Wallet,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'address',
        name: 'Address',
        component: Address,
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
        props: route => ({ query: route.query.q, queryprod: route.query.t, qprodtype: route.query.j, querycat: route.query.c })
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
        component: Cart,
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
        component: IndexOrd,
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
