const routes = [{
  path: '/',
  component: () =>
            import ('layouts/Basic.vue'),
  children: [{
    path: '',
    component: () =>
                    import ('pages/Auth.vue')
  },
  {
    path: 'ambientes',
    component: () =>
                    import ('pages/ambientes/index.vue')
  }
  ]
},
{
  path: '/',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'home',
    name: 'Home',
    component: () =>
                    import ('pages/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: 'quick',
    name: 'quick',
    component: () =>
                    import ('pages/quickSetup/quick.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ]
},
{
  path: '/guide',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'intro',
    name: 'intro',
    component: () =>
                    import ('pages/quickSetup/quick.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: 'addopts',
    name: 'AgregarOpcionesAProds',
    component: () =>
                    import ('pages/quickSetup/quickAddOpts.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: 'quicktheme',
    name: 'quickTheme',
    component: () =>
                    import ('pages/quickSetup/quickTheme.vue'),
    meta: {
      requiresAuth: true
    }
  }
  ]
},
{
  path: '/auth',
  component: () =>
            import ('layouts/Basic.vue'),
  children: [{
    path: 'forgotPassword',
    name: 'ForgotPassword',
    component: () =>
                    import ('pages/ForgotPassword.vue')
  },
  {
    path: 'login',
    name: 'Login',
    component: () =>
                    import ('pages/Auth.vue')
  },
  {
    path: 'register',
    name: 'Register',
    component: () =>
                    import ('pages/Auth.vue')
  }
  ]
},
{
  path: '/user',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'profile',
    name: 'UserProfile',
    component: () =>
                import ('pages/user/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  }]
},
{
  path: '/editor',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'Editor',
    component: () =>
                    import ('pages/editor/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Editor Web'
    }
  },
  {
    path: 'index2',
    name: 'Editor',
    component: () =>
                    import ('pages/editor/index2.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Editor Web'
    }
  }
  ]
},
{
  path: '/testing',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'index',
    component: () =>
                import ('components/menu/photomulti.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Editor Web'
    }
  }]
},
{
  path: '/localization',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listLocalization',
    component: () =>
                    import ('pages/localization/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Sedes'
    }
  },
  {
    path: 'create',
    name: 'createlocalization',
    component: () =>
                    import ('pages/localization/create.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Crear Sedes'
    }
  },
  {
    path: 'show',
    name: 'showlocalization',
    component: () =>
                    import ('pages/localization/show.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Sedes'
    }
  }
  ]
},
{
  path: '/menu',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'categorias',
    name: 'Categorias',
    component: () =>
                    import ('pages/Menu/Categorias.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Categorias'
    }
  },
  {
    path: 'menu',
    name: 'Menu',
    component: () =>
                    import ('pages/Menu/menuAdm.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Menu'
    }
  },
  {
    path: 'rewards',
    name: 'Rewards',
    component: () =>
                    import ('pages/Menu/rewards.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'rewards'
    }
  },
  {
    path: 'coupons',
    name: 'Coupons',
    component: () =>
                    import ('pages/Menu/coupons.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Coupons'
    }
  },
  {
    path: 'promo',
    name: 'Promo',
    component: () =>
                    import ('pages/Menu/promociones.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Promo'
    }
  },
  {
    path: 'options',
    name: 'Options',
    component: () =>
                    import ('pages/Menu/options.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Opciones'
    }
  },
  {
    path: 'groupoptions',
    name: 'GroupOptions',
    component: () =>
                    import ('pages/Menu/gruposOpt.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'GroupOptions'
    }
  },
  {
    path: 'menufilters',
    name: 'menu_filters',
    component: () =>
                    import ('pages/Menu/menufilters.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'menufilters'
    }
  },
  {
    path: 'optionsconf',
    name: 'options_Config',
    component: () =>
                    import ('pages/Menu/optionsConf.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Configuracion de Opciones'
    }
  }
  ]
},
{
  path: '/clients',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listClients',
    component: () =>
                    import ('pages/clients/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Clientes'
    }
  },
  {
    path: 'create',
    name: 'createClient',
    component: () =>
                    import ('pages/clients/create.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Crear clientes'
    }
  },
  {
    path: 'show',
    name: 'showClient',
    component: () =>
                    import ('pages/clients/show.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Clientes'
    }
  }
  ]
},
{
  path: '/corporativo',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listClientsCorp',
    component: () =>
                    import ('pages/ClientsCorporativo/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Corporativo'
    }
  }

  ]
},
{
  path: '/corporativo/order',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'orders',
    name: 'listClientsCorp2',
    component: () =>
                    import ('pages/ClientsCorporativo/orders/orders.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Corporativo Order'
    }
  }

  ]
},
{
  path: '/corporativo/order',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'orders',
    name: 'listClientsCorp2',
    component: () =>
                    import ('pages/ClientsCorporativo/orders/orders.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Corporativo Order'
    }
  },
  {
    path: 'orders2',
    name: 'listClientsCorp3',
    component: () =>
                    import ('pages/ClientsCorporativo/branches/orders.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Branches Order'
    }
  }

  ]
},
{
  path: '/corporativo/branches',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index2',
    name: 'listClientsBranches',
    component: () =>
                    import ('pages/ClientsCorporativo/index2.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Corporativo2'
    }
  }

  ]
},

