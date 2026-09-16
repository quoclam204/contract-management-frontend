import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, X, AlertCircle, RotateCcw } from 'lucide-react';
import { getPartners } from '../api/partnerApi';
import { Partner } from '../types/partner.types';
import { PartnerTable } from '../components/PartnerTable';
import { PartnerPagination } from '../components/PartnerPagination';
import { PartnerFormModal } from '../components/PartnerFormModal';
import { PartnerDetailModal } from '../components/PartnerDetailModal';
import { Button } from '@/components/ui/Button';

export const PartnerListPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal create / edit state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Modal detail view state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPartnerForView, setSelectedPartnerForView] = useState<Partner | null>(null);

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPageNumber(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['partners', pageNumber, pageSize, debouncedSearch],
    queryFn: () =>
      getPartners({
        pageNumber,
        pageSize,
        searchTerm: debouncedSearch,
      }),
  });

  const handleClearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1);
  };

  const handleAddPartner = () => {
    setSelectedPartner(null);
    setIsFormModalOpen(true);
  };

  const handleView = (partner: Partner) => {
    setSelectedPartnerForView(partner);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPartnerForView(null);
  };

  const handleEditFromDetail = (partner: Partner) => {
    setIsDetailModalOpen(false);
    setSelectedPartnerForView(null);
    setSelectedPartner(partner);
    setIsFormModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setSelectedPartner(null);
  };

  const handleDelete = (partner: Partner) => {
    alert(`Xác nhận xóa đối tác: ${partner.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Danh sách Đối tác / Doanh nghiệp
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý nhà cung cấp, khách hàng doanh nghiệp và thông tin pháp lý hợp đồng
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddPartner}
          className="shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Thêm đối tác</span>
        </Button>
      </div>

      {/* Control Bar: Search Input */}
      <div className="bg-white p-3 sm:p-4 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm theo tên đối tác hoặc mã số thuế..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isFetching && !isLoading && (
          <span className="text-xs text-slate-400 italic hidden sm:inline">
            Đang cập nhật...
          </span>
        )}
      </div>

      {/* Error Alert State */}
      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-semibold text-sm">Không thể kết nối đến máy chủ</p>
              <p className="text-xs text-rose-600 mt-0.5">
                {error instanceof Error
                  ? error.message
                  : 'Đã xảy ra lỗi khi lấy dữ liệu danh sách đối tác.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* Data Table */}
      <PartnerTable
        partners={data?.items ?? []}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Footer */}
      <PartnerPagination
        pageNumber={data?.pageNumber ?? pageNumber}
        pageSize={data?.pageSize ?? pageSize}
        totalPages={data?.totalPages ?? 1}
        totalCount={data?.totalCount ?? 0}
        hasPreviousPage={data?.hasPreviousPage ?? false}
        hasNextPage={data?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      {/* Create / Edit Partner Form Modal */}
      <PartnerFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        initialData={selectedPartner}
      />

      {/* View Partner Detail Modal (Read-only) */}
      <PartnerDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        partner={selectedPartnerForView}
        onEdit={handleEditFromDetail}
      />
    </div>
  );
};
