import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/features/identity/LoginPage';
import { UserManagementPage } from '@/features/identity/UserManagementPage';
import { ContractListPage } from '@/features/contracts/ContractListPage';
import { ContractDetailPage } from '@/features/contracts/ContractDetailPage';
import { ContractCreatePage } from '@/features/contracts/ContractCreatePage';
import { PartnerListPage } from '@/features/partners/PartnerListPage';
import { PaymentTrackingPage } from '@/features/payments/PaymentTrackingPage';
import { AttachmentListPage } from '@/features/attachments/AttachmentListPage';
import { ApprovalFlowPage } from '@/features/workflows/ApprovalFlowPage';
import { WorkflowConfigPage } from '@/features/workflows/WorkflowConfigPage';
import { AIAnalysisPage } from '@/features/ai-analysis/AIAnalysisPage';
import { NotificationListPage } from '@/features/notifications/NotificationListPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<MainLayout />}>
        {/* Người 5: Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Người 2: Contracts */}
        <Route path="contracts" element={<ContractListPage />} />
        <Route path="contracts/create" element={<ContractCreatePage />} />
        <Route path="contracts/:id" element={<ContractDetailPage />} />

        {/* Người 3: Partners, Payments, Attachments */}
        <Route path="partners" element={<PartnerListPage />} />
        <Route path="payments" element={<PaymentTrackingPage />} />
        <Route path="attachments" element={<AttachmentListPage />} />

        {/* Người 4: Workflows */}
        <Route path="workflows" element={<ApprovalFlowPage />} />
        <Route path="workflows/config" element={<WorkflowConfigPage />} />

        {/* Người 5: AI & Notifications */}
        <Route path="ai-analysis" element={<AIAnalysisPage />} />
        <Route path="notifications" element={<NotificationListPage />} />

        {/* Người 1: User management */}
        <Route path="users" element={<UserManagementPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
