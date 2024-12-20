import Axios from "axios"
import type { InternalAxiosRequestConfig } from "axios"
import { warningAlert } from '@/utils/AlertUtil'
import useUserInfo from '@/store/user'
import router from "@/router"

const axios = Axios.create({
  baseURL: '/api'
})

axios.interceptors.request.use(function (config: InternalAxiosRequestConfig<any>) {
  const token = useUserInfo().getState().token;
  if (token) {
    config.headers['Authorization'] = token.toString()
  }
  return config
}, function (error) {
  return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // if (response.data.code !== '0') {
  //   warningAlert(response.data.msg ? response.data.msg : "请求处理异常, 请联系管理员");
  // }
  return response;
}, function (error) {
  // console.log(error);
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么: 比如统一处理token失效
  // 统一处理token失效
  if (error.status === 401) {
    // 弹框提示用户
    warningAlert(`请求处理异常: ${error.response.data.msg}`)
    // 删除用户缓存
    useUserInfo().setUserState('', '', '', '', '')
    // 返回登录页
    router.push('/login')
  }
  return Promise.reject(error)
})

export default axios