import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 引入router 重置路由方法
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(),
  userInfo: {} // 用户资料
}

// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token // 设置token
    setToken(token) // vuex和 缓存数据的同步
  },
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 获取设置用户资料
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 删除用户资料
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, formData) {
    // request 拦截数据 加工后 返回 的 数据 返回数据就说明调用成功
    const data = await login(formData)
    // 返回数据就说明调用成功 actions 修改state 必须通过mutations
    context.commit('setToken', data)
    // 接口调用成功 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取用户资料 同时根据用户id获取头像
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', baseResult) // 将个人信息设置到用户的vuex数据中
    return baseResult // 这里为什么要返回 为后面埋下伏笔
  },
  // 用户登出
  logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('removeUserInfo') // 删除用户信息资料
    // 重置路由
    resetRouter()
    // 要清空permission模块下的state数据
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
