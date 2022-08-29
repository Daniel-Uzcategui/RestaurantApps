export const config = ({ config }) => config
export const configurations = ({ configurations }) => configurations
export const paymentServ = ({ paymentServ }) => paymentServ
export const chat = ({ chat }) => chat
export const menucfg = ({ menucfg }) => menucfg
export const rates = ({ rates }) => rates
export const menuDispType = ({ menuDispType }) => menuDispType
export const themecfg = ({ themecfg }) => themecfg
export const manifest = ({ manifest }) => manifest
export const leftDrawerOp = ({ leftDrawerOp }) => leftDrawerOp
export const leftDrawerCatOp = ({ leftDrawerCatOp }) => leftDrawerCatOp
export const searchBarState = ({ searchBarState }) => searchBarState
export const metamani = ({ manifest }) => {
  let e = manifest
  let obj = {}
  obj.title = e?.name
  obj.meta = {}
  obj.meta.title = {}
  obj.meta.title.name = 'title'
  obj.meta.title.content = e?.name
  obj.meta.description = {}
  obj.meta.description.name = 'description'
  obj.meta.description.content = e?.description
  obj.meta.keywords = {}
  obj.meta.keywords.name = 'keywords'
  obj.meta.keywords.content = e?.description
  obj.meta.robots = { name: 'robots', content: 'index, follow' }
  obj.meta.language = { name: 'language', content: 'Spanish' }
  obj.meta.equiv = { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
  if (e?.icons) {
    obj.link = {
      favicon: { rel: 'shortcut icon', type: 'image/ico', href: e.icons.favicon },
      '128x128': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon128x128 },
      '192x192': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon192x192 },
      '256x256': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon256x256 },
      '512x512': { rel: 'shortcut icon', type: 'image/png', href: e.icons.icon512x512 }
    }
  }
  return obj
}
