
const axios = require('axios')
const querystring = require('querystring')

export default class CreditCorp {
  setSecurity (securityKey) {
    // Validate that passed in information contains valid keys
    const validsecurityKey = ['security_key']

    for (let key in securityKey) {
      if (!validsecurityKey.includes(key)) {
        throw new Error(`Invalid key provided in billingInformation. '${key}'
            is not a valid billing parameter.`)
      }
    }
    this.securityKey = securityKey
  }
  setBilling (billingInformation) {
    // Validate that passed in information contains valid keys
    const validBillingKeys = ['first_name', 'last_name', 'company', 'address1',
      'address2', 'city', 'state', 'zip', 'country', 'phone', 'fax', 'email']

    for (let key in billingInformation) {
      if (!validBillingKeys.includes(key)) {
        throw new Error(`Invalid key provided in billingInformation. '${key}'
            is not a valid billing parameter.`)
      }
    }

    this.billing = billingInformation
  }

  setShipping (shippingInformation) {
    // Validate that passed in information contains valid keys
    const validShippingKeys = [
      'shipping_first_name', 'shipping_last_name', 'shipping_company',
      'shipping_address1', 'address2', 'shipping_city', 'shipping_state',
      'shipping_zip', 'shipping_country', 'shipping_email'
    ]

    for (let key in shippingInformation) {
      if (!validShippingKeys.includes(key)) {
        throw new Error(`Invalid key provided in shippingInformation. '${key}'
            is not a valid shipping parameter.`)
      }
    }

    this.shipping = shippingInformation
  }

  doSale (amount, ccNum, ccExp, cvv) {
    let postData = {
      'type': 'sale',
      'amount': amount,
      'ccnumber': ccNum,
      'ccexp': ccExp,
      'cvv': cvv
    }

    // Merge together all request options into one object
    Object.assign(postData, this.billing, this.shipping, this.securityKey)

    // Make request
    let respuesta
    postData = querystring.stringify(postData)

    const options = {
      url: 'https://secure.nmi.com/api/transact.php',
      method: 'POST',
      data: postData
    }
    console.log('option :', options)
    respuesta = axios(options)
    respuesta.then((successMessage) => {
      console.log('response Mensaje bank ', successMessage.data)
      this.responseBank = successMessage.data
      return successMessage.data
    })
  }
}
