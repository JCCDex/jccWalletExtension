import Vue from "vue";
import Vuex from "vuex";
const NOT_LOGIN = 0;
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    isLogin: NOT_LOGIN,
    jcWallet: "",
    currentCurrency: "",
    currentWallet: ""
  },
  mutations: {
    SET_LOGIN_STATUS(state, isLogin) {
      Vue.set(state, 'isLogin', isLogin);
    },
    SET_JCWALLET(state, jcWallet) {
      Vue.set(state, 'jcWallet', jcWallet);
    }
  },
  actions: {
    updateIsLogin: ({
      commit
    }, isLogin) => commit('SET_LOGIN_STATUS', isLogin),
    updateJCWallet: ({
      commit
    }, jcWallet) => commit('SET_JCWALLET', jcWallet)
  },
  getters: {
    isLogin: state => state.isLogin,
    jcWallet: state => state.jcWallet
  }
});

export default store;