import axios from "axios";
import { LOGIN_URL, REGISTER_URL, PUB_KEY_URL, CAPTCHA_URL } from './endpoints';
import { ElMessageBox } from 'element-plus';
import router from '@/router';

const http = axios.create({
  timeout: 10000
});

// 需要放行的接口或页面路径白名单
const whiteList = [
  '/login', // 页面路由
  '/register', // 页面路由
  LOGIN_URL,
  REGISTER_URL,
  PUB_KEY_URL,
  CAPTCHA_URL
];

// 请求拦截器：自动加Authorization
http.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('Authorization');
    // 判断当前请求是否在白名单
    const isWhite = whiteList.some(path => (config.url && config.url.includes(path)) || (window.location.pathname === path));
    if (!isWhite) {
      if (token) {
        config.headers['Authorization'] = token;
      } else {
        window.sessionStorage.clear();
        window.location.href = '/login';
        alert('登录已过期，请重新登录');
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器：处理未登录/过期和全局业务code
http.interceptors.response.use(
  response => {
    // 全局业务code处理
    const data = response?.data;
    if (data && data.code === 201) {
      ElMessageBox.alert(data.message || '请重新登录', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: () => {
          if (router && typeof router.push === 'function') {
            router.push('/login');
          } else {
            window.location.href = '/login';
          }
        }
      });
      return Promise.reject({ isAuth: true, message: data.message || '请重新登录' });
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      window.sessionStorage.clear();
      window.location.href = '/login';
      alert('登录已过期，请重新登录');
    }
    return Promise.reject(error);
  }
);

export default http; 