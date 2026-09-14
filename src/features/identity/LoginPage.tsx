import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/data/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('admin@clm.com');
  const [password, setPassword] = useState('Password@123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password });
      navigate('/');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin hoặc kết nối máy chủ.';
      setErrorMessage(msg);
    }
  };

  const handleQuickFill = (testEmail: string, testRoleName: string) => {
    setEmail(testEmail);
    setPassword('Password@123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 border border-slate-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Đăng Nhập CLM
          </h1>
          <p className="text-xs text-slate-500">
            Hệ thống Quản lý Vòng đời Hợp đồng Doanh nghiệp
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mật khẩu truy cập
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 text-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 mt-2"
            isLoading={loginMutation.isPending}
          >
            Đăng nhập hệ thống
          </Button>
        </form>

        {/* Quick Test Accounts for RBAC */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            Chọn nhanh tài khoản mẫu để kiểm thử RBAC:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@clm.com', 'Admin')}
              className="px-2.5 py-2 text-center rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-xs cursor-pointer group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-blue-600">
                Admin
              </span>
              <span className="text-[10px] text-slate-400">Toàn quyền</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('manager@clm.com', 'Manager')}
              className="px-2.5 py-2 text-center rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs cursor-pointer group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-emerald-600">
                Manager
              </span>
              <span className="text-[10px] text-slate-400">Tạo / Sửa</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('staff@clm.com', 'Staff')}
              className="px-2.5 py-2 text-center rounded-lg border border-slate-200 hover:border-violet-500 hover:bg-violet-50/50 transition-all text-xs cursor-pointer group"
            >
              <span className="block font-bold text-slate-800 group-hover:text-violet-600">
                Staff
              </span>
              <span className="text-[10px] text-slate-400">Chỉ xem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

