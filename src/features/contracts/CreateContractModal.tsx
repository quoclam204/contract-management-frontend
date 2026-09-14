import React from 'react';

// Người 2: Modal tạo hợp đồng nhanh (tùy chọn)
export const CreateContractModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen }) => {
  if (!isOpen) return null;
  return <div>Modal tạo hợp đồng nháp</div>;
};
