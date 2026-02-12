import axios from 'axios';

// 切换 mock / 真实后端：改 USE_MOCK 即可
const USE_MOCK = false;
const BASE_URL = USE_MOCK ? '/api' : 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: BASE_URL
});

// 获取 store 中的 token（避免循环依赖）
const getToken = () => {
  try {
    const stored = localStorage.getItem('inkwell-user-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.accessToken || null;
    }
  } catch (e) {
    return null;
  }
  return null;
};

// 获取 refresh token
const getRefreshToken = () => {
  try {
    const stored = localStorage.getItem('inkwell-user-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.refreshToken || null;
    }
  } catch (e) {
    return null;
  }
  return null;
};

// 更新 token
const updateTokens = (accessToken: string, refreshToken: string) => {
  try {
    const stored = localStorage.getItem('inkwell-user-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.state.accessToken = accessToken;
      parsed.state.refreshToken = refreshToken;
      localStorage.setItem('inkwell-user-store', JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('更新 token 失败:', e);
  }
};

// 清除登录状态
const clearAuth = () => {
  try {
    const stored = localStorage.getItem('inkwell-user-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.state.accessToken = null;
      parsed.state.refreshToken = null;
      parsed.state.user = null;
      parsed.state.isLogin = false;
      localStorage.setItem('inkwell-user-store', JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('清除登录状态失败:', e);
  }
};

// 是否正在刷新 token
let isRefreshing = false;
// 等待刷新的请求队列
let refreshSubscribers: ((token: string) => void)[] = [];

// 添加到等待队列
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// 通知所有等待的请求
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// 请求拦截器：添加 Authorization header
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理 token 过期
instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 错误且不是刷新 token 请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshTokenValue = getRefreshToken();

      // 没有 refresh token，清除登录状态
      if (!refreshTokenValue) {
        clearAuth();
        return Promise.reject(error);
      }

      // 正在刷新，加入等待队列
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 刷新 token
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshTokenValue
        });

        const { access_token, refresh_token } = res.data;
        updateTokens(access_token, refresh_token);

        // 通知等待的请求
        onRefreshed(access_token);
        isRefreshing = false;

        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除登录状态
        isRefreshing = false;
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
