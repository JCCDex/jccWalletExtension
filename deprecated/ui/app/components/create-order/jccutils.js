import { JcExchange, JcConfig } from 'jcc_rpc'

class Jccutils {
  jccInstance
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    this.jccInstance = this.getJccInstance()
  }

  async getBalance (address) {
    const jcc = await this.jccInstance
    const balResult = await jcc.getBalances(address)
    let bal = 0
    if (balResult.result === false || balResult.code === '3301') {
      return bal
    }
    bal = balResult.data
   // const freezed = result.data.freezed
   // const reserve = result.data.reserve
    return bal
  }

  async getHistoricPayments (address, ledger, seq) {
    const jcc = await this.jccInstance
    const resutl = await jcc.getHistoricPayments(address)
    return resutl
  }

  async getJccInstance () {
    const hosts = ['jccdex.cn', 'weidex.vip']
    const port = 443
    const https = true
    const instance = await new JcConfig(hosts, port, https)
    let res = await instance.getConfig()
  // import { JcExchange } from 'jcc_rpc'
  let exhosts = res.exHosts
  if (!res.exHosts) {
    res = await instance.getConfig()
    exhosts = res.exHosts
  }
   const excport = 443
   const exhttps = true
  const jccInstance = await new JcExchange(exhosts, excport, exhttps)
  return jccInstance
  }
}

module.exports = Jccutils

