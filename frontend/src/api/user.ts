import axios from './config';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  nickname?: string;
}

/**
 * 用户登录
 */
export const doLogin = (data: LoginParams) => {
  return axios.post('/auth/login', data);
};

/**
 * 用户注册
 */
export const doRegister = (data: RegisterParams) => {
  return axios.post('/users/register', data);
};

/**
 * 刷新 token
 */
export const refreshToken = (refreshToken: string) => {
  return axios.post('/auth/refresh', { refresh_token: refreshToken });
};

/**
 * 获取当前用户信息
 */
export const getUserProfile = () => {
  return axios.get('/users/profile');
};