{
  path: '/orders',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listOrders',
    component: () =>
                    import ('pages/orders/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Ordenes'
    }
  },
  {
    path: 'create',
    name: 'createOrders',
    component: () =>
                    import ('pages/orders/create.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Crear Ordenes'
    }
  },
  {
    path: 'show',
    name: 'showOrders',
    component: () =>
                    import ('pages/orders/show.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Ordenes'
    }
  }
  ]
},
{
  path: '/vendedor',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listOrders',
    component: () =>
                import ('pages/clients/Vendedores/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Vendedores'
    }
  }]
},
{
  path: '/encomienda',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listOrders',
    component: () =>
                import ('pages/jetes/orders.vue')

  }]
},
{
  path: '/encomienda/form',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listOrders',
    component: () =>
                import ('pages/jetes/encomienda.vue')

  }]
},
{
  path: '/payments',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listpayments',
    component: () =>
                    import ('pages/payments/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Pagos'
    }
  },
  {
    path: 'show',
    name: 'showPayments',
    component: () =>
                    import ('pages/payments/show.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Pagos'
    }
  },
  {
    path: 'transactions',
    name: 'transaction',
    component: () =>
                    import ('pages/payments/transactions.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Pagos con medios de pago'
    }
  }
  ]
},
{
  path: '/users',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'index',
    name: 'listusers',
    component: () =>
                    import ('pages/users/index.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Usuarios'
    }
  },
  {
    path: 'create',
    name: 'createUsers',
    component: () =>
                    import ('pages/users/create.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'create Usuarios'
    }
  },
  {
    path: 'show',
    name: 'showUsers',
    component: () =>
                    import ('pages/users/show.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Visualizar Usuarios'
    }
  }
  ]
},
{
  path: '/settings',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'general',
    name: 'general',
    component: () =>
                    import ('pages/settings/general.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Configuración General'
    }
  },
  {
    path: 'schedule',
    name: 'schedule',
    component: () =>
                    import ('pages/settings/schedule.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Horarios de sedes'
    }
  },
  {
    path: 'paymentServ',
    name: 'paymentServ',
    component: () =>
                    import ('pages/settings/paymentServ.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Servicios de Pagos'
    }
  },
  {
    path: 'services',
    name: 'services',
    component: () =>
                    import ('pages/settings/Services.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Servicios'
    }
  },
  {
    path: 'chat',
    name: 'chat',
    component: () =>
                    import ('pages/settings/chat.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Chat'
    }
  },
  {
    path: 'rate',
    name: 'rate',
    component: () =>
                    import ('pages/settings/rate.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Tasa de Cambio'
    }
  }
  ]
},
{
  path: '/reports',
  component: () =>
            import ('layouts/User.vue'),
  children: [{
    path: 'generalSales',
    name: 'generalSales',
    component: () =>
                    import ('pages/reports/generalSales.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Ventas Generales'
    }
  },
  {
    path: 'locationSales',
    name: 'locationSales',
    component: () =>
                    import ('pages/reports/locationSales.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Ventas x Sedes'
    }
  },
  {
    path: 'rcategories',
    name: 'rcategories',
    component: () =>
                    import ('pages/reports/rcategories.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Categorias'
    }
  },
  {
    path: 'rproducts',
    name: 'products',
    component: () =>
                    import ('pages/reports/rproducts.vue'),
    meta: {
      requiresAuth: true,
      nombre: 'Productos'
    }
  }
  ]
}
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () =>
        import ('pages/Error404.vue')
})

export default routes
