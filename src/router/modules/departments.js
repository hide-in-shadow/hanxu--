import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/departments', // 路径
  name: 'departments',
  component: Layout, // 组件
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: {
        // meta里的属性 随意定义
        title: '组织架构', // 用title 因为左侧导航会读取meta里的title作为菜单名
        icon: 'tree'
      }
    }
  ]
}
