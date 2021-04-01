import store from '@/store'

// 混入一个对象
export default {
  methods: {
    // 检查权限 key就是要检查的点
    checkPermission(key) {
      // store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 没进入说明没权限
    }
  }
}
