import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
const JingtumWallet = require('jcc_jingtum_base_lib').Wallet

//这是 jingchang wallet的逻辑 暂时弃用
const accountImporter = {

   importAccount (strategy, args) {
    try {
      const importer = this.strategies[strategy]
      const address = importer.apply(null, args)
      return address
    } catch (e) {
      throw e
    }
  },

  strategies: {
     'Private Key': (privateKey, password) => {
      if (!privateKey) {
        throw new Error('Cannot import an empty key.')
      }
      if (!JingtumWallet.isValidSecret(privateKey, 'swt')) {
        throw new Error('Cannot import invalid private key.')
      }
      const result = JingchangWallet.generate(password, privateKey).then((wallet) => {
        if (!JingchangWallet.get()) {
          const inst = new JingchangWallet(wallet, true, true)
          inst.setJingchangWallet(wallet)
          JingchangWallet.save(wallet)
          const address = wallet.wallets[0].address
          return address
        } else {
          const inst = JingchangWallet.get()
          inst.wallets.push(wallet.wallets[0])
          JingchangWallet.save(inst)
          const address = wallet.wallets[0].address
          return address
        }
    })

      return Promise.resolve(result)
    },
    'JSON File': (input) => {
      const keystore = JSON.parse(input)
      if (!JingchangWallet.isValid(keystore)) {
        throw new Error('Cannot import invalid wallet.')
      }
      let address
      if (!JingchangWallet.get()) {
        const inst = new JingchangWallet(keystore, true, true)
        inst.setJingchangWallet(keystore)
        JingchangWallet.save(keystore)
        address = keystore.wallets[0].address
      } else {
        const inst = JingchangWallet.get()
        inst.wallets.push(keystore.wallets[0])
        JingchangWallet.save(inst)
        address = keystore.wallets[0].address
      }
      return Promise.resolve(address)
    },
  },
}

module.exports = accountImporter
