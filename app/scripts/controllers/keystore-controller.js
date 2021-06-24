const ObservableStore = require('obs-store')
const extend = require('xtend')
//keystore 的本地化存储，通过配置文件动态增加不同链的keystore 支持
//等同于钱包密钥管理，基本上所有的操作都牵扯到授权，而所谓授权 即使用户自己通过 password 取出对应的 密钥
//用户的 password 密钥将不作任何存储

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
            keystores:[]
        }, opts.initState)

        this.store = new ObservableStore(initState)
    }

    setKeystore(keystore){
        let keystores={};
        if(!this.store.getState().keystores){
            keystores=[keystore];
        }else{
          keystores =this.store.getState().keystores
          keystores.push(keystore);
        }
        this.store.updateState({keystores})
        return Promise.resolve(true)
    }

    removeKeystore(address){
        if(!this.store.getState().keystores){
            return null
        }
        
        let keystores = this.store.getState().keystores

        keystores.forEach((item, index, arr)=>{
            if(item[1].address === address ){
              arr.splice(index, 1);
            }
          });
        this.store.updateState({keystores})
        return Promise.resolve(true)
    }

}
module.exports = KeystoresController