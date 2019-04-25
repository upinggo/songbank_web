import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Song from './views/Song.vue'
import Search from './views/Search.vue'
import PHome from './views/PHome.vue'
import PVerify from './views/PVerify.vue'
import Current from './views/Current.vue'
import Message from "./views/Message.vue";
import Beats from "./views/Beats.vue";
Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/song',
      name: 'song',
      component: Song
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/phome',
      name: 'phome',
      component: PHome
    },
    {
      path: '/pverify',
      name: 'pverify',
      component: PVerify
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import(/* webpackChunkName: "about" */ './views/Upload.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/current',
      name: 'current',
      component: Current,
      children:[{
        path:'/current/:type',
              name:'currenttype',
              
      }]
    },{
      path:'/message',
      name: 'message',
      component: Message,
    },{
      path:'/beats',
      name:'beats',
      component:Beats,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (/\/current\/.+/.test(to.path)) return null
      return { x: 0, y: 0 }
    }
  },
})

export default router
