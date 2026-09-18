import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from './api/contractApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileText, X, AlertCircle } from 'lucide-react';

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateContractModal: React.FC<CreateContractModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [contractNumber, setContractNumber] = useState(
    `HD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [title, setTitle] = useState('');
  const [contractTypeId, setContractTypeId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [value, setValue] = useState(50000000);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: contractTypes = [] } = useQuery({
    queryKey: ['contract-types'],
    queryFn: contractApi.getContractTypes,
    enabled: isOpen,
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners-dropdown'],
    queryFn: contractApi.getPartners,
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: contractApi.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: unknown) => {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi tạo hợp đồng nháp.');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractNumber.trim() || !title.trim() || !contractTypeId || !partnerId) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }

    createMutation.mutate({
      contractNumber: contractNumber.trim(),
      title: title.trim(),
      contractTypeId,
      partnerId,
      value: Number(value) || 0,
      effectiveDate: new Date(effectiveDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      signedDate: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tạo Nhanh Hợp Đồng Nháp</h2>
              <p className="text-[11px] text-slate-500">Khởi tạo nhanh bản thảo hợp đồng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Số Hợp Đồng <span className="text-rose-500">*</span>
              </label>
              <Input
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                className="text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Loại HĐ <span className="text-rose-500">*</span>
              </label>
              <select
                value={contractTypeId}
                onChange={(e) => setContractTypeId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                required
              >
                <option value="">-- Chọn Loại HĐ --</option>
                {contractTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Tiêu Đề Hợp Đồng <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Hợp đồng mua bán thiết bị..."
              className="text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Đối Tác <span className="text-rose-500">*</span>
              </label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                required
              >
                <option value="">-- Chọn Đối Tác --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Giá Trị (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Ngày Hiệu Lực <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Ngày Hết Hạn <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Hủy Bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo Bản Nháp'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
