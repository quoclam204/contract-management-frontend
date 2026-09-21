export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Approver';

export enum UserRoleEnum {
  Admin = 0,
  Manager = 1,
  Staff = 2,
  Approver = 3,
}

export const ROLE_NAMES: Record<number, UserRole> = {
  0: 'Admin',
  1: 'Manager',
  2: 'Staff',
  3: 'Approver',
};

export const ROLE_VALUES: Record<UserRole, number> = {
  Admin: 0,
  Manager: 1,
  Staff: 2,
  Approver: 3,
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleId?: number;
  roleName?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  isActive?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: number | UserRole;
    roleName: string;
    departmentId: string | null;
    isActive: boolean;
    createdAt: string;
    avatarUrl?: string | null;
  };
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
  role?: number;
  departmentId?: string | null;
}

