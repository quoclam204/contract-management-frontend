import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/data/useAuth';
import {
  Lock,
  Mail,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Key,
  Briefcase,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface QuickAccount {
  id: string;
  roleName: string;
  department: string;
  email: string;
  password: string;
  badge: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    id: 'admin',
    roleName: 'Quản Trị Viên (Admin)',
    department: 'Ban Quản Trị & CNTT',
    email: 'admin@gmail.com',
    password: 'admin@2004',
    badge: 'Admin',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200/80',
    icon: ShieldCheck,
    iconColor: 'text-rose-500 bg-rose-50',
  },
  {
    id: 'manager',
    roleName: 'Trưởng Phòng (Manager)',
    department: 'Phòng Kinh Doanh',
    email: 'manager@clm.com',
    password: 'Password@123',
    badge: 'Manager',
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    icon: Briefcase,
    iconColor: 'text-emerald-500 bg-emerald-50',
  },
  {
    id: 'approver',
    roleName: 'Người Phê Duyệt (Approver)',
    department: 'Phòng Pháp Chế & Thẩm Định',
    email: 'approver@clm.com',
    password: 'Password@123',
    badge: 'Approver',
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200/80',
    icon: UserCheck,
    iconColor: 'text-amber-500 bg-amber-50',
  },
  {
    id: 'user',
    roleName: 'Nhân Viên (Staff)',
    department: 'Phòng Mua Hàng & Vận Hành',
    email: 'user1@clm.com',
    password: 'Password@123',
    badge: 'Staff',
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200/80',
    icon: User,
    iconColor: 'text-blue-500 bg-blue-50',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@2004');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('admin');

  const handleFormSubmit = async (e: React.FormEvent) => {
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

  const handleSelect = (acc: QuickAccount) => {
    setSelectedId(acc.id);
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  const handleDirectLogin = async (acc: QuickAccount) => {
    setSelectedId(acc.id);
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
    try {
      await loginMutation.mutateAsync({ email: acc.email, password: acc.password });
      navigate('/');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Đăng nhập không thành công. Vui lòng kiểm tra lại máy chủ backend.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="max-w-[430px] w-full bg-white rounded-3xl shadow-2xl p-7 sm:p-8 space-y-6 relative z-10 border border-slate-100/90">

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-50 transition-transform hover:scale-105">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Đăng Nhập CLM
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Hệ thống Quản lý Vòng đời Hợp đồng Doanh nghiệp
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200/80 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Địa chỉ Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSelectedId('');
                }}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 focus:bg-white transition-all shadow-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Mật khẩu truy cập
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSelectedId('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 focus:bg-white transition-all shadow-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                tabIndex={-1}
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loginMutation.isPending ? (
              <span>Đang kết nối hệ thống...</span>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Test Accounts Combobox */}
        <div className="pt-3.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Tài Khoản Kiểm Thử Nhanh
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Chọn để tự động điền</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={selectedId}
                onChange={(e) => {
                  const found = QUICK_ACCOUNTS.find((a) => a.id === e.target.value);
                  if (found) handleSelect(found);
                }}
                className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer appearance-none"
              >
                {QUICK_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    [{acc.badge}] {acc.email}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const current = QUICK_ACCOUNTS.find((a) => a.id === selectedId) || QUICK_ACCOUNTS[0];
                handleDirectLogin(current);
              }}
              disabled={loginMutation.isPending}
              title="Đăng nhập ngay lập tức với tài khoản này"
              className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <span>Vào ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Micro preview of selected account */}
          {(() => {
            const currentAcc = QUICK_ACCOUNTS.find((a) => a.id === selectedId) || QUICK_ACCOUNTS[0];
            return (
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentAcc.badgeClass}`}>
                    {currentAcc.badge}
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">{currentAcc.email}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-500 text-[11px]">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentAcc.password}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 pt-1 font-medium">
          CLM Enterprise 2026 • Bảo mật JWT & Phân quyền RBAC
        </div>
      </div>
    </div>
  );
};
