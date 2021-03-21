import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/employees', // 路径
  // name: 'employees', // 给路由规则加一个name
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [
    {
      path: '', // path: ""  表示该路由为当前二级路由的默认路由
      component: () => import('@/views/employees'),
      meta: {
        // meta里的属性 随意定义
        title: '员工', // 用title 因为左侧导航会读取meta里的title作为菜单名
        icon: 'people'
      }
    }
  ]
}
// 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
