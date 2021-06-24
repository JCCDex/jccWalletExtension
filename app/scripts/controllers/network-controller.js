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
 * @property {object} selectedNetWork , {"jingtum":network}} Stores each type of default network
 * 
 * 
 */
class NetworkController extends EventEmitter {
    constructor(opts = {}) {
        super()
        const initState = extend({
            networks:{'jingtum':[{
                name :"井通默认节点",
                url:'http://101.200.174.239:7545',
              },{
                name :"井通默认节点2",
                url:'http://101.200.174.239:7546',
              }],
              'eth':[{
                name :"ETH默认节点",
                url:'https://eth626892d.jccdex.cn',
              },{
                name :"ETH默认节点",
                url:'https://ropsten.infura.io/v3/9af2760f61ea4fedbf3b10b5c07f2781',
              }]},
            selectedNetWork:{'jingtum':             
              {
                name :"井通默认节点",
                url:'http://101.200.174.239:7545',
              },'eth':{
                name :"ETH默认节点",
                url:'https://eth626892d.jccdex.cn',
              },
            },

            preNetWork:"",

        }, opts.initState)
        this.store = new ObservableStore(initState)
        this.on(NETWORK_EVENTS.NETWORK_WILL_CHANGE,this.handleNetwrokChange)
    }


    //获取network列表
    getNetworks(type){
        return this.store.getState().networks[type]
    }

    //切换
    setNetwork(type,network){
        //发出 network change 事件， 并且修改
        const selectedNetWork = this.store.getState().selectedNetWork
        this.store.updateState({preNetWork:selectedNetWork[type]})
        selectedNetWork[type] = network
        this.store.updateState({selectedNetWork})
        return Promise.resolve(network)
    }

    //添加
    addNetwork(type,network){
        let networks =  this.store.getState().networks
        if(networks[type]){
          networks[type].push(network)
        }else{
            networks[type] = [network]
        }
        this.store.updateState({networks})
        return Promise.resolve(true)
    }

    //删除
    deleteNetwork(type,url){
        let networks =  this.store.getState().networks
        if(networks[type]){
          networks[type].forEach((item, index, arr)=>{
            if(item.url === url ){
              arr.splice(index, 1);
             }
          });
        }
        this.store.updateState({networks})
        return Promise.resolve(true)
    }

    handleNetwrokChange(){
        console.log("")
        //TODO 检测当前 selectedNetWork 不可用时切换 preNetWork
    }

}

module.exports = NetworkController