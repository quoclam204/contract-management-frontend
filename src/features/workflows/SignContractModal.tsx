import React from 'react';

// Người 4: Modal ký số điện tử
export const SignContractModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen }) => {
  if (!isOpen) return null;
  return <div>Modal Ký số điện tử (Mock / OTP / USB Token)</div>;
};
