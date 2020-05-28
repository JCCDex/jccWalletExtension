const {
  addCurrencies,
  conversionGTE,
} = require('../../conversion-util')

import { JcExchange, JcConfig } from 'jcc_rpc'

module.exports = {
  getBalance,
  isBalanceSufficient,
  removeLeadingZeroes,
}

async function getBalance (address) {
  const jccInstance = await getJccInstance()
  const balResult = await jccInstance.getBalances(address)
  let bal = 0
  if (balResult.result === false || balResult.code === '3301') {
    return bal
  }
  bal = balResult.data
 // const freezed = result.data.freezed
 // const reserve = result.data.reserve
  return bal
}

async function getJccInstance () {
  const hosts = ['jccdex.cn', 'weidex.vip']
  const port = 443
  const https = true
  const instance = await new JcConfig(hosts, port, https)
  this.defaultMaxListeners = 20
  const res = await instance.getConfig()
// import { JcExchange } from 'jcc_rpc'
const exhosts = res.exHosts
 const excport = 443
 const exhttps = true
const jccInstance = await new JcExchange(exhosts, excport, exhttps)
return jccInstance
}

function isBalanceSufficient ({
  amount = '0x0',
  amountConversionRate = 1,
  balance = '0x0',
  conversionRate = 1,
  primaryCurrency,
}) {
  const totalAmount = addCurrencies(amount, gasTotal, {
    aBase: 16,
    bBase: 16,
    toNumericBase: 'hex',
  })

  const balanceIsSufficient = conversionGTE(
    {
      value: balance,
      fromNumericBase: 'hex',
      fromCurrency: primaryCurrency,
      conversionRate,
    },
    {
      value: totalAmount,
      fromNumericBase: 'hex',
      conversionRate: Number(amountConversionRate) || conversionRate,
      fromCurrency: primaryCurrency,
    },
  )

  return balanceIsSufficient
}

function removeLeadingZeroes (str) {
  return str.replace(/^0*(?=\d)/, '')
}
