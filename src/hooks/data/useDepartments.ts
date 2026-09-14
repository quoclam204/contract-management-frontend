import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '@/types/department';

export const DEPARTMENT_QUERY_KEYS = {
  all: ['departments'] as const,
  detail: (id: string) => ['departments', id] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.all,
    queryFn: () => apiClient.get<Department[]>('/api/departments'),
    staleTime: 2 * 60 * 1000,
  });
}

export function useDepartment(id?: string) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(id || ''),
    queryFn: () => apiClient.get<Department>(`/api/departments/${id}`),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateDepartmentDto) =>
      apiClient.post<Department>('/api/departments', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDepartmentDto }) =>
      apiClient.put<Department>(`/api/departments/${id}`, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: DEPARTMENT_QUERY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/api/departments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
    },
  });
}
