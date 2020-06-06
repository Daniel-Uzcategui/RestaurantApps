import { Api, JsonRpc } from 'eosjs'

const GetBlock = async function () {
  return 1 // get the first block
}
export default ({ store }) => {
  const rpc = new JsonRpc(`${process.env.NETWORK_PROTOCOL}://${process.env.NETWORK_HOST}:${process.env.NETWORK_PORT}`)
  store['$defaultApi'] = new Api({ rpc, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  store['$api'] = {
    GetBlock: GetBlock.bind(store)
  }
}
