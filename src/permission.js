// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 路由的前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    //   如果有token 判断是不是去登录页
    if (to.path === '/login') {
      next('/') // 去的是登录页 跳到主页
    } else {
      // 判断有没有用户id vuex的获取资料的action
      if (!store.getters.userId) {
        // 写await 因为我们想获取完资料再去放行
        const { roles } = await store.dispatch('user/getUserInfo')
        // 根据获取的 用户信息 的权限信息
        const routes = await store.dispatch(
          'permission/filterRoutes',
          roles.menus
        )
        // 添加动态路由到路由表 设置左侧导航栏  铺路
        // 404页面需添加在 所有路由的 最后
        router.addRoutes([
          ...routes,
          { path: '*', redirect: '/404', hidden: true }
        ])
        // addRoutes使用后需要重新导向 即再次跳转原地址
        next(to.path) // to.path 指向原本应该跳转的地址
      } else {
        next() // 直接放行
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  解决 手动切换地址  进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
