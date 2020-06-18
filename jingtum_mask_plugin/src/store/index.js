import Vue from "vue";
import Vuex from "vuex";
import { JingchangWallet } from "jcc_wallet";
const NOT_LOGIN = 0;
const jcNodes = process.env.jcNodes;
Vue.use(Vuex);

const getAddress = (jcWallet, type = "swt") => {
  try {
    const inst = new JingchangWallet(jcWallet);
    const wallet = inst.findWallet((w) => w.type.toLowerCase() === type.toLowerCase() && w.default);
    return wallet.address;
  } catch (error) {
    return "";
  }
}

const store = new Vuex.Store({
  state: {
    isLogin: NOT_LOGIN,
    jcWallet: JingchangWallet.get() || {},
    balance: "",
    currentBalance: "",
    coins: [],
    currentCoins: [],
    currentNode: jcNodes[0] || {},
    defAddress: "",
    assetName: "SWTC"
  },
  mutations: {
    SET_LOGIN_STATUS(state, isLogin) {
      Vue.set(state, 'isLogin', isLogin);
    },
    SET_JCWALLET(state, jcWallet) {
      if (JingchangWallet.isValid(jcWallet)) {
        Vue.set(state, 'jcWallet', jcWallet);
      } else {
        Vue.set(state, 'jcWallet', {});
      }
    },
    SET_BALANCE(state, balance) {
      Vue.set(state, 'balance', balance);
    },
    SET_CURRENTBALANCE(state, currentBalance) {
      Vue.set(state, 'currentBalance', currentBalance);
    },
    SET_COINS(state, coins) {
      Vue.set(state, 'coins', coins);
    },
    SET_CURRENTCOINS(state, currentCoins) {
      Vue.set(state, 'currentCoins', currentCoins);
    },
    SET_CURRENTNODE(state, currentNode) {
      Vue.set(state, 'currentNode', currentNode);
    },
    SET_DEFADDRESS(state, defAddress) {
      Vue.set(state, 'defAddress', defAddress);
    },
    SET_ASSETNAME(state, assetName) {
      Vue.set(state, 'assetName', assetName);
    }
  },
  actions: {
    updateIsLogin: ({
      commit
    }, isLogin) => commit('SET_LOGIN_STATUS', isLogin),
    updateJCWallet: ({
      commit
    }, jcWallet) => commit('SET_JCWALLET', jcWallet),
    updateBalance: ({
      commit
    }, balance) => commit('SET_BALANCE', balance),
    updateCurrentBalance: ({
      commit
    }, currentBalance) => commit('SET_CURRENTBALANCE', currentBalance),
    updateCoins: ({
      commit
    }, coins) => commit('SET_COINS', coins),
    updateCurrentCoins: ({
      commit
    }, currentCoins) => commit('SET_CURRENTCOINS', currentCoins),
    updateCurrentNode: ({
      commit
    }, currentNode) => commit('SET_CURRENTNODE', currentNode),
    updateDefAddress: ({
      commit
    }, defAddress) => commit('SET_DEFADDRESS', defAddress),
    updateAssetName: ({
      commit
    }, assetName) => commit('SET_ASSETNAME', assetName)
  },
  getters: {
    isLogin: state => state.isLogin,
    jcWallet: state => state.jcWallet,
    balance: state => state.balance,
    currentBalance: state => state.currentBalance,
    swtAddress(state) {
      const address = getAddress(state.jcWallet, 'swt');
      return address || "";
    },
    currentNode: state => state.currentNode,
    defAddress: state => state.defAddress,
    coins: state => state.coins,
    currentCoins: state => state.currentCoins,
    assetName: state => state.assetName
  }
});

export default store;