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
            console.log("checkSecretByType",WalletType+" is not support")
            return false;
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
                console.log("checkSecretByType",WalletType+" is not support")
                return false;
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
                console.log("checkSecretByType",WalletType+" is not support")
                return false;
          }
    },

    getAddress (WalletType){
        switch(WalletType){
            case WalletTypes.JINGTUM:
                return jccwallet.jtWallet.getAddress();
            case WalletTypes.ETH:
                return jccwallet.ethWallet.getAddress();
            case WalletTypes.MOAC:
                return jccwallet.moacWallet.getAddress();;
            case WalletTypes.RIPPLE:
                return jccwallet.rippleWallet.getAddress();
            case WalletTypes.CALL:
                return jccwallet.callWallet.getAddress();
            case WalletTypes.STM:
                return jccwallet.stmWallet.getAddress();
            default:
                console.log("checkSecretByType",WalletType+" is not support")
                return false;
          }
    }

    
}

module.exports = walletUtils