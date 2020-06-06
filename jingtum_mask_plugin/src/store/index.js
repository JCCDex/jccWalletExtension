import Vue from "vue";
import Vuex from "vuex";
import { JingchangWallet } from "jcc_wallet";
const NOT_LOGIN = 0;
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
    balance: ""
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
    }, balance) => commit('SET_BALANCE', balance)
  },
  getters: {
    isLogin: state => state.isLogin,
    jcWallet: state => state.jcWallet,
    balance: state => state.balance,
    swtAddress(state) {
      const address = getAddress(state.jcWallet, 'swt');
      return address || "";
    }
  }
});

export default store;