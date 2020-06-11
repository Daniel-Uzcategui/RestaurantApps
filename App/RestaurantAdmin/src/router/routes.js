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
        name: 'Index',
        component: () => import('pages/localization/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('pages/localization/create.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'show',
        name: 'Show',
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
