import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/features/identity/useAuthStore';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterUserDto,
  ROLE_NAMES,
  User,
  UserRole,
} from '@/types/auth';

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginRequestDto) => {
      const response = await apiClient.post<LoginResponseDto>(
        '/api/auth/login',
        credentials
      );

      const rawRole = response.user.role;
      const roleStr: UserRole =
        typeof rawRole === 'number'
          ? ROLE_NAMES[rawRole] || 'Staff'
          : (rawRole as UserRole) || 'Staff';

      const user: User = {
        id: response.user.id,
        fullName: response.user.fullName,
        email: response.user.email,
        role: roleStr,
        roleId: typeof rawRole === 'number' ? rawRole : undefined,
        roleName: response.user.roleName || roleStr,
        departmentId: response.user.departmentId,
        isActive: response.user.isActive,
        createdAt: response.user.createdAt,
      };

      login(user, response.token);
      return { user, token: response.token };
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterUserDto) =>
      apiClient.post<User>('/api/auth/register', data),
  });
}
