import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import i18n from '@/lang' // 引入自定义多语言组件包
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })

import checkPermission from '@/mixin/checkPermission'
Vue.mixin(checkPermission) // 全局混入 方法

import '@/icons' // icon
import '@/permission' // 引入token管理 路由守卫

import Component from '@/components' // 引用
Vue.use(Component) // 注册自己的插件

import Print from 'vue-print-nb'
Vue.use(Print) // 注册打印插件

import * as filters from '@/filters' // 引入工具类
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

import * as directives from '@/directives' // 引入自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
