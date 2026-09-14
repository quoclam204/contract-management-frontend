import React from 'react';
import { useAuthStore } from '@/features/identity/useAuthStore';
import { UserRole } from '@/types/auth';

interface CanProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ roles, children, fallback = null }) => {
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
