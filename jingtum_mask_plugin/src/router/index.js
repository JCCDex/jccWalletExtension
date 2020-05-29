import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index'
const _import = file => () => import('@/view/' + file + '.vue')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/view/createdWallet',
      name: 'createdWallet',
      component: _import("createdWallet")
    }
  ]
})