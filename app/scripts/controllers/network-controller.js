//
import EventEmitter from 'events';
const {ObservableStore,ComposedStore} = require('obs-store')
const {WALLET_TYPES,NETWORK_TYPE_RPC} = require('../constants/walletType-constants')
import {
    createSwappableProxy,
    createEventEmitterProxy,
  } from 'swappable-obj-proxy';
export const NETWORK_EVENTS = {
    // Fired after the actively selected network is changed
    NETWORK_DID_CHANGE: 'networkDidChange',
    // Fired when the actively selected network *will* change
    NETWORK_WILL_CHANGE: 'networkWillChange',
};

//参考了部分 metamask 的写法


export default class NetworkController extends EventEmitter {
    constructor(opts = {}) {
        super();
        const providerConfig = opts.provider || defaultProviderConfig
        // create stores
        this.providerStore = new ObservableStore(providerConfig)//即上面的provider，到底是default的RINKEBY或MAINNET还是用户自己传进来的provider
        this.networkStore = new ObservableStore('loading') //network处于加载状态
        this.store = new ComposedStore({ provider: this.providerStore, network: this.networkStore }) //即将两个store组合起来
        // create event emitter proxy
        this._proxy = createEventEmitterProxy()
        this.on('networkDidChange', this.lookupNetwork)
    }
    
    initializeProvider(providerParams) {
        this._baseProviderParams = providerParams;
        const { type, rpcUrl} = this.getProviderConfig();
        this._configureProvider({type, rpcUrl});
        this.lookupNetwork();
      }

      getProviderConfig() {
        return this.providerStore.getState();
      }

    _configureProvider({ type, rpcUrl}) {
        if (WALLET_TYPES.includes(type)) {
            //钱包类型中的一类
            this._configureChainProvider(type);
        } else if (type === NETWORK_TYPE_RPC) {
            //本地 节点类型
            this._configureStandardProvider(rpcUrl);
        } else {
            throw new Error(
            `NetworkController - _configureProvider - unknown type "${type}"`,
            );
        }
    }

    _configureChainProvider(type) {
        log.info('NetworkController - _configureChainProvider', type);


        const networkClient = createInfuraClient({
            network: type,
        });
        this._setNetworkClient(networkClient);
    }

    _setNetworkClient({ networkMiddleware, blockTracker }) {
        const metamaskMiddleware = createMetamaskMiddleware(
            this._baseProviderParams,
        );
        const engine = new JsonRpcEngine();
        engine.push(metamaskMiddleware);
        engine.push(networkMiddleware);
        const provider = providerFromEngine(engine);
        this._setProviderAndBlockTracker({ provider, blockTracker });
    }

    _configureStandardProvider(rpcUrl) {
        log.info('NetworkController - configureStandardProvider', rpcUrl);
        
        const networkClient = createJsonRpcClient({ rpcUrl });

        this._setNetworkClient(networkClient);
      }
    
    _switchNetwork(opts) {
        this.emit(NETWORK_EVENTS.NETWORK_WILL_CHANGE);
        this.setNetworkState('loading');
        this._configureProvider(opts);
        this.emit(NETWORK_EVENTS.NETWORK_DID_CHANGE, opts.type);
    }
}