// react vue http 请求标配
// ./ ../ 相对路径 查找
// fs http 内置模块 node_modules/ 安装的第三方package
import axios from 'axios';
// 实例
const service = axios.create({
  baseURL: "/", // 基础路径
  timeout: 5000, // 超时时间
})
// 登录后， 有好多接口token ?token=1234567890
// service
// 看文档  chatgpt 
// 拦截器 
// fetch xhr 在axios 面前弟弟，
// fetch/xhr js 向后端通信的功能
// axios 封装了 fetch/xhr, 为了前端工程而来 
service.interceptors.request.use(
  (config) => {
    // 发生在请求之前
    console.log(config, '拦截所有请求.....')
    // 拿到token
    let token = localStorage.getItem('token') || '';
    // 请求头添加了 Authorization 字段
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }
)

export default service;