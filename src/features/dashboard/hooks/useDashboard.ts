import { useQuery } from '@tanstack/react-query';
import {
  getDashboardByDepartment,
  getDashboardByPartner,
  getDashboardByStatus,
  getDashboardByTime,
  getDashboardSummary,
} from '../api/dashboardApi';

export const DASHBOARD_QUERY_KEYS = {
  summary: ['dashboard', 'summary'] as const,
  byStatus: ['dashboard', 'by-status'] as const,
  byDepartment: ['dashboard', 'by-department'] as const,
  byPartner: (top: number) => ['dashboard', 'by-partner', top] as const,
  byTime: ['dashboard', 'by-time'] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.summary,
    queryFn: getDashboardSummary,
  });
}

export function useDashboardByStatus() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byStatus,
    queryFn: getDashboardByStatus,
  });
}

export function useDashboardByDepartment() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byDepartment,
    queryFn: getDashboardByDepartment,
  });
}

export function useDashboardByPartner(top = 10) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byPartner(top),
    queryFn: () => getDashboardByPartner(top),
  });
}

export function useDashboardByTime() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.byTime,
    queryFn: getDashboardByTime,
  });
}
