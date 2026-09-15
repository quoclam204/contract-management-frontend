import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { UserRole } from '@/types/auth';

export interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleName: string;
  departmentId: string | null;
  departmentName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UserFilter {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  role?: number;
  departmentId?: string;
  isActive?: boolean;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: number;
  departmentId?: string | null;
}

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  role: number;
  departmentId?: string | null;
  isActive?: boolean;
}

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  list: (filter: UserFilter) => ['users', 'list', filter] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

export function useUsers(filter: UserFilter = {}) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filter),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
      if (filter.search?.trim()) params.append('search', filter.search.trim());
      if (filter.role !== undefined) params.append('role', filter.role.toString());
      if (filter.departmentId) params.append('departmentId', filter.departmentId);
      if (filter.isActive !== undefined) params.append('isActive', filter.isActive.toString());

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      return apiClient.get<PagedResult<UserDetail>>(`/api/users${queryStr}`);
    },
    staleTime: 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      apiClient.post<UserDetail>('/api/users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      apiClient.put<UserDetail>(`/api/users/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<{ message: string }>(`/api/users/${id}/toggle-active`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
}
