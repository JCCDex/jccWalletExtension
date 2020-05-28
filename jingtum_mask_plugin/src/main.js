// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import { browser } from "./js/utils";

Vue.use(VueI18n)

Vue.config.productionTip = false

var messages = {
  en: {
    message: require('./i18n/en-GB'),
  },
  zh: {
    message: require('./i18n/zh-CN')
  }
}
var local = localStorage.getItem('languageType');
if (!local || local === "") {
  local = (browser.language.substr(0, 2)) === 'zh' ? 'zh' : 'en';
  localStorage.setItem('languageType', local);
}

const i18n = new VueI18n({
  locale: local, // set locale
  messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})