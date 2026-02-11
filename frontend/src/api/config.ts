import axios from 'axios';

// 切换 mock / 真实后端：改 USE_MOCK 即可
const USE_MOCK = false;
const BASE_URL = USE_MOCK ? '/api' : 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: BASE_URL
});

// 请求拦截器
instance.interceptors.request.use((config) => {
 
 
  return config;
});

// 响应拦截器
instance.interceptors.response.use((res) => {
  return res.data;
});

export default instance;
