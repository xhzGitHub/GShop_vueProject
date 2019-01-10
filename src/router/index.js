/*
路由器对象模块
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../pages/Search/Search'
import MSite from '../pages/MSite/MSite'
import Profile from '../pages/Profile/Profile'
import Order from '../pages/Order/Order'
import Login from '../pages/Login/Login'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/search',
      component: Search,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/msite',
      component: MSite,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    // 重定向
    {
      path: '/',
      redirect: '/msite'
    }
  ],
  mode: 'history'
})
