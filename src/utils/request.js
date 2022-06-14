import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出基准地址 原因 其他地方不是通过axios发请求的地方用基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

// 创建axios实例
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器 如果有tokne 则注入token至header
instance.interceptors.request.use(
  config => {
  // 拦截业务
    const { profile } = store.state.user
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器 剥离无效数据 处理token失效
instance.interceptors.response.use(
  res => {
    // 剥离无效数据
    return res.data
  },
  err => {
    // 处理状态码 token失效 401
    if (err.response && err.response.status === 401) {
      // 清空无效信息
      // 跳转到登录 并且传参 当前路由地址 当登录完后 跳转回来
      store.commit('user/setUser', {})
      router.push(`/login?redirectUrl=${encodeURIComponent(router.currentRoute.value.fullPath)}`)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    // 如果是get 使用params
    // 如果不是get 则是 data
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export default request
