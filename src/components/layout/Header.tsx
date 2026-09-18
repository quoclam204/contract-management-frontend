import React, { useState } from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { UserRole } from '@/types/auth';
import { LogOut, Settings } from 'lucide-react';
import { NotificationPopover } from './NotificationPopover';
import { ProfileModal } from '@/features/identity/components/ProfileModal';

const ROLE_COLORS: Record<UserRole, string> = {
  Admin: 'bg-rose-50 text-rose-700 border-rose-200',
  Manager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Staff: 'bg-blue-50 text-blue-700 border-blue-200',
  Approver: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const currentRole = user?.role || 'Staff';

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Hệ thống Quản lý Vòng đời Hợp đồng (CLM)
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <NotificationPopover />

        {/* User Badge - Click to open Profile Management Modal */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          title="Quản lý tài khoản: Đổi tên, mật khẩu, ảnh đại diện"
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100/90 active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-slate-200 group"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-blue-400 transition-all"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center transition-colors">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {user?.fullName || 'Người dùng'}
              </p>
              <Settings className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span
              className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                ROLE_COLORS[currentRole]
              }`}
            >
              {currentRole}
            </span>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title="Đăng xuất khỏi hệ thống"
          className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thoát</span>
        </button>
      </div>

      {/* Profile & Account Management Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
};
