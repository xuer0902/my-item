import axios from 'axios'
// 设置请求的基准路径
// axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'
// 本地基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
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
// 用户管理-获取用户数据
export const getUsersData = (params) => {
  return axios.get('users', {params: params}).then(res => {
    console.log(res.data)
    return res.data
  })
}
// 用户管理-修改用户状态
// restful /users/512/state/true
export const toggleUserState = (params) => {
  return axios.put('users/' + params.id + 'state' + params.state).then(res => {
    console.log(res.data)
    return res.data
  })
}
