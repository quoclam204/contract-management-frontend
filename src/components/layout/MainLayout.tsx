import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { apiClient } from '@/api/client';
import { UserRole, ROLE_NAMES } from '@/types/auth';

interface ServerUserDto {
  id: string;
  fullName: string;
  email: string;
  role: number | UserRole;
  roleName?: string;
  departmentId?: string | null;
  isActive?: boolean;
  avatarUrl?: string | null;
}

export const MainLayout: React.FC = () => {
  const { token, updateUser } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    apiClient
      .get<ServerUserDto>('/api/auth/me')
      .then((serverUser) => {
        if (serverUser) {
          const rawRole = serverUser.role;
          const roleStr: UserRole =
            typeof rawRole === 'number'
              ? ROLE_NAMES[rawRole] || 'Staff'
              : (serverUser.roleName as UserRole) || (rawRole as UserRole) || 'Staff';

          updateUser({
            fullName: serverUser.fullName,
            avatarUrl: serverUser.avatarUrl || undefined,
            role: roleStr,
            roleId: typeof rawRole === 'number' ? rawRole : undefined,
            roleName: serverUser.roleName || roleStr,
            departmentId: serverUser.departmentId,
            isActive: serverUser.isActive,
          });
        }
      })
      .catch((err) => {
        console.warn('Could not sync profile from server:', err);
      });
  }, [token, updateUser]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
