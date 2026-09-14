import React from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { UserRole } from '@/types/auth';
import { LogOut, UserCheck } from 'lucide-react';

const ROLES: UserRole[] = ['Admin', 'Manager', 'Staff', 'Approver'];

const ROLE_COLORS: Record<UserRole, string> = {
  Admin: 'bg-rose-50 text-rose-700 border-rose-200',
  Manager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Staff: 'bg-blue-50 text-blue-700 border-blue-200',
  Approver: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuthStore();
  const currentRole = user?.role || 'Staff';
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
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Hệ thống Quản lý Vòng đời Hợp đồng (CLM)
        </div>

        {/* Quick Role Switcher for Testing RBAC */}
        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">RBAC Demo:</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                title={`Chuyển sang quyền ${role}`}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                  currentRole === role
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {/* User Badge */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-semibold text-slate-800 leading-tight">
              {user?.fullName || 'Người dùng'}
            </p>
            <span
              className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                ROLE_COLORS[currentRole]
              }`}
            >
              {currentRole}
            </span>
          </div>
        </div>

        {/* Logout */}
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
          className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Thoát</span>
        </button>
      </div>
    </header>
  );
};

