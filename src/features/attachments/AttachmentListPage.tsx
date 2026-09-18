import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import {
  Search,
  X,
  RotateCcw,
  AlertCircle,
  Filter,
  Plus,
  FolderOpen,
} from 'lucide-react';
import { getAttachments, downloadAttachment } from './api/attachmentApi';
import { Attachment } from './types/attachment.types';
import { AttachmentTable } from './components/AttachmentTable';
import { UploadAttachmentModal } from './components/UploadAttachmentModal';
import { UploadNewVersionModal } from './components/UploadNewVersionModal';
import { DeleteAttachmentModal } from './components/DeleteAttachmentModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { useContracts } from '@/hooks/data/useContracts';
import { Button } from '@/components/ui/Button';

export const AttachmentListPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedContractId, setSelectedContractId] = useState<string>('');

  // Modal upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Modals state
  const [versionModalItem, setVersionModalItem] = useState<Attachment | null>(null);
  const [deleteModalItem, setDeleteModalItem] = useState<Attachment | null>(null);
  const [historyModalItem, setHistoryModalItem] = useState<Attachment | null>(null);

  // Contracts for filter
  const { data: contractsData } = useContracts();
  const contracts = Array.isArray(contractsData) ? contractsData : [];

  // TỰ ĐỘNG chọn hợp đồng đầu tiên làm mặc định khi danh sách hợp đồng tải xong
  useEffect(() => {
    if (contracts.length > 0 && !selectedContractId) {
      setSelectedContractId(contracts[0].id);
    }
  }, [contracts, selectedContractId]);

  // Debounce search query by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const currentContract = contracts.find((c) => c.id === selectedContractId);

  // Query attachments list - chỉ fetch khi có selectedContractId, tuyệt đối không bắn request hàng loạt
  const {
    data: attachments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['attachments', selectedContractId, debouncedSearch],
    queryFn: () => {
      if (!selectedContractId) return Promise.resolve([]);
      return getAttachments({
        contractId: selectedContractId,
        search: debouncedSearch,
        contractInfo: currentContract
          ? { contractNumber: currentContract.contractNumber, contractTitle: currentContract.title }
          : undefined,
      });
    },
    enabled: Boolean(selectedContractId),
    staleTime: 5 * 60 * 1000,
  });

  const handleClearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      message.loading({ content: `Đang tải xuống "${attachment.fileName}"...`, key: 'downloading' });
      await downloadAttachment(attachment.id, attachment.fileName);
      message.success({ content: `Đã tải xuống "${attachment.fileName}"!`, key: 'downloading' });
    } catch (err) {
      message.error({
        content: err instanceof Error ? err.message : 'Không thể tải tệp. Vui lòng thử lại.',
        key: 'downloading',
      });
    }
  };

  const handleDownloadHistoryVersion = async (attachmentId: string, preferredName?: string) => {
    try {
      message.loading({ content: 'Đang tải xuống phiên bản...', key: 'downloading-ver' });
      await downloadAttachment(attachmentId, preferredName);
      message.success({ content: 'Tải xuống hoàn tất!', key: 'downloading-ver' });
    } catch (err) {
      message.error({
        content: err instanceof Error ? err.message : 'Không thể tải phiên bản tệp.',
        key: 'downloading-ver',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Tệp Đính Kèm & Phiên Bản
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý, lưu trữ và theo dõi lịch sử các phiên bản tài liệu hợp đồng
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Tải lên tệp</span>
        </Button>
      </div>

      {/* Control Bar: Search Input & Contract Filter */}
      <div className="bg-white p-3 sm:p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên tệp, số hợp đồng, người tải..."
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

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Hợp đồng:</span>
          </div>
          <select
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer max-w-[280px] truncate"
          >
            {contracts.length === 0 ? (
              <option value="">-- Đang tải hợp đồng... --</option>
            ) : (
              contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contractNumber} — {c.title}
                </option>
              ))
            )}
          </select>

          {isFetching && !isLoading && (
            <span className="text-xs text-slate-400 italic hidden sm:inline ml-1">
              Đang cập nhật...
            </span>
          )}
        </div>
      </div>

      {/* Error Alert State */}
      {isError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-semibold text-sm">Không thể tải danh sách tệp đính kèm</p>
              <p className="text-xs text-rose-600 mt-0.5">
                {error instanceof Error ? error.message : 'Đã xảy ra sự cố khi tải dữ liệu từ máy chủ.'}
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

      {/* Empty State when no contract selected OR Data Table */}
      {!selectedContractId ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-2xs">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Vui lòng chọn hợp đồng để xem tệp đính kèm
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            Hệ thống quản lý tệp đính kèm theo từng hợp đồng cụ thể. Hãy chọn một hợp đồng từ danh sách phía trên để xem các tài liệu đính kèm.
          </p>
        </div>
      ) : (
        <AttachmentTable
          attachments={attachments}
          isLoading={isLoading}
          onDownload={handleDownload}
          onUploadNewVersion={(att) => setVersionModalItem(att)}
          onViewHistory={(att) => setHistoryModalItem(att)}
          onDelete={(att) => setDeleteModalItem(att)}
        />
      )}

      {/* Modals */}
      <UploadAttachmentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultContractId={selectedContractId || undefined}
        onUploadSuccess={() => {
          refetch();
        }}
      />

      {versionModalItem && (
        <UploadNewVersionModal
          isOpen={Boolean(versionModalItem)}
          onClose={() => setVersionModalItem(null)}
          attachment={versionModalItem}
        />
      )}

      {deleteModalItem && (
        <DeleteAttachmentModal
          isOpen={Boolean(deleteModalItem)}
          onClose={() => setDeleteModalItem(null)}
          attachment={deleteModalItem}
        />
      )}

      {historyModalItem && (
        <VersionHistoryModal
          isOpen={Boolean(historyModalItem)}
          onClose={() => setHistoryModalItem(null)}
          attachment={historyModalItem}
          onDownload={handleDownloadHistoryVersion}
        />
      )}
    </div>
  );
};
