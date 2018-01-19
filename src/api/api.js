import axios from 'axios'
// 设置请求的基准路径
axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'
// 请求拦截器功能,看是否登录,登陆了就加上唯一的请求头
axios.interceptors.request.use(function (config) {
  // 获取当前是否存在token
  let token = localStorage.getItem('mytoken')
  if (token) {
    // 设置请求头
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 如果没有token值,说明用户没有登录过
  return Promise.reject(error)
})

// 登录功能
export const login = (params) => {
  return axios.post('login', params).then(res => {
    return res.data
  })
}
