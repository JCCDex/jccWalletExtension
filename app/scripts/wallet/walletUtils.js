const {jtWallet,ethWallet,moacWallet,rippleWallet,callWallet,stmWallet} = require('jcc_wallet');
const JingtumWallet = require('jcc_jingtum_base_lib').Wallet
const WalletTypes = require('../constants/walletType-constants')
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
const walletUtils = {

    checkSecretByType (secret,WalletType){
    switch(WalletType){
        case WalletTypes.JINGTUM:
            return jtWallet.isValidSecret(secret);
        case WalletTypes.ETH:
            return ethWallet.isValidSecret(secret);
        case WalletTypes.MOAC:
            return moacWallet.isValidSecret(secret);;
        case WalletTypes.RIPPLE:
            return rippleWallet.isValidSecret(secret);
        case WalletTypes.CALL:
            return callWallet.isValidSecret(secret);
        case WalletTypes.STM:
            return stmWallet.isValidSecret(secret);
        default:
            throw(new Error("checkSecretByType",type+" is not support"))
      }
    },

    checkAddressByType (address,WalletType){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jtWallet.isValidAddress(address);
            case WalletTypes.ETH:
                return ethWallet.isValidAddress(address);
            case WalletTypes.MOAC:
                return moacWallet.isValidAddress(address);;
            case WalletTypes.RIPPLE:
                return rippleWallet.isValidAddress(address);
            case WalletTypes.CALL:
                return callWallet.isValidAddress(address);
            case WalletTypes.STM:
                return stmWallet.isValidAddress(address);
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    },

    async createWalletByType (WalletType){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jtWallet.createWallet();
            case WalletTypes.ETH:
                return ethWallet.createWallet();
            case WalletTypes.MOAC:
                return moacWallet.createWallet();;
            case WalletTypes.RIPPLE:
                return rippleWallet.createWallet();
            case WalletTypes.CALL:
                return callWallet.createWallet();
            case WalletTypes.STM:
                return stmWallet.createWallet();
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    },

    getAddress (WalletType,secret){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jtWallet.getAddress(secret);
            case WalletTypes.ETH:
                return ethWallet.getAddress(secret);
            case WalletTypes.MOAC:
                return moacWallet.getAddress(secret);;
            case WalletTypes.RIPPLE:
                return rippleWallet.getAddress(secret);
            case WalletTypes.CALL:
                return callWallet.getAddress(secret);
            case WalletTypes.STM:
                return stmWallet.getAddress(secret);
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    },


    //这里粗暴了一把，每次创建直接创建 一个 jingchangwallet 按照输入的密码，只保存一个钱包。
    //其实只是个keystore 创建 工具，影响不大
    //后面可以 按weidex的逻辑进行进一步的修改
    async generateKeystore(type,secret,password){
        const keypairs = await JingtumWallet.generate()
        //初始化一个 keystore list 
        let init = await JingchangWallet.generate(password, keypairs.secret)
        let jcWallet = new JingchangWallet(init)
        switch(type){
            case WalletTypes.ETH:
                return await jcWallet.importSecret(secret, password, type, (secret)=>{
                    return ethWallet.getAddress(secret);
                  })
            case WalletTypes.JINGTUM:
                return await jcWallet.importSecret(secret, password, type, (secret)=>{
                    return jtWallet.getAddress(secret);
                })
            default:
                throw(new Error("this type is not support"))
 
        }
    }
}

module.exports = walletUtils