// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import Vuikittheme from '@vuikit/theme'
import VueSocketio from 'vue-socket.io'
import VueCookie from 'vue-cookie'
import store from './store/store.js'

Vue.config.productionTip = false
Vue.use(Vuikit)
Vue.use(Vuikittheme)
Vue.use(VuikitIcons)
Vue.use(VueSocketio, 'http://127.0.0.1:8081')
Vue.use(VueCookie)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
