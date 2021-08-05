import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import auth from './auth'
import user from './user'
import menu from './menu'
import client from './client'
import order from './order'
import payment from './payment'
import address from './address'
import localization from './localization'
import config from './config'
import editor from './editor'
import seller from './seller'
import rider from './rider'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      address,
      auth,
      user,
      menu,
      client,
      rider,
      seller,
      order,
      payment,
      localization,
      config,
      editor
    },
    mutations: {
      ...vuexfireMutations
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
