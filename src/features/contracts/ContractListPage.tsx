import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractApi } from './api/contractApi';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Send,
  Trash2,
  Layers,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const STATUS_MAP: Record<string | number, { label: string; className: string }> = {
  0: { label: 'Bản Nháp (Draft)', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  Draft: { label: 'Bản Nháp (Draft)', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  1: { label: 'Chờ Duyệt', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  PendingApproval: { label: 'Chờ Duyệt', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  2: { label: 'Đã Duyệt', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Approved: { label: 'Đã Duyệt', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  3: { label: 'Đã Ký Số', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  Signed: { label: 'Đã Ký Số', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  4: { label: 'Hiệu Lực (Active)', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Active: { label: 'Hiệu Lực (Active)', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  5: { label: 'Sắp Hết Hạn', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  Expiring: { label: 'Sắp Hết Hạn', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  6: { label: 'Đã Chấm Dứt', className: 'bg-zinc-100 text-zinc-600 border-zinc-300' },
  Terminated: { label: 'Đã Chấm Dứt', className: 'bg-zinc-100 text-zinc-600 border-zinc-300' },
  7: { label: 'Đã Gia Hạn', className: 'bg-teal-50 text-teal-700 border-teal-200' },
  Renewed: { label: 'Đã Gia Hạn', className: 'bg-teal-50 text-teal-700 border-teal-200' },
};

export const ContractListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch contracts
  const {
    data: contracts = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractApi.getContracts,
  });

  // Fetch contract types
  const { data: contractTypes = [] } = useQuery({
    queryKey: ['contract-types'],
    queryFn: contractApi.getContractTypes,
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: contractApi.submitContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: contractApi.deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  // Filtered & Paginated contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchSearch =
        c.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contractTypeName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' ||
        String(c.status).toLowerCase() === selectedStatus.toLowerCase();

      const matchType =
        selectedTypeId === 'all' || c.contractTypeId === selectedTypeId;

      return matchSearch && matchStatus && matchType;
    });
  }, [contracts, searchTerm, selectedStatus, selectedTypeId]);

  const totalPages = Math.ceil(filteredContracts.length / pageSize) || 1;
  const paginatedContracts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredContracts.slice(start, start + pageSize);
  }, [filteredContracts, page]);

  const handleSubmitContract = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn đệ trình hợp đồng này vào quy trình phê duyệt?')) {
      await submitMutation.mutateAsync(id);
    }
  };

  const handleDeleteContract = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa hợp đồng này? Hành động không thể hoàn tác.')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600/10 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Quản Lý Hợp Đồng</h1>
              <p className="text-xs text-slate-500">
                Toàn bộ vòng đời hợp đồng doanh nghiệp (Người 2 - Đặng Nguyễn Phúc Khang)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/contract-types"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <Layers className="w-4 h-4" />
            Loại Hợp Đồng
          </Link>

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

          <Link
            to="/contracts/create"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Soạn Thảo Hợp Đồng
          </Link>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Tổng Hợp Đồng</div>
          <div className="text-lg font-bold text-slate-900 mt-1">{contracts.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Chờ Phê Duyệt</div>
          <div className="text-lg font-bold text-amber-600 mt-1">
            {contracts.filter((c) => String(c.status) === '1' || String(c.status) === 'PendingApproval').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Đang Có Hiệu Lực</div>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {contracts.filter((c) => String(c.status) === '4' || String(c.status) === 'Active').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Bản Nháp (Draft)</div>
          <div className="text-lg font-bold text-slate-600 mt-1">
            {contracts.filter((c) => String(c.status) === '0' || String(c.status) === 'Draft').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Tìm theo số hợp đồng, tên hợp đồng, loại hợp đồng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="0">Bản Nháp (Draft)</option>
            <option value="1">Chờ Phê Duyệt</option>
            <option value="2">Đã Duyệt</option>
            <option value="3">Đã Ký Số</option>
            <option value="4">Hiệu Lực (Active)</option>
            <option value="5">Sắp Hết Hạn</option>
            <option value="7">Đã Gia Hạn</option>
            <option value="6">Đã Chấm Dứt</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeId}
            onChange={(e) => {
              setSelectedTypeId(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[160px] truncate"
          >
            <option value="all">Tất cả loại HĐ</option>
            {contractTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            Đang tải dữ liệu hợp đồng...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-600 text-xs">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            Lỗi khi tải dữ liệu: {error instanceof Error ? error.message : 'Không xác định'}
          </div>
        ) : paginatedContracts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Không tìm thấy hợp đồng nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Mã Số HĐ</th>
                  <th className="py-3 px-4">Tên Hợp Đồng</th>
                  <th className="py-3 px-4">Loại Hợp Đồng</th>
                  <th className="py-3 px-4 text-right">Giá Trị (VNĐ)</th>
                  <th className="py-3 px-4">Thời Hạn</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedContracts.map((c) => {
                  const statusInfo = STATUS_MAP[c.status] || {
                    label: String(c.status),
                    className: 'bg-slate-100 text-slate-600 border-slate-200',
                  };
                  const isDraft = String(c.status) === '0' || String(c.status).toLowerCase() === 'draft';

                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/contracts/${c.id}`)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-blue-600">
                        {c.contractNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-[220px] truncate">
                        {c.title}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {c.contractTypeName || 'Chưa phân loại'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        {formatCurrency(c.value)} đ
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(c.effectiveDate)} → {formatDate(c.expiryDate)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {isDraft && (
                            <button
                              title="Đệ trình phê duyệt"
                              onClick={(e) => handleSubmitContract(c.id, e)}
                              disabled={submitMutation.isPending}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Link
                            to={`/contracts/${c.id}`}
                            title="Xem chi tiết"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          {isDraft && (
                            <button
                              title="Xóa bản nháp"
                              onClick={(e) => handleDeleteContract(c.id, e)}
                              disabled={deleteMutation.isPending}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredContracts.length > pageSize && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <div>
              Hiển thị {(page - 1) * pageSize + 1} -{' '}
              {Math.min(page * pageSize, filteredContracts.length)} trên tổng số{' '}
              {filteredContracts.length} hợp đồng
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs"
              >
                Trước
              </Button>
              <span className="px-2 font-medium text-slate-700">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
