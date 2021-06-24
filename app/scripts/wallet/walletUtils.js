const jccwallet = require('jcc_wallet');
const JingtumWallet = require('jcc_jingtum_base_lib').Wallet
const WalletTypes = require('../constants/walletType-constants')


const walletUtils = {

    checkSecretByType (secret,WalletType){
    switch(WalletType){
        case WalletTypes.JINGTUM:
            return jccwallet.jtWallet.isValidSecret(secret);
        case WalletTypes.ETH:
            return jccwallet.ethWallet.isValidSecret(secret);
        case WalletTypes.MOAC:
            return jccwallet.moacWallet.isValidSecret(secret);;
        case WalletTypes.RIPPLE:
            return jccwallet.rippleWallet.isValidSecret(secret);
        case WalletTypes.CALL:
            return jccwallet.callWallet.isValidSecret(secret);
        case WalletTypes.STM:
            return jccwallet.stmWallet.isValidSecret(secret);
        default:
            throw(new Error("checkSecretByType",type+" is not support"))
      }
    },

    checkAddressByType (address,WalletType){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jccwallet.jtWallet.isValidAddress(address);
            case WalletTypes.ETH:
                return jccwallet.ethWallet.isValidAddress(address);
            case WalletTypes.MOAC:
                return jccwallet.moacWallet.isValidAddress(address);;
            case WalletTypes.RIPPLE:
                return jccwallet.rippleWallet.isValidAddress(address);
            case WalletTypes.CALL:
                return jccwallet.callWallet.isValidAddress(address);
            case WalletTypes.STM:
                return jccwallet.stmWallet.isValidAddress(address);
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    },

    createWalletByType (WalletType){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jccwallet.jtWallet.createWallet();
            case WalletTypes.ETH:
                return jccwallet.ethWallet.createWallet();
            case WalletTypes.MOAC:
                return jccwallet.moacWallet.createWallet();;
            case WalletTypes.RIPPLE:
                return jccwallet.rippleWallet.createWallet();
            case WalletTypes.CALL:
                return jccwallet.callWallet.createWallet();
            case WalletTypes.STM:
                return jccwallet.stmWallet.createWallet();
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    },

    getAddress (WalletType,secret){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jccwallet.jtWallet.getAddress(secret);
            case WalletTypes.ETH:
                return jccwallet.ethWallet.getAddress(secret);
            case WalletTypes.MOAC:
                return jccwallet.moacWallet.getAddress(secret);;
            case WalletTypes.RIPPLE:
                return jccwallet.rippleWallet.getAddress(secret);
            case WalletTypes.CALL:
                return jccwallet.callWallet.getAddress(secret);
            case WalletTypes.STM:
                return jccwallet.stmWallet.getAddress(secret);
            default:
                throw(new Error("checkSecretByType",type+" is not support"))
          }
    }

    
}

module.exports = walletUtils