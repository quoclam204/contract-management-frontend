import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';

// Người 1 phụ trách: Login, User management, Department
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO (Người 1): Gọi API đăng nhập /api/v1/auth/login
    login(
      {
        id: 'u-1',
        username: username || 'admin',
        fullName: 'Quản Trị Viên',
        email: 'admin@enterprise.vn',
        role: 'Admin',
        department: 'Ban Giám Đốc',
      },
      'dummy-token'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 text-center">Đăng Nhập CLM</h2>
        <p className="text-xs text-slate-500 text-center">Hệ thống Quản lý Vòng đời Hợp đồng Doanh nghiệp</p>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};
