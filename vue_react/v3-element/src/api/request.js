// react vue http 请求标配
// ./ ../ 相对路径 查找
// fs http 内置模块 node_modules / 安装的第三方packages

import axios from 'axios';
// 实例
const service = axios.create({
  baseURL: '/', // 配置请求的基础路径
  timeout: 5000, // 配置请求超时时间
});

export default service;