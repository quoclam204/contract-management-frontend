import React from 'react';

// Người 4: Modal duyệt hoặc từ chối hợp đồng
export const WorkflowApprovalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen }) => {
  if (!isOpen) return null;
  return <div>Modal Duyệt / Từ chối hợp đồng</div>;
};
