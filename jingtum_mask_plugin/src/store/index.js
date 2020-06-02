import Vue from "vue";
import Vuex from "vuex";
const NOT_LOGIN = 0;
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    isLogin: NOT_LOGIN,
    jcWallet: "",
    currentCurrency: "",
    currentWallet: "",
    balance: ""
  },
  mutations: {
    SET_LOGIN_STATUS(state, isLogin) {
      Vue.set(state, 'isLogin', isLogin);
    },
    SET_JCWALLET(state, jcWallet) {
      Vue.set(state, 'jcWallet', jcWallet);
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
    balance: state => state.balance
  }
});

export default store;