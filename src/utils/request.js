// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance  创建了一个新的axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000 // request timeout  超时时间
})

// request interceptor    axios的请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
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
    return Promise.reject(error) // 返回执行错误 直接进入 catch
  }
)

// 导出axios实例
export default service
