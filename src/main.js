// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入ElementUI组件和样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 启用ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局导航过滤(拦截路由请求)
router.beforeEach((to, from, next) => {
  let user = localStorage.getItem('mytoken')
  if (user) {
    // 如果已经登陆了,就允许用户进入首页
    next()
  } else {
    if (to.path !== '/login') {
      next({path: '/login'})
    } else {
      next()
    }
    // next({path: '/login'})
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
