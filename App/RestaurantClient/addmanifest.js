const fs = require('fs-extra')
const cheerio = require('cheerio')
const admin = require('firebase-admin')
const yargs = require('yargs')
const argv = yargs
  .command('deploy', 'execute deploy command', {
    year: {
      description: 'This argument needs options such as [-p, -s, -w]',
      alias: 'y',
      type: 'number'
    }
  })
  .showHelpOnFail(true)
  .option('production', {
    alias: 'p',
    description: 'Deploy to all, not recommended',
    type: 'boolean'
  })
  .option('development', {
    alias: 'd',
    description: 'Deploy to Staging servers',
    type: 'boolean'
  })
  .help()
  .alias('help', 'h')
  .demandCommand(1, '')
  .argv
const credentialdev = {
  'type': 'service_account',
  'project_id': 'restaurant-testnet',
  'private_key_id': 'c94bd78bfc1f58706e273104e21c95a2c12d4543',
  'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCK0A/gyEnScapX\nlqylTUMABg+BDQdLV+ZSnkJTBkKGNOAmcnb7MhIGpB8RAt0z+/GWUT6k4qseNRVx\nepv2b9unHB/wEYHxMiomu1naRYL3WU3ttya0F+tttmZnM5k5ZkNfhvoEU9FyPAZY\n/3uWTJ5C68JoOsZf9O4h421FhWVf54m2ighLH+y1brZpg4Wzn5iY722hQiA2n8TO\nwjx6hKznHRmmVyyus0ZJxZKFZM+qHYTG4oEYEksBhw4+yzhrhd6h7CokwRQgwX4X\n6ND4WJpSxOTxm7krZMAvgrxesfSrL+I4BTFZcgxQiF6Haprs7enUJPdEvTe6JYWK\n9eOO63KnAgMBAAECggEAPWZnx5FAWhYN910984Y3zyBfJkGZiuGQDtZS1v+LWGq2\nBTuXVmgg4hAhb7hZGN/lzgwUzgE3GI75c678oqZ6vbGqjNlppUL/sw8m4O3jTr6R\nQkdDluCHsgk+xYJk0adiwLPnDhf3KnTTh/VF+MbeMBKxdMIesh4YYSQEVv54x1Dv\n5WVRwDCb92/t5tYPvF6gyZwHnfVMUAs2C6Itck87BbG91Tf6soyO+JcRwVEBB/o/\nx6uNMZ7IYKyttdWG5tgW5RkkEeFbrfNkBkmCPlVe1dRcwFSpI3IK0OFBSqVuOtRt\nvyRqBzjTDTrBl1SDEGvUFmktoV6y2YHyspvbU1Y3+QKBgQC/7h7m3ZGgMz8jOlME\nLsTLd2+5L0HWprMrJZ0LWeCznlO7aSkjAfXzVywmnE0N30YFTOUDsks5t4XBqe8H\nDBrbWlqFGBQwCPxdwuPtqeGLG6VvMypM88MRnFs+mavdIbo5701obIgP+OF8t4ea\nQRUQ0mdnAxTDI9LPqhY0rH0QLwKBgQC5JqhUJ1UQLbVk0ry1KMvUyit58sN4PGQH\n9T2k/LEn2M5aYDAcAyQB316HQuubeXO2lU5lpRQ87sVGd0GX//wlLREG+09Fp+64\nj5LFtwUNkitvJlm1BRXSWanK3+4e/PN/68KtL5BDjAa+wHrgTlFleNNKwoJwp9G7\nCQc6tbbvCQKBgATQiF3qOPj30CGmGOcF9VHVUSwoD1K/I8d1Thc2zfgzhI4y+SEz\nr2PHUAg364bpjuwbHbOWCWUNQYG2LZTTrOjLv3GPRRJfZ1VCykzv8gR3URMVCX6c\nrswGTBOp7zHA4tcJNbvk3RTpfV6PjAtGjqy5WnavERpED8m9zojLuudpAoGAGFU5\nSB4HMuIe9cowXMqoxyVuw08hW1rsdpNHb7h5+9elfwEnMXdEMy7M+I/V8Q/sIjHL\nJNamKz/iE1m2+Cf/Vk9u7nD2wRvJ5t2Pl4ZvFpKAPNJYdc7eSE/aXbxCSjZKNiSg\n6CvZFNeBR256d6IzVlejxS59ABs+GAuetJuPGCkCgYBoLdToB5SwrVlPrQOotq1h\njcuUyfEDAwYY/0tbOjwjrrsl+/OPMQ8/k7r+RGokiU+weHHH8aD6uAoPXoONIJlY\n/I1vHRT0MyRur3Y9/qZVWD8QSgqb1FOm8m6wtESEL62pA1kA4ZtYOn9Qwoe1Of1s\nxAx4VATbKNmtmSYu/lZfEg==\n-----END PRIVATE KEY-----\n',
  'client_email': 'firebase-adminsdk-k6vqq@restaurant-testnet.iam.gserviceaccount.com',
  'client_id': '115890159153026815416',
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k6vqq%40restaurant-testnet.iam.gserviceaccount.com'
}
const credentialprod = {
  'type': 'service_account',
  'project_id': 'chopzi-production',
  'private_key_id': '016bafa6ce0f5f26de63584fab3f4fab4795d53e',
  'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDN7Rc3NAimWXIy\nH2gt2YaG4B/4wSnODN4af0cajSaSTlrTXLwEGkbKwnngW/uLeY3hcztt9QuhxVV0\n/18TOtIQo7rUr55YLJQa3nqLTG7Ipa1vR7j5yY9XNHMWQKtjd3669bCkI9PwOv02\nTCGa2uh45Ktf3vj59dJp8Y13mKs03VJf37bWfNepHsqbYJvFiPPbYILCemuN8OY2\nAa+NOLZIdJ5TjBwmZeSEK00lgRNdgxq24M8wIOnHbJetH0FW1d4m/JkmLiuBNVTe\nRqeYmaEDIMFFWTOFSudiM/wCpCHGaJhOI5Fy2KhxlQQtKcApzZPjVekRy0smX+x0\n+hHesHlJAgMBAAECggEAFgYlvb53r1zxKPmxcXfqmqnFWZxFLZe0OHbE4srWZX7y\nWVk5daHe0Og4Uz3bOylSuppRsJqs9g4OK/91CnA3z9ZHEODAiXMpGu+RAS15SsXn\ndPehibucNEo0hdyASBjbacEFtaRsUizo8IH3dSG1C9r/FjeZfthi+vg99lzScMqK\nzF/Mtv9lw63GY10kJe06TSzdgjMLJE6JxHmBm6DLT0WkXkZ9IYWFHV/LW7nnmQry\nurUH9ZPpAq3aIQ8tO9LuSpmgevPjoYze3rXeCsBmhbNfQNAd2GoyBlgshqFLAhEq\nvJ5SmSnnj0Sw5F/Pan89/De8GBHPdTm8a9kxSc7+RQKBgQDxZiYvW/kcphSslvDq\neuPrSPfXrpGDvj8RV1u26qUhDyvdesQ7bh1fbZXpgUFQl6viMrdmKLYIc78A4fl0\nCZcupaviX4sq02dZJEr/Mj6xC/hMhZyOmUTvHkkkFCmlb0Z0cBz2jGCPmLvMs/3R\n3p/ZQs8j5U8XxCdSKaf84vaDRQKBgQDaYazaOFbxjBwJ3qbqRj0wliom8+6N3Dcs\nxXlPPFe0mEFcgvTgtdlWoB+9V3xsULWQWUrU/yGqkPW4XJAHLDQiolgnEpdnSwAR\nkHvq/tdvUWt1oL4bxr2loVPFKBwIIPaOjy3jD7jRLFTQecH5xNvhmUcW/ii1L4nC\nzfELRvjcNQKBgDbtR0L/am9aWtnqfmbcD4A52ir5TaLsZu1LM1MrkOc0zIZYqM3d\nAFH2XWYEQxhTaojNgW19Ve4WaB+LS3dbt0ql57Zahw/3ikx+NZJbnGgskRLYVAce\nWNEP0xSigddiumVEHVL8HfyOhCzPx7E5NqX4zakdRCHkQA4x7EdeXTkBAoGAIFoq\nDmYcU0qLeNbYaYqgVAtbEUxAAhomvmY+84MgBywrOrZX6tZl7VRpf1Zvo2hNjaX8\n1RM6/JbfIEHuQHHHA36Dir5RWccdqnx6LzUz21T3k4SNxXWq8Ne2nlWz2Wxwumvx\nw1q36Z0kr4HqP8NvQ7u+cWSTyUvSn958oEwSYCUCgYBVltqoibCs4HYLU2JOLjYc\n75CiYSyu3PqmnUXYQjM+Y5r3/4TuH54LAvvaLHxwCIBtGCXYWGQ3X+RM+Dhq+jHb\nDcpcQougbn8Ar4qwP8oJNZYSvyZqRM0xCI+hZIYSAEV/jS3srUlLUWP5/+jRmB4q\nR009l4bH5ZjZx5QLoq0MAg==\n-----END PRIVATE KEY-----\n',
  'client_email': 'firebase-adminsdk-kro6a@chopzi-production.iam.gserviceaccount.com',
  'client_id': '117673672519642125955',
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kro6a%40chopzi-production.iam.gserviceaccount.com'
}
const sdkprod = {
  credential: admin.credential.cert(credentialprod),
  apiKey: 'AIzaSyBFSYXSMhNj5QUpIJ0P5Xaxnito1BJqnrU',
  authDomain: 'chopzi-production.firebaseapp.com',
  projectId: 'chopzi-production',
  storageBucket: 'chopzi-production.appspot.com',
  messagingSenderId: '487244630627',
  appId: '1:487244630627:web:ec089b6d061bfe0e280656',
  measurementId: 'G-1KE2MX27E4'
}
const sdkdev = {
  credential: admin.credential.cert(credentialdev),
  projectId: 'restaurant-testnet',
  appId: '1:895400658847:web:7dbe8942eb438d0f081faa',
  databaseURL: 'https://restaurant-testnet.firebaseio.com',
  storageBucket: 'restaurant-testnet.appspot.com',
  apiKey: 'AIzaSyCQD0XVbvw9CjEShP3Ql3eZwD6wCSuIzR4',
  authDomain: 'restaurant-testnet.firebaseapp.com',
  messagingSenderId: '857639385359'
}
switch (true) {
  case argv.production:
    admin.initializeApp(sdkprod)
    break
  case argv.development:
    admin.initializeApp(sdkdev)
    break
  default:
    process.exit(1)
}
var db = admin.firestore()
fs.readFile('./dist/pwa/index.html', 'utf8', async (err, data) => {
  let html = data
  let $ = cheerio.load(html)
  let script = $('script')
  let src = []
  for (let i of script) {
    typeof i.attribs.src !== 'undefined' && i.attribs.src !== null ? src.push(i.attribs.src) : console.log('null')
  }
  let link = $('[rel="stylesheet"]')
  let links = []
  for (let i of link) {
    typeof i.attribs.href !== 'undefined' && i.attribs.href !== null ? links.push(i.attribs.href) : console.log('null')
  }
  console.log(links)
  let envRef = await db.doc('environment/sources').set({ src: src, stylesheet: links })
  // let nomani = $.html()
  console.log(envRef)
  fs.unlinkSync('./dist/pwa/index.html')
  // fs.writeFile('./dist/pwa/index.html', nomani, 'utf8', () => { console.log('getmanifest ready') })
  console.error(err)
})
