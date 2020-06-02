import Vue from 'vue'
import Router from 'vue-router'

const _import = file => () => import('@/view/' + file + '.vue')

Vue.use(Router)
const router = new Router({

  routes: [{
      path: '/',
      redirect: 'home'
    }, {
      path: '/home',
      name: 'home',
      component: _import("home")
    },
    {
      path: '/createdWallet',
      name: 'createdWallet',
      component: _import("createdWallet")
    },
    {
      path: '/setPassword',
      name: 'setPassword',
      component: _import("setPassword")
    },
    {
      path: '/myWallet',
      name: 'myWallet',
      meta: {
        needLogin: false
      },
      component: _import("myWallet")
    },
    {
      path: '/assets',
      name: 'assets',
      meta: {
        needLogin: false
      },
      component: _import("assets")
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