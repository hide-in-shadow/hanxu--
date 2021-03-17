// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: state => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password })
//         .then(response => {
//           const { data } = response
//           commit('SET_TOKEN', data.token)
//           setToken(data.token)
//           resolve()
//         })
//         .catch(error => {
//           reject(error)
//         })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token)
//         .then(response => {
//           const { data } = response

//           if (!data) {
//             return reject('Verification failed, please Login again.')
//           }

//           const { name, avatar } = data

//           commit('SET_NAME', name)
//           commit('SET_AVATAR', avatar)
//           resolve(data)
//         })
//         .catch(error => {
//           reject(error)
//         })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token)
//         .then(() => {
//           removeToken() // must remove  token  first
//           resetRouter()
//           commit('RESET_STATE')
//           resolve()
//         })
//         .catch(error => {
//           reject(error)
//         })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// 状态
const state = {
  token: getToken()
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
