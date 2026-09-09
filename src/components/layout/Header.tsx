import React from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="text-xs text-slate-500 font-medium">
        Hệ thống Quản lý Vòng đời Hợp đồng (CLM)
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-700">
          Xin chào, <strong>{user?.fullName || 'Nhân viên'}</strong> ({user?.role || 'Staff'})
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Thoát</span>
        </button>
      </div>
    </header>
  );
};
