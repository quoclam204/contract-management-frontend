import React from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { LogOut } from 'lucide-react';
import { UserRole } from '@/types/auth';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuthStore();

  const roles: Array<{ value: UserRole; label: string }> = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Approver', label: 'Approver' },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="text-xs text-slate-500 font-medium">
        Hệ thống Quản lý Vòng đời Hợp đồng (CLM)
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="text-slate-700">
          Xin chào, <strong>{user?.fullName || 'Nhân viên'}</strong> ({user?.role || 'Staff'})
        </span>

        {/* Temporary Role Switcher (Dev Only) */}
        <div className="relative">
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer p-1 bg-slate-50 rounded"
          >
            <span>Role: {user?.role || 'Staff'} ▼</span>
          </button>
          <div className="absolute left-0 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => switchRole(role.value as UserRole)}
                className={`w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 ${
                  user?.role === role.value ? 'font-medium bg-slate-50' : 'font-normal'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

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
