import React from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { UserRole } from '@/types/auth';

interface CanProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ roles, children, fallback = null }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback}</>;
  }

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
