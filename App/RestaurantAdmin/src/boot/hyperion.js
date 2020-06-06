import HyperionSocketClient from '@eosrio/hyperion-stream-client'

export default ({ router, store, Vue }) => {
  const config = process.env.environments.HYPERION_URL
  const client = new HyperionSocketClient(config, { async: false })
  Vue.prototype.$hyp = client
  store.$hyp = client
}
