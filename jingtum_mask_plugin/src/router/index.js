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
      path: '/newWallet',
      name: 'newWallet',
      component: _import("newWallet")
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
    },
    {
      path: '/lookWallet',
      name: 'lookWallet',
      meta: {
        needLogin: false
      },
      component: _import("lookWallet")
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        needLogin: false
      },
      component: _import("transfer")
    },
    {
      path: '/createdWallet',
      name: 'createdWallet',
      meta: {
        needLogin: false
      },
      component: _import("createdWallet")
    },
    {
      path: '/importBySecret',
      name: 'importBySecret',
      meta: {
        needLogin: false
      },
      component: _import("importBySecret")
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.needLogin) {
    let logined = store.getters.isLogin;
    if (logined) {
      next();
    } else {
      next("/home");
    }
  } else {
    next();
  }
})

export default router