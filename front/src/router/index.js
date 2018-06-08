import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import About from '@/components/About'
import UserCreate from '@/components/UserCreate'
import Info from '@/components/Info'
import Settings from '@/components/Settings'
import NewEatPoint from '@/components/NewEatPoint'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/newuser',
      name: 'UserCreate',
      component: UserCreate
    },
    {
      path: '/info',
      name: 'Info',
      component: Info
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/newpoint',
      name: 'NewEatPoint',
      component: NewEatPoint
    }
  ]
})
