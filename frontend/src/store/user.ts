import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doLogin, doRegister, type LoginParams, type RegisterParams } from '@/api/user';

// 用户信息类型
interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
}

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  isLogin: boolean;
  login: (credentials: LoginParams) => Promise<void>;
  register: (data: RegisterParams) => Promise<any>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLogin: false,

      // 登录
      login: async (credentials: LoginParams) => {
        const res: any = await doLogin(credentials);
        const { access_token, refresh_token, user } = res;

        set({
          accessToken: access_token,
          refreshToken: refresh_token,
          user,
          isLogin: true
        });
      },

      // 注册
      register: async (data: RegisterParams) => {
        const res: any = await doRegister(data);
        return res;
      },

      // 退出登录
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLogin: false
        });
      }
    }),
    {
      name: 'inkwell-user-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isLogin: state.isLogin
      })
    }
  )
);
