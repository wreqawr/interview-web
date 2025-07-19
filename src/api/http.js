import axios from "axios";

const http = axios.create({
  timeout: 10000
});

// 可在此添加请求/响应拦截器

export default http; 