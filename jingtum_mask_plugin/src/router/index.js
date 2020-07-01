import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"

const _import = file => () => import('@/view/' + file + '.vue')

Vue.use(Router)
const router = new Router({

  routes: [{
      path: '/',
      redirect: 'home'
    }, {
      path: '/home',
      name: 'home',
      meta: {
        needLogin: false
      },
      component: _import("home")
    },
    {
      path: '/newWallet',
      name: 'newWallet',
      meta: {
        needLogin: false
      },
      component: _import("newWallet")
    },
    // {
    //   path: '/setPassword',
    //   name: 'setPassword',
    //   meta: {
    //     needLogin: false
    //   },
    //   component: _import("setPassword")
    // },
    {
      path: '/myWallet',
      name: 'myWallet',
      meta: {
        needLogin: true
      },
      component: _import("myWallet")
    },
    {
      path: '/assets',
      name: 'assets',
      meta: {
        needLogin: true
      },
      component: _import("assets")
    },
    {
      path: '/lookWallet',
      name: 'lookWallet',
      meta: {
        needLogin: true
      },
      component: _import("lookWallet")
    },
    {
      path: '/transfer',
      name: 'transfer',
      meta: {
        needLogin: true
      },
      component: _import("transfer")
    },
    {
      path: '/createdWallet',
      name: 'createdWallet',
      meta: {
        needLogin: true
      },
      component: _import("createdWallet")
    },
    {
      path: '/importBySecret',
      name: 'importBySecret',
      meta: {
        needLogin: true
      },
      component: _import("importBySecret")
    },
    {
      path: '/setting/index',
      name: 'setting',
      meta: {
        needLogin: true
      },
      component: _import("setting/index")
    },
    {
      path: '/setting/contacts',
      name: 'contacts',
      meta: {
        needLogin: true
      },
      component: _import("setting/contacts")
    },
    {
      path: '/setting/addContact',
      name: 'addContact',
      meta: {
        needLogin: true
      },
      component: _import("setting/addContact")
    },
    {
      path: '/setting/nodeSetting',
      name: 'nodeSetting',
      meta: {
        needLogin: true
      },
      component: _import("setting/nodeSetting")
    },
    {
      path: '/setting/authorization',
      name: 'authorization',
      meta: {
        needLogin: true
      },
      component: _import("setting/authorization")
    },
    {
      path: '/setting/aboutUs',
      name: 'aboutUs',
      meta: {
        needLogin: true
      },
      component: _import("setting/aboutUs")
    },
    {
      path: '/setting/changePassword',
      name: 'changePassword',
      meta: {
        needLogin: true
      },
      component: _import("setting/changePassword")
    },
    {
      path: '/setting/showMnemonic',
      name: 'showMnemonic',
      meta: {
        needLogin: true
      },
      component: _import("setting/showMnemonic")
    },
    {
      path: '/importByMnenonic',
      name: 'importByMnenonic',
      meta: {
        needLogin: false
      },
      component: _import("importByMnenonic")
    },
    {
      path: '/setting/language',
      name: 'language',
      meta: {
        needLogin: true
      },
      component: _import("setting/language")
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