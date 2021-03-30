const fs = require('fs-extra')
const cheerio = require('cheerio')
fs.readFile('./dist/pwa/index.html', 'utf8', (err, data) => {
  let html = data
  let $ = cheerio.load(html)
  $('[rel=manifest]').attr('href', 'getmanifest.json')
  let nomani = $.html()
  fs.writeFile('./dist/pwa/index.html', nomani, 'utf8', () => { console.log('getmanifest ready') })
  console.error(err)
})
