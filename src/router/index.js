import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import settingRouter from './modules/setting'
import permissionRouter from './modules/permission'
import socialRouter from './modules/social'
import attendancesRouter from './modules/attendances'
import approvalsRouter from './modules/approvals'
import salarysRouter from './modules/salarys'

import usersRouter from './modules/user'

// 动态路由
export const asyncRoutes = [
  departmentsRouter, // 组织架构
  employeesRouter, // 员工
  settingRouter, // 公司设置
  permissionRouter, // 权限设置
  socialRouter, // 社保
  attendancesRouter, // 考勤
  approvalsRouter, // 审批
  salarysRouter // 工资
]

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [
      {
        path: '', // 二级路由path什么都不写 表示二级默认路由
        component: () => import('@/views/import')
      }
    ]
  },
  usersRouter, // 用户详情路由

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: 'hr/', // 配置项目的基础地址
    scrollBehavior: () => ({ y: 0 }), // 管理滚动行为 出现滚动 切换就页面回到顶部
    routes: [...constantRoutes]
  })

const router = createRouter()

// 重置初始路由可匹配路径 重新实例化一个路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重新设置路由的可匹配路径
}

export default router
