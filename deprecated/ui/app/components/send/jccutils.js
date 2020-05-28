import { JcExchange, JcConfig } from 'jcc_rpc'
import JCCExchange from "jcc_exchange";
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'


class Jccutils {
  jccInstance
  // eslint-disable-next-line no-useless-constructor
  constructor () {
    this.jccInstance = this.getJccInstance()
  }

  async getBalance (address) {
    let jcc = await this.jccInstance
    if(!jcc.hosts){
      this.jccInstance = this.getJccInstance()
      jcc = await this.jccInstance
    }
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
    let jcc = await this.jccInstance
    if(!jcc.hosts){
      this.jccInstance = this.getJccInstance()
      jcc = await this.jccInstance
    }
    const resutl = await jcc.getHistoricPayments(address)
    return resutl
  }

  async getHistoricTransactions (address, ledger, seq) {
    let jcc = await this.jccInstance
    if(!jcc.hosts){
      this.jccInstance = this.getJccInstance()
      jcc = await this.jccInstance
    }
    const resutl = await jcc.getHistoricTransactions(address)
    return resutl
  }

  async getOrders (address) {
    let jcc = await this.jccInstance
    if(!jcc.hosts){
      this.jccInstance = this.getJccInstance()
      jcc = await this.jccInstance
    }
    const resutl = await jcc.getOrders(address,1)
    return resutl
  }

  async cancelOrder (address,orderSequence,pwd) {
    const hosts = await this.getExHosts()
    const inst = new JingchangWallet(JingchangWallet.get(), true, false)
    let key = await inst.getSecretWithAddress(pwd, address)
    JCCExchange.init(hosts, 443, true);
    const hash = await JCCExchange.cancelOrder(address, key, orderSequence);
    return hash
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

  async getExHosts () {
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
  return exhosts
  }
}

module.exports = Jccutils

