
const axios = require('axios')
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

  async doSale (amount, ccNum, ccExp, cvv) {
    let postData = {
      'type': 'sale',
      'amount': amount,
      'ccnumber': ccNum,
      'ccexp': ccExp,
      'cvv': cvv,
      'bank': 'CrediCorp',
      'ambiente': localStorage.getItem('amb')
    }

    // Merge together all request options into one object
    Object.assign(postData, this.billing, this.shipping)
    // Make request
    let Message
    const options = {
      // url: window.location.origin + '/transact',
      url: 'http://localhost:5001/restaurant-testnet/us-central1/MakePay',
      method: 'POST',
      data: postData
    }
    console.log('option :', options)
    Message = await axios(options)
    console.log(Message)
    return Message.data
  }
}
