import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { apiClient } from '@/api/client';
import { UserRole } from '@/types/auth';
import {
  User,
  Key,
  Shield,
  Mail,
  CheckCircle2,
  AlertCircle,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
];

const ROLE_BADGES: Record<UserRole, { label: string; className: string }> = {
  Admin: { label: 'Quản Trị Viên (Admin)', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  Manager: { label: 'Trưởng Phòng (Manager)', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Staff: { label: 'Nhân Viên (Staff)', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Approver: { label: 'Người Phê Duyệt (Approver)', className: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [customAvatarInput, setCustomAvatarInput] = useState(user?.avatarUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Security (Change Password) state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null);
  const [securityErrorMsg, setSecurityErrorMsg] = useState<string | null>(null);

  const currentRole = (user?.role || 'Staff') as UserRole;
  const roleConfig = ROLE_BADGES[currentRole] || { label: currentRole, className: 'bg-slate-100 text-slate-700' };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    if (!fullName.trim()) {
      setProfileErrorMsg('Họ và tên không được để trống.');
      return;
    }

    setIsSavingProfile(true);
    try {
      // Save avatar to localStorage keyed by user email
      if (user?.email) {
        if (avatarUrl.trim()) {
          localStorage.setItem(`clm_avatar_${user.email}`, avatarUrl.trim());
        } else {
          localStorage.removeItem(`clm_avatar_${user.email}`);
        }
      }

      // Call backend API to update profile in Database
      await apiClient.put('/api/auth/profile', { fullName: fullName.trim() });
      
      // Update local store
      updateUser({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setProfileSuccessMsg('Cập nhật thông tin vào cơ sở dữ liệu thành công!');
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chưa kết nối được API backend mới.';
      setProfileErrorMsg(
        `Chưa lưu được vào Database: ${msg}. (Vui lòng tắt và chạy lại backend "dotnet run" để nạp tính năng mới!)`
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccessMsg(null);
    setSecurityErrorMsg(null);

    if (!currentPassword) {
      setSecurityErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (newPassword.length < 6) {
      setSecurityErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityErrorMsg('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setIsChangingPass(true);
    try {
      await apiClient.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSecuritySuccessMsg('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSecuritySuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.';
      setSecurityErrorMsg(msg);
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hồ Sơ & Quản Lý Tài Khoản"
      description="Quản lý thông tin cá nhân, ảnh đại diện và bảo mật mật khẩu của bạn"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Thông tin & Ảnh đại diện</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Tab 1: Profile & Avatar */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {/* Avatar Preview & Selection */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center ring-4 ring-white shadow-md">
                    {fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-sm">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div className="mt-3 text-center">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Chọn nhanh ảnh đại diện mẫu:
                </p>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setAvatarUrl(url);
                        setCustomAvatarInput(url);
                      }}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                        avatarUrl === url ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl('');
                        setCustomAvatarInput('');
                      }}
                      className="text-[10px] text-slate-400 hover:text-rose-500 ml-1 cursor-pointer underline"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Avatar URL Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Hoặc nhập liên kết ảnh đại diện (Image URL):
              </label>
              <Input
                placeholder="https://example.com/my-photo.jpg"
                value={customAvatarInput}
                onChange={(e) => {
                  setCustomAvatarInput(e.target.value);
                  setAvatarUrl(e.target.value);
                }}
              />
            </div>

            {/* Full Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Họ và tên hiển thị <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Nhập họ và tên đầy đủ"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Readonly Identity Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email đăng nhập
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{user?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Vai trò hệ thống
                </span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleConfig.className}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Đóng
              </Button>
              <Button type="submit" size="sm" disabled={isSavingProfile} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {securitySuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{securitySuccessMsg}</span>
              </div>
            )}

            {securityErrorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{securityErrorMsg}</span>
              </div>
            )}

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Để bảo vệ tài khoản, mật khẩu mới cần có độ dài tối thiểu <strong>6 ký tự</strong>. Sau khi đổi mật khẩu, bạn vẫn có thể tiếp tục sử dụng phiên hiện tại.
              </span>
            </div>

            {/* Current Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Mật khẩu hiện tại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <Input
                type={showNewPass ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isChangingPass}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{isChangingPass ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
