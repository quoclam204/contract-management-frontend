import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { UserRole } from '@/types/auth';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Truy cập bị từ chối (403 Forbidden)
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Tài khoản của bạn mang vai trò{' '}
          <span className="font-semibold text-slate-700">{user.role}</span>, không đủ
          thẩm quyền để truy cập phân hệ này. Vui lòng liên hệ Quản trị viên (Admin).
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Quay lại trang trước
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
