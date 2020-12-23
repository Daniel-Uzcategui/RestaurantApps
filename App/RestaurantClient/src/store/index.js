import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

import createPersistedState from 'vuex-persistedstate'
import createCache from 'vuex-cache'
import SecureLS from 'secure-ls'
var ls = new SecureLS({ isCompression: false })

import auth from './auth'
import user from './user'
import menu from './menu'
import client from './client'
import order from './order'
import address from './address'
import localization from './localization'
import config from './config'
import editor from './editor'
import transactions from './transactions'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    plugins: [
      createPersistedState({
        key: 'ott-token',
        storage: {
          getItem: (key) => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: (key) => ls.remove(key)
        }
      }),
      createCache({ timeout: 10000 })
    ],
    modules: {
      address,
      auth,
      user,
      menu,
      client,
      order,
      localization,
      config,
      editor,
      transactions
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
