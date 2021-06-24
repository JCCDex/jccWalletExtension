const ObservableStore = require('obs-store')
const extend = require('xtend')

//keystore 的本地化存储，通过配置文件动态增加不同链的keystore 支持

/**
 *  @typedef {Object} KeystoresController
 *  @param {object} opts Overrides the defaults for the initial state of this.store
 *  @property {object} store The stored object, stored in local storage
 *  @property {object} store.keystores a array to stored keystore by type
 * 
 */
class KeystoresController {

    constructor (opts = {}) {
        const initState = extend({
            keystores
        }, opts.initState)

        this.store = new ObservableStore(initState)

    }

    setKeystore(type,keystore){
        let keystores={};
        if(!this.store.getState().keystores[type]){
            keystores[type]=[keystore];
        }else{
          keystores = JSON.parse(JSON.stringify(this.store.getState().keystores))
          keystores[type].push(keystore);
        }
        this.store.updateState({keystores})
    }

    getKeystore(type,address){
        if(!this.store.getState().keystores[type]){
            return null
        }

        for(let key in this.store.getState().keystores[type]){
            if(key.wallets.address === address)
            return key;
        }
    }

    removeKeystore(type,address){
        if(!this.store.getState().keystores[type]){
            return null
        }
        let keystores={};
        keystores = JSON.parse(JSON.stringify(this.store.getState().keystores))
        for(let key in keystores){
            if(key.wallets.address === address){
                keystores.remove(key)
            }
            return key;
        }
        this.store.updateState({keystores})
    }

}
module.exports = KeystoresController