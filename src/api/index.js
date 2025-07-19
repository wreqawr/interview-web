import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 可根据实际后端调整
  timeout: 10000
});

// 可在此添加请求/响应拦截器

export default instance; 