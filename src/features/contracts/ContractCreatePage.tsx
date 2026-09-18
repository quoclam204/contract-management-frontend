import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi, CreateContractPayload } from './api/contractApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  ArrowLeft,
  Building2,
  Calendar,
  Save,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const ContractCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateContractPayload>({
    contractNumber: `HD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    contractTypeId: '',
    partnerId: '',
    title: '',
    value: 100000000,
    signedDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    fileUrl: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch contract types
  const { data: contractTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ['contract-types'],
    queryFn: contractApi.getContractTypes,
  });

  // Fetch partners
  const { data: partners = [], isLoading: loadingPartners } = useQuery({
    queryKey: ['partners-dropdown'],
    queryFn: contractApi.getPartners,
  });

  const createMutation = useMutation({
    mutationFn: contractApi.createContract,
    onSuccess: (newContract) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      navigate(`/contracts/${newContract.id}`);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : 'Lỗi khi tạo hợp đồng. Vui lòng kiểm tra lại thông tin nhập.';
      setErrorMsg(msg);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.contractNumber.trim()) {
      setErrorMsg('Vui lòng nhập Số hợp đồng.');
      return;
    }
    if (!formData.title.trim()) {
      setErrorMsg('Vui lòng nhập Tiêu đề hợp đồng.');
      return;
    }
    if (!formData.contractTypeId) {
      setErrorMsg('Vui lòng chọn Loại hợp đồng.');
      return;
    }
    if (!formData.partnerId) {
      setErrorMsg('Vui lòng chọn Đối tác.');
      return;
    }
    if (!formData.effectiveDate || !formData.expiryDate) {
      setErrorMsg('Vui lòng chọn Ngày hiệu lực và Ngày hết hạn.');
      return;
    }

    createMutation.mutate({
      ...formData,
      value: Number(formData.value) || 0,
      signedDate: formData.signedDate ? new Date(formData.signedDate).toISOString() : null,
      effectiveDate: new Date(formData.effectiveDate).toISOString(),
      expiryDate: new Date(formData.expiryDate).toISOString(),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/contracts"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Soạn Thảo Hợp Đồng Mới</h1>
            <p className="text-xs text-slate-500">
              Khởi tạo bản thảo hợp đồng nháp (Draft) vào hệ thống CLM (Người 2)
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Section 1: Thông tin định danh */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-600" />
            1. Thông Tin Định Danh Hợp Đồng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số Hợp Đồng <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.contractNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contractNumber: e.target.value })
                }
                placeholder="VD: HD-2026-001"
                className="text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Loại Hợp Đồng <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.contractTypeId}
                onChange={(e) =>
                  setFormData({ ...formData, contractTypeId: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn Loại Hợp Đồng --</option>
                {contractTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {loadingTypes && (
                <span className="text-[10px] text-slate-400 mt-1 block">Đang tải loại HĐ...</span>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tiêu Đề Hợp Đồng <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Hợp đồng cung cấp dịch vụ hạ tầng đám mây và an ninh mạng"
                className="text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Đối tác và giá trị tài chính */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-emerald-600" />
            2. Đối Tác & Giá Trị Hợp Đồng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Đối Tác Ký Kết <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.partnerId}
                onChange={(e) =>
                  setFormData({ ...formData, partnerId: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn Đối Tác Khách Hàng --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.taxCode ? `(MST: ${p.taxCode})` : ''}
                  </option>
                ))}
              </select>
              {loadingPartners && (
                <span className="text-[10px] text-slate-400 mt-1 block">Đang tải đối tác...</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tổng Giá Trị (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                step={1000000}
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                placeholder="100000000"
                className="text-xs font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Các mốc thời gian */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-amber-600" />
            3. Thời Hạn & Ngày Ký
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Ngày Ký</label>
              <Input
                type="date"
                value={formData.signedDate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, signedDate: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ngày Bắt Đầu Hiệu Lực <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) =>
                  setFormData({ ...formData, effectiveDate: e.target.value })
                }
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ngày Hết Hạn <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Tệp mẫu & File đính kèm */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            4. Liên Kết Tệp / Văn Bản Đính Kèm (Tùy chọn)
          </h2>
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Đường dẫn Tệp Đính Kèm (URL / Lưu trữ nội bộ)
            </label>
            <Input
              value={formData.fileUrl || ''}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              placeholder="VD: /storage/contracts/HD-2026-001.pdf hoặc https://..."
              className="text-xs"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Link
            to="/contracts"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            Hủy Bỏ
          </Link>

          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-2 shadow-blue-500/20"
          >
            <Save className="w-4 h-4" />
            {createMutation.isPending ? 'Đang Lưu...' : 'Lưu Bản Nháp (Draft)'}
          </Button>
        </div>
      </form>
    </div>
  );
};
