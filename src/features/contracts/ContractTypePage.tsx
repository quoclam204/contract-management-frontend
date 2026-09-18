import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from './api/contractApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Layers,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const ContractTypePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    data: contractTypes = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['contract-types'],
    queryFn: contractApi.getContractTypes,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => contractApi.createContractType({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-types'] });
      setIsCreateOpen(false);
      setNewTypeName('');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tạo loại hợp đồng.';
      setErrorMsg(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contractApi.deleteContractType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-types'] });
    },
  });

  const filteredTypes = contractTypes.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setErrorMsg(null);
    createMutation.mutate(newTypeName.trim());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa loại hợp đồng "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/contracts"
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Quản Lý Loại Hợp Đồng</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {contractTypes.length} loại
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh mục phân loại và áp dụng mẫu hợp đồng (Người 2 - Đặng Nguyễn Phúc Khang)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Thêm Loại Mới
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Tìm kiếm loại hợp đồng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Create Modal / Popover */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Tạo Mới Loại Hợp Đồng
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tên Loại Hợp Đồng <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="VD: Hợp đồng Thuê Máy Chủ"
                  className="text-xs"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs"
                >
                  Hủy Bỏ
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  {createMutation.isPending ? 'Đang tạo...' : 'Lưu Loại HĐ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List / Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Đang tải danh sách...</div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-xs">
            Lỗi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}
          </div>
        ) : filteredTypes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không tìm thấy loại hợp đồng nào.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Tên Loại Hợp Đồng</th>
                <th className="py-3 px-4">Mã Phân Loại (ID)</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTypes.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{t.id}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      title="Xóa loại hợp đồng"
                      onClick={() => handleDelete(t.id, t.name)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
