import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index'
const _import = file => () => import('@/view/' + file + '.vue')

Vue.use(Router)
const router = new Router({

  routes: [{
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/view/createdWallet',
      name: 'createdWallet',
      component: _import("createdWallet")
    },
    {
      path: '/view/setPassword',
      name: 'setPassword',
      component: _import("setPassword")
    },
    {
      path: '/view/myWallet',
      name: 'myWallet',
      meta: {
        needLogin: true
      },
      component: _import("myWallet")
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    let logined = store.getters.isLogin;
    if (logined) {
      next();
    } else {
      next("/index");
    }
  } else {
    next();
  }
})

export default router