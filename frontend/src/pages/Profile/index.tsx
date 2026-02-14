import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import {
  User,
  Heart,
  Star,
  Clock,
  ChevronRight,
  LogOut,
  PenLine,
  Bell,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { isLogin, user, logout } = useUserStore();

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  const handleAuthAction = (path?: string) => {
    if (!isLogin) {
      navigate('/login');
      return;
    }
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部用户信息卡片 */}
      <div className="bg-white p-6 mb-4">
        <div
          className="flex items-center gap-5"
          onClick={() => !isLogin && navigate('/login')}
        >
          {/* 头像 */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              {isLogin && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nickname || user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {/* 未登录小红点提示 */}
            {!isLogin && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          
          {/* 用户名/登录提示 */}
          <div className="flex-1 min-w-0">
            {isLogin ? (
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {user?.nickname || user?.username}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    ID: {user?.id}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-900">点击登录/注册</h2>
                <p className="text-sm text-gray-500 mt-1">登录后享受更多权益</p>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 快捷入口卡片 - 移除负边距，增加间距 */}
      <div className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-6 relative z-10 flex justify-around items-center">
        <QuickEntry
          icon={<Heart className="w-7 h-7" />}
          label="我的点赞"
          color="text-red-500"
          bg="bg-red-50"
          onClick={() => handleAuthAction()}
        />
        <div className="w-px h-10 bg-gray-100"></div>
        <QuickEntry
          icon={<Star className="w-7 h-7" />}
          label="我的书架"
          color="text-yellow-500"
          bg="bg-yellow-50"
          onClick={() => handleAuthAction('/bookshelf')}
        />
        <div className="w-px h-10 bg-gray-100"></div>
        <QuickEntry
          icon={<Clock className="w-7 h-7" />}
          label="阅读历史"
          color="text-blue-500"
          bg="bg-blue-50"
          onClick={() => handleAuthAction('/reading-history')}
        />
      </div>

      {/* 功能菜单列表 - 增加间距 */}
      <div className="mx-4 mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <MenuItem
          icon={<PenLine className="w-5 h-5" />}
          label="成为作家"
          color="text-indigo-500"
          onClick={() => handleAuthAction()}
        />
        <MenuItem
          icon={<Bell className="w-5 h-5" />}
          label="我的消息"
          color="text-green-500"
          badge="2"
          onClick={() => handleAuthAction()}
        />
        <MenuItem
          icon={<FileText className="w-5 h-5" />}
          label="服务条款"
          color="text-gray-500"
          showBorder={false}
          onClick={() => {}}
        />
      </div>

      <div className="mx-4 mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <MenuItem
          icon={<Settings className="w-5 h-5" />}
          label="设置"
          color="text-gray-600"
          onClick={() => {}}
        />
        <MenuItem
          icon={<HelpCircle className="w-5 h-5" />}
          label="帮助与反馈"
          color="text-gray-600"
          showBorder={false}
          onClick={() => {}}
        />
      </div>

      {/* 退出登录按钮 */}
      {isLogin && (
        <div className="mx-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-white text-red-500 font-medium rounded-xl shadow-sm flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};

// 快捷入口组件
interface QuickEntryProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  onClick?: () => void;
}

const QuickEntry = ({ icon, label, color, bg, onClick }: QuickEntryProps) => (
  <div
    className="flex flex-col items-center gap-3 cursor-pointer active:opacity-70 transition-opacity flex-1 py-1"
    onClick={onClick}
  >
    <div className={`w-12 h-12 rounded-full ${bg} ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </div>
);

// 菜单项组件
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
  showBorder?: boolean;
  badge?: string;
}

const MenuItem = ({ icon, label, color, onClick, showBorder = true, badge }: MenuItemProps) => (
  <div
    className={`flex items-center px-5 py-5 cursor-pointer active:bg-gray-50 transition-colors ${
      showBorder ? 'border-b border-gray-100' : ''
    }`}
    onClick={onClick}
  >
    <span className={`${color} scale-110`}>{icon}</span>
    <span className="flex-1 ml-4 text-base font-medium text-gray-700">{label}</span>
    <div className="flex items-center gap-2">
      {badge && (
        <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] text-center">
          {badge}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </div>
  </div>
);

export default Profile;
