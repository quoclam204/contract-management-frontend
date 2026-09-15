import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import {
  Search,
  X,
  RotateCcw,
  AlertCircle,
  Paperclip,
  HardDrive,
  History,
  FileStack,
  Filter,
  Plus,
} from 'lucide-react';
import { getAttachments, downloadAttachment } from './api/attachmentApi';
import { Attachment } from './types/attachment.types';
import { formatFileSize } from './utils/attachment.utils';
import { AttachmentDropzone } from './components/AttachmentDropzone';
import { AttachmentTable } from './components/AttachmentTable';
import { UploadNewVersionModal } from './components/UploadNewVersionModal';
import { DeleteAttachmentModal } from './components/DeleteAttachmentModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { useContracts } from '@/hooks/data/useContracts';
import { Button } from '@/components/ui/Button';

export const AttachmentListPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedContractFilter, setSelectedContractFilter] = useState<string>('all');
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState<boolean>(true);

  // Modals state
  const [versionModalItem, setVersionModalItem] = useState<Attachment | null>(null);
  const [deleteModalItem, setDeleteModalItem] = useState<Attachment | null>(null);
  const [historyModalItem, setHistoryModalItem] = useState<Attachment | null>(null);

  // Contracts for filter
  const { data: contractsData } = useContracts();
  const contracts = Array.isArray(contractsData) ? contractsData : [];

  // Debounce search query by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Query attachments list
  const {
    data: attachments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['attachments', selectedContractFilter, debouncedSearch],
    queryFn: () =>
      getAttachments({
        contractId: selectedContractFilter === 'all' ? undefined : selectedContractFilter,
        search: debouncedSearch,
      }),
  });

  // Calculate statistics metrics
  const totalFiles = attachments.length;
  const totalSizeBytes = attachments.reduce((sum, item) => sum + (item.fileSize || 0), 0);
  const totalVersions = attachments.reduce(
    (sum, item) => sum + (item.versions?.length || 1),
    0
  );

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
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Paperclip className="w-6 h-6 text-blue-600" />
            <span>Quản Lý Tệp Đính Kèm & Phiên Bản</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Lưu trữ tài liệu hợp đồng, phụ lục, chứng từ và quản lý lịch sử phiên bản tài liệu theo đặc tả SRS v3
          </p>
        </div>

        <Button
          type="button"
          variant={isUploadSectionOpen ? 'outline' : 'primary'}
          onClick={() => setIsUploadSectionOpen(!isUploadSectionOpen)}
          className="shrink-0 shadow-xs"
        >
          <Plus className={`w-4 h-4 mr-1.5 transition-transform ${isUploadSectionOpen ? 'rotate-45' : ''}`} />
          <span>{isUploadSectionOpen ? 'Thu gọn khung upload' : 'Tải lên tài liệu'}</span>
        </Button>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileStack className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng số tệp đính kèm</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{totalFiles} tệp</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Dung lượng lưu trữ</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
              {formatFileSize(totalSizeBytes)}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tổng số phiên bản lưu trữ</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{totalVersions} phiên bản</p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Section (collapsible) */}
      {isUploadSectionOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <AttachmentDropzone
            defaultContractId={selectedContractFilter !== 'all' ? selectedContractFilter : undefined}
          />
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-3.5 sm:p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên tệp, số hợp đồng, người tải..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
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
            <span>Lọc hợp đồng:</span>
          </div>
          <select
            value={selectedContractFilter}
            onChange={(e) => setSelectedContractFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all cursor-pointer max-w-[220px] truncate"
          >
            <option value="all">Tất cả hợp đồng</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.contractNumber} — {c.title}
              </option>
            ))}
          </select>

          {isFetching && !isLoading && (
            <span className="text-xs text-slate-400 italic hidden md:inline ml-1">
              Đang làm mới...
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

      {/* Data Table */}
      <AttachmentTable
        attachments={attachments}
        isLoading={isLoading}
        onDownload={handleDownload}
        onUploadNewVersion={(att) => setVersionModalItem(att)}
        onViewHistory={(att) => setHistoryModalItem(att)}
        onDelete={(att) => setDeleteModalItem(att)}
      />

      {/* Modals */}
      <UploadNewVersionModal
        isOpen={Boolean(versionModalItem)}
        onClose={() => setVersionModalItem(null)}
        attachment={versionModalItem}
      />

      <DeleteAttachmentModal
        isOpen={Boolean(deleteModalItem)}
        onClose={() => setDeleteModalItem(null)}
        attachment={deleteModalItem}
      />

      <VersionHistoryModal
        isOpen={Boolean(historyModalItem)}
        onClose={() => setHistoryModalItem(null)}
        attachment={historyModalItem}
        onDownload={handleDownloadHistoryVersion}
      />
    </div>
  );
};
