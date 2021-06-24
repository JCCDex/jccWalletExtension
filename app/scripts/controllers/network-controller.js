const ObservableStore = require('obs-store')
const EventEmitter = require('events')
const extend = require('xtend')

export const NETWORK_EVENTS = {
    NETWORK_WILL_CHANGE: 'networkWillChange', //开始切换链支持
    NETWORK_DID_CHANGE: 'networkDidChange', //切换链支持结束 
  };

/** 
 * @typedef {Object} NetworkController
 * @param {object} opts Overrides the defaults for the initial state of this.store
 * @property {object} networks ,  {"jingtum":[networkname,url],"eth":[networkname,url]}
 * @property {object} preNetWork , old network,  When the switch fails, the initial state is restored
 * @property {object} selectedNetWork , Current node
 * 
 * 
 */
class NetworkController extends EventEmitter {
    constructor(opts = {}) {
        super()
        const initState = extend({
            networks:"",
            preNetWork:"",
            selectedNetWork:"",

        }, opts.initState)
        this.store = new ObservableStore(initState)
        this.on(NETWORK_EVENTS.NETWORK_WILL_CHANGE,this.handleNetwrokChange)
    }


    //获取network列表
    getNetworks(type){
        return this.store.getState(networks)[type]
    }

    //切换
    setNetwork(network){
        //发出 network change 事件， 并且修改
        this.store.updateState({preNetWork:this.store.getState().selectedNetWork})
        this.store.updateState({selectedNetWork:network})
        return Promise.resolve(network)
    }

    //添加
    addNetwork(type,network){
        let networks =  this.store.getState(networks)
        if(networks){
            networks[type].push(network)
        }else{
            networks[type] = [network]
        }
        this.store.updateState(networks)
    }

    //删除
    deleteNetwork(type,url){
        let networks =  this.store.getState(networks)
        if(!networks){
            return 
        }
        networks[type].forEach(element => {
           if(element.url === url ){
            networks[type].remove(element)
           }
            
        });
        this.store.updateState(networks)
    }

    handleNetwrokChange(){
        console.log("")
        //TODO 检测当前 selectedNetWork 不可用时切换 preNetWork
    }

}

module.exports = NetworkController