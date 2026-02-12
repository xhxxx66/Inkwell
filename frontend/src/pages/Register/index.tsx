import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '@/store/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';

const Register = () => {
  const { register, login } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, confirmPassword, nickname } = formData;

    // 表单验证
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (username.trim().length < 2) {
      setError('用户名至少2个字符');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }
    if (password.length < 6) {
      setError('密码不能少于6位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 注册
      await register({
        username: username.trim(),
        password,
        nickname: nickname.trim() || undefined
      });

      // 注册成功后自动登录
      await login({ username: username.trim(), password });
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('注册失败:', err);
      setError(err.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Inkwell</h1>
          <p className="text-muted-foreground text-sm">创建新账户</p>
        </div>

        {/* 注册表单 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">注册</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名 *</Label>
                <Input
                  id="username"
                  placeholder="请输入用户名（至少2个字符）"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input
                  id="nickname"
                  placeholder="请输入昵称（选填）"
                  value={formData.nickname}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码 *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码（至少6位）"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码 *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  '立即注册'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">已有账户？</span>
              <Link to="/login" className="text-primary ml-1 hover:underline">
                立即登录
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 返回首页 */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/')}
        >
          暂不注册，返回首页
        </Button>
      </div>
    </div>
  );
};

export default Register;
