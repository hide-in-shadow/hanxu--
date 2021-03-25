// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间 3600s

// 是否超时 函数
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// create an axios instance  创建了一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000 // request timeout  超时时间
})

// request interceptor    请求拦截器
service.interceptors.request.use(
  config => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 只有在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        // 如果它为true表示 过期了
        store.dispatch('user/logout') // 登出操作
        router.push('/login') // 跳转到登录页
        return Promise.reject(new Error('token超时了')) // 返回错误
      }
      // 如果token存在 注入token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  error => {
    // error 信息 里面 response的对象
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error)
  }
)

// response interceptor  响应拦截器
service.interceptors.response.use(
  response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      // 业务已经错误了 应该进catch
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  error => {
    console.log(error)
    Message.error(error.message) // 提示错误信息
    // router.push('/login') // 跳转到登录页
    return router.push('/login') // 返回执行错误 直接进入 登录页
  }
)

// 导出axios实例
export default service
