import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Paperclip,
  GitPullRequest,
  Bot,
  Bell,
  Users,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, author: 'Người 5' },
    { label: 'Hợp Đồng', path: '/contracts', icon: FileText, author: 'Người 2' },
    { label: 'Loại Hợp Đồng', path: '/contract-types', icon: Layers, author: 'Người 2' },
    { label: 'Phòng Ban', path: '/departments', icon: Layers, author: 'Người 1' },
    { label: 'Đối Tác', path: '/partners', icon: Building2, author: 'Người 3' },
    { label: 'Tệp Đính Kèm', path: '/attachments', icon: Paperclip, author: 'Người 3' },
    { label: 'Quy Trình Duyệt', path: '/workflows', icon: GitPullRequest, author: 'Người 4' },
    { label: 'Trợ Lý AI', path: '/ai-analysis', icon: Bot, author: 'Người 5' },
    { label: 'Thông Báo', path: '/notifications', icon: Bell, author: 'Người 5' },
    { label: 'Người Dùng', path: '/users', icon: Users, author: 'Người 1' },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col shrink-0">
      <div className="px-3 py-2 mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight">CLM System</h2>
        <p className="text-[11px] text-slate-400">Quản Lý Hợp Đồng Doanh Nghiệp</p>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 opacity-60">
                {item.author}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
